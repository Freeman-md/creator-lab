alter table public.account_profiles enable row level security;
alter table public.profile_versions enable row level security;

revoke all on public.account_profiles from anon, authenticated;
revoke all on public.profile_versions from anon, authenticated;

grant select, insert, update on public.account_profiles to authenticated;
grant select, insert on public.profile_versions to authenticated;

drop policy if exists "account_profiles_select_own" on public.account_profiles;
create policy "account_profiles_select_own"
on public.account_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "account_profiles_insert_own" on public.account_profiles;
create policy "account_profiles_insert_own"
on public.account_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "account_profiles_update_own" on public.account_profiles;
create policy "account_profiles_update_own"
on public.account_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profile_versions_select_own" on public.profile_versions;
create policy "profile_versions_select_own"
on public.profile_versions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profile_versions_insert_own" on public.profile_versions;
create policy "profile_versions_insert_own"
on public.profile_versions
for insert
to authenticated
with check (auth.uid() = user_id);

drop function if exists public.prevent_profile_version_updates();

create or replace function public.prevent_profile_version_modification()
returns trigger
language plpgsql
as $$
begin
  raise exception 'profile_versions records are immutable';
end;
$$;

drop trigger if exists prevent_profile_version_updates on public.profile_versions;
drop trigger if exists prevent_profile_version_modification on public.profile_versions;
create trigger prevent_profile_version_modification
before update or delete on public.profile_versions
for each row
execute function public.prevent_profile_version_modification();
