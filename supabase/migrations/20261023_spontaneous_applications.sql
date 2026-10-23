begin;
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
commit;
