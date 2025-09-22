-- Ensure videos table exists with correct structure and RLS
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,               -- auth.users.id (matching existing schema)
  title text NOT NULL,
  description text,
  youtube_url text NOT NULL,
  youtube_video_id text NOT NULL,
  thumbnail_url text,
  category text DEFAULT 'Community',
  duration text,
  tags text[] DEFAULT ARRAY[]::text[],
  is_featured boolean DEFAULT false,
  is_public boolean DEFAULT true,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- INDEX for faster user lookups
CREATE INDEX IF NOT EXISTS videos_user_idx ON public.videos(user_id);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and create robust ones
DROP POLICY IF EXISTS "videos_insert_own" ON public.videos;
DROP POLICY IF EXISTS "videos_read_all" ON public.videos;
DROP POLICY IF EXISTS "Users can create their own videos" ON public.videos;
DROP POLICY IF EXISTS "Videos are viewable by everyone if public" ON public.videos;

-- Allow inserts by the logged-in user for their own rows
CREATE POLICY "videos_insert_own"
ON public.videos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow reads for public videos or own videos
CREATE POLICY "videos_read_all"
ON public.videos
FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

-- Allow updates for own videos
CREATE POLICY "videos_update_own"
ON public.videos
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow deletes for own videos
CREATE POLICY "videos_delete_own"
ON public.videos
FOR DELETE
USING (auth.uid() = user_id);