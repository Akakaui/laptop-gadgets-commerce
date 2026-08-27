-- Kora Commerce / Supabase production schema
create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('owner', 'staff');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum ('awaiting_payment', 'awaiting_confirmation', 'ready_to_ship', 'shipped', 'out_for_delivery', 'delivered', 'returned', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded', 'cod');
exception when duplicate_object then null; end $$;

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'Kora Computers',
  support_phone text,
  support_email text,
  whatsapp_number text,
  address text,
  currency text not null default 'NGN',
  announcement text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'staff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  category_id uuid references public.categories(id) on delete set null,
  category text,
  name text not null,
  slug text not null unique,
  brand text,
  condition text,
  description text,
  price numeric(14,2) not null check (price >= 0),
  compare_at numeric(14,2) check (compare_at is null or compare_at >= price),
  image_tone text,
  stock integer not null default 0 check (stock >= 0),
  limited boolean not null default false,
  badge text,
  specs jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  weight_grams integer check (weight_grams is null or weight_grams > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  address text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer_id uuid references public.customers(id) on delete set null,
  customer text not null,
  phone text not null,
  email text,
  address text,
  item_count integer not null default 1 check (item_count > 0),
  total numeric(14,2) not null check (total >= 0),
  status public.order_status not null default 'awaiting_payment',
  payment public.payment_status not null default 'pending',
  city text not null,
  product text not null,
  items jsonb not null default '[]'::jsonb,
  provider_reference text,
  tracking_number text,
  placed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percent', 'fixed')),
  value numeric(14,2) not null check (value > 0),
  uses integer not null default 0 check (uses >= 0),
  usage_limit integer not null default 100 check (usage_limit > 0),
  expiry date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  provider text not null default 'manual',
  tracking_number text,
  status text not null default 'ready_to_ship',
  quoted_fee numeric(14,2),
  estimated_days text,
  provider_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  topic text,
  channel text not null default 'inbox',
  status text not null default 'open',
  last_message text,
  unread integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender text not null check (sender in ('customer', 'staff')),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  event_id text primary key,
  provider text not null,
  event_type text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(active);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists conversations_status_idx on public.conversations(status);

alter table public.store_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.coupons enable row level security;
alter table public.shipments enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.payment_events enable row level security;

create or replace function public.is_staff_or_owner() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'staff'));
$$;

create policy "public can view active categories" on public.categories for select to anon, authenticated using (active = true);
create policy "public can view active products" on public.products for select to anon, authenticated using (active = true);
create policy "staff can manage categories" on public.categories for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage products" on public.products for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage product images" on public.product_images for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage settings" on public.store_settings for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage customers" on public.customers for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage orders" on public.orders for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage coupons" on public.coupons for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage shipments" on public.shipments for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage conversations" on public.conversations for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage conversation messages" on public.conversation_messages for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage payment events" on public.payment_events for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
create policy "public can view product images" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
create policy "staff can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_staff_or_owner());
create policy "staff can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_staff_or_owner()) with check (bucket_id = 'product-images' and public.is_staff_or_owner());
create policy "staff can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_staff_or_owner());

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  product_name text not null,
  customer text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status text not null default 'Pending' check (status in ('Published', 'Pending', 'Hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'storefront',
  status text not null default 'Subscribed' check (status in ('Subscribed', 'Unsubscribed')),
  created_at timestamptz not null default now()
);

create table if not exists public.storefront_appearance (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'Kora Computers',
  tagline text not null default 'Good gear. Clear choices.',
  logo_url text,
  hero_url text,
  primary_color text not null default '#c9f25b',
  support_phone text,
  support_email text,
  whatsapp_number text,
  address text,
  currency text not null default 'NGN',
  announcement text,
  enabled_features jsonb not null default '{"reviews":true,"emailCapture":true,"variants":true,"delivery":true,"coupons":true,"chat":true,"cod":true,"analytics":true,"wishlist":false,"payments":true}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.reviews enable row level security;
alter table public.email_subscribers enable row level security;
alter table public.storefront_appearance enable row level security;
create policy "public can view published reviews" on public.reviews for select to anon, authenticated using (status = 'Published');
create policy "public can subscribe" on public.email_subscribers for insert to anon, authenticated with check (status = 'Subscribed');
create policy "staff can manage reviews" on public.reviews for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage subscribers" on public.email_subscribers for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());
create policy "staff can manage appearance" on public.storefront_appearance for all to authenticated using (public.is_staff_or_owner()) with check (public.is_staff_or_owner());

alter table public.products add column if not exists sku text;
alter table public.products add column if not exists weight text;
alter table public.products add column if not exists sizes jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists variants jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists tags jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists rating numeric(2,1) not null default 0;
alter table public.products add column if not exists review_count integer not null default 0;

alter table public.products add column if not exists image_url text;
alter table public.products alter column category drop not null;
alter table public.products alter column category drop default;
alter table public.products alter column brand drop not null;
alter table public.products alter column condition drop not null;
alter table public.products alter column description drop not null;
alter table public.products alter column description drop default;
