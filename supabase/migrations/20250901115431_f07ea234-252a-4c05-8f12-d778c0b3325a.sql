-- Add tags column to messages table
ALTER TABLE public.messages 
ADD COLUMN tags text[] DEFAULT ARRAY[]::text[];