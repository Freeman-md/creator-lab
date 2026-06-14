alter table public.posts enable row level security;

revoke all on public.posts from anon, authenticated;

grant select, insert, update on public.posts to authenticated;

drop policy if exists "posts_select_own" on public.posts;
create policy "posts_select_own"
on public.posts
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
on public.posts
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
on public.posts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
