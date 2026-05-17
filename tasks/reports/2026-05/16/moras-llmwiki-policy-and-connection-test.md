# Moras LLMWiki 정책 및 연결 테스트

**일자:** 2026-05-16  
**범위:** Moras 로컬 LLMWiki, GitHub 추적 정책, SwarmVault 검증, upstream 통합 기준  

## 요약

Moras의 LLMWiki는 제품 지식 저장소이자 NStack 파일럿 검증 근거 저장소로 운영한다.

GitHub private repo에는 사람이 작성한 원천 문서와 설정만 커밋하고, `wiki/`, `raw/`, `state/`는 로컬 생성물로 제외한다.

## 현재 Git 추적 정책

커밋 대상:

- `llmwiki/content/`
- `llmwiki/swarmvault.config.json`
- `llmwiki/swarmvault.schema.md`

제외 대상:

- `llmwiki/wiki/`
- `llmwiki/raw/`
- `llmwiki/state/`

현재 Git에 추적되는 LLMWiki 파일:

- `llmwiki/content/readiness-test.md`
- `llmwiki/content/01-Logs/tasks/2026-05-16-moras-product-definition.md`
- `llmwiki/content/01-Logs/tasks/2026-05-16-moras-project-plan.md`
- `llmwiki/content/01-Logs/tasks/2026-05-16-moras-llmwiki-policy.md`
- `llmwiki/swarmvault.config.json`
- `llmwiki/swarmvault.schema.md`

## 운영 정책 문서

정책 문서:

- `docs/llmwiki-policy.md`

이 문서에는 다음 내용을 정리했다.

- LLMWiki 목적
- GitHub 커밋 대상과 제외 대상
- 작업 후 기록 원칙
- 로컬 검증 절차
- upstream `NSoft-LLMWiki` 통합 정책
- NStack 파일럿 검증 항목

## 검증 기준

LLMWiki 변경 후 다음을 확인한다.

- `swarmvault ingest`가 source id를 반환한다.
- `swarmvault compile`이 성공한다.
- `swarmvault doctor`에서 graph와 retrieval이 OK이다.
- `swarmvault query`에서 작성한 문서가 검색된다.

candidate review warning은 현재 허용한다. 이는 후보 concept/entity 검토가 남아 있다는 의미이며, 연결 실패로 보지 않는다.

## 실제 검증 결과

실행 결과:

| 항목 | 결과 |
|---|---|
| product definition ingest | `moras-moras-product-definition-b8f1fe18` |
| project plan ingest | `moras-moras-project-plan-11a60ff2` |
| readiness test ingest | `moras-nstack-readiness-test-116c04bf` |
| LLMWiki policy ingest | `moras-llmwiki-f5d1cd02` |
| compile | `Compiled 4 source(s), 61 page(s). Changed: 61.` |
| doctor | `Vault health: ok`, graph/retrieval OK |
| query | `Moras LLMWiki 운영 정책` 질의에서 Moras LLMWiki 운영 정책 문서가 1순위로 검색 |

추가로 LLMWiki 운영 정책 자체를 지식화하기 위해 `llmwiki/content/01-Logs/tasks/2026-05-16-moras-llmwiki-policy.md`를 작성했다.

## 파일럿 관찰

처음에 `swarmvault compile`, `swarmvault doctor`, `swarmvault query`를 병렬 실행했을 때 일시적으로 다음 오류가 발생했다.

- `ENOENT: no such file or directory, open '.../wiki/concepts/llmwiki.md'`
- `database is locked`

이후 같은 명령을 순차 실행하자 정상 통과했다.

판정:

- SwarmVault 검증 명령은 같은 vault에서 병렬 실행하지 않는 것이 안전하다.
- NStack 작업 지침에는 LLMWiki 검증을 `ingest -> compile -> doctor -> query` 순서로 실행하도록 명시하는 편이 좋다.
