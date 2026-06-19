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
