-- Fix security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    first_name,
    last_name,
    email,
    university,
    job_title,
    company,
    country,
    city,
    areas_of_interest,
    reason_for_joining,
    willing_to_mentor,
    linkedin_profile,
    referral_member,
    membership_type,
    agree_to_terms,
    agree_to_newsletter
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'university', ''),
    COALESCE(NEW.raw_user_meta_data->>'job_title', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data->>'areas_of_interest' IS NOT NULL 
        THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'areas_of_interest'))
        ELSE ARRAY[]::text[]
      END,
      ARRAY[]::text[]
    ),
    COALESCE(NEW.raw_user_meta_data->>'reason_for_joining', ''),
    NEW.raw_user_meta_data->>'willing_to_mentor',
    NEW.raw_user_meta_data->>'linkedin_profile',
    NEW.raw_user_meta_data->>'referral_member',
    COALESCE(NEW.raw_user_meta_data->>'membership_type', 'free'),
    COALESCE((NEW.raw_user_meta_data->>'agree_to_terms')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'agree_to_newsletter')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';