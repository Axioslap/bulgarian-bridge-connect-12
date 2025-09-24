-- Add RLS policy to allow superadmins to delete events
CREATE POLICY "Superadmins can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (has_role_or_higher(auth.uid(), 'superadmin'::app_role));