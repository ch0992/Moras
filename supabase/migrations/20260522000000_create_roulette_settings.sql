create table if not exists public.roulette_settings (
  id text primary key default 'default',
  event_name text not null default 'Moras 룰렛 이벤트',
  starts_at timestamptz null,
  updated_at timestamptz not null default now()
);

alter table public.roulette_settings enable row level security;
grant all on table public.roulette_settings to service_role;

insert into public.roulette_settings (id, event_name)
values ('default', 'Moras 룰렛 이벤트')
on conflict (id) do nothing;
