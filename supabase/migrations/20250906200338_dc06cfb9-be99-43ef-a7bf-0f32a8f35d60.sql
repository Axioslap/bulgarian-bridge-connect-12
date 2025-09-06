-- Ensure RLS is ON
alter table public.messages enable row level security;
alter table public.message_receipts enable row level security;

-- A) Messages: allow users to insert messages they author
drop policy if exists "Users can send messages" on public.messages;
drop policy if exists msg_insert_author on public.messages;
create policy msg_insert_participant
on public.messages
for insert
with check (
  auth.uid() = sender_id
);

-- Allow users to read messages they sent or received
drop policy if exists "Users can view their messages" on public.messages;
drop policy if exists msg_select_visible on public.messages;
create policy msg_select_visible
on public.messages
for select
using (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);

-- B) Receipts: author can insert both receipts; users can insert their own
drop policy if exists "Users can insert their own receipts" on public.message_receipts;
drop policy if exists mr_upsert_self_or_author on public.message_receipts;
create policy mr_insert_by_author_or_self
on public.message_receipts
for insert
with check (
  auth.uid() = user_id
  or auth.uid() = (select sender_id from public.messages m where m.id = message_id)
);

-- Users can update only their own receipt (for per-user delete/read)
drop policy if exists "Users can update their own receipts" on public.message_receipts;
drop policy if exists mr_update_self on public.message_receipts;
create policy mr_update_self
on public.message_receipts
for update
using (auth.uid() = user_id);

-- Users can see only their own receipt rows
drop policy if exists "Users can view their own receipts" on public.message_receipts;
drop policy if exists mr_select_self on public.message_receipts;
create policy mr_select_self
on public.message_receipts
for select
using (auth.uid() = user_id);