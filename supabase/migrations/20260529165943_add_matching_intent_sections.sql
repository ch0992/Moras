alter table public.participant_submissions
  add column if not exists matching_intent text not null default 'romance'
  check (matching_intent in ('romance', 'friendship'));

alter table public.match_results
  add column if not exists matching_intent text not null default 'romance'
  check (matching_intent in ('romance', 'friendship'));

alter table public.unmatched_participants
  add column if not exists matching_intent text not null default 'romance'
  check (matching_intent in ('romance', 'friendship'));

comment on column public.participant_submissions.matching_intent is
  'Participant matching intent. romance=썸, friendship=친목.';

comment on column public.match_results.matching_intent is
  'Matching result section. romance results support voting; friendship results are for fun only.';

comment on column public.unmatched_participants.matching_intent is
  'Intent group where the participant was left unmatched.';
