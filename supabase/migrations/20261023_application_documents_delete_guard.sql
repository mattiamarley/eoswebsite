-- Security-only follow-up for projects that already applied the intake migration.
-- No records or files are deleted. Re-running is safe.
begin;
-- Constrain legacy permissive DELETE policies without changing other buckets.
drop policy if exists application_documents_delete_guard on storage.objects;
create policy application_documents_delete_guard on storage.objects as restrictive for delete to anon,authenticated
using (bucket_id <> 'applications-docs' or coalesce((select auth.jwt())->'app_metadata'->>'role','') = 'admin');
commit;
