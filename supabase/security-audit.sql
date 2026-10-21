-- Read-only: run in the SQL editor of the configured EOS project.
-- No applicant records, secrets or documents are selected.
select schemaname, tablename, rowsecurity
from pg_tables where schemaname='public'
and tablename in ('projects','team_members','jobs','applications','application_rate_limits');

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies where (schemaname='public' and tablename in ('projects','team_members','jobs','applications','application_rate_limits'))
or (schemaname='storage' and tablename='objects');

select table_name, grantee, privilege_type from information_schema.role_table_grants
where table_schema='public' and grantee in ('anon','authenticated')
and table_name in ('projects','team_members','jobs','applications','application_rate_limits');

select id, public, file_size_limit, allowed_mime_types from storage.buckets
where id in ('website-images','applications-docs');
