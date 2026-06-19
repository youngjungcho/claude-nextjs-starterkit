import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-6">
      <Frown className="mb-6 h-16 w-16 text-muted-foreground" />
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <h2 className="mt-4 text-xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="mt-2 text-muted-foreground max-w-sm">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button>대시보드로</Button>
        </Link>
      </div>
    </div>
  );
}
