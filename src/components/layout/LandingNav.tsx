"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "기능", href: "#features" },
  { label: "요금제", href: "#pricing" },
  { label: "시작하기", href: "#cta" },
];

export function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false);
  }

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm transition-shadow",
        scrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* 로고 + 데스크탑 메뉴 */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="font-bold text-foreground"
          >
            StarterKit
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchor(e, href)}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* 우측 액션 */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              로그인
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">시작하기</Button>
          </Link>
          {/* 모바일 햄버거 */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="메뉴"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-6 py-3 md:hidden">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleAnchor(e, href)}
              className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {label}
            </a>
          ))}
          <div className="mt-2 border-t border-border pt-2">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <div className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent">
                로그인
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
