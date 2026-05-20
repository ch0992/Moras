# Moras 에이전트 지침

## graphify

- **graphify** (`~/.Codex/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
- When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.

## NStack 지식 탐색

이 프로젝트는 `/Users/yg/workspace/NStack`을 기준으로 초기화되었고 NStack workflow baseline을 따른다.

Moras는 제품 개발 프로젝트이면서 NStack 검증용 파일럿 애플리케이션이다. 모든 주요 작업은 기능 구현 결과와 함께 NStack 흐름 자체의 유효성도 남겨야 한다.

### 임시 비활성: LLMWiki 연동

현재 Moras의 NStack 한 사이클 테스트에서는 LLMWiki 저장/업스트림/SwarmVault 갱신을 사용하지 않는다.

- 작업 플로우에서 LLMWiki 기록을 필수 단계로 요구하지 않는다.
- `llmwiki-writer`, `nstack-codex-llmwiki`, `swarmvault` workflow는 사용자가 명시적으로 “LLMWiki 다시 연결” 또는 “LLMWiki 기록 실행”을 요청하기 전까지 사용하지 않는다.
- 작업 보고서에는 `LLMWiki: 임시 비활성`으로 기록한다.

### SwarmVault Vault

| Vault | 위치 | 대상 | 용도 |
|---|---|---|---|
| LLMWiki vault | `llmwiki/` | `content/` | Knowledge, docs, task history |
| Project vault | project root | Code files | Code structure and symbol search |

현재 상태:

- 이번 NStack 한 사이클 테스트에서는 SwarmVault/LLMWiki 명령을 실행하지 않는다.
- 아키텍처, 작업 히스토리, 코드 구조 질문도 우선 일반 파일 탐색과 기존 문서로 답한다.
- 사용자가 명시적으로 “SwarmVault 다시 연결”, “LLMWiki 기록 실행”, “swarmvault 실행”을 요청한 경우에만 이 섹션의 vault를 사용한다.

## 코딩 행동 원칙

- **구현 전 사고**: 애매한 부분과 tradeoff를 먼저 정리한다.
- **단순성 우선**: 요청 문제를 해결하는 가장 작은 durable change를 선호한다.
- **외과적 변경**: 작업과 관련된 파일만 수정하고 기존 스타일을 유지한다.
- **목표 기반 실행**: 성공 기준을 정하고 검증한 뒤 보고한다.

## 제품 맥락

Moras는 오픈채팅 커뮤니티 이벤트용 웹 애플리케이션이다.

- 목적: MBTI와 사주 기반 궁합 점수로 남녀 참가자를 매칭한다.
- 톤: 재미있고 상징적이며 이벤트 친화적으로 유지한다. 운명에 대한 결정론적 표현은 피한다.
- 참가자 흐름: 이벤트 접속, 프로필 입력, MBTI 선택, 사주 관련 출생 정보 입력, 동의, 제출.
- 운영자 흐름: 참가자 검토, 점수 계산, 점수 상세 확인, 최종 매칭 확정.
- 제품 브리프: `docs/product/moras-product-brief.md`.
- 프로젝트 계획: `docs/project-plan.md`.

## NStack 파일럿 검증 기준

각 주요 작업은 다음을 남기는 것을 원칙으로 한다.

- 작업 전 지시서
- 구현 결과
- 실행한 검증
- 완료 보고서
- LLMWiki: 임시 비활성 상태 기록
- NStack 흐름에서 발견한 개선점

## Codex 전용 NStack 자산

Antigravity와 Claude가 물리적으로 분리된 자산 구조를 갖는 것처럼, Codex도 Moras 안에서 별도 자산 구조를 가진다.

| 구분 | 위치 | 용도 |
|---|---|---|
| Codex 상시 규칙 | `.codex/rules/` | Codex 전용 NStack rule 원본 |
| Codex 워크플로우 | `.codex/workflows/` | Codex 전용 NStack workflow 원본 |
| Codex 스킬 | `.codex/skills/` | Codex 전용 NStack skill 원본 |
| 런타임 진입점 | `AGENTS.md` | Codex가 우선 읽는 프로젝트 지침 |

규칙:

- `.codex/`는 Codex 전용 NStack 자산의 물리적 원본으로 관리한다.
- `.agents/skills/nsoft`는 현재 NStack 호환 및 기존 스킬 참조를 위해 유지하되, Codex 전용 신규 스킬은 `.codex/skills/`에 작성한다.
- Antigravity 전용 `.antigravity/rules`는 Codex 자산으로 복사하지 않는다.
- Antigravity의 `.agents/rules`와 `.agents/workflows`에 해당하는 핵심 내용은 Codex에서는 `.codex/rules`와 `.codex/workflows`로 분리한다.
- Codex 런타임에서 자동 발견이 확인되지 않은 자산은 `AGENTS.md`에서 명시적으로 참조한다.
- GitHub, Git workflow, ship, retro, handoff, devlog, noffice, scope, qa, investigate, harness도 Codex 전용 스킬 원본을 `.codex/skills/` 아래에 둔다.
