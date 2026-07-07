-- ============================================================
-- G-STITCHES — SIGNUP FIX
-- Run this in Supabase SQL Editor to fix the 500 error on signup
-- ============================================================

-- STEP 1: Replace trigger function with a clean version
-- (removes the buggy admin_email check that can crash the trigger)
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

-- STEP 2: Recreate the trigger cleanly
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- STEP 3: Drop ALL existing profiles policies (both schema files created duplicates)
drop policy if exists "profiles_own_select"  on profiles;
drop policy if exists "profiles_own_update"  on profiles;
drop policy if exists "profiles_insert"      on profiles;
drop policy if exists "profiles_admin_all"   on profiles;

-- STEP 4: Recreate policies correctly
-- Users can read their own profile
create policy "profiles_own_select" on profiles
  for select using (auth.uid() = id or is_admin());

-- Users can update their own profile
create policy "profiles_own_update" on profiles
  for update using (auth.uid() = id or is_admin());

-- Allow inserts freely — the trigger runs as postgres (no session user),
-- so auth.uid() = id would always fail and block signup
create policy "profiles_insert" on profiles
  for insert with check (true);

-- Admins can do everything
create policy "profiles_admin_all" on profiles
  for all using (is_admin());
