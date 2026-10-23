begin;
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
commit;
