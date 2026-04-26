-- Pending member signups (university + admin approval).
-- Inserts are intended to be done with the service role from /api/signup/request.

create table if not exists public.signup_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  university_name text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists signup_requests_status_idx
  on public.signup_requests (status);
create index if not exists signup_requests_email_idx
  on public.signup_requests (lower(email));
create index if not exists signup_requests_user_id_idx
  on public.signup_requests (user_id);

-- At most one pending request per email (case-insensitive).
create unique index if not exists signup_requests_one_pending_email
  on public.signup_requests (lower(email))
  where status = 'pending';

alter table public.signup_requests enable row level security;

-- Admins (from profiles) can read/update all signup requests.
create policy "signup_requests admin all"
  on public.signup_requests
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- Members can see their own request after user_id is linked.
create policy "signup_requests user select own"
  on public.signup_requests
  for select
  to authenticated
  using (user_id = auth.uid());

-- Optional: ensure profiles has a status column for pending gating (no-op if already present).
alter table public.profiles
  add column if not exists status text default 'active';

update public.profiles
set status = 'active'
where status is null;
