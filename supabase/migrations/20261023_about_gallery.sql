begin;
create table if not exists public.site_galleries (
  key text primary key check (key = 'about'),
  slides jsonb default null,
  revision integer not null default 0 check (revision >= 0),
  constraint site_galleries_slides check (
    slides is null or (
      jsonb_typeof(slides) = 'array'
      and jsonb_array_length(slides) <= 8
    )
  )
);
-- NULL preserves the existing automatic carousel until an administrator saves.
insert into public.site_galleries(key) values ('about') on conflict (key) do nothing;
alter table public.site_galleries enable row level security;
revoke all on public.site_galleries from anon, authenticated;
grant select on public.site_galleries to anon, authenticated;
grant update on public.site_galleries to authenticated;
drop policy if exists gallery_public_read on public.site_galleries;
create policy gallery_public_read on public.site_galleries for select to anon, authenticated using (true);
drop policy if exists gallery_admin_update on public.site_galleries;
create policy gallery_admin_update on public.site_galleries for update to authenticated
using (coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin')
with check (coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
drop policy if exists gallery_admin_guard on public.site_galleries;
create policy gallery_admin_guard on public.site_galleries as restrictive for update to authenticated
using (coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin')
with check (coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
-- Files use the existing public website-images bucket, under about/.
-- Admin-only upload policy also supports projects that have not run policies.sql.
drop policy if exists gallery_image_upload on storage.objects;
create policy gallery_image_upload on storage.objects for insert to authenticated
with check (bucket_id = 'website-images' and (storage.foldername(name))[1] = 'about'
  and coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
drop policy if exists gallery_image_delete on storage.objects;
create policy gallery_image_delete on storage.objects for delete to authenticated
using (bucket_id = 'website-images' and (storage.foldername(name))[1] = 'about'
  and coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
drop policy if exists gallery_image_read on storage.objects;
create policy gallery_image_read on storage.objects for select to authenticated
using (bucket_id = 'website-images' and (storage.foldername(name))[1] = 'about'
  and coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
-- These guards also constrain pre-existing permissive policies for about/ files.
drop policy if exists gallery_upload_guard on storage.objects;
create policy gallery_upload_guard on storage.objects as restrictive for insert to anon, authenticated
with check (bucket_id <> 'website-images' or coalesce((storage.foldername(name))[1],'') <> 'about'
  or coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
drop policy if exists gallery_update_guard on storage.objects;
create policy gallery_update_guard on storage.objects as restrictive for update to anon, authenticated
using (bucket_id <> 'website-images' or coalesce((storage.foldername(name))[1],'') <> 'about'
  or coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin')
with check (bucket_id <> 'website-images' or coalesce((storage.foldername(name))[1],'') <> 'about'
  or coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
drop policy if exists gallery_delete_guard on storage.objects;
create policy gallery_delete_guard on storage.objects as restrictive for delete to anon, authenticated
using (bucket_id <> 'website-images' or coalesce((storage.foldername(name))[1],'') <> 'about'
  or coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
commit;
