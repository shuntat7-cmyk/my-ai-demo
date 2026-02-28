"use client";

import { Home, FolderKanban, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ホーム", Icon: Home },
  { href: "/projects", label: "プロジェクト", Icon: FolderKanban },
  { href: "/settings", label: "設定", Icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-10 flex h-full w-64 flex-col border-r border-slate-200/80 bg-white/98 shadow-sm backdrop-blur-sm">
      <div className="flex h-16 items-center border-b border-slate-200/80 px-6">
        <span className="text-lg font-semibold tracking-tight text-slate-800">
          AI Agency
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-200/80 text-slate-900"
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200/80 p-4">
        <p className="text-xs text-slate-500">© AI Agency</p>
      </div>
    </aside>
  );
}
