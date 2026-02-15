export interface Product {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  sale_price?: number | null;
  sku: string;
  stock_quantity: number;
  category: string;
  images: string[];
  status: 'draft' | 'published' | 'archived';
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: Address;
  created_at?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  created_at: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_intent_id?: string;
  shipping_address: Address;
  items?: OrderItem[];
  profiles?: UserProfile; // Joined data
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_spend: number;
  usage_limit: number | null;
  used_count: number;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
}
