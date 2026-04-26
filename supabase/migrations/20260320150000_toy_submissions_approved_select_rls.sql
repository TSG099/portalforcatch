-- Catalog lists approved toys from all chapters. Without this, RLS often only allows
-- SELECT where submitted_by = auth.uid(), so approved rows from other users are invisible.

drop policy if exists "Authenticated can read approved toy submissions" on public.toy_submissions;

create policy "Authenticated can read approved toy submissions"
on public.toy_submissions
for select
to authenticated
using (status = 'approved');
