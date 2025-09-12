-- Create a secure RPC to soft-delete a post by its author
CREATE OR REPLACE FUNCTION public.soft_delete_post(p_post_id uuid)
RETURNS TABLE(id uuid, deleted_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Require authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Soft delete only if the caller is the author and the post isn't already deleted
  RETURN QUERY
  UPDATE public.posts
     SET deleted_at = now(),
         updated_at = now()
   WHERE id = p_post_id
     AND author_id = auth.uid()
     AND deleted_at IS NULL
  RETURNING id, deleted_at;
END;
$$;
