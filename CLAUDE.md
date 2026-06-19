# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

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

**스택:** Next.js 16 App Router · React 19 · TypeScript · NextAuth v5 (JWT) · Prisma 7 + SQLite (better-sqlite3) · shadcn/ui · Tailwind CSS v4 · React Hook Form + Zod

### 라우트 구조

```
src/app/
  (auth)/           # 공개 인증 페이지 — 로그인, 회원가입
  (dashboard)/      # 보호된 페이지 — 사이드바 + 헤더 레이아웃
    dashboard/      # 메인 대시보드 (서버 컴포넌트)
    settings/
  api/auth/
    register/       # POST — 회원가입
    [...nextauth]/  # NextAuth 핸들러
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

shadcn/ui 컴포넌트는 `src/components/ui/`에 위치. 새 컴포넌트 추가: `npx shadcn add <component>`. 레이아웃 컴포넌트(Sidebar, Header, Footer)는 `src/components/layout/`. 경로 별칭 `@/*`는 `src/*`로 매핑됩니다.

### 폼

모든 폼은 React Hook Form + Zod 사용. 스키마는 각 페이지 파일 내에 정의됩니다. `@hookform/resolvers/zod`의 `zodResolver` 사용.

## Next.js 버전 주의사항

이 프로젝트는 Next.js 16을 사용하며, 이전 버전과 비호환 변경사항이 있습니다. 라우팅, 미들웨어, 서버 액션 관련 코드 작성 전에 `node_modules/next/dist/docs/`에서 현재 API를 확인할 것.

## 한국어 지원

이 프로젝트는 한국어를 위해 설정되었습니다.
- HTML lang 속성을 "ko"로 설정
- 한국어 라벨(라이트, 다크, 시스템)이 포함된 테마 토글
- 한국어 설명이 포함된 환경변수
- 한국어로 작성된 README 및 문서