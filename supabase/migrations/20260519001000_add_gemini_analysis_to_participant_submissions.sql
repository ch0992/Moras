alter table public.participant_submissions
  add column if not exists gemini_analysis jsonb not null default '{}'::jsonb;

comment on column public.participant_submissions.gemini_analysis is
  'Gemini-generated event-friendly saju analysis JSON. Generated server-side from calculated manseryeok data.';
