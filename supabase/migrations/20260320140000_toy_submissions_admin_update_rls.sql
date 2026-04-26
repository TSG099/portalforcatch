-- Allow users with profiles.role = 'admin' to update toy_submissions (status, feedback, reviewed_at).
-- Needed when the app uses the anon key + JWT in API routes instead of the service role.

drop policy if exists "Admins can update toy submissions" on public.toy_submissions;

create policy "Admins can update toy submissions"
on public.toy_submissions
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
