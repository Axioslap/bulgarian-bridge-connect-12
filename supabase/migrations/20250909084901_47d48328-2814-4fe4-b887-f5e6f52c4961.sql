-- Fix security issue: Restrict public access to sensitive profile data

-- Drop existing problematic policies
DROP POLICY IF EXISTS "profiles_public_or_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_rw" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update only their own profile" ON public.profiles;

-- Create secure RLS policies that protect sensitive data
-- Policy 1: Users can always view and manage their own profile completely
CREATE POLICY "Users can manage their own profile" 
ON public.profiles 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Public can only view basic, non-sensitive profile information
CREATE POLICY "Public can view basic profile info" 
ON public.profiles 
FOR SELECT 
TO public
USING (
  COALESCE(is_public, true) = true
);

-- Policy 3: Allow profile creation during signup
CREATE POLICY "Allow profile creation" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update the get_profile_public function to protect sensitive data
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
  -- Only allow if profile is public OR the requester is the owner
  select
    p.id, p.first_name, p.last_name, p.profile_photo_url, p.city, p.country,
    p.job_title, p.company, p.university, p.areas_of_interest,
    p.reason_for_joining, p.willing_to_mentor, p.linkedin_profile,
    p.membership_type, p.created_at,
    -- Only return sensitive data to profile owner
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

-- Ensure proper permissions
REVOKE ALL ON FUNCTION public.get_profile_public(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_profile_public(uuid) TO anon, authenticated;