# SKEMA — AI 기반 스마트 시간표 관리

> **Scheme**에서 따온 이름, **SKEMA**. 당신의 시간을 설계합니다.

AI 어시스턴트와 함께 강의 일정을 자연어로 관리하는 풀스택 웹 애플리케이션입니다.

---

## 주요 기능

- **강의 CRUD** — 강의명, 요일, 시간, 장소, 색상, 우선순위 등록/수정/삭제
- **주간 시간표 뷰** — 동적 시간 범위, 충돌 감지, 현재 시간 표시
- **시험 일정 관리** — 시험 날짜·과목 등록 및 목록 조회
- **JWT 인증** — 회원가입/로그인, 토큰 기반 보호 API
- **시간표 공유** — 고유 링크로 비로그인 열람
- **AI 어시스턴트** — 자연어로 강의 추가/삭제/조회/빈 시간 탐색

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui |
| 상태 관리 | Zustand (persist), TanStack React Query v5 |
| 백엔드 | FastAPI, Python 3.11+, SQLAlchemy ORM |
| 데이터베이스 | SQLite (개발환경) |
| 인증 | JWT (python-jose, passlib) |
| AI | Google Gemini API (claude-sonnet-4-6 tool use 방식) |
| 디자인 시스템 | CSS 커스텀 속성 (`--skema-*` 토큰), Manrope + Inter 폰트, Material Symbols |

---

## 빠른 시작

### 백엔드

```bash
cd backend
cp .env.example .env
# .env 파일에 GEMINI_API_KEY 설정

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Swagger 문서: http://localhost:8000/docs

### 프론트엔드 (Next.js)

```bash
cd frontend-next
npm install
npm run dev
```

앱: http://localhost:3000

---

## 프로젝트 구조

```
timetable/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI 앱 진입점
│   │   ├── database.py        # SQLAlchemy 설정
│   │   ├── core/config.py     # 환경변수
│   │   ├── models/            # DB 모델 (User, Schedule, Exam, ShareToken)
│   │   ├── schemas/           # Pydantic 스키마
│   │   ├── routers/           # API 라우터 (auth, schedules, exams, share, ai)
│   │   └── services/          # 비즈니스 로직 (auth, ai_agent)
│   ├── requirements.txt
│   └── .env.example
└── frontend-next/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx           # 랜딩 페이지
    │   │   ├── (auth)/            # 로그인, 회원가입
    │   │   ├── (app)/             # 대시보드, 온보딩
    │   │   └── share/[token]/     # 공유 시간표
    │   ├── components/
    │   │   ├── timetable/         # Timetable 그리드
    │   │   ├── class-form/        # 강의 추가/수정 폼
    │   │   ├── ai-chat/           # AI 채팅 사이드바
    │   │   ├── exam/              # 시험 일정 목록
    │   │   ├── layout/            # AuthNavbar, AuthFooter
    │   │   ├── common/            # MaterialIcon
    │   │   └── ui/                # shadcn/ui 컴포넌트
    │   ├── hooks/                 # useSchedules, useAuth, useExams
    │   ├── store/                 # authStore, uiStore (Zustand)
    │   ├── lib/                   # api.ts (Axios), utils.ts
    │   └── types/                 # TypeScript 타입 정의
    └── package.json
```

---

## AI 사용 예시

```
"월요일 9시에 알고리즘 수업 추가해줘"
"수요일 오전 빈 시간 알려줘"
"현재 시간표 보여줘"
"알고리즘 수업 삭제해줘"
"화요일에 2시간짜리 수업 넣을 수 있는 시간 찾아줘"
```

## AI Agent 도구 목록

| 도구 | 설명 |
|------|------|
| `add_schedule` | 강의 추가 |
| `delete_schedule` | 강의 삭제 (ID 기반) |
| `list_schedules` | 현재 시간표 전체 조회 |
| `find_free_slots` | 특정 요일의 빈 시간대 탐색 |
