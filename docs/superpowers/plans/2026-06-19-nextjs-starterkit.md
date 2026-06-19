# Next.js Starter Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Next.js v15 App Router 기반으로 인증·DB·UI가 갖춰진 웹 개발 스타터킷을 구축한다.

**Architecture:** `create-next-app`으로 기반을 생성하고 NextAuth v5(Credentials Provider, JWT), Prisma(SQLite), shadcn/ui를 순서대로 설치·설정한다. Route Group `(auth)`와 `(dashboard)`로 공개/보호 영역을 분리하고 `middleware.ts`로 접근을 제어한다.

**Tech Stack:** Next.js 15, TypeScript, TailwindCSS v4, shadcn/ui, lucide-react, NextAuth v5, Prisma, SQLite, react-hook-form, zod, bcryptjs

## Global Constraints

- Next.js v15 App Router 전용 — Pages Router 패턴 사용 금지
- TailwindCSS v4 — `tailwind.config.{js,ts}` 파일 없음, CSS에서 `@import "tailwindcss"` 사용
- shadcn/ui — `src/components/ui/` 경로, `zinc` base color, CSS variables 사용
- NextAuth v5 (beta) — `next-auth@beta`, `src/lib/auth.ts`에서 `NextAuth()` export
- Prisma — `prisma/schema.prisma`, SQLite, `src/lib/db.ts`에서 싱글턴 export
- 모든 페이지 다크 테마 기본 (bg-zinc-950, text-zinc-50, 강조 indigo-500)
- `src/` 디렉토리 구조 사용

---

## File Map

| 역할 | 파일 경로 |
|------|-----------|
| Prisma 스키마 | `prisma/schema.prisma` |
| Prisma 클라이언트 | `src/lib/db.ts` |
| NextAuth 설정 | `src/lib/auth.ts` |
| 유틸리티 | `src/lib/utils.ts` |
| 미들웨어 | `middleware.ts` |
| 루트 레이아웃 | `src/app/layout.tsx` |
| 랜딩 페이지 | `src/app/page.tsx` |
| 로그인 페이지 | `src/app/(auth)/login/page.tsx` |
| 회원가입 페이지 | `src/app/(auth)/register/page.tsx` |
| 대시보드 레이아웃 | `src/app/(dashboard)/layout.tsx` |
| 대시보드 페이지 | `src/app/(dashboard)/dashboard/page.tsx` |
| 설정 페이지 | `src/app/(dashboard)/settings/page.tsx` |
| NextAuth API | `src/app/api/auth/[...nextauth]/route.ts` |
| 회원가입 API | `src/app/api/auth/register/route.ts` |
| Sidebar | `src/components/layout/sidebar.tsx` |
| Header | `src/components/layout/header.tsx` |
| Footer | `src/components/layout/footer.tsx` |

---

## Task 1: 프로젝트 초기화

**Files:**
- Create: 전체 프로젝트 구조 (`create-next-app`)
- Create: `.env`, `.env.example`

**Interfaces:**
- Produces: Next.js 15 + TypeScript + TailwindCSS v4 기반 프로젝트, `npm run dev` 동작

- [ ] **Step 1: create-next-app 실행**

```bash
cd /Users/joyeongjung/workspace/courses/claude-nextjs-starterkit
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git --yes
```

Expected: 프로젝트 파일 생성 완료, 오류 없음

- [ ] **Step 2: 의존성 설치**

```bash
npm install next-auth@beta bcryptjs react-hook-form zod @hookform/resolvers lucide-react prisma @prisma/client
npm install -D @types/bcryptjs
```

Expected: `node_modules` 설치 완료, 오류 없음

- [ ] **Step 3: Prisma 초기화**

```bash
npx prisma init --datasource-provider sqlite
```

Expected: `prisma/schema.prisma`, `.env`(DATABASE_URL 포함) 생성

- [ ] **Step 4: .env 설정**

`.env` 파일에 추가:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-development-secret-change-in-production"
AUTH_URL="http://localhost:3000"
```

- [ ] **Step 5: .env.example 작성**

```bash
cat > .env.example << 'EOF'
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"
EOF
```

- [ ] **Step 6: .gitignore에 .env 추가 확인**

```bash
grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore
echo ".env" >> .gitignore 2>/dev/null; grep "\.env" .gitignore
```

Expected: `.env`가 gitignore에 포함

- [ ] **Step 7: 개발 서버 시작 확인**

```bash
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
kill %1
```

Expected: `200`

---

## Task 2: Prisma 스키마 및 DB 설정

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `src/lib/db.ts`

**Interfaces:**
- Produces: `import { db } from "@/lib/db"` — `PrismaClient` 싱글턴
- Produces: User, Account, Session, VerificationToken 테이블

- [ ] **Step 1: schema.prisma 작성**

`prisma/schema.prisma`를 아래로 교체:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

- [ ] **Step 2: DB 마이그레이션**

```bash
npx prisma db push
```

Expected: `prisma/dev.db` 생성, "Your database is now in sync" 메시지

- [ ] **Step 3: Prisma 클라이언트 생성**

```bash
npx prisma generate
```

Expected: 오류 없음

- [ ] **Step 4: src/lib/db.ts 작성**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

- [ ] **Step 5: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 오류 없음

---

## Task 3: NextAuth 설정 및 미들웨어

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts`

**Interfaces:**
- Consumes: `db` from `@/lib/db`
- Produces: `auth`, `handlers`, `signIn`, `signOut` from `@/lib/auth`
- Produces: `/dashboard`, `/settings` 경로 보호

- [ ] **Step 1: src/lib/auth.ts 작성**

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
```

- [ ] **Step 2: NextAuth API 라우트 작성**

`src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: middleware.ts 작성**

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/settings");

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 4: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 오류 없음

---

## Task 4: 회원가입 API 및 shadcn/ui 설치

**Files:**
- Create: `src/app/api/auth/register/route.ts`
- Create: `src/lib/utils.ts` (shadcn/ui 기본 포함)
- Create: `components.json`
- Create: `src/components/ui/` (shadcn 컴포넌트들)

**Interfaces:**
- Consumes: `db` from `@/lib/db`
- Produces: `POST /api/auth/register` — `{ name, email, password }` → `{ id, email }`
- Produces: shadcn/ui 컴포넌트: Button, Input, Label, Card, Avatar, DropdownMenu, Separator, Badge, Form

- [ ] **Step 1: shadcn/ui 초기화**

```bash
npx shadcn@latest init --defaults --base-color zinc --css-variables
```

프롬프트가 나오면 아래 옵션 선택:
- Style: Default
- Base color: Zinc
- CSS variables: Yes

- [ ] **Step 2: shadcn/ui 컴포넌트 설치**

```bash
npx shadcn@latest add button input label card avatar dropdown-menu separator badge form --overwrite
```

- [ ] **Step 3: 회원가입 API 작성**

`src/app/api/auth/register/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "유효하지 않은 입력입니다." },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, email: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 오류 없음

---

## Task 5: 루트 레이아웃 및 랜딩 페이지

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/layout/footer.tsx`

**Interfaces:**
- Consumes: `auth` from `@/lib/auth` (SessionProvider 대신 서버 컴포넌트 직접 사용)
- Produces: 랜딩 페이지 `/` — Hero, Features, Footer 섹션

- [ ] **Step 1: globals.css 수정**

`src/app/globals.css`를 아래로 교체:

```css
@import "tailwindcss";

:root {
  --background: #09090b;
  --foreground: #fafafa;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: system-ui, -apple-system, sans-serif;
}
```

- [ ] **Step 2: 루트 layout.tsx 수정**

`src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Starter Kit",
  description: "빠르게 시작하는 Next.js 스타터킷",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: footer.tsx 작성**

`src/components/layout/footer.tsx`:

```typescript
export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-500">
        <p>© 2026 Next.js Starter Kit. MIT License.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: 랜딩 페이지 작성**

`src/app/page.tsx`:

```typescript
import Link from "next/link";
import { Zap, Shield, Database, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: Zap,
    title: "Next.js 15",
    description: "App Router, Server Components, Streaming으로 최고의 성능",
  },
  {
    icon: Shield,
    title: "NextAuth v5",
    description: "JWT 기반 인증, 보호된 라우트, 미들웨어 통합",
  },
  {
    icon: Database,
    title: "Prisma + SQLite",
    description: "타입 안전한 ORM, 로컬 개발용 SQLite, 프로덕션은 PostgreSQL",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <span className="font-bold text-zinc-50">StarterKit</span>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-50">
              로그인
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              시작하기
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="max-w-2xl text-5xl font-bold leading-tight text-zinc-50">
          더 빠르게 빌드하고,
          <br />
          <span className="text-indigo-400">더 스마트하게 출시하세요.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          Next.js 15, NextAuth, Prisma, shadcn/ui가 모두 설정된 스타터킷으로
          비즈니스 로직에만 집중하세요.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 text-base">
              무료로 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-3 text-base">
              로그인
            </Button>
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-zinc-800 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-zinc-50">
            모든 것이 준비되어 있습니다
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <Icon className="mb-4 h-8 w-8 text-indigo-400" />
                <h3 className="mb-2 text-lg font-semibold text-zinc-50">{title}</h3>
                <p className="text-sm text-zinc-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: 개발 서버에서 랜딩 페이지 확인**

```bash
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
kill %1
```

Expected: `200`

---

## Task 6: 인증 페이지 (로그인 / 회원가입)

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`

**Interfaces:**
- Consumes: `signIn` from `next-auth/react`, `POST /api/auth/register`
- Produces: 로그인 성공 → `/dashboard` 리다이렉트

- [ ] **Step 1: 로그인 페이지 작성**

`src/app/(auth)/login/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-50">로그인</CardTitle>
          <CardDescription className="text-zinc-400">
            이메일과 비밀번호로 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="border-zinc-700 bg-zinc-800 text-zinc-50 placeholder:text-zinc-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">비밀번호</Label>
              <Input
                id="password"
                type="password"
                className="border-zinc-700 bg-zinc-800 text-zinc-50"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-zinc-500">
            계정이 없으신가요?{" "}
            <Link href="/register" className="text-indigo-400 hover:underline">
              회원가입
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: 회원가입 페이지 작성**

`src/app/(auth)/register/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const registerSchema = z.object({
  name: z.string().min(1, "이름을 입력하세요."),
  email: z.string().email("유효한 이메일을 입력하세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "회원가입에 실패했습니다.");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-50">회원가입</CardTitle>
          <CardDescription className="text-zinc-400">
            계정을 만들어 시작하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">이름</Label>
              <Input
                id="name"
                placeholder="홍길동"
                className="border-zinc-700 bg-zinc-800 text-zinc-50 placeholder:text-zinc-500"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="border-zinc-700 bg-zinc-800 text-zinc-50 placeholder:text-zinc-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">비밀번호</Label>
              <Input
                id="password"
                type="password"
                className="border-zinc-700 bg-zinc-800 text-zinc-50"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? "가입 중..." : "회원가입"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-zinc-500">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-indigo-400 hover:underline">
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 오류 없음

---

## Task 7: 대시보드 레이아웃 컴포넌트 (Sidebar, Header)

**Files:**
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/header.tsx`
- Create: `src/app/(dashboard)/layout.tsx`

**Interfaces:**
- Consumes: `auth` from `@/lib/auth` (서버 컴포넌트에서 세션 조회)
- Produces: `<DashboardLayout>` — Sidebar + Header가 포함된 대시보드 레이아웃

- [ ] **Step 1: sidebar.tsx 작성**

`src/components/layout/sidebar.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/settings", label: "설정", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-zinc-800 bg-zinc-950 px-3 py-6">
      <div className="mb-8 px-3">
        <span className="text-lg font-bold text-zinc-50">StarterKit</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-indigo-600/20 text-indigo-400"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: header.tsx 작성**

`src/components/layout/header.tsx`:

```typescript
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export async function Header() {
  const session = await auth();
  const user = session?.user;
  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="flex h-14 items-center justify-end border-b border-zinc-800 bg-zinc-950 px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-800">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-indigo-600 text-xs text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium text-zinc-50">{user?.name ?? "사용자"}</p>
              <p className="text-xs text-zinc-500">{user?.email}</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 border-zinc-800 bg-zinc-900"
        >
          <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">
            <User className="mr-2 h-4 w-4" />
            프로필
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem asChild className="text-red-400 focus:bg-zinc-800 focus:text-red-400">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button type="submit" className="flex w-full items-center">
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
```

- [ ] **Step 3: 대시보드 layout.tsx 작성**

`src/app/(dashboard)/layout.tsx`:

```typescript
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 오류 없음

---

## Task 8: 대시보드 및 설정 페이지

**Files:**
- Create: `src/app/(dashboard)/dashboard/page.tsx`
- Create: `src/app/(dashboard)/settings/page.tsx`

**Interfaces:**
- Consumes: `auth` from `@/lib/auth`
- Produces: 대시보드 `/dashboard`, 설정 `/settings` 페이지

- [ ] **Step 1: 대시보드 페이지 작성**

`src/app/(dashboard)/dashboard/page.tsx`:

```typescript
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, TrendingUp, Zap } from "lucide-react";

const stats = [
  { title: "총 사용자", value: "1,234", icon: Users, change: "+12%" },
  { title: "활성 세션", value: "56", icon: Activity, change: "+3%" },
  { title: "월간 성장", value: "23%", icon: TrendingUp, change: "+5%" },
  { title: "API 요청", value: "98.1k", icon: Zap, change: "+18%" },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">대시보드</h1>
        <p className="mt-1 text-sm text-zinc-400">
          안녕하세요, {session?.user?.name ?? "사용자"}님!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ title, value, icon: Icon, change }) => (
          <Card key={title} className="border-zinc-800 bg-zinc-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {title}
              </CardTitle>
              <Icon className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-50">{value}</div>
              <p className="mt-1 text-xs text-indigo-400">{change} 지난 달 대비</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-50">시작하기</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-400 space-y-2">
          <p>✅ Next.js 15 App Router 설정 완료</p>
          <p>✅ NextAuth v5 인증 설정 완료</p>
          <p>✅ Prisma + SQLite DB 설정 완료</p>
          <p>✅ shadcn/ui 컴포넌트 설치 완료</p>
          <p className="pt-2 text-zinc-500">이제 비즈니스 로직을 추가하세요!</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: 설정 페이지 작성**

`src/app/(dashboard)/settings/page.tsx`:

```typescript
import { auth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">설정</h1>
        <p className="mt-1 text-sm text-zinc-400">계정 정보를 관리하세요</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-50">프로필 정보</CardTitle>
          <CardDescription className="text-zinc-400">
            이름과 이메일을 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">이름</Label>
            <Input
              defaultValue={user?.name ?? ""}
              className="border-zinc-700 bg-zinc-800 text-zinc-50"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">이메일</Label>
            <div className="flex items-center gap-2">
              <Input
                defaultValue={user?.email ?? ""}
                className="border-zinc-700 bg-zinc-800 text-zinc-50"
                readOnly
              />
              <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-600/30">
                인증됨
              </Badge>
            </div>
          </div>
          <Button disabled className="bg-indigo-600/50 text-zinc-400 cursor-not-allowed">
            저장 (준비 중)
          </Button>
        </CardContent>
      </Card>

      <Separator className="bg-zinc-800" />

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-50">계정 정보</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-400 space-y-2">
          <p>인증 방식: Credentials (이메일/비밀번호)</p>
          <p>세션 전략: JWT</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: 전체 빌드 확인**

```bash
npm run build
```

Expected: 오류 없음, 빌드 성공

---

## Task 9: 최종 검증

**Files:**
- 수정 없음 (검증 단계)

- [ ] **Step 1: 개발 서버 시작**

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

- [ ] **Step 2: 회원가입 테스트**

`http://localhost:3000/register`에서:
- 이름, 이메일, 비밀번호 입력
- 회원가입 버튼 클릭
- `/login`으로 리다이렉트 확인

- [ ] **Step 3: DB 확인**

```bash
npx prisma studio
```

`http://localhost:5555`에서 User 테이블에 새 레코드 확인

- [ ] **Step 4: 로그인 테스트**

`http://localhost:3000/login`에서:
- 가입한 이메일/비밀번호 입력
- 로그인 → `/dashboard` 리다이렉트 확인
- 대시보드에 이름 표시 확인

- [ ] **Step 5: 라우트 보호 테스트**

브라우저 시크릿 창에서 `http://localhost:3000/dashboard` 직접 접근:
- `/login`으로 자동 리다이렉트 확인

- [ ] **Step 6: 로그아웃 테스트**

헤더 우측 아바타 클릭 → 로그아웃 → `/login` 리다이렉트 확인

- [ ] **Step 7: 빌드 확인**

```bash
npm run build && echo "빌드 성공"
```

Expected: "빌드 성공"
