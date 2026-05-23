alter table match_results
add column if not exists score_detail jsonb;

comment on column match_results.score_detail is
'Moras simple matching score detail: MBTI score, saju score, deviation correction, final score, relation type, and explanation.';
