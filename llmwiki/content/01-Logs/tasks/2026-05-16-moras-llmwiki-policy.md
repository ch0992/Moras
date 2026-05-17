# Moras LLMWiki 운영 정책

## 요약

Moras의 LLMWiki는 제품 개발 지식과 NStack 파일럿 검증 근거를 함께 축적하는 지식 저장소이다.

GitHub private repo에는 `llmwiki/content/`, `llmwiki/swarmvault.config.json`, `llmwiki/swarmvault.schema.md`만 커밋하고, `llmwiki/wiki/`, `llmwiki/raw/`, `llmwiki/state/`는 로컬 생성물로 제외한다.

## 원칙

- 사람이 작성한 원천 지식만 GitHub에 남긴다.
- SwarmVault가 생성하는 graph, wiki, retrieval, session 파일은 로컬 상태로 둔다.
- 중요한 작업 후에는 `llmwiki/content/01-Logs/tasks/`에 지식 문서를 남긴다.
- 문서에는 작업 배경, 결정 사항, 검증 결과, 다음 작업 맥락, NStack 파일럿 관점의 발견점을 포함한다.

## 검증 절차

LLMWiki 문서를 작성한 뒤 다음을 실행한다.

1. `swarmvault ingest {문서경로} --no-guide`
2. `swarmvault compile`
3. `swarmvault doctor`
4. `swarmvault query "{확인 질문}"`

## upstream 통합

Moras 로컬 repo는 개인 private repo로 유지한다. 각 프로젝트에서 생성된 작업 지식은 통합 LLMWiki인 upstream `NSoft-LLMWiki`에 모이는 것을 기본값으로 한다.

개인정보, 참가자 데이터, 민감한 운영 정보는 upstream에 올리지 않는다. 이런 내용이 섞인 문서는 정제본을 만들어 통합하고, 정제해도 공유할 수 없으면 완료 보고서에 skip 사유를 남긴다.
