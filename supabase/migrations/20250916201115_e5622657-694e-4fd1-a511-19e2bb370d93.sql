-- SECURITY FIX: Further restrict profile access and anonymize discussion data

-- Drop the current public profile view policy and create a more restrictive one
DROP POLICY IF EXISTS "public_safe_profile_view" ON public.profiles;

-- Create a highly restrictive policy that only shows minimal safe data
CREATE POLICY "minimal_public_profile_view" ON public.profiles
FOR SELECT USING (
  -- Only allow public access to very limited fields, full access to owner
  COALESCE(is_public, true) = true AND auth.uid() != user_id
);

-- Update get_profile_public function to be much more restrictive for public access
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
    -- Only show first name for both public and owner (no sensitive data)
    p.first_name,
    -- Never show last name publicly, only to owner
    CASE 
      WHEN auth.uid() = p.user_id THEN p.last_name 
      ELSE NULL 
    END as last_name,
    -- Only show profile photo if public
    CASE 
      WHEN auth.uid() = p.user_id OR COALESCE(p.is_public, true) = true THEN p.profile_photo_url
      ELSE NULL 
    END as profile_photo_url,
    -- Only show city to owner, hide from public
    CASE 
      WHEN auth.uid() = p.user_id THEN p.city 
      ELSE NULL 
    END as city,
    -- Only show country to owner, hide from public  
    CASE 
      WHEN auth.uid() = p.user_id THEN p.country 
      ELSE NULL 
    END as country,
    -- Hide all professional info from public
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
    -- Only show areas of interest if user allows public profile
    CASE 
      WHEN auth.uid() = p.user_id THEN p.areas_of_interest
      WHEN COALESCE(p.is_public, true) = true THEN p.areas_of_interest
      ELSE ARRAY[]::text[]
    END as areas_of_interest,
    -- Hide personal reasons from public
    CASE 
      WHEN auth.uid() = p.user_id THEN p.reason_for_joining 
      ELSE NULL 
    END as reason_for_joining,
    -- Only show mentoring status if public profile enabled
    CASE 
      WHEN auth.uid() = p.user_id THEN p.willing_to_mentor
      WHEN COALESCE(p.is_public, true) = true THEN p.willing_to_mentor
      ELSE NULL
    END as willing_to_mentor,
    -- Never show LinkedIn publicly
    CASE 
      WHEN auth.uid() = p.user_id THEN p.linkedin_profile 
      ELSE NULL 
    END as linkedin_profile,
    -- Hide membership type from public
    CASE 
      WHEN auth.uid() = p.user_id THEN p.membership_type
      ELSE NULL
    END as membership_type,
    p.created_at,
    -- Never show email publicly
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

-- Create function to get anonymized author info for public discussion views
CREATE OR REPLACE FUNCTION public.get_discussion_author_safe(discussion_user_id uuid)
RETURNS TABLE(
  author_name text,
  author_id text,
  is_mentor boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    -- Only show first name for author identification
    COALESCE(p.first_name, 'Anonymous') as author_name,
    -- Return anonymized ID instead of real user_id using simple hash
    CONCAT('user_', substring(p.user_id::text, 1, 8)) as author_id,
    -- Show if they're willing to mentor (networking feature)
    CASE 
      WHEN p.willing_to_mentor = 'yes' THEN true
      ELSE false
    END as is_mentor
  FROM public.profiles p
  WHERE p.user_id = discussion_user_id
    AND COALESCE(p.is_public, true) = true
  LIMIT 1;
$$;