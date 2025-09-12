-- Fix posts update policy to allow updating (soft delete/edit) by the author
DROP POLICY IF EXISTS "posts_update" ON public.posts;

CREATE POLICY "posts_update"
ON public.posts
FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);
