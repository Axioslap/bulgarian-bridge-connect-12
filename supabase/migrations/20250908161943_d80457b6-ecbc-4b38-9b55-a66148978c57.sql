-- Create secure RPC function to fetch public profile data
CREATE OR REPLACE FUNCTION public.get_profile_public(_id uuid)
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  email text,
  university text,
  job_title text,
  company text,
  country text,
  city text,
  areas_of_interest text[],
  reason_for_joining text,
  willing_to_mentor text,
  linkedin_profile text,
  profile_photo_url text,
  membership_type text,
  created_at timestamptz,
  is_public boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    p.email,
    p.university,
    p.job_title,
    p.company,
    p.country,
    p.city,
    p.areas_of_interest,
    p.reason_for_joining,
    p.willing_to_mentor,
    p.linkedin_profile,
    p.profile_photo_url,
    p.membership_type,
    p.created_at,
    p.is_public
  FROM public.profiles p
  WHERE p.id = _id
    AND (COALESCE(p.is_public, true) OR auth.uid() = p.user_id);
$$;

-- Grant execute permissions
REVOKE ALL ON FUNCTION public.get_profile_public(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_profile_public(uuid) TO anon, authenticated;