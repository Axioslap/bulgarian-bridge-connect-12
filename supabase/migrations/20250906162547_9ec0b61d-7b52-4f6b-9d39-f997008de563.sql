-- Add soft delete columns to messages table
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID;

-- Update RLS policy for messages to allow soft delete
CREATE POLICY "Users can soft delete their sent messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id);

CREATE POLICY "Users can soft delete received messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = recipient_id);