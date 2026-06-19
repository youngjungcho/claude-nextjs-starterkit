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
