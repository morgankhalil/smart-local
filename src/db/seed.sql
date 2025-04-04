-- Insert categories
insert into public.categories (name, slug, icon_url)
values
  ('Technology', 'technology', '🖥️'),
  ('Design', 'design', '🎨'),
  ('Writing', 'writing', '✍️'),
  ('Business', 'business', '💼'),
  ('Marketing', 'marketing', '📢'),
  ('Education', 'education', '📚'),
  ('Health', 'health', '🏥'),
  ('Lifestyle', 'lifestyle', '🌟'),
  ('Music', 'music', '🎵'),
  ('Other', 'other', '🔍')
on conflict (slug) do nothing;

-- Insert kinds
insert into public.kinds (name, slug)
values
  ('Service', 'service'),
  ('Product', 'product'),
  ('Consultation', 'consultation'),
  ('Mentorship', 'mentorship'),
  ('Workshop', 'workshop'),
  ('Course', 'course'),
  ('Event', 'event'),
  ('Other', 'other')
on conflict (slug) do nothing;

-- Insert types
insert into public.types (name, slug)
values
  ('One-time', 'one-time'),
  ('Recurring', 'recurring'),
  ('Project-based', 'project-based'),
  ('Subscription', 'subscription'),
  ('Hourly', 'hourly'),
  ('Daily', 'daily'),
  ('Weekly', 'weekly'),
  ('Monthly', 'monthly'),
  ('Other', 'other')
on conflict (slug) do nothing; 