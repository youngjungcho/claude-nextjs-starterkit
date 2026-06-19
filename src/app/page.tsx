import Link from "next/link";
import { Zap, Shield, Database, ArrowRight, Check, BarChart2, Layers, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/footer";
import { LandingNav } from "@/components/layout/LandingNav";

const features = [
  {
    icon: Zap,
    title: "Next.js 15 App Router",
    description: "Server Components, Streaming, Parallel Routes로 최고 성능의 앱을 만드세요.",
  },
  {
    icon: Shield,
    title: "NextAuth v5 인증",
    description: "JWT 기반 인증, 미들웨어 보호, Credentials 로그인이 바로 작동합니다.",
  },
  {
    icon: Database,
    title: "Prisma + SQLite",
    description: "타입 안전한 ORM으로 즉시 개발 시작. 프로덕션엔 PostgreSQL로 전환하세요.",
  },
  {
    icon: Layers,
    title: "shadcn/ui 컴포넌트",
    description: "복사-붙여넣기 방식의 접근성 높은 UI 컴포넌트로 디자인을 완성하세요.",
  },
  {
    icon: BarChart2,
    title: "Recharts 대시보드",
    description: "반응형 차트와 통계 카드가 포함된 분석 대시보드가 준비되어 있습니다.",
  },
  {
    icon: RefreshCw,
    title: "다크/라이트 테마",
    description: "next-themes로 시스템 설정을 따르거나 수동으로 테마를 전환하세요.",
  },
];

const plans = [
  {
    name: "무료",
    price: "0",
    description: "개인 프로젝트와 학습용",
    features: ["App Router 구조", "이메일 인증", "SQLite DB", "기본 대시보드"],
    cta: "무료로 시작",
    href: "/register",
    highlighted: false,
  },
  {
    name: "프로",
    price: "29,000",
    description: "팀과 프로덕션 서비스용",
    features: ["무료 플랜 전체", "PostgreSQL 지원", "분석 대시보드", "우선 지원"],
    cta: "프로 시작하기",
    href: "/register",
    highlighted: true,
  },
  {
    name: "엔터프라이즈",
    price: "문의",
    description: "대규모 팀을 위한 맞춤 솔루션",
    features: ["프로 플랜 전체", "전담 지원", "커스텀 계약", "SLA 보장"],
    cta: "문의하기",
    href: "/register",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingNav />

      {/* Hero */}
      <section id="hero" className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <Badge variant="secondary" className="mb-6">
          ✨ Next.js 15 · NextAuth v5 · Prisma 7
        </Badge>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight">
          더 빠르게 빌드하고,
          <br />
          <span className="text-primary/70">더 스마트하게 출시하세요.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Next.js 15, NextAuth, Prisma, shadcn/ui가 모두 설정된 스타터킷으로
          비즈니스 로직에만 집중하세요.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="px-8">
              무료로 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="px-8">
              로그인
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
            모든 것이 준비되어 있습니다
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            반복적인 설정 작업 없이 바로 핵심 기능 개발을 시작하세요.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-base font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 border-t border-border bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
            심플한 요금제
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            팀 규모와 필요에 맞는 플랜을 선택하세요.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-6 ${
                  plan.highlighted
                    ? "border-primary bg-card shadow-lg ring-1 ring-primary/20"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    인기
                  </Badge>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold">
                    {plan.price === "문의" ? "" : "₩"}
                    {plan.price}
                  </span>
                  {plan.price !== "문의" && (
                    <span className="text-sm text-muted-foreground">/월</span>
                  )}
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="scroll-mt-20 border-t border-border px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight">
            지금 바로 시작하세요
          </h2>
          <p className="mt-4 text-muted-foreground">
            5분 안에 풀스택 Next.js 앱을 실행하고 빌드를 시작하세요.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-8">
                무료로 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
