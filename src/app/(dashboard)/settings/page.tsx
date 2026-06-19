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
