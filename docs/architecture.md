# 시스템 아키텍처 다이어그램

> AI 기반 시간표 관리 시스템 — 전체 구조 및 데이터 흐름

```mermaid
graph TB
    subgraph Client["클라이언트 (Browser)"]
        subgraph FE["Frontend — Next.js 15 (App Router)"]
            direction TB
            Pages["Pages\n/login · /register\n/dashboard · /onboarding\n/share/[token]"]
            Components["Components\nTimetable · AIChat\nClassForm · ExamList\nSettingsModal"]
            Hooks["Hooks\nuseAuth · useSchedules\nuseExams · useProfile"]
            Store["State (Zustand)\nauthStore · uiStore"]
            ApiClient["API Client (Axios)\nlib/api.ts\nBearer Token 자동 주입"]

            Pages --> Components
            Components --> Hooks
            Hooks --> ApiClient
            Store --> Components
        end
    end

    subgraph Backend["Backend — FastAPI (Python)"]
        direction TB
        subgraph Routers["Routers (REST API)"]
            AuthRouter["/auth\nPOST /register\nPOST /login\nGET /oauth/{provider}"]
            ScheduleRouter["/schedules\nCRUD 일정 관리"]
            AIRouter["/ai/chat\nPOST 대화 처리"]
            ExamRouter["/exams\nCRUD 시험 일정"]
            ProfileRouter["/profile\n온보딩 · 프로필"]
            ShareRouter["/share\n시간표 공유 토큰"]
        end

        subgraph Services["Services"]
            AuthService["auth.py\n비밀번호 해싱\nJWT 발급·검증"]
            AIAgent["ai_agent.py\nGemini Function Calling\n일정 도구 실행 루프"]
        end

        subgraph Models["SQLAlchemy Models"]
            UserModel["User\nusername · email\nhashed_password\nsocial_provider · social_id"]
            ScheduleModel["Schedule\ntitle · day_of_week · date\nstart_time · end_time\nlocation · color · priority\nschedule_type · is_completed"]
            ProfileModel["UserProfile\noccupation\nsleep_start · sleep_end\nonboarding_completed"]
            ExamModel["ExamSchedule\ntitle · subject\nexam_date · exam_time · location"]
            ShareModel["ShareToken\ntoken · expires_at"]
        end

        Routers --> Services
        Routers --> Models
        AuthRouter --> AuthService
        AIRouter --> AIAgent
        AIAgent --> Models
    end

    subgraph DB["Database"]
        SQLite[("SQLite\ntimetable.db")]
    end

    subgraph External["외부 서비스"]
        Gemini["Google Gemini API\ngemini-2.5-flash\nFunction Calling"]
        OAuth["OAuth Providers\nGoogle · Naver · Kakao"]
    end

    %% 데이터 흐름
    ApiClient -- "HTTP REST\nJSON" --> Routers
    Models -- "ORM Query" --> SQLite
    AIAgent -- "google-genai SDK" --> Gemini
    AuthRouter -- "OAuth 2.0 Redirect" --> OAuth

    %% 인증 흐름
    AuthService -- "JWT (HS256)\n24h 유효" --> ApiClient

    %% 공유 흐름
    ShareRouter -- "공개 URL\n/share/[token]" --> Pages

    style Client fill:#EFF6FF,stroke:#3B82F6
    style Backend fill:#F0FDF4,stroke:#22C55E
    style DB fill:#FEF9C3,stroke:#EAB308
    style External fill:#FDF4FF,stroke:#A855F7
```

## 구성 요소별 역할

| 레이어 | 기술 | 역할 |
|--------|------|------|
| Frontend | Next.js 15, Zustand, Axios, TailwindCSS | UI 렌더링, 상태 관리, API 통신 |
| Backend | FastAPI, SQLAlchemy, Python-JOSE | REST API, 비즈니스 로직, JWT 인증 |
| Database | SQLite | 사용자·일정·시험·프로필 영속 저장 |
| AI | Google Gemini 2.5 Flash | 자연어 일정 관리 (Function Calling) |
| OAuth | Google / Naver / Kakao | 소셜 로그인 |

## 주요 데이터 흐름

1. **인증**: 로그인 → JWT 발급 → `localStorage` 저장 → 모든 요청 헤더에 `Bearer` 자동 첨부
2. **일정 CRUD**: 프론트엔드 훅 → Axios → `/schedules` 라우터 → SQLAlchemy → SQLite
3. **AI 채팅**: 사용자 메시지 → `/ai/chat` → Gemini Function Calling 루프 → 도구 실행(일정 CRUD) → 자연어 응답 반환
4. **시간표 공유**: 공유 토큰 생성 → `/share/[token]` 공개 URL → 인증 없이 열람 가능
5. **온보딩**: 최초 로그인 → `/onboarding` → 수면 시간·직업 입력 → AI 학습 일정 자동 생성에 활용
