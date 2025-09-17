-- Create experts table for expert profiles
CREATE TABLE public.experts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  expertise TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin_profile TEXT,
  profile_image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  consultations_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;

-- RLS policies for experts table
CREATE POLICY "Anyone can view approved experts" 
ON public.experts 
FOR SELECT 
USING (is_approved = true AND is_active = true);

CREATE POLICY "Users can create their own expert profile" 
ON public.experts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expert profile" 
ON public.experts 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own expert profile" 
ON public.experts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_experts_updated_at
BEFORE UPDATE ON public.experts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();