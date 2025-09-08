-- Public profile fetch that is RLS-safe and can include email from auth.users
create or replace function public.get_profile_public(_id uuid)
returns table (
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
  created_at timestamptz,
  email text,
  user_id uuid
)
language sql
security definer
as $$
  -- Only allow if profile is public OR the requester is the owner
  select
    p.id, p.first_name, p.last_name, p.profile_photo_url, p.city, p.country,
    p.job_title, p.company, p.university, p.areas_of_interest,
    p.reason_for_joining, p.willing_to_mentor, p.linkedin_profile,
    p.membership_type, p.created_at,
    u.email, p.user_id
  from public.profiles p
  left join auth.users u on u.id = p.user_id
  where p.id = _id
    and (coalesce(p.is_public, true) or auth.uid() = p.user_id)
  limit 1;
$$;

revoke all on function public.get_profile_public(uuid) from public;
grant execute on function public.get_profile_public(uuid) to anon, authenticated;