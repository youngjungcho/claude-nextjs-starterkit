# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 명령어

```bash
npm run dev       # 개발 서버 실행
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버 실행
npm run lint      # ESLint 실행

npx prisma migrate dev    # 스키마 변경 적용 (마이그레이션 생성)
npx prisma migrate deploy # 프로덕션 마이그레이션 적용
npx prisma studio         # DB 브라우저 GUI 열기
```

## 환경 변수 설정

`.env.example`을 `.env`로 복사 후 설정:
```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_URL="http://localhost:3000"
```

## 아키텍처

**스택:** Next.js 16 App Router · React 19 · TypeScript · NextAuth v5 (JWT) · Prisma 7 + SQLite (better-sqlite3) · shadcn/ui · Tailwind CSS v4 · React Hook Form + Zod · Recharts · Sonner

### 라우트 구조

```
src/app/
  (auth)/           # 공개 인증 페이지 — 로그인, 회원가입
  (dashboard)/      # 보호된 페이지 — 사이드바 + 헤더 레이아웃
    dashboard/      # 통계 카드, 방문자 차트, 최근 사용자 테이블
    analytics/      # 주간 바차트, 트래픽 파이차트, 월간 매출 라인차트
    components/     # shadcn/ui 컴포넌트 쇼케이스
    settings/       # 프로필, 보안, 알림 탭
  api/
    auth/
      register/     # POST — 회원가입
      [...nextauth]/# NextAuth 핸들러
    user/
      profile/      # PATCH — 사용자 이름 업데이트 (Zod 유효성 검사, 세션 인증)
  page.tsx          # 랜딩 페이지
```

미들웨어(`middleware.ts`)는 Edge에서 실행되며 `/dashboard/*`, `/settings/*`를 보호합니다. 이미 로그인된 경우 인증 페이지는 대시보드로 리다이렉트합니다.

### 인증 흐름

1. 회원가입: `POST /api/auth/register` → bcryptjs 해시(12 rounds) → Prisma `User` 생성
2. 로그인: NextAuth Credentials provider → Zod 유효성 검사 → DB 조회 → 비밀번호 비교 → JWT 발급
3. 세션: 서버 컴포넌트에서는 `auth()`, 클라이언트 컴포넌트에서는 `useSession()` 사용
4. 설정 분리: `src/lib/auth.ts` (전체 설정, Node.js) vs `src/lib/auth.config.ts` (미들웨어용, Edge)

### 데이터베이스

Prisma 스키마: `prisma/schema.prisma`. 모델: `User`, `Account`, `Session`, `VerificationToken` (NextAuth 표준). Prisma 클라이언트 싱글톤은 `src/lib/db.ts`에 위치 — 항상 이 파일에서 `db`를 import할 것.

`@prisma/adapter-better-sqlite3` (동기 드라이버) 사용. 프로덕션에서는 `DATABASE_URL`을 PostgreSQL로 변경하고 better-sqlite3 어댑터를 제거할 것.

### UI 컴포넌트

shadcn/ui 컴포넌트는 `src/components/ui/`에 위치. 새 컴포넌트 추가: `npx shadcn add <component>`. 경로 별칭 `@/*`는 `src/*`로 매핑됩니다.

**레이아웃** (`src/components/layout/`): `Sidebar`, `Header`, `MobileSidebar`, `ThemeToggle`, `LandingNav`

**공통 컴포넌트** (`src/components/common/`):
- `PageHeader` — 페이지 제목 + 설명 + 우측 슬롯
- `StatCard` — 통계 카드 (값 + 아이콘 + 변화율 배지)
- `DataTable` — 제네릭 테이블 (컬럼 정의, 셀 렌더 함수 지원)
- `EmptyState` — 빈 상태 안내
- `OverviewChart` — Recharts 라인차트 (방문자 & 신규 가입 추이)
- `AnalyticsCharts` — 주간 바차트 + 월별 매출 라인 + 트래픽 파이차트

### 커스텀 훅 (`src/hooks/`)

| 훅 | 설명 |
|----|------|
| `useMediaQuery(bp)` | Tailwind 브레이크포인트 래퍼. `bp`: `sm`/`md`/`lg`/`xl`/`2xl`/`mobile`/`tablet`/`desktop`/`dark`/`reducedMotion` |
| `useFetch(url)` | 경량 데이터 페칭. `{ data, loading, error }` 반환. AbortController로 메모리 누수 방지 |
| `useDisclosure()` | 모달/드로어 상태 관리. `{ isOpen, open, close, toggle }` 반환 |
| `useDebounce(value, delay?)` | 입력값 지연 처리 (기본 400ms). 검색 입력, API 호출 최적화용 |
| `useLocalStorage(key, init)` | localStorage 상태 관리 (SSR 안전, 탭 동기화) |
| `useIntersectionObserver` | 무한 스크롤, 지연 로딩용. 옵션: `threshold`, `rootMargin`, `freezeOnceVisible` |
| `useCopyToClipboard()` | 클립보드 복사 + sonner toast 자동 알림 |

### 폼

모든 폼은 React Hook Form + Zod 사용. 스키마는 각 페이지 파일 내에 정의됩니다. `@hookform/resolvers/zod`의 `zodResolver` 사용.

### 알림

토스트 알림은 `sonner` 라이브러리 사용: `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`

## Next.js 버전 주의사항

이 프로젝트는 Next.js 16을 사용하며, 이전 버전과 비호환 변경사항이 있습니다. 라우팅, 미들웨어, 서버 액션 관련 코드 작성 전에 `node_modules/next/dist/docs/`에서 현재 API를 확인할 것.

## 한국어 지원

이 프로젝트는 한국어를 위해 설정되었습니다.
- HTML lang 속성을 "ko"로 설정
- 한국어 라벨(라이트, 다크, 시스템)이 포함된 테마 토글
- 한국어로 작성된 README 및 문서
