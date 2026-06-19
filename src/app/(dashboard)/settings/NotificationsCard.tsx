"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const defaultPrefs = {
  email_marketing: false,
  email_security: true,
  email_updates: true,
};

export function NotificationsCard() {
  const [prefs, setPrefs] = useState(defaultPrefs);

  function toggle(key: keyof typeof defaultPrefs) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    toast.success("알림 설정이 저장되었습니다.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>알림 설정</CardTitle>
        <CardDescription>이메일 알림 수신 여부를 설정합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { key: "email_security" as const, label: "보안 알림", desc: "로그인, 비밀번호 변경 등 보안 관련 알림" },
          { key: "email_updates" as const, label: "업데이트 알림", desc: "새 기능 및 서비스 업데이트 소식" },
          { key: "email_marketing" as const, label: "마케팅 알림", desc: "프로모션 및 이벤트 소식" },
        ].map(({ key, label, desc }, i, arr) => (
          <div key={key}>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor={key} className="cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <Switch
                id={key}
                checked={prefs[key]}
                onCheckedChange={() => toggle(key)}
              />
            </div>
            {i < arr.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
        <Button onClick={handleSave} className="mt-2">저장하기</Button>
      </CardContent>
    </Card>
  );
}
