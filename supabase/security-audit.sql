-- Sola lettura: eseguire nel SQL Editor del progetto EOS.
-- Nessuna candidatura, documento, chiave o valore dei contenuti viene selezionato.
-- Rivedere TUTTE le tabelle pubbliche: nuovi oggetti potrebbero esporre dati.
select n.nspname as schema_name, c.relname as object_name, c.relkind,
       c.relrowsecurity as rls_enabled, c.relforcerowsecurity as rls_forced, c.reloptions as options
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind in ('r','p','v','m')
order by c.relname;

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname='public' or (schemaname='storage' and tablename='objects')
order by schemaname,tablename,policyname;

-- Privilegi effettivi (inclusi quelli ereditati da PUBLIC), non solo grant espliciti.
select r.rolname as role_name, c.relname as table_name,
       has_table_privilege(r.oid,c.oid,'SELECT') as can_select,
       has_any_column_privilege(r.oid,c.oid,'SELECT') as can_select_any_column,
       has_table_privilege(r.oid,c.oid,'INSERT') as can_insert,
       has_table_privilege(r.oid,c.oid,'UPDATE') as can_update,
       has_table_privilege(r.oid,c.oid,'DELETE') as can_delete,
       has_table_privilege(r.oid,c.oid,'TRUNCATE') as can_truncate
from pg_class c join pg_namespace n on n.oid=c.relnamespace
cross join pg_roles r
where n.nspname='public' and c.relkind in ('r','p','v','m')
  and r.rolname in ('anon','authenticated','service_role')
order by c.relname,r.rolname;

select table_name, column_name, grantee, privilege_type
from information_schema.column_privileges
where table_schema='public' and grantee in ('PUBLIC','anon','authenticated')
order by table_name,column_name,grantee;

-- Rivedere in particolare le funzioni SECURITY DEFINER e i permessi RPC.
select p.proname, pg_get_function_identity_arguments(p.oid) as arguments,
       p.prosecdef as security_definer, p.proconfig as settings,
       pg_get_userbyid(p.proowner) as owner,
       has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
       has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_execute,
       has_function_privilege('service_role',p.oid,'EXECUTE') as service_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' order by p.proname;

select rolname, rolsuper, rolbypassrls, rolcanlogin from pg_roles
where rolname in ('anon','authenticated','service_role');

select id, public, file_size_limit, allowed_mime_types from storage.buckets
where id in ('website-images','applications-docs');

select event_object_table, trigger_name, event_manipulation, action_timing
from information_schema.triggers
where event_object_schema='public' and event_object_table='applications';
