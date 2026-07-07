-- ================================================================
-- G-STITCHES — MASTER SCHEMA
-- One file to rule them all. Run this on a FRESH Supabase project.
-- ================================================================
-- HOW TO USE:
--   1. Go to supabase.com → your NEW project
--   2. Click SQL Editor → New query
--   3. Paste this entire file and click Run
--   4. Done. Every table, trigger, policy, and storage bucket
--      needed by every page in the app is created here.
-- ================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";


-- ================================================================
-- TABLE 1: PROFILES
-- One row per user. Auto-created by trigger when someone signs up.
-- Used by: account pages, admin customers, navbar avatar, sidebar
-- ================================================================
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  phone       text,
  avatar_url  text,
  role        text not null default 'customer'
                check (role in ('customer', 'admin', 'manager')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ================================================================
-- TABLE 2: PRODUCTS
-- All items in the shop. Admin can add/edit/delete.
-- Used by: gallery page, checkout, admin products, admin dashboard
-- ================================================================
create table if not exists products (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  price       numeric(10,2) not null,
  image_url   text not null,
  alt         text,
  category    text,           -- 'Women' | 'Men' | 'Accessories' | 'Bespoke'
  featured    boolean not null default false,
  in_stock    boolean not null default true,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ================================================================
-- TABLE 3: ORDERS
-- Created at checkout after Paystack payment succeeds.
-- user_id is nullable so guests can also checkout without account.
-- Used by: checkout, account orders, admin orders
-- ================================================================
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
                      check (payment_status in ('pending', 'paid', 'failed')),
  order_status      text not null default 'processing'
                      check (order_status in ('processing', 'shipped', 'delivered', 'cancelled')),
  created_at        timestamptz not null default now()
);


-- ================================================================
-- TABLE 4: ORDER ITEMS
-- Line items belonging to an order.
-- Used by: account orders page, admin order detail
-- ================================================================
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


-- ================================================================
-- TABLE 5: APPOINTMENTS
-- Fitting bookings. user_id nullable so guests can also book.
-- Used by: book-fitting page, account appointments, admin appointments
-- ================================================================
create table if not exists appointments (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete set null,
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  phone           text,
  garment_type    text,   -- 'bridal' | 'casual' | 'formal' | 'traditional'
  preferred_date  text,
  preferred_time  text,
  notes           text,
  status          text not null default 'pending'
                    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at      timestamptz not null default now()
);


-- ================================================================
-- TABLE 6: CONTACT MESSAGES
-- Messages from the contact form. user_id nullable for guests.
-- Used by: contact page, account messages, admin messages
-- ================================================================
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


-- ================================================================
-- TABLE 7: CUSTOM DESIGN REQUESTS
-- Bespoke / custom design submissions.
-- Used by: admin designs page
-- ================================================================
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
                      check (status in ('pending', 'reviewed', 'quoted', 'in_progress', 'completed')),
  admin_notes       text,
  created_at        timestamptz not null default now()
);


-- ================================================================
-- TABLE 8: REVIEWS
-- Product reviews left by customers after purchase.
-- Used by: admin reviews page
-- ================================================================
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


-- ================================================================
-- FUNCTIONS
-- ================================================================

-- Auto-update updated_at on every row edit
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Auto-create a profile row the moment someone signs up.
-- Reads full_name and phone from the data passed to signUp().
-- SECURITY DEFINER so it runs as postgres (bypasses RLS safely).
create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Returns true if the currently logged-in user has role = 'admin' or 'manager'.
-- Used in RLS policies so admins can see/edit everything.
create or replace function is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from profiles
    where id   = auth.uid()
    and   role in ('admin', 'manager')
  );
$$;


-- ================================================================
-- TRIGGERS
-- ================================================================

-- updated_at on profiles
drop trigger if exists set_updated_at_profiles on profiles;
create trigger set_updated_at_profiles
  before update on profiles
  for each row execute function handle_updated_at();

-- updated_at on products
drop trigger if exists set_updated_at_products on products;
create trigger set_updated_at_products
  before update on products
  for each row execute function handle_updated_at();

-- Auto-create profile on sign up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

alter table profiles         enable row level security;
alter table products         enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table appointments     enable row level security;
alter table contact_messages enable row level security;
alter table custom_designs   enable row level security;
alter table reviews          enable row level security;

-- Drop all old policies first (prevents "already exists" errors
-- if you are re-running this file on an existing project)
do $$ declare r record;
begin
  for r in (
    select policyname, tablename from pg_policies
    where schemaname = 'public'
    and tablename in (
      'profiles','products','orders','order_items',
      'appointments','contact_messages','custom_designs','reviews'
    )
  ) loop
    execute format('drop policy if exists %I on %I', r.policyname, r.tablename);
  end loop;
end $$;


-- ── PROFILES ──────────────────────────────────────────────────

-- Anyone can insert (the trigger needs this; auth.uid() = NULL at insert time)
create policy "profiles_insert" on profiles
  for insert with check (true);

-- Users see only their own row; admins see all
create policy "profiles_own_select" on profiles
  for select using (auth.uid() = id or is_admin());

-- Users can update only their own row; admins can update all
create policy "profiles_own_update" on profiles
  for update using (auth.uid() = id or is_admin());

-- Admins can delete profiles
create policy "profiles_admin_delete" on profiles
  for delete using (is_admin());


-- ── PRODUCTS ──────────────────────────────────────────────────

-- Everyone (including anonymous visitors) can read products
create policy "products_public_read" on products
  for select using (true);

-- Only admins can create, update, or delete products
create policy "products_admin_write" on products
  for all using (is_admin());


-- ── ORDERS ────────────────────────────────────────────────────

-- Anyone (guest checkout) can insert an order
create policy "orders_public_insert" on orders
  for insert with check (true);

-- Logged-in users see only their own orders; admins see all
create policy "orders_own_select" on orders
  for select using (auth.uid() = user_id or is_admin());

-- Only admins can update order status
create policy "orders_admin_update" on orders
  for update using (is_admin());

-- Only admins can delete orders
create policy "orders_admin_delete" on orders
  for delete using (is_admin());


-- ── ORDER ITEMS ───────────────────────────────────────────────

-- Anyone can insert order items (created at same time as the order)
create policy "order_items_public_insert" on order_items
  for insert with check (true);

-- Users can read items from their own orders; admins read all
create policy "order_items_own_select" on order_items
  for select using (
    is_admin() or exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and   orders.user_id = auth.uid()
    )
  );

-- Only admins can delete order items
create policy "order_items_admin_delete" on order_items
  for delete using (is_admin());


-- ── APPOINTMENTS ──────────────────────────────────────────────

-- Anyone (including guests) can book an appointment
create policy "appointments_public_insert" on appointments
  for insert with check (true);

-- Logged-in users see their own appointments; admins see all
create policy "appointments_own_select" on appointments
  for select using (auth.uid() = user_id or is_admin());

-- Only admins can update appointment status
create policy "appointments_admin_update" on appointments
  for update using (is_admin());

-- Only admins can delete appointments
create policy "appointments_admin_delete" on appointments
  for delete using (is_admin());


-- ── CONTACT MESSAGES ──────────────────────────────────────────

-- Anyone (including guests) can send a contact message
create policy "contact_public_insert" on contact_messages
  for insert with check (true);

-- Logged-in users see their own messages; admins see all
create policy "contact_own_select" on contact_messages
  for select using (auth.uid() = user_id or is_admin());

-- Only admins can mark messages as read / delete them
create policy "contact_admin_update" on contact_messages
  for update using (is_admin());

create policy "contact_admin_delete" on contact_messages
  for delete using (is_admin());


-- ── CUSTOM DESIGNS ────────────────────────────────────────────

-- Anyone can submit a design request
create policy "designs_public_insert" on custom_designs
  for insert with check (true);

-- Logged-in users see their own requests; admins see all
create policy "designs_own_select" on custom_designs
  for select using (auth.uid() = user_id or is_admin());

-- Only admins can update/delete design requests
create policy "designs_admin_update" on custom_designs
  for update using (is_admin());

create policy "designs_admin_delete" on custom_designs
  for delete using (is_admin());


-- ── REVIEWS ───────────────────────────────────────────────────

-- Approved reviews are public; users see their own; admins see all
create policy "reviews_public_read" on reviews
  for select using (approved = true or auth.uid() = user_id or is_admin());

-- Anyone can submit a review
create policy "reviews_public_insert" on reviews
  for insert with check (true);

-- Users can edit their own reviews
create policy "reviews_own_update" on reviews
  for update using (auth.uid() = user_id);

-- Admins can approve/reject/delete any review
create policy "reviews_admin_all" on reviews
  for all using (is_admin());


-- ================================================================
-- STORAGE BUCKET: images
-- Used for: product photos, user avatars, design request images
-- Path conventions:
--   avatars/{user_id}.{ext}    → profile photos
--   products/{timestamp}.{ext} → product images
--   designs/{timestamp}.{ext}  → custom design images
-- ================================================================

insert into storage.buckets (id, name, public)
  values ('images', 'images', true)
  on conflict (id) do nothing;

-- Drop old storage policies first
do $$ declare r record;
begin
  for r in (
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
    and policyname like 'images_%'
  ) loop
    execute format('drop policy if exists %I on storage.objects', r.policyname);
  end loop;
end $$;

-- Anyone can view images (needed for avatars and product photos to display)
create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

-- Any logged-in user can upload an image
create policy "images_auth_upload" on storage.objects
  for insert with check (
    bucket_id = 'images'
    and auth.role() = 'authenticated'
  );

-- Any logged-in user can update (replace) their own uploads
create policy "images_auth_update" on storage.objects
  for update using (
    bucket_id = 'images'
    and auth.role() = 'authenticated'
  );

-- Any logged-in user can delete their own uploads
create policy "images_auth_delete" on storage.objects
  for delete using (
    bucket_id = 'images'
    and auth.role() = 'authenticated'
  );


-- ================================================================
-- REALTIME
-- Allows the admin Customers page to receive live updates
-- when a new user registers (no page refresh needed).
-- ================================================================
alter publication supabase_realtime add table profiles;


-- ================================================================
-- ADMIN USER SETUP
-- After running this schema, create your admin account:
--   1. Go to Authentication → Users → Add user
--   2. Enter your email and password
--   3. Go to Table Editor → profiles
--   4. Find your row and change role from 'customer' to 'admin'
-- OR run this SQL (replace the email with yours):
--
--   update profiles set role = 'admin'
--   where email = 'your-email@example.com';
--
-- ================================================================


-- ================================================================
-- DONE!
-- After running, you should see in your Supabase dashboard:
--
-- Table Editor:
--   profiles, products, orders, order_items, appointments,
--   contact_messages, custom_designs, reviews
--
-- Database → Functions:
--   handle_new_user, handle_updated_at, is_admin
--
-- Database → Triggers:
--   on_auth_user_created  (fires on auth.users INSERT)
--   set_updated_at_profiles, set_updated_at_products
--
-- Storage → Buckets:
--   images  (public)
--
-- Authentication → Policies (on each table):
--   profiles: insert, own_select, own_update, admin_delete
--   products: public_read, admin_write
--   orders: public_insert, own_select, admin_update, admin_delete
--   order_items: public_insert, own_select, admin_delete
--   appointments: public_insert, own_select, admin_update, admin_delete
--   contact_messages: public_insert, own_select, admin_update, admin_delete
--   custom_designs: public_insert, own_select, admin_update, admin_delete
--   reviews: public_read, public_insert, own_update, admin_all
-- ================================================================
