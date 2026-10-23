-- Candidature e CV, RAL, spontanee e carosello About.
-- Eseguire tutto in Supabase SQL Editor; conserva i record esistenti.
begin;
-- 20261023_applications_intake.sql

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete set null,
  applicant_name text not null,
  email text not null,
  phone text,
  documents text[] not null default '{}',
  status text not null default 'nuova',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.applications add column if not exists first_name text;
alter table public.applications add column if not exists last_name text;
alter table public.applications add column if not exists message text;
alter table public.applications add column if not exists job_title text;
alter table public.applications add column if not exists privacy_accepted_at timestamptz;
alter table public.applications add column if not exists privacy_version text;
update public.applications a set job_title = j.title from public.jobs j where a.job_id = j.id and a.job_title is null;
-- Enforce the job association even if a position closes while a CV uploads.
create or replace function public.capture_application_job() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  select title into new.job_title from public.jobs where id = new.job_id and is_open = true for share;
  if not found then raise exception 'Position no longer open'; end if;
  return new;
end;
$$;
drop trigger if exists capture_application_job on public.applications;
create trigger capture_application_job before insert on public.applications for each row execute function public.capture_application_job();
create index if not exists applications_job_date on public.applications(job_id,created_at desc);
create index if not exists applications_status_date on public.applications(status,created_at desc);
alter table public.applications enable row level security;
revoke all on public.applications from anon,authenticated;
grant select,update on public.applications to authenticated;
grant all on public.applications to service_role;
drop policy if exists application_admin_read on public.applications;
create policy application_admin_read on public.applications for select to authenticated using (coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
drop policy if exists application_admin_update on public.applications;
create policy application_admin_update on public.applications for update to authenticated using (coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin') with check (coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
drop policy if exists application_admin_guard on public.applications;
create policy application_admin_guard on public.applications as restrictive for all to anon,authenticated using (coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin') with check (coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('applications-docs','applications-docs',false,3145728,array['application/pdf'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists application_documents_read on storage.objects;
create policy application_documents_read on storage.objects for select to authenticated using (bucket_id = 'applications-docs' and coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
drop policy if exists application_documents_read_guard on storage.objects;
create policy application_documents_read_guard on storage.objects as restrictive for select to anon,authenticated using (bucket_id <> 'applications-docs' or coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
drop policy if exists application_documents_write_guard on storage.objects;
create policy application_documents_write_guard on storage.objects as restrictive for insert to anon,authenticated with check (bucket_id <> 'applications-docs');
drop policy if exists application_documents_update_guard on storage.objects;
create policy application_documents_update_guard on storage.objects as restrictive for update to anon,authenticated using (bucket_id <> 'applications-docs') with check (bucket_id <> 'applications-docs');
-- Throttle public intake without granting public writes to applications or storage.
create table if not exists public.application_rate_limits (key text primary key, started_at timestamptz not null, attempts integer not null);
alter table public.application_rate_limits enable row level security;
revoke all on public.application_rate_limits from anon,authenticated;
create or replace function public.allow_application_submission(email_hash text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare used integer; global_used integer;
begin
  delete from public.application_rate_limits where started_at < now() - interval '1 day';
  insert into public.application_rate_limits as limits values ('global',now(),1)
  on conflict (key) do update set attempts = case when limits.started_at < now()-interval '1 hour' then 1 else limits.attempts+1 end,
    started_at = case when limits.started_at < now()-interval '1 hour' then now() else limits.started_at end returning attempts into global_used;
  if global_used > 50 then return false; end if;
  insert into public.application_rate_limits as limits values (email_hash,now(),1)
  on conflict (key) do update set attempts=limits.attempts+1 returning attempts into used;
  return used <= 3;
end $$;
revoke all on function public.allow_application_submission(text) from public,anon,authenticated;
grant execute on function public.allow_application_submission(text) to service_role;

-- 20261023_job_compensation.sql

alter table public.jobs
  add column if not exists seniority text,
  add column if not exists salary_min integer,
  add column if not exists salary_max integer;
alter table public.jobs drop constraint if exists jobs_seniority_allowed;
alter table public.jobs add constraint jobs_seniority_allowed
  check (seniority is null or seniority in ('Stage','Junior','Middle','Senior','Lead'));
alter table public.jobs drop constraint if exists jobs_salary_range;
alter table public.jobs add constraint jobs_salary_range check (
  (salary_min is null and salary_max is null)
  or (salary_min is not null and salary_min between 1 and 5000000
    and (salary_max is null or (salary_max between salary_min and 5000000)))
);
comment on column public.jobs.salary_min is 'Annual gross salary in EUR; fixed amount when salary_max is null.';
comment on column public.jobs.salary_max is 'Optional upper bound of annual gross salary in EUR.';

-- 20261023_spontaneous_applications.sql

alter table public.applications add column if not exists application_type text not null default 'position';
alter table public.applications alter column job_id drop not null;
alter table public.applications drop constraint if exists applications_type_allowed;
alter table public.applications add constraint applications_type_allowed check (application_type in ('position','spontaneous'));
alter table public.applications drop constraint if exists spontaneous_without_job;
alter table public.applications add constraint spontaneous_without_job check (application_type <> 'spontaneous' or job_id is null);
create or replace function public.capture_application_job() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if new.application_type = 'spontaneous' then
    if new.job_id is not null then raise exception 'Spontaneous application cannot have a job'; end if;
    new.job_title := 'Candidatura spontanea';
    return new;
  end if;
  select title into new.job_title from public.jobs where id = new.job_id and is_open = true for share;
  if not found then raise exception 'Position no longer open'; end if;
  return new;
end;
$$;
-- Recreate the trigger as well for projects that applied the old intake separately.
drop trigger if exists capture_application_job on public.applications;
create trigger capture_application_job before insert on public.applications for each row execute function public.capture_application_job();

-- 20261023_about_gallery.sql

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
