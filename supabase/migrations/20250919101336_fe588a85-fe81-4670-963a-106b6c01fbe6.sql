-- Add latitude and longitude columns to profiles table for map positioning
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS lat double precision,
ADD COLUMN IF NOT EXISTS lng double precision,
ADD COLUMN IF NOT EXISTS state text;