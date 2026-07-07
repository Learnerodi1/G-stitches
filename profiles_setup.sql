-- ============================================================
-- G-STITCHES — PROFILES & AUTH SETUP
-- ============================================================
-- HOW TO USE:
--   1. Go to your Supabase project
--   2. Click "SQL Editor" in the left sidebar
--   3. Click "New Query"
--   4. Paste this entire file and click "Run"
-- ============================================================
-- NOTE: You do NOT create the users table yourself.
--   Supabase automatically creates auth.users when someone
--   signs up. This file only creates the profiles table that
--   links to it and stores extra info like name, phone, avatar.
-- ============================================================


-- ============================================================
-- STEP 1: PROFILES TABLE
-- Stores display name, phone, avatar URL, and role for each
-- user. One row per user, linked to auth.users by id.
-- ============================================================

create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  phone       text,
  avatar_url  text,
  role        text not null default 'customer'
                check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ============================================================
-- STEP 2: AUTO-UPDATE updated_at ON EVERY PROFILE CHANGE
-- Whenever someone saves their name or phone, updated_at is
-- automatically set to the current time.
-- ============================================================

create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger set_updated_at_profiles
  before update on profiles
  for each row execute function handle_updated_at();


-- ============================================================
-- STEP 3: AUTO-CREATE PROFILE WHEN A USER SIGNS UP
-- The moment Supabase creates a row in auth.users (sign up),
-- this trigger fires and creates a matching row in profiles
-- with the name and phone they entered during registration.
-- ============================================================

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
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop old trigger first to avoid duplicate errors
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ============================================================
-- STEP 4: ROW LEVEL SECURITY (RLS)
-- Prevents users from reading or editing other users' profiles.
-- Each user can only see and change their own row.
-- ============================================================

alter table profiles enable row level security;

-- Drop old policies first (prevents "already exists" errors)
drop policy if exists "profiles_own_select" on profiles;
drop policy if exists "profiles_own_update" on profiles;
drop policy if exists "profiles_insert"     on profiles;
drop policy if exists "profiles_admin_all"  on profiles;

-- Users see only their own profile row
create policy "profiles_own_select" on profiles
  for select using (auth.uid() = id);

-- Users can only edit their own profile
create policy "profiles_own_update" on profiles
  for update using (auth.uid() = id);

-- Allows the trigger to insert the profile row on sign up
create policy "profiles_insert" on profiles
  for insert with check (auth.uid() = id);


-- ============================================================
-- STEP 5: is_admin() HELPER FUNCTION
-- Used by admin pages to check if the current user is admin.
-- Returns true if the logged-in user has role = 'admin'.
-- ============================================================

create or replace function is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from profiles
    where id   = auth.uid()
    and   role = 'admin'
  );
$$;

-- Allow admins to read and manage ALL profiles
drop policy if exists "profiles_admin_all" on profiles;
create policy "profiles_admin_all" on profiles
  for all using (is_admin());


-- ============================================================
-- STEP 6: STORAGE BUCKET FOR AVATAR / PHOTO UPLOADS
-- Creates a public "images" bucket. Users upload their profile
-- photo here. The public URL is then saved to avatar_url.
-- ============================================================

-- Create the bucket (public = photos are viewable by anyone)
insert into storage.buckets (id, name, public)
  values ('images', 'images', true)
  on conflict (id) do nothing;

-- Drop old storage policies first
drop policy if exists "images_public_read"   on storage.objects;
drop policy if exists "images_public_upload" on storage.objects;
drop policy if exists "images_auth_upload"   on storage.objects;
drop policy if exists "images_own_update"    on storage.objects;
drop policy if exists "images_own_delete"    on storage.objects;

-- Anyone (including non-logged-in visitors) can view images
-- This is needed so avatar photos display on screen
create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

-- Only logged-in users can upload a photo
create policy "images_auth_upload" on storage.objects
  for insert with check (
    bucket_id = 'images'
    and auth.role() = 'authenticated'
  );

-- Logged-in users can replace (update) their photo
create policy "images_own_update" on storage.objects
  for update using (
    bucket_id = 'images'
    and auth.role() = 'authenticated'
  );

-- Logged-in users can delete their photo
create policy "images_own_delete" on storage.objects
  for delete using (
    bucket_id = 'images'
    and auth.role() = 'authenticated'
  );


-- ============================================================
-- STEP 7: REALTIME
-- Enables live updates so the admin Customers page refreshes
-- automatically the moment a new user registers.
-- ============================================================

alter publication supabase_realtime add table profiles;


-- ============================================================
-- DONE. Here is what you should see in your Supabase dashboard
-- after running this file:
--
--  Table Editor
--    profiles table with columns:
--      id, email, full_name, phone, avatar_url,
--      role, created_at, updated_at
--
--  Database → Functions
--    handle_new_user
--    handle_updated_at
--    is_admin
--
--  Database → Triggers
--    on_auth_user_created  (fires on auth.users INSERT)
--    set_updated_at_profiles  (fires on profiles UPDATE)
--
--  Authentication → Policies → profiles
--    profiles_own_select
--    profiles_own_update
--    profiles_insert
--    profiles_admin_all
--
--  Storage → Buckets
--    images  (marked Public)
--
--  Storage → Policies
--    images_public_read
--    images_auth_upload
--    images_own_update
--    images_own_delete
--
-- TO TEST:
--   1. Go to Authentication → Users → Invite user (or sign up)
--   2. Go to Table Editor → profiles
--   3. A new row should appear automatically with their email
-- ============================================================
