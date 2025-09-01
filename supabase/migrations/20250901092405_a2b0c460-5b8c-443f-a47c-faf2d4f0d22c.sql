-- Add foreign key constraints to link tables properly

-- Add foreign key constraint for discussions.user_id -> profiles.user_id
ALTER TABLE public.discussions 
ADD CONSTRAINT discussions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint for discussion_comments.user_id -> auth.users.id
ALTER TABLE public.discussion_comments 
ADD CONSTRAINT discussion_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint for discussion_comments.discussion_id -> discussions.id
ALTER TABLE public.discussion_comments 
ADD CONSTRAINT discussion_comments_discussion_id_fkey 
FOREIGN KEY (discussion_id) REFERENCES public.discussions(id) ON DELETE CASCADE;

-- Add foreign key constraint for discussion_likes.user_id -> auth.users.id
ALTER TABLE public.discussion_likes 
ADD CONSTRAINT discussion_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint for discussion_likes.discussion_id -> discussions.id
ALTER TABLE public.discussion_likes 
ADD CONSTRAINT discussion_likes_discussion_id_fkey 
FOREIGN KEY (discussion_id) REFERENCES public.discussions(id) ON DELETE CASCADE;

-- Add foreign key constraint for messages.sender_id -> auth.users.id
ALTER TABLE public.messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint for messages.recipient_id -> auth.users.id
ALTER TABLE public.messages 
ADD CONSTRAINT messages_recipient_id_fkey 
FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint for event_registrations.user_id -> auth.users.id
ALTER TABLE public.event_registrations 
ADD CONSTRAINT event_registrations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint for event_registrations.event_id -> events.id
ALTER TABLE public.event_registrations 
ADD CONSTRAINT event_registrations_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

-- Add foreign key constraint for events.created_by -> auth.users.id
ALTER TABLE public.events 
ADD CONSTRAINT events_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add foreign key constraint for profiles.user_id -> auth.users.id
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;