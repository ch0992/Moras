create table if not exists public.event_participants (
  id uuid primary key default gen_random_uuid(),
  display_name text not null unique,
  gender text not null check (gender in ('남', '여')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.event_participants enable row level security;

grant all on table public.event_participants to service_role;

comment on table public.event_participants is
  'Moras event master participant roster. Public clients must access it only through server-side API routes.';

alter table public.participant_submissions
  add column if not exists roster_participant_id uuid null references public.event_participants(id),
  add column if not exists gender text null check (gender is null or gender in ('남', '여')),
  add column if not exists marital_status text null check (marital_status is null or marital_status in ('미혼', '기혼', '돌싱'));

create unique index if not exists participant_submissions_roster_participant_id_uidx
  on public.participant_submissions (roster_participant_id)
  where roster_participant_id is not null;

insert into public.event_participants (display_name, gender)
values
  ('졸디', '남'),
  ('지나', '여'),
  ('차니', '남'),
  ('차키', '여'),
  ('카이', '여'),
  ('태이', '남'),
  ('하늘', '남'),
  ('하린', '여'),
  ('하윤', '여'),
  ('하이', '여'),
  ('호세', '남'),
  ('흥국', '남'),
  ('호빵', '남'),
  ('행복', '남'),
  ('소리', '여'),
  ('수혁', '남'),
  ('콜라', '남'),
  ('벤지', '남'),
  ('나나', '여'),
  ('나무', '남'),
  ('빛나', '여'),
  ('구마', '남'),
  ('그루', '여'),
  ('나옹', '여'),
  ('돌리', '남'),
  ('딸기', '여'),
  ('라드', '남'),
  ('라라', '남'),
  ('라미', '남'),
  ('라온', '남'),
  ('라이', '남'),
  ('라임', '여'),
  ('모몽', '여'),
  ('미소', '여'),
  ('밀라', '여'),
  ('블랙', '남'),
  ('비비', '여'),
  ('셔니', '남'),
  ('시경', '남'),
  ('아카', '남'),
  ('야옹', '남'),
  ('여름', '여'),
  ('연하', '남'),
  ('이은', '여'),
  ('재이', '남'),
  ('제프', '남')
on conflict (display_name) do update
set gender = excluded.gender,
    is_active = true,
    updated_at = now();
