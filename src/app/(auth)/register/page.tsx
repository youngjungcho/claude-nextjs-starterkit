"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
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
        <CardHeader className="relative">
          <Link
            href="/"
            className="absolute right-0 top-0 text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </Link>
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
