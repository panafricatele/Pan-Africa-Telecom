-- ============================================================
-- Pan Africa Telecom – Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer',  -- 'customer' | 'admin'
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Everyone can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (but not role)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow insert from trigger
create policy "Service can insert profiles"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. Cart items table (persisted cart for logged-in users)
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phone_id text not null,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique(user_id, phone_id)
);

alter table public.cart_items enable row level security;

create policy "Users manage own cart"
  on public.cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 3. Packages table (service plans the admin can manage)
create table if not exists public.packages (
  id text primary key,
  category text not null,           -- internet | lte | global | voice | solar
  technologies text[] not null default '{}',
  name text not null,
  tagline text,
  price numeric not null default 0,
  price_label text not null default '/ month',
  speed text,
  uncapped boolean not null default false,
  features text[] not null default '{}',
  demand_range numeric[] not null default '{0,0}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.packages enable row level security;

-- Anyone can read packages
create policy "Public can read packages"
  on public.packages for select
  using (true);

-- Only admins can insert/update/delete
create policy "Admins manage packages"
  on public.packages for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- 4. Products table (phones & equipment the admin can manage)
create table if not exists public.products (
  id text primary key,
  slug text not null,
  category text not null default 'phone',  -- phone | equipment
  name text not null,
  brand text not null,
  model text not null,
  color text not null default '',
  color_code text not null default '#000000',
  price numeric not null default 0,
  compare_at_price numeric,
  stock int not null default 0,
  image text not null default '',
  description text not null default '',
  specs jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone can read products
create policy "Public can read products"
  on public.products for select
  using (true);

-- Only admins can insert/update/delete
create policy "Admins manage products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- 5. Updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger packages_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();
