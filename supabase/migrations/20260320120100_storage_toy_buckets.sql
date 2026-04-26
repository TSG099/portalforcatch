insert into storage.buckets (id, name, public)
values
  ('toy-images', 'toy-images', true),
  ('toy-videos', 'toy-videos', true),
  ('toy-files', 'toy-files', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Authenticated upload toy-images" on storage.objects;
drop policy if exists "Public read toy-images" on storage.objects;
drop policy if exists "Authenticated upload toy-videos" on storage.objects;
drop policy if exists "Public read toy-videos" on storage.objects;
drop policy if exists "Authenticated upload toy-files" on storage.objects;
drop policy if exists "Public read toy-files" on storage.objects;

create policy "Authenticated upload toy-images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'toy-images'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "Public read toy-images"
on storage.objects for select to public
using (bucket_id = 'toy-images');

create policy "Authenticated upload toy-videos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'toy-videos'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "Public read toy-videos"
on storage.objects for select to public
using (bucket_id = 'toy-videos');

create policy "Authenticated upload toy-files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'toy-files'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "Public read toy-files"
on storage.objects for select to public
using (bucket_id = 'toy-files');
