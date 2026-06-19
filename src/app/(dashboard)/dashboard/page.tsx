import { auth } from "@/lib/auth";
import { Users, Activity, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/common/PageHeader";
import { OverviewChart } from "@/components/common/OverviewChart";
import { DataTable } from "@/components/common/DataTable";

const stats = [
  { title: "총 사용자", value: "1,234", icon: Users, change: "+12%" },
  { title: "활성 세션", value: "56", icon: Activity, change: "+3%" },
  { title: "월간 성장", value: "23%", icon: TrendingUp, change: "+5%" },
  { title: "API 요청", value: "98.1k", icon: Zap, change: "+18%" },
];

const recentUsers = [
  { 이름: "김철수", 이메일: "kim@example.com", 가입일: "2026-06-18", 상태: "활성" },
  { 이름: "이영희", 이메일: "lee@example.com", 가입일: "2026-06-17", 상태: "활성" },
  { 이름: "박민준", 이메일: "park@example.com", 가입일: "2026-06-15", 상태: "비활성" },
  { 이름: "최지원", 이메일: "choi@example.com", 가입일: "2026-06-14", 상태: "활성" },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description={`안녕하세요, ${session?.user?.name ?? "사용자"}님! 오늘도 좋은 하루 되세요.`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} changeType="positive" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>방문자 개요</CardTitle>
            <CardDescription>최근 6개월 방문자 및 신규 가입자 추이</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>시작하기</CardTitle>
            <CardDescription>스타터킷 설정 현황</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Next.js 15 App Router",
              "NextAuth v5 인증",
              "Prisma + SQLite DB",
              "shadcn/ui 컴포넌트",
              "다크/라이트 테마",
              "Recharts 차트",
              "Sonner 토스트",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="h-5 w-5 shrink-0 rounded-full p-0 flex items-center justify-center text-[10px]">
                  ✓
                </Badge>
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 가입 사용자</CardTitle>
          <CardDescription>최근 등록된 사용자 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: "이름", header: "이름" },
              { key: "이메일", header: "이메일" },
              { key: "가입일", header: "가입일" },
              {
                key: "상태",
                header: "상태",
                cell: (row) => (
                  <Badge variant={row["상태"] === "활성" ? "default" : "secondary"}>
                    {String(row["상태"])}
                  </Badge>
                ),
              },
            ]}
            data={recentUsers as Record<string, unknown>[]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
