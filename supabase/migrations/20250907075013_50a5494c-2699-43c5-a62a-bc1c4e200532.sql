-- Ensure RLS is ON for profiles
alter table public.profiles enable row level security;

-- Everyone can read public profiles (assuming is_public column exists, if not we'll add it)
-- First check if is_public column exists, if not add it
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'is_public') then
    alter table public.profiles add column is_public boolean default true;
  end if;
end $$;

-- Drop existing policies and create new ones
drop policy if exists "Users can view other members' basic profile info" on public.profiles;
drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read
on public.profiles for select
using (is_public = true);

-- Owners can read/update their own profile
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists profiles_self_rw on public.profiles;
create policy profiles_self_rw
on public.profiles for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helpful indexes for pagination
create index if not exists profiles_created_idx on public.profiles(created_at desc, id);
create index if not exists profiles_public_idx on public.profiles(is_public);