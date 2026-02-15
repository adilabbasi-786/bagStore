import { supabase } from './supabase';
import { Product, Coupon } from '../types';

// --- Products ---
export const createProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
  return await supabase.from('products').insert(product).select().single();
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  return await supabase.from('products').update(updates).eq('id', id).select().single();
};

export const deleteProduct = async (id: string) => {
  return await supabase.from('products').delete().eq('id', id);
};

// --- Coupons ---
export const getCoupons = async () => {
  return await supabase.from('coupons').select('*').order('created_at', { ascending: false });
};

export const createCoupon = async (coupon: Partial<Coupon>) => {
  return await supabase.from('coupons').insert(coupon).select().single();
};

export const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
  return await supabase.from('coupons').update(updates).eq('id', id).select().single();
};

export const deleteCoupon = async (id: string) => {
  return await supabase.from('coupons').delete().eq('id', id);
};

// --- Shipping Rules ---
export const getShippingRules = async () => {
  return await supabase.from('shipping_rules').select('*');
};

export const createShippingRule = async (rule: any) => {
  return await supabase.from('shipping_rules').insert(rule).select().single();
};

// --- Tax Rules ---
export const getTaxRules = async () => {
  return await supabase.from('tax_rules').select('*');
};

export const createTaxRule = async (rule: any) => {
  return await supabase.from('tax_rules').insert(rule).select().single();
};
