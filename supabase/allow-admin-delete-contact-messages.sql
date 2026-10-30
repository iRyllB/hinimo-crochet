drop policy if exists "Authenticated users can delete contact messages"
  on public.contact_messages;

create policy "Authenticated users can delete contact messages"
  on public.contact_messages
  for delete
  to authenticated
  using (true);
