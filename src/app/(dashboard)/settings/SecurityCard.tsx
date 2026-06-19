import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Key } from "lucide-react";

export function SecurityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>보안</CardTitle>
        <CardDescription>계정 보안 설정을 확인합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">인증 방식</p>
              <p className="text-xs text-muted-foreground">이메일/비밀번호</p>
            </div>
          </div>
          <Badge variant="secondary">Credentials</Badge>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">세션 방식</p>
              <p className="text-xs text-muted-foreground">JWT 기반 무상태 세션</p>
            </div>
          </div>
          <Badge variant="secondary">JWT</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
