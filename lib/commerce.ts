import { supabase } from './supabase';
import { Address, Coupon, CartItem } from '../types';

interface CalculationResult {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  appliedCoupon?: Coupon;
}

/**
 * Validates a coupon code.
 */
export const validateCoupon = async (code: string, subtotal: number): Promise<Coupon | null> => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  const coupon = data as Coupon;

  // Check expiry
  if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
    throw new Error('Coupon expired');
  }

  // Check usage limit
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    throw new Error('Coupon usage limit reached');
  }

  // Check min spend
  if (coupon.min_spend && subtotal < coupon.min_spend) {
    throw new Error(`Minimum spend of ${coupon.min_spend} required`);
  }

  return coupon;
};

/**
 * Calculates Tax based on address.
 * Simplified logic: finds matching rule for country/state or country/null.
 */
export const calculateTax = async (address: Address, subtotal: number): Promise<number> => {
  // Try finding specific state rule first, then country rule
  const { data: stateRule } = await supabase
    .from('tax_rules')
    .select('rate')
    .eq('country_code', address.country)
    .eq('state_code', address.state)
    .single();

  if (stateRule) {
    return subtotal * (stateRule.rate / 100);
  }

  const { data: countryRule } = await supabase
    .from('tax_rules')
    .select('rate')
    .eq('country_code', address.country)
    .is('state_code', null)
    .single();

  if (countryRule) {
    return subtotal * (countryRule.rate / 100);
  }

  // Default fallback if no rules found (e.g. 0 or global default)
  return 0;
};

/**
 * Calculates Shipping based on address and rules.
 */
export const calculateShipping = async (address: Address, subtotal: number): Promise<number> => {
  const { data: rules } = await supabase
    .from('shipping_rules')
    .select('*')
    .eq('is_active', true)
    .or(`country_code.eq.${address.country},country_code.eq.GLOBAL`)
    .order('cost', { ascending: true }); // Prefer cheaper/specific rules if logic permits

  if (!rules || rules.length === 0) return 0; // Or default flat rate

  // Filter logic: Match state if present, check min_order_value
  const validRule = rules.find(r => {
    if (r.state_code && r.state_code !== address.state) return false;
    if (subtotal >= r.min_order_value && r.min_order_value > 0) return true; // Free shipping candidate
    return true;
  });
  
  // If rule has free shipping threshold met
  if (validRule && subtotal >= validRule.min_order_value && validRule.min_order_value > 0) {
    return 0;
  }

  return validRule ? validRule.cost : 10; // Default 10 if no match found
};

/**
 * Full Order Calculation
 */
export const calculateOrderSummary = async (
  items: CartItem[], 
  address: Address, 
  couponCode?: string
): Promise<CalculationResult> => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  let discount = 0;
  let appliedCoupon: Coupon | undefined;

  if (couponCode) {
    try {
      const coupon = await validateCoupon(couponCode, subtotal);
      if (coupon) {
        appliedCoupon = coupon;
        if (coupon.discount_type === 'percent') {
          discount = subtotal * (coupon.discount_value / 100);
        } else {
          discount = coupon.discount_value;
        }
      }
    } catch (e) {
      console.warn('Coupon invalid:', e);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = await calculateTax(address, taxableAmount);
  const shipping = await calculateShipping(address, taxableAmount);
  
  const total = Math.max(0, taxableAmount + tax + shipping);

  return { subtotal, discount, tax, shipping, total, appliedCoupon };
};
