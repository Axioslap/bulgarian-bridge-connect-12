-- Update the get_profile_public function to protect sensitive data like email
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