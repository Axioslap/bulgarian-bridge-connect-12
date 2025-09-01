-- Update RLS policy to allow users to see other members' profiles for the member directory
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policies for member directory functionality
CREATE POLICY "Users can view other members' basic profile info" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can update only their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);