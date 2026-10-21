-- Apply in a staging Supabase project first. Never run blindly against production.
-- Admins require server-managed app_metadata.role = 'admin'.
-- An existing admin must be provisioned with that role before rollout.
begin;
create or replace function public.is_eos_admin() returns boolean
language sql stable security invoker set search_path = '' as $$
  select coalesce((select auth.jwt())->'app_metadata'->>'role' = 'admin', false);
$$;
revoke all on function public.is_eos_admin() from public;
grant execute on function public.is_eos_admin() to anon, authenticated;

-- Restrictive guards also constrain any old permissive policies.
do $$ declare t text; begin
  foreach t in array array['projects','team_members','jobs','applications'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists eos_admin_access on public.%I',t);
    execute format('create policy eos_admin_access on public.%I for all to authenticated using (public.is_eos_admin()) with check (public.is_eos_admin())',t);
    execute format('drop policy if exists eos_insert_guard on public.%I',t);
    execute format('create policy eos_insert_guard on public.%I as restrictive for insert to anon, authenticated with check (public.is_eos_admin())',t);
    execute format('drop policy if exists eos_update_guard on public.%I',t);
    execute format('create policy eos_update_guard on public.%I as restrictive for update to anon, authenticated using (public.is_eos_admin()) with check (public.is_eos_admin())',t);
    execute format('drop policy if exists eos_delete_guard on public.%I',t);
    execute format('create policy eos_delete_guard on public.%I as restrictive for delete to anon, authenticated using (public.is_eos_admin())',t);
    execute format('drop policy if exists eos_read_guard on public.%I',t);
    if t = 'applications' then
      execute format('create policy eos_read_guard on public.%I as restrictive for select to anon, authenticated using (public.is_eos_admin())',t);
    else
      execute format('grant select on public.%I to anon', t);
      execute format('drop policy if exists eos_public_read on public.%I',t);
      if t = 'jobs' then
        execute 'create policy eos_public_read on public.jobs for select to anon, authenticated using (is_open = true)';
        execute 'create policy eos_read_guard on public.jobs as restrictive for select to anon, authenticated using (is_open = true or public.is_eos_admin())';
      else
        execute format('create policy eos_public_read on public.%I for select to anon, authenticated using (true)',t);
      end if;
    end if;
  end loop;
end $$;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('website-images','website-images',true,5242880,array['image/jpeg','image/png','image/webp']),
       ('applications-docs','applications-docs',false,3145728,array['application/pdf'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Authenticated upload website-images" on storage.objects;
drop policy if exists "Authenticated update website-images" on storage.objects;
drop policy if exists "Authenticated delete website-images" on storage.objects;
drop policy if exists eos_storage_admin on storage.objects;
create policy eos_storage_admin on storage.objects for all to authenticated
using (bucket_id in ('website-images','applications-docs') and public.is_eos_admin())
with check (bucket_id in ('website-images','applications-docs') and public.is_eos_admin());
drop policy if exists eos_storage_read_guard on storage.objects;
create policy eos_storage_read_guard on storage.objects as restrictive for select to anon,authenticated
using (bucket_id <> 'applications-docs' or public.is_eos_admin());
drop policy if exists eos_storage_insert_guard on storage.objects;
create policy eos_storage_insert_guard on storage.objects as restrictive for insert to anon,authenticated
with check (bucket_id not in ('website-images','applications-docs') or public.is_eos_admin());
drop policy if exists eos_storage_update_guard on storage.objects;
create policy eos_storage_update_guard on storage.objects as restrictive for update to anon,authenticated
using (bucket_id not in ('website-images','applications-docs') or public.is_eos_admin())
with check (bucket_id not in ('website-images','applications-docs') or public.is_eos_admin());
drop policy if exists eos_storage_delete_guard on storage.objects;
create policy eos_storage_delete_guard on storage.objects as restrictive for delete to anon,authenticated
using (bucket_id not in ('website-images','applications-docs') or public.is_eos_admin());

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
commit;
