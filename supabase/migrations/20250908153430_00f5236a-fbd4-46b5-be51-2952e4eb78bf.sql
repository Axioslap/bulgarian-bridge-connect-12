-- Fix RLS policies for profiles
alter table public.profiles enable row level security;

-- Allow reading public profiles or your own profile
drop policy if exists profiles_public_read on public.profiles;
drop policy if exists profiles_public_or_self on public.profiles;
create policy profiles_public_or_self
on public.profiles
for select
using (coalesce(is_public, true) OR auth.uid() = user_id);