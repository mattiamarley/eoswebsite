-- Additive migration: existing projects keep their images and descriptions.
begin;
alter table public.projects add column if not exists tags text[] not null default '{}';
alter table public.projects drop constraint if exists projects_tags_allowed;
alter table public.projects add constraint projects_tags_allowed check (
  cardinality(tags) <= 10 and array_position(tags, null) is null and
  tags <@ array['Architettura','Strutture','Impianti','Ambiente','Sicurezza','Antincendio','Project management','Valutazioni immobiliari','Geologia e rilievi','Acustica']::text[]
);
commit;
-- Existing RLS permissions remain unchanged; only authorized admins can write.
