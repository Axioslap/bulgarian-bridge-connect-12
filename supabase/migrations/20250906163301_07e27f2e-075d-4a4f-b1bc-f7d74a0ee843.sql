-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "posts_read" ON public.posts 
FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "posts_insert" ON public.posts 
FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts_update" ON public.posts 
FOR UPDATE USING (auth.uid() = author_id);

-- RLS Policies for comments
CREATE POLICY "comments_read" ON public.comments 
FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "comments_insert" ON public.comments 
FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "comments_update" ON public.comments 
FOR UPDATE USING (auth.uid() = author_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS posts_created_idx ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS comments_post_idx ON public.comments(post_id, created_at);

-- Create trigger for updating updated_at
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();