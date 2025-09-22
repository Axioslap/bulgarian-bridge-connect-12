-- Fix RLS policies for videos table to ensure inserts work properly
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "videos_insert_own" ON public.videos;
DROP POLICY IF EXISTS "videos_read_all" ON public.videos;

-- Create robust RLS policies for video sharing
CREATE POLICY "videos_insert_own" 
ON public.videos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "videos_read_all" 
ON public.videos 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);