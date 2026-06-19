# Next.js Starter Kit — 설계 문서

**날짜:** 2026-06-19  
**상태:** 승인됨

---

## 목적

Next.js v15 App Router 기반의 웹 개발 스타터킷. 새 프로젝트를 시작할 때 인증, DB, UI 기반이 이미 갖춰진 상태에서 빠르게 비즈니스 로직 개발을 시작할 수 있도록 한다.

---

## 기술 스택

| 범주 | 기술 |
|------|------|
| 프레임워크 | Next.js v15 (App Router) |
| 언어 | TypeScript |
| 스타일링 | TailwindCSS v4 (설정 파일 없음) |
| UI 컴포넌트 | shadcn/ui |
| 아이콘 | lucide-react |
| 인증 | NextAuth.js v5 (Auth.js) |
| ORM | Prisma |
| DB | SQLite (개발), PostgreSQL (프로덕션 전환 용이) |

---

## 파일 구조

```
claude-nextjs-starterkit/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # 로그인 페이지
│   │   │   └── register/
│   │   │       └── page.tsx         # 회원가입 페이지
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx           # 대시보드 레이아웃 (Sidebar 포함)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # 대시보드 메인
│   │   │   └── settings/
│   │   │       └── page.tsx         # 사용자 설정
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts     # NextAuth API 라우트
│   │   ├── layout.tsx               # 루트 레이아웃 (SessionProvider)
│   │   └── page.tsx                 # 랜딩 페이지
│   ├── components/
│   │   ├── ui/                      # shadcn/ui 자동 생성 컴포넌트
│   │   └── layout/
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       └── footer.tsx
│   └── lib/
│       ├── auth.ts                  # NextAuth 설정 (providers, callbacks)
│       ├── db.ts                    # Prisma 클라이언트 싱글턴
│       └── utils.ts                 # cn() 유틸리티
├── prisma/
│   ├── schema.prisma                # User, Account, Session, VerificationToken
│   └── dev.db                      # SQLite DB (gitignore)
├── middleware.ts                    # 보호된 라우트 접근 제어
├── .env.example                     # 환경변수 템플릿
└── components.json                  # shadcn/ui 설정
```

---

## 페이지별 설계

### 1. 랜딩 페이지 (`/`)
- Hero 섹션: 헤드라인, 서브 카피, CTA 버튼(Get Started / Sign In)
- Features 섹션: 3~4개 기능 카드 (lucide-react 아이콘)
- Footer: 링크, 저작권

### 2. 로그인 (`/login`)
- 이메일/비밀번호 폼
- "계정이 없으신가요? 회원가입" 링크
- NextAuth `signIn()` 연동

### 3. 회원가입 (`/register`)
- 이름, 이메일, 비밀번호 폼
- API Route(`/api/auth/register`)로 Prisma를 통해 User 생성

### 4. 대시보드 (`/dashboard`)
- 좌측 Sidebar + 상단 Header 레이아웃
- 로그인 사용자 정보 표시 (이름, 이메일, 아바타)
- 통계 카드(placeholder) 3~4개

### 5. 설정 (`/settings`)
- 프로필 정보 수정 폼
- 비밀번호 변경 섹션

---

## 인증 흐름

1. 미들웨어(`middleware.ts`)가 `/dashboard`, `/settings` 경로를 보호
2. 미인증 요청 → `/login`으로 리다이렉트
3. NextAuth Credentials Provider로 이메일/비밀번호 검증
4. 세션은 JWT 전략 사용

---

## Prisma 스키마 (핵심 모델)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  accounts      Account[]
  sessions      Session[]
}
```

NextAuth 표준 모델(Account, Session, VerificationToken) 포함.

---

## UI 스타일

- **배경:** `zinc-950`
- **텍스트:** `zinc-50` / `zinc-400`
- **강조색:** `indigo-500` (primary 버튼, 링크)
- **카드:** `zinc-900` 배경, `zinc-800` 테두리
- **다크 모드:** 기본값 (라이트 모드 토글 미포함)
- TailwindCSS v4는 `tailwind.config` 파일 없이 CSS `@import "tailwindcss"` 사용

---

## shadcn/ui 컴포넌트 (초기 설치 목록)

- `button`, `input`, `label`, `card`, `avatar`
- `dropdown-menu`, `separator`, `badge`
- `form` (react-hook-form + zod 연동)

---

## 환경변수 (.env.example)

```env
# NextAuth
AUTH_SECRET=your-secret-here
AUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"
```

---

## 검증 방법

1. `npm run dev` 실행 → `http://localhost:3000` 랜딩 페이지 확인
2. `/register`에서 계정 생성 → Prisma DB에 User 생성 확인
3. `/login`으로 로그인 → `/dashboard` 리다이렉트 확인
4. 미인증 상태로 `/dashboard` 직접 접근 → `/login` 리다이렉트 확인
5. `/settings`에서 프로필 수정 확인
