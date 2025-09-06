-- Create message_receipts table for per-user message state
CREATE TABLE IF NOT EXISTS public.message_receipts (
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  read_at timestamptz,
  deleted_at timestamptz,
  PRIMARY KEY (message_id, user_id)
);

-- Enable RLS
ALTER TABLE public.message_receipts ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only see/modify their own receipts
CREATE POLICY "Users can view their own receipts" 
ON public.message_receipts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own receipts" 
ON public.message_receipts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receipts" 
ON public.message_receipts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS message_receipts_user_id_idx ON public.message_receipts(user_id);
CREATE INDEX IF NOT EXISTS message_receipts_message_id_idx ON public.message_receipts(message_id);