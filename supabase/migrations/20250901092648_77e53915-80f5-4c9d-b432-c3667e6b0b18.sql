-- Check and add missing foreign key constraints

-- First, let's check what constraints exist and add only the missing ones

-- Add foreign key constraint for discussion_comments.user_id -> auth.users.id (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'discussion_comments_user_id_fkey'
    ) THEN
        ALTER TABLE public.discussion_comments 
        ADD CONSTRAINT discussion_comments_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for discussion_comments.discussion_id -> discussions.id (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'discussion_comments_discussion_id_fkey'
    ) THEN
        ALTER TABLE public.discussion_comments 
        ADD CONSTRAINT discussion_comments_discussion_id_fkey 
        FOREIGN KEY (discussion_id) REFERENCES public.discussions(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for discussion_likes.user_id -> auth.users.id (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'discussion_likes_user_id_fkey'
    ) THEN
        ALTER TABLE public.discussion_likes 
        ADD CONSTRAINT discussion_likes_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for discussion_likes.discussion_id -> discussions.id (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'discussion_likes_discussion_id_fkey'
    ) THEN
        ALTER TABLE public.discussion_likes 
        ADD CONSTRAINT discussion_likes_discussion_id_fkey 
        FOREIGN KEY (discussion_id) REFERENCES public.discussions(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for messages.sender_id -> auth.users.id (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'messages_sender_id_fkey'
    ) THEN
        ALTER TABLE public.messages 
        ADD CONSTRAINT messages_sender_id_fkey 
        FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for messages.recipient_id -> auth.users.id (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'messages_recipient_id_fkey'
    ) THEN
        ALTER TABLE public.messages 
        ADD CONSTRAINT messages_recipient_id_fkey 
        FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;