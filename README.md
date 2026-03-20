# AI 기반 시간표 관리 웹 앱

FastAPI + React(Vite)로 구현한 AI 기반 시간표 관리 풀스택 웹 앱입니다.

## 주요 기능

- **강의 CRUD** — 강의명, 요일, 시간, 장소, 색상 등록/수정/삭제
- **주간 시간표 뷰** — 월~일 그리드 형태의 시각적 시간표
- **JWT 인증** — 회원가입/로그인, 토큰 기반 보호 API
- **시간표 공유** — 고유 링크로 비로그인 열람
- **AI 어시스턴트** — 자연어로 강의 추가/삭제/조회 (Claude API + tool use)

## 빠른 시작

### 백엔드

```bash
cd backend
cp .env.example .env
# .env 파일에 ANTHROPIC_API_KEY 설정

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Swagger 문서: http://localhost:8000/docs

### 프론트엔드

```bash
cd frontend
cp .env.example .env

npm install
npm run dev
```

앱: http://localhost:5173

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React 18, Vite, React Router v6 |
| 백엔드 | FastAPI, Python 3.11+ |
| 데이터베이스 | SQLite (개발), SQLAlchemy ORM |
| 인증 | JWT (python-jose, passlib) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |

## AI 사용 예시

```
"월요일 9시에 알고리즘 수업 추가해줘"
"수요일 오전 빈 시간 알려줘"
"현재 시간표 보여줘"
"알고리즘 수업 삭제해줘"
"화요일에 2시간짜리 수업 넣을 수 있는 시간 찾아줘"
```

## 프로젝트 구조

```
timetable/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI 앱 진입점
│   │   ├── database.py      # SQLAlchemy 설정
│   │   ├── core/config.py   # 환경변수
│   │   ├── models/          # DB 모델 (User, Schedule, ShareToken)
│   │   ├── schemas/         # Pydantic 스키마
│   │   ├── routers/         # API 라우터 (auth, schedules, share, ai)
│   │   └── services/        # 비즈니스 로직 (auth, ai_agent)
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/      # Timetable, ClassForm, AIChat
    │   ├── pages/           # Home, Login, Share
    │   ├── hooks/           # useSchedule
    │   └── services/api.js  # Axios API 클라이언트
    ├── package.json
    └── .env.example
```

## AI Agent 도구 목록

| 도구 | 설명 |
|------|------|
| `add_schedule` | 강의 추가 |
| `delete_schedule` | 강의 삭제 (ID 기반) |
| `list_schedules` | 현재 시간표 전체 조회 |
| `find_free_slots` | 특정 요일의 빈 시간대 탐색 |
