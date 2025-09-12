-- Fix ambiguous column reference in soft_delete_post
CREATE OR REPLACE FUNCTION public.soft_delete_post(p_post_id uuid)
RETURNS TABLE(id uuid, deleted_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure the caller is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Qualify column references to avoid ambiguity with OUT params
  RETURN QUERY
  UPDATE public.posts AS p
     SET deleted_at = now(),
         updated_at = now()
   WHERE p.id = p_post_id
     AND p.author_id = auth.uid()
     AND p.deleted_at IS NULL
  RETURNING p.id, p.deleted_at;
END;
$$;