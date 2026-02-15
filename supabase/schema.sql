-- Enable UUID
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'customer', -- 'admin' or 'customer'
  address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price numeric not null,
  sale_price numeric,
  stock_quantity integer default 0,
  category text,
  images text[],
  sku text,
  status text default 'published',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COUPONS
create table public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric not null,
  min_spend numeric default 0,
  usage_limit integer,
  used_count integer default 0,
  expiry_date timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SHIPPING RULES
create table public.shipping_rules (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  country_code text not null, -- 'IN', 'US', or 'GLOBAL'
  state_code text, -- Null for all states
  cost numeric not null,
  min_order_value numeric default 0, -- Free shipping threshold
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TAX RULES
create table public.tax_rules (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  country_code text not null,
  state_code text,
  rate numeric not null, -- percentage
  priority integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  status text default 'pending', -- pending, processing, shipped, completed, cancelled
  total_amount numeric not null,
  subtotal numeric,
  tax_amount numeric default 0,
  shipping_cost numeric default 0,
  discount_amount numeric default 0,
  coupon_code text,
  currency text default 'INR',
  payment_status text default 'pending',
  payment_intent_id text,
  shipping_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id),
  product_title text,
  quantity integer not null,
  price numeric not null,
  total numeric not null
);

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict do nothing;

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.shipping_rules enable row level security;
alter table public.tax_rules enable row level security;

-- Profile Policies
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Product Policies
create policy "Products are viewable by everyone." on products for select using (true);
create policy "Admins can insert products" on products for insert with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update products" on products for update using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can delete products" on products for delete using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Coupon Policies
create policy "Everyone can view active coupons" on coupons for select using (is_active = true);
create policy "Admins can manage coupons" on coupons for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Shipping/Tax Policies
create policy "Everyone can view rules" on shipping_rules for select using (true);
create policy "Admins can manage shipping" on shipping_rules for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Everyone can view tax" on tax_rules for select using (true);
create policy "Admins can manage tax" on tax_rules for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Order Policies
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Admins can view all orders" on orders for select using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admins can update orders" on orders for update using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Order Items Policies
create policy "Users can view own order items" on order_items for select using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "Admins can view all order items" on order_items for select using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Users can insert own order items" on order_items for insert with check (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

-- Storage Policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'products' );
create policy "Admin Upload" on storage.objects for insert with check ( bucket_id = 'products' and exists (select 1 from profiles where id = auth.uid() and role = 'admin') );
create policy "Admin Update" on storage.objects for update using ( bucket_id = 'products' and exists (select 1 from profiles where id = auth.uid() and role = 'admin') );
create policy "Admin Delete" on storage.objects for delete using ( bucket_id = 'products' and exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- DATABASE FUNCTION: Decrement Stock
create or replace function public.decrement_stock(order_id uuid)
returns void as $$
begin
  update public.products
  set stock_quantity = products.stock_quantity - order_items.quantity
  from public.order_items
  where order_items.order_id = decrement_stock.order_id
  and products.id = order_items.product_id;
end;
$$ language plpgsql security definer;

-- Insert Dummy Data
insert into products (title, description, price, stock_quantity, category, images) values
('Classic White Tee', 'High quality cotton tee.', 29.99, 100, 'Clothing', ARRAY['https://picsum.photos/400?random=1']),
('Leather Weekend Bag', 'Durable leather bag for travel.', 199.99, 20, 'Accessories', ARRAY['https://picsum.photos/400?random=2']),
('Wireless Noise Cancelling Headphones', 'Premium sound quality.', 299.99, 50, 'Electronics', ARRAY['https://picsum.photos/400?random=3']);
