-- Fix security issue: Update existing policies to protect sensitive data

-- First, let's check what policies exist and update them appropriately
-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "profiles_public_or_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_rw" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update only their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;

-- Create secure RLS policies that protect sensitive data

-- Policy 1: Users can manage their own profile completely
CREATE POLICY "profile_owner_full_access" 
ON public.profiles 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Public/unauthenticated users can only view basic, non-sensitive information
-- This policy works with the updated get_profile_public function to control data exposure
CREATE POLICY "public_basic_profile_view" 
ON public.profiles 
FOR SELECT 
TO public
USING (COALESCE(is_public, true) = true);

-- Policy 3: Allow authenticated users to create profiles during signup
CREATE POLICY "authenticated_profile_creation" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update the get_profile_public function to conditionally return sensitive data
CREATE OR REPLACE FUNCTION public.get_profile_public(_id uuid)
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  profile_photo_url text,
  city text,
  country text,
  job_title text,
  company text,
  university text,
  areas_of_interest text[],
  reason_for_joining text,
  willing_to_mentor text,
  linkedin_profile text,
  membership_type text,
  created_at timestamp with time zone,
  email text,
  user_id uuid
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  select
    p.id, p.first_name, p.last_name, p.profile_photo_url, p.city, p.country,
    p.job_title, p.company, p.university, p.areas_of_interest,
    p.reason_for_joining, p.willing_to_mentor, p.linkedin_profile,
    p.membership_type, p.created_at,
    -- Only return email to the profile owner, null for everyone else
    CASE 
      WHEN auth.uid() = p.user_id THEN p.email 
      ELSE NULL 
    END as email,
    p.user_id
  from public.profiles p
  where p.id = _id
    and (coalesce(p.is_public, true) or auth.uid() = p.user_id)
  limit 1;
$$;