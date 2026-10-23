begin;
alter table public.team_members add column if not exists sort_order integer;
with ranked as (select id, row_number() over (order by created_at desc, id) - 1 as position from public.team_members)
update public.team_members t set sort_order = ranked.position from ranked where t.id = ranked.id and t.sort_order is null;
create or replace function public.reorder_team(member_ids uuid[]) returns void
language plpgsql security invoker set search_path = '' as $$
begin
  if coalesce((select auth.jwt())->'app_metadata'->>'role', '') <> 'admin' then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  lock table public.team_members in share row exclusive mode;
  if member_ids is null or cardinality(member_ids) <> (select count(*) from public.team_members)
     or cardinality(member_ids) <> (select count(distinct id) from unnest(member_ids) as ids(id))
     or exists (select 1 from unnest(member_ids) as ids(id) where not exists (select 1 from public.team_members t where t.id = ids.id)) then
    raise exception 'Team changed. Reload before saving.';
  end if;
  update public.team_members t set sort_order = ordered.position - 1
  from unnest(member_ids) with ordinality as ordered(id, position) where t.id = ordered.id;
end;
$$;
revoke all on function public.reorder_team(uuid[]) from public;
grant execute on function public.reorder_team(uuid[]) to authenticated;
commit;
