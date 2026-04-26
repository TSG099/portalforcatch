-- Chapter picker + profile.chapter_id updates (anon must NOT be used for this; authenticated only).

alter table if exists public.chapters enable row level security;

drop policy if exists "chapters_select_authenticated" on public.chapters;
create policy "chapters_select_authenticated"
  on public.chapters
  for select
  to authenticated
  using (true);

-- If `profiles` already has RLS enabled, allow members to set `chapter_id` on their row.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
