import { auth, signOut } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export async function Header() {
  const session = await auth();
  const user = session?.user;
  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="flex h-14 items-center justify-end border-b border-zinc-800 bg-zinc-950 px-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-800">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-indigo-600 text-xs text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium text-zinc-50">{user?.name ?? "사용자"}</p>
            <p className="text-xs text-zinc-500">{user?.email}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 border-zinc-800 bg-zinc-900"
        >
          <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">
            <User className="mr-2 h-4 w-4" />
            프로필
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem className="text-red-400 focus:bg-zinc-800 focus:text-red-400">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
              className="flex w-full items-center"
            >
              <button type="submit" className="flex w-full items-center">
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
