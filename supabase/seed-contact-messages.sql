insert into public.contact_messages (name, email, message, status, created_at)
values
  ('Nia Santos', 'nia@example.com', 'Could I order one in moss green for my sister''s birthday?', 'unread', now() - interval '34 minutes'),
  ('Aria Park', 'aria@example.com', 'I love the daisy bag. Will you have more available soon?', 'unread', now() - interval '3 hours'),
  ('Jamie Liu', 'jamie@example.com', 'Do you have any beginner workshops coming up?', 'read', now() - interval '1 day');
