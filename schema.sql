-- ============================================================
-- G-STITCHES — COMPLETE SCHEMA
-- Run this ONCE on a fresh Supabase project.
-- If your tables already exist, run ONLY the MIGRATION section
-- at the very bottom of this file.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── 1. PROFILES ───────────────────────────────────────────────
-- One row per auth user, created automatically by trigger below.
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  phone       text,
  avatar_url  text,
  role        text not null default 'customer'
                check (role in ('customer','admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── 2. HELPER FUNCTIONS ──────────────────────────────────────

-- Keeps updated_at current on every row edit
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Returns true if the calling user has role = 'admin'
create or replace function is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and   role = 'admin'
  );
$$;

-- Auto-creates a profile row whenever a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone',     ''),
    case
      when new.email = current_setting('app.admin_email', true)
      then 'admin'
      else 'customer'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Triggers
create or replace trigger set_updated_at_profiles
  before update on profiles
  for each row execute function handle_updated_at();

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ── 3. PRODUCTS ───────────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  price       numeric(10,2) not null,
  image_url   text not null,
  alt         text,
  category    text,
  featured    boolean not null default false,
  in_stock    boolean not null default true,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace trigger set_updated_at_products
  before update on products
  for each row execute function handle_updated_at();


-- ── 4. APPOINTMENTS ───────────────────────────────────────────
-- user_id is nullable so guests can also book without an account
create table if not exists appointments (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete set null,
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  phone           text,
  garment_type    text,
  preferred_date  text,
  preferred_time  text,
  notes           text,
  status          text not null default 'pending'
                    check (status in ('pending','confirmed','completed','cancelled')),
  created_at      timestamptz not null default now()
);


-- ── 5. CONTACT MESSAGES ───────────────────────────────────────
create table if not exists contact_messages (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete set null,
  first_name  text,
  last_name   text,
  phone       text,
  email       text,
  location    text,
  message     text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);


-- ── 6. CUSTOM DESIGN REQUESTS ─────────────────────────────────
create table if not exists custom_designs (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid references auth.users(id) on delete set null,
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text,
  design_image_url  text not null,
  description       text,
  budget            numeric(10,2),
  status            text not null default 'pending'
                      check (status in ('pending','reviewed','quoted','in_progress','completed')),
  admin_notes       text,
  created_at        timestamptz not null default now()
);


-- ── 7. ORDERS ─────────────────────────────────────────────────
-- user_id is nullable — guest checkout is allowed
create table if not exists orders (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid references auth.users(id) on delete set null,
  first_name        text not null,
  last_name         text not null,
  email             text not null,
  phone             text,
  street_address    text not null,
  city              text not null,
  state             text not null,
  postal_code       text,
  subtotal          numeric(10,2) not null,
  shipping          numeric(10,2) not null default 0,
  total             numeric(10,2) not null,
  payment_reference text,
  payment_status    text not null default 'pending'
                      check (payment_status in ('pending','paid','failed')),
  order_status      text not null default 'processing'
                      check (order_status in ('processing','shipped','delivered','cancelled')),
  created_at        timestamptz not null default now()
);


-- ── 8. ORDER ITEMS ────────────────────────────────────────────
create table if not exists order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  name        text not null,
  size        text,
  price       numeric(10,2) not null,
  quantity    int not null default 1,
  created_at  timestamptz not null default now()
);


-- ── 9. REVIEWS ────────────────────────────────────────────────
create table if not exists reviews (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete set null,
  product_id    uuid references products(id) on delete cascade,
  customer_name text not null,
  rating        int not null check (rating between 1 and 5),
  comment       text,
  approved      boolean not null default false,
  created_at    timestamptz not null default now()
);


-- ── 10. ROW LEVEL SECURITY ────────────────────────────────────

alter table profiles         enable row level security;
alter table products         enable row level security;
alter table appointments     enable row level security;
alter table contact_messages enable row level security;
alter table custom_designs   enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table reviews          enable row level security;

-- PROFILES
-- Owner can read/update their own; admin can see all
create policy "profiles_own_select" on profiles
  for select using (auth.uid() = id or is_admin());
create policy "profiles_own_update" on profiles
  for update using (auth.uid() = id or is_admin());
-- Trigger uses security definer so it bypasses this, but needed for direct inserts
create policy "profiles_insert" on profiles
  for insert with check (auth.uid() = id);

-- PRODUCTS — public read, admin writes
create policy "products_public_read" on products
  for select using (true);
create policy "products_admin_all" on products
  for all using (is_admin());

-- APPOINTMENTS
-- Anyone can insert (guest booking); logged-in user can read their own
create policy "appointments_public_insert" on appointments
  for insert with check (true);
create policy "appointments_own_select" on appointments
  for select using (auth.uid() = user_id or is_admin());
create policy "appointments_admin_all" on appointments
  for all using (is_admin());

-- CONTACT MESSAGES
create policy "contact_public_insert" on contact_messages
  for insert with check (true);
create policy "contact_own_select" on contact_messages
  for select using (auth.uid() = user_id or is_admin());
create policy "contact_admin_all" on contact_messages
  for all using (is_admin());

-- CUSTOM DESIGNS
create policy "designs_public_insert" on custom_designs
  for insert with check (true);
create policy "designs_own_select" on custom_designs
  for select using (auth.uid() = user_id or is_admin());
create policy "designs_admin_all" on custom_designs
  for all using (is_admin());

-- ORDERS — anyone inserts (guest checkout); owner reads their own
create policy "orders_public_insert" on orders
  for insert with check (true);
create policy "orders_own_select" on orders
  for select using (auth.uid() = user_id or is_admin());
create policy "orders_admin_all" on orders
  for all using (is_admin());

-- ORDER ITEMS — readable via parent order ownership
create policy "order_items_public_insert" on order_items
  for insert with check (true);
create policy "order_items_own_select" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and   (orders.user_id = auth.uid() or is_admin())
    )
  );
create policy "order_items_admin_all" on order_items
  for all using (is_admin());

-- REVIEWS
create policy "reviews_public_read" on reviews
  for select using (approved = true or auth.uid() = user_id or is_admin());
create policy "reviews_public_insert" on reviews
  for insert with check (true);
create policy "reviews_own_update" on reviews
  for update using (auth.uid() = user_id);
create policy "reviews_admin_all" on reviews
  for all using (is_admin());


-- ── 11. STORAGE ───────────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('images', 'images', true)
  on conflict (id) do nothing;

create policy "images_public_read"   on storage.objects
  for select using (bucket_id = 'images');
create policy "images_public_upload" on storage.objects
  for insert with check (bucket_id = 'images');
create policy "images_admin_update"  on storage.objects
  for update using (bucket_id = 'images' and is_admin());
create policy "images_admin_delete"  on storage.objects
  for delete using (bucket_id = 'images' and is_admin());


-- ════════════════════════════════════════════════════════════
-- MIGRATION — Run ONLY these lines if tables already exist
-- Copy and paste the block below into Supabase SQL Editor
-- ════════════════════════════════════════════════════════════

/*

-- STEP 1: Add missing columns
alter table profiles         add column if not exists phone      text;
alter table profiles         add column if not exists avatar_url text;
alter table appointments     add column if not exists user_id    uuid references auth.users(id) on delete set null;
alter table contact_messages add column if not exists user_id    uuid references auth.users(id) on delete set null;
alter table custom_designs   add column if not exists user_id    uuid references auth.users(id) on delete set null;
alter table orders           add column if not exists user_id    uuid references auth.users(id) on delete set null;
alter table reviews          add column if not exists user_id    uuid references auth.users(id) on delete set null;

-- STEP 2: Replace the trigger function to also save phone
create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone',     ''),
    case
      when new.email = current_setting('app.admin_email', true)
      then 'admin'
      else 'customer'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- STEP 3: Add new RLS select policies for customers
-- (only add if you haven't already — running twice will cause a "policy already exists" error)
create policy "appointments_own_select" on appointments
  for select using (auth.uid() = user_id or is_admin());

create policy "contact_own_select" on contact_messages
  for select using (auth.uid() = user_id or is_admin());

create policy "designs_own_select" on custom_designs
  for select using (auth.uid() = user_id or is_admin());

create policy "orders_own_select" on orders
  for select using (auth.uid() = user_id or is_admin());

create policy "order_items_own_select" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and   (orders.user_id = auth.uid() or is_admin())
    )
  );

create policy "reviews_own_update" on reviews
  for update using (auth.uid() = user_id);

-- Drop the old reviews select policy that only allowed approved reviews,
-- replace with one that also lets the author see their own unapproved reviews
drop policy if exists "reviews_public_read" on reviews;
create policy "reviews_public_read" on reviews
  for select using (approved = true or auth.uid() = user_id or is_admin());

-- STEP 4: Enable Realtime on profiles so the admin customers page
-- receives live updates when a new user registers.
-- In Supabase dashboard: Table Editor → profiles → Enable Realtime toggle
-- OR run:
alter publication supabase_realtime add table profiles;

*/
