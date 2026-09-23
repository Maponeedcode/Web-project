-- Enable Supabase Cron (pg_cron) in Integrations before running this migration.
-- target_date remains valid through the end of that calendar day in Bangkok.
begin;

alter table public.blood_requests
  drop constraint if exists blood_requests_status_check;

alter table public.blood_requests
  add constraint blood_requests_status_check
  check (status in ('OPEN', 'IN_PROGRESS', 'FULFILLED', 'CANCELLED', 'EXPIRED'));

update public.blood_requests
set status = 'EXPIRED'
where status = 'OPEN'
  and target_date < (now() at time zone 'Asia/Bangkok')::date;

select cron.schedule(
  'expire-open-blood-requests',
  '*/5 * * * *',
  $$
    update public.blood_requests
    set status = 'EXPIRED'
    where status = 'OPEN'
      and target_date < (now() at time zone 'Asia/Bangkok')::date;
  $$
);

commit;
