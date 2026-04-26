-- Public catalog: allow anyone (including anon) to SELECT approved toys.
-- Replaces the authenticated-only policy so logged-out visitors can browse /catalog.

drop policy if exists "Authenticated can read approved toy submissions" on public.toy_submissions;
drop policy if exists "Anon can read approved toy submissions" on public.toy_submissions;
drop policy if exists "Approved catalog toys are readable" on public.toy_submissions;

-- No TO clause: applies to all roles (anon + authenticated + …) in Postgres RLS.
create policy "Approved catalog toys are readable"
on public.toy_submissions
for select
using (status = 'approved');
