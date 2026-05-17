# Moras

> MBTI + 사주 기반 이벤트 매칭 웹 애플리케이션

Moras는 오픈채팅 이벤트 참가자가 MBTI와 사주 관련 출생 정보를 입력하면, 궁합 점수를 계산해 가장 잘 맞는 남녀 매칭 후보를 추천하는 웹 애플리케이션이다.

이름에는 다음 의미를 담았다.

| 요소 | 의미 |
|---|---|
| M | MBTI, Mind, Match |
| Oracle | 사람의 성향과 관계 흐름을 해석하는 상징 |
| S | Saju, Sync, Soul |

Moras는 `/Users/yg/workspace/NStack`의 NStack 프레임워크를 기준으로 초기화되어 있다.

- 제품 브리프: [docs/product/moras-product-brief.md](/Users/yg/workspace/Moras/docs/product/moras-product-brief.md)
- 프로젝트 계획: [docs/project-plan.md](/Users/yg/workspace/Moras/docs/project-plan.md)

## 프로젝트 구조

```text
Moras/
├── AGENTS.md
├── .antigravity/
│   └── rules
├── .agents/skills/nsoft -> /Users/yg/workspace/NStack/.agents/skills/nsoft
├── docs/
│   ├── product/
│   └── project-plan.md
├── llmwiki/
│   ├── content/
│   ├── raw/
│   ├── state/
│   ├── wiki/
│   └── swarmvault.schema.md
└── tasks/
    ├── orders/
    ├── reports/
    └── next-session/
```

## NStack 스킬

NStack 스킬은 `.agents/skills/nsoft/`에 연결되어 있다.

주요 흐름:

| 스킬 | 용도 |
|---|---|
| `/task` | 지시서 작성, 승인 대기, 구현, 검증 |
| `/task-auto` | 승인 게이트 없이 자동 작업 진행 |
| `/investigate` | 버그와 원인 분석 |
| `/ship` | 배포 전 품질 게이트 |
| `/llmwiki-writer` | 완료 지식을 LLMWiki에 기록 |
| `/next-session-writer` | 다음 세션 인계 작성 |

## LLMWiki

`llmwiki/`는 로컬에서 준비되어 있으며, upstream `NSoft-LLMWiki` 통합 흐름도 테스트 완료했다.
