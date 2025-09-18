-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('free', 'paid', 'admin', 'superadmin');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'superadmin' THEN 4
    WHEN 'admin' THEN 3
    WHEN 'paid' THEN 2
    WHEN 'free' THEN 1
  END DESC
  LIMIT 1
$$;

-- Create function to check role hierarchy
CREATE OR REPLACE FUNCTION public.has_role_or_higher(_user_id UUID, _min_role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND CASE _min_role
        WHEN 'free' THEN ur.role IN ('free', 'paid', 'admin', 'superadmin')
        WHEN 'paid' THEN ur.role IN ('paid', 'admin', 'superadmin')
        WHEN 'admin' THEN ur.role IN ('admin', 'superadmin')
        WHEN 'superadmin' THEN ur.role = 'superadmin'
      END
  )
$$;

-- RLS Policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role_or_higher(auth.uid(), 'admin'));

CREATE POLICY "Superadmins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role_or_higher(auth.uid(), 'superadmin'))
WITH CHECK (public.has_role_or_higher(auth.uid(), 'superadmin'));

-- Add trigger for updated_at
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert roles for existing users
-- Set asenivanov610@gmail.com as superadmin
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'superadmin'::app_role
FROM auth.users u
WHERE u.email = 'asenivanov610@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Set all other existing users as admin
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE u.email != 'asenivanov610@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Create trigger to assign default role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'free'::app_role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role();