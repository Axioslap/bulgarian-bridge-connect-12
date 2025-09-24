-- Add member_access_level column to events table to control access based on membership
ALTER TABLE public.events 
ADD COLUMN member_access_level text DEFAULT 'free' CHECK (member_access_level IN ('free', 'paid', 'admin'));