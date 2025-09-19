-- Ensure location columns exist on profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS state text, 
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS lat double precision,
  ADD COLUMN IF NOT EXISTS lng double precision,
  ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS profiles_country_state_idx ON public.profiles(country, state);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policy to allow reading public profiles
DROP POLICY IF EXISTS profiles_public_or_self ON public.profiles;
CREATE POLICY profiles_public_or_self
ON public.profiles FOR SELECT
USING (COALESCE(is_public, true) = true OR auth.uid() = user_id);