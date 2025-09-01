-- Create conversation_tags table for organizing messages
CREATE TABLE public.conversation_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.conversation_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for conversation_tags
CREATE POLICY "Users can view their own tags" 
ON public.conversation_tags 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags" 
ON public.conversation_tags 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" 
ON public.conversation_tags 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" 
ON public.conversation_tags 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create conversation_tag_assignments table to assign tags to conversations
CREATE TABLE public.conversation_tag_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversation_partner_id UUID NOT NULL,
  tag_id UUID NOT NULL REFERENCES public.conversation_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, conversation_partner_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.conversation_tag_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for conversation_tag_assignments
CREATE POLICY "Users can view their own tag assignments" 
ON public.conversation_tag_assignments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tag assignments" 
ON public.conversation_tag_assignments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tag assignments" 
ON public.conversation_tag_assignments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_conversation_tags_updated_at
BEFORE UPDATE ON public.conversation_tags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();