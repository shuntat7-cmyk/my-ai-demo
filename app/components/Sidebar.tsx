"use client";

import { Home, FolderKanban, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "ホーム", Icon: Home },
  { href: "/projects", label: "プロジェクト", Icon: FolderKanban },
  { href: "/settings", label: "設定", Icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // メニュー開閉時にbodyのスクロールをロック（スマホ）
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // 画面遷移時にドロワーを閉じる
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* モバイル用ヘッダー（ハンバーガー＋ロゴ） */}
      <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/98 px-4 shadow-sm backdrop-blur-sm md:hidden [padding-top:env(safe-area-inset-top)]">
        <span className="text-base font-semibold tracking-tight text-slate-800">
          AI Agency
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          aria-label="メニューを開く"
        >
          <Menu className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </header>

      {/* オーバーレイ（スマホでメニュー開時） */}
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[21] bg-black/50 transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      {/* サイドバー本体：PCでは常時表示、スマホではドロワー */}
      <aside
        className={`fixed left-0 top-0 z-[22] flex h-full w-64 max-w-[85vw] flex-col border-r border-slate-200/80 bg-white shadow-lg backdrop-blur-sm transition-transform duration-200 ease-out md:translate-x-0 md:shadow-sm pt-[env(safe-area-inset-top,0px)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 min-h-14 items-center justify-between border-b border-slate-200/80 px-4 md:h-16 md:px-6">
          <span className="text-lg font-semibold tracking-tight text-slate-800">
            AI Agency
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 md:hidden"
            aria-label="メニューを閉じる"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-4">
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
    </>
  );
}
