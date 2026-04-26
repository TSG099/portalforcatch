alter table public.toy_submissions
add column if not exists file_url text;

comment on column public.toy_submissions.file_url is 'Optional PDF or attachment URL (toy-files bucket)';
