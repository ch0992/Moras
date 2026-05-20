# NStack Codex 적합성 점검

작성일: 2026-05-18  
대상 프로젝트: Moras  
기준 문서: `docs/nstack-codex-porting-analysis.md`

## 1. 점검 목적

NStack의 Antigravity 기반 `skill`, `workflow`, `rule` 자산이 Codex 환경에서 실제로 작동 가능한 방식인지 확인한다.

## 2. Codex 기준

Codex 스킬 규격은 다음을 핵심 조건으로 본다.

현재 한 사이클 테스트에서는 LLMWiki/SwarmVault 연동을 임시 비활성으로 둔다. 따라서 `nstack-codex-llmwiki`, `llmwiki-writer`, `swarmvault` workflow는 사용자가 재연결을 명시하기 전까지 실행 대상이 아니다.

| 항목 | Codex 기준 | Moras 상태 |
|---|---|---|
| 프로젝트 상시 지침 | `AGENTS.md` | 존재함 |
| 스킬 메타데이터 | 각 `SKILL.md`에 YAML frontmatter 필요 | NStack 스킬 대부분 충족 |
| 필수 frontmatter | `name`, `description` | 확인된 NStack 스킬 15개 모두 충족 |
| 스킬 로딩 방식 | description과 사용자 요청이 맞을 때 body 로딩 | 가능 |
| references/scripts/assets | 필요 시 skill 폴더 하위에 배치 | 현재 핵심 스킬은 instruction-only 중심 |
| workflow 자동 호출 | Antigravity식 `.agents/workflows` 자동 호출은 Codex 기본 모델 아님 | `.codex/workflows`로 물리 분리 후 `AGENTS.md`에서 참조 |
| rule 자동 호출 | Antigravity식 `.agents/rules` 자동 호출은 Codex 기본 모델 아님 | `.codex/rules`로 물리 분리 후 `AGENTS.md`에서 참조 |

## 3. Moras 현재 설치 상태

### 3.1 `AGENTS.md`

파일:

`/Users/yg/workspace/Moras/AGENTS.md`

상태:

- Codex가 프로젝트 지침으로 읽을 수 있는 위치에 있다.
- NStack 지식 탐색, SwarmVault, 코딩 행동 원칙, Moras 제품 맥락, NStack 파일럿 검증 기준이 이미 포함되어 있다.

판정:

`적합`

단, Codex 런타임이 `.codex/skills`를 자동 발견하는지는 별도 검증이 필요하다. 따라서 `.codex/`는 Codex 전용 원본 자산으로 관리하고, 런타임 진입점인 `AGENTS.md`에서 명시적으로 참조한다.

### 3.2 NStack 스킬

경로:

`/Users/yg/workspace/Moras/.agents/skills/nsoft -> /Users/yg/workspace/NStack/.agents/skills/nsoft`

확인된 스킬:

| 스킬 | Codex frontmatter | Codex 적합성 |
|---|---|---|
| `devlog-writer` | `name`, `description` 있음 | 적합 |
| `github-issue-creator` | `name`, `description` 있음 | 적합 |
| `github-issue-handler` | `name`, `description` 있음 | 적합 |
| `harness` | `name`, `description` 있음 | 조건부 적합 |
| `investigate` | `name`, `description` 있음 | 적합 |
| `llmwiki-writer` | `name`, `description` 있음 | 적합 |
| `next-session-writer` | `name`, `description` 있음 | 적합 |
| `noffice-writer` | `name`, `description` 있음 | 적합 |
| `qa` | `name`, `description` 있음 | 적합 |
| `retro` | `name`, `description` 있음 | 적합 |
| `scope` | `name`, `description` 있음 | 적합 |
| `ship` | `name`, `description` 있음 | 적합 |
| `task-auto` | `name`, `description` 있음 | 조건부 적합 |
| `task` | `name`, `description` 있음 | 조건부 적합 |
| `workflow` | `name`, `description` 있음 | 조건부 적합 |

판정:

`대체로 적합`

조건부 항목:

- `task`: Codex의 기본 동작은 사용자가 요청하면 구현까지 진행하는 것이다. NStack `task`는 승인형 절차가 강하므로 “주요 작업”에만 적용하도록 조정이 필요하다.
- `task-auto`: 명시적으로 자동 실행을 요청할 때만 사용해야 한다.
- `harness`: Codex에서는 사용자가 명시적으로 하위 에이전트/병렬 에이전트 작업을 요청할 때만 사용해야 한다.
- `workflow`: Codex 앱의 기본 브랜치 prefix 정책과 NStack의 `feat/`, `fix/` 규칙을 조정해야 한다.

### 3.3 Codex rules/workflows

Moras 현재 상태:

- `/Users/yg/workspace/Moras/.codex/rules/` 생성 대상
- `/Users/yg/workspace/Moras/.codex/workflows/` 생성 대상
- `/Users/yg/workspace/Moras/.codex/skills/` 생성 대상

판정:

`Codex 전용 물리 분리 필요`

이유:

- Codex에서 확실하게 상시 반영되는 프로젝트 지침은 `AGENTS.md`다.
- Antigravity의 `.agents/rules`와 `.agents/workflows`는 Codex가 같은 방식으로 자동 실행한다고 가정하면 안 된다.
- 그러나 Antigravity와 Claude가 물리적으로 분리된 것처럼 Codex도 `.codex/` 아래에 원본 자산을 분리해야 한다.
- 따라서 중요한 rule은 `.codex/rules`에 두고 `AGENTS.md`에서 참조하며, 호출형 workflow는 `.codex/workflows` 또는 `.codex/skills`로 옮긴다.

## 4. 결론

현재 분석 방향은 Codex에 맞다.

다만 “그대로 이식”이 아니라 다음 전환 원칙이 필요하다.

| NStack/Antigravity 자산 | Codex 전환 방식 |
|---|---|
| `.antigravity/rules` | 직접 복사 금지. 핵심 원칙만 `AGENTS.md`로 재작성 |
| `.agents/rules/*.md` | `.codex/rules/*.md`로 Codex 전용 원본을 만들고 `AGENTS.md`에서 참조 |
| `.agents/workflows/*.md` | `.codex/workflows/*.md` 또는 `.codex/skills/*/SKILL.md`로 변환 |
| `.agents/skills/nsoft/*/SKILL.md` | 기존 호환으로 유지하되 Codex 신규/수정 스킬은 `.codex/skills`에 작성 |
| `.codex/hooks.json` | 선택 사항. SwarmVault 안내처럼 read-only 힌트만 제한적으로 사용 |

## 5. 다음 작업 제안

1. `AGENTS.md`에 “Codex용 NStack 실행 원칙” 섹션 추가
2. `.codex/rules`, `.codex/workflows`, `.codex/skills` 생성
3. `.agents/skills/nsoft` symlink는 기존 NStack 호환용으로 유지
4. Codex 전용 핵심 스킬 세트 추가
   - `nstack-codex-task`
   - `nstack-codex-llmwiki` — 임시 비활성 placeholder
   - `nstack-codex-github`
   - `nstack-codex-workflow`
   - `nstack-codex-ship`
   - `nstack-codex-retro`
   - `nstack-codex-handoff`
   - `nstack-codex-devlog`
   - `nstack-codex-noffice`
   - `nstack-codex-scope`
   - `nstack-codex-qa`
   - `nstack-codex-investigate`
   - `nstack-codex-harness`
5. 기존 NStack 스킬 중 조건부 적합 항목을 Codex 정책에 맞게 보완
   - `task`
   - `task-auto`
   - `harness`
   - `workflow`
6. Moras의 첫 실제 개발 태스크로 dry run 검증

## 6. 현재 판정

`부분 적합 / 보완 후 실사용 가능`

Codex가 이미 NStack 스킬을 인식할 수 있는 구조는 갖춰져 있다. 하지만 Antigravity의 rule/workflow 모델은 Codex와 다르므로, Moras에서는 `.codex/`에 Codex 전용 원본 자산을 물리적으로 분리하고 `AGENTS.md`를 런타임 진입점으로 삼아야 한다.
