-- Apply after 20261001_project_tags.sql. Existing projects are unchanged.
alter table public.projects add column if not exists is_featured boolean not null default false;
