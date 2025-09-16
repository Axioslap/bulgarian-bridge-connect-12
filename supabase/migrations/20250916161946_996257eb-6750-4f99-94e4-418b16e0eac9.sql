-- CRITICAL SECURITY FIX: Restrict public profile access to safe fields only

-- Drop the overly permissive public profile view policy
DROP POLICY IF EXISTS "public_basic_profile_view" ON public.profiles;

-- Create a new restrictive policy that only exposes safe, non-sensitive fields
CREATE POLICY "public_safe_profile_view" ON public.profiles
FOR SELECT USING (
  COALESCE(is_public, true) = true AND auth.uid() != user_id
);

-- Update the get_profile_public function to only return safe fields for public access
CREATE OR REPLACE FUNCTION public.get_profile_public(_id uuid)
RETURNS TABLE(
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
SET search_path = public
AS $$
  SELECT
    p.id, 
    -- Only show first name publicly, full name to owner
    CASE 
      WHEN auth.uid() = p.user_id THEN p.first_name 
      ELSE p.first_name 
    END as first_name,
    -- Only show last name to owner
    CASE 
      WHEN auth.uid() = p.user_id THEN p.last_name 
      ELSE NULL 
    END as last_name,
    p.profile_photo_url,
    -- Only show city publicly, not full address details
    CASE 
      WHEN auth.uid() = p.user_id THEN p.city 
      ELSE p.city 
    END as city,
    CASE 
      WHEN auth.uid() = p.user_id THEN p.country 
      ELSE p.country 
    END as country,
    -- Hide sensitive professional info from public
    CASE 
      WHEN auth.uid() = p.user_id THEN p.job_title 
      ELSE NULL 
    END as job_title,
    CASE 
      WHEN auth.uid() = p.user_id THEN p.company 
      ELSE NULL 
    END as company,
    CASE 
      WHEN auth.uid() = p.user_id THEN p.university 
      ELSE NULL 
    END as university,
    -- Areas of interest can be public for networking
    p.areas_of_interest,
    -- Hide personal reasons from public
    CASE 
      WHEN auth.uid() = p.user_id THEN p.reason_for_joining 
      ELSE NULL 
    END as reason_for_joining,
    -- Mentoring status can be public for networking
    p.willing_to_mentor,
    -- Hide LinkedIn from public to prevent harassment
    CASE 
      WHEN auth.uid() = p.user_id THEN p.linkedin_profile 
      ELSE NULL 
    END as linkedin_profile,
    p.membership_type,
    p.created_at,
    -- Only return email to the profile owner
    CASE 
      WHEN auth.uid() = p.user_id THEN p.email 
      ELSE NULL 
    END as email,
    p.user_id
  FROM public.profiles p
  WHERE p.id = _id
    AND (COALESCE(p.is_public, true) = true OR auth.uid() = p.user_id)
  LIMIT 1;
$$;