-- Create avatars bucket (if not exists)
-- Note: Run this in Supabase Dashboard or use the Dashboard UI to create the bucket
insert into storage.buckets (id, name, public, file_size_limit)
values ('avatars', 'avatars', true, 5242880)
on conflict (id) do nothing;

-- Remove old policies if they exist
drop policy if exists "Avatars are publicly readable" on storage.objects;
drop policy if exists "Avatar users can upload own files" on storage.objects;
drop policy if exists "Avatar users can update own files" on storage.objects;
drop policy if exists "Avatar users can delete own files" on storage.objects;

-- Public read: anyone can read files in the avatars bucket
create policy "Avatars are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'avatars');

-- Authenticated users can upload to their own folder: avatars/<userId>/...
create policy "Avatar users can upload own files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and left(name, length(auth.uid()::text) + 1) = auth.uid()::text || '/'
);

-- Authenticated users can update files in their own folder
create policy "Avatar users can update own files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and left(name, length(auth.uid()::text) + 1) = auth.uid()::text || '/'
);

-- Authenticated users can delete files in their own folder
create policy "Avatar users can delete own files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and left(name, length(auth.uid()::text) + 1) = auth.uid()::text || '/'
);
