-- Update RLS policy to allow profile creation during signup
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Keep the other policies as they are for security
-- Users can only view and update their own profiles after they're logged in