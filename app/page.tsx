"use client";

import { MessageCircle, FileCheck, CheckCircle2, Activity, Calendar, Building2, FileText, BarChart3 } from "lucide-react";

const progressCards = [
  {
    title: "商談中",
    value: "12",
    unit: "件",
    description: "現在進行中の商談",
    trend: "+2今月",
    color: "from-amber-500/10 to-amber-600/5 border-amber-200/80",
    accent: "text-amber-700",
    Icon: MessageCircle,
  },
  {
    title: "提案済み",
    value: "8",
    unit: "件",
    description: "提案書送付済み",
    trend: "先月比+1",
    color: "from-emerald-500/10 to-emerald-600/5 border-emerald-200/80",
    accent: "text-emerald-700",
    Icon: FileCheck,
  },
  {
    title: "導入完了",
    value: "24",
    unit: "件",
    description: "本年度の実績",
    trend: "目標の80%",
    color: "from-slate-500/10 to-slate-600/5 border-slate-200/80",
    accent: "text-slate-700",
    Icon: CheckCircle2,
  },
];

const activities = [
  { id: 1, date: "2025-03-01", client: "株式会社テックソリューション", action: "提案書送付", status: "提案済み" },
  { id: 2, date: "2025-02-28", client: "グローバル商事株式会社", action: "初回ヒアリング実施", status: "商談中" },
  { id: 3, date: "2025-02-27", client: "株式会社イノベート", action: "導入完了・キックオフ", status: "完了" },
  { id: 4, date: "2025-02-26", client: "サンプル電機株式会社", action: "デモ実施", status: "商談中" },
  { id: 5, date: "2025-02-25", client: "未来システム株式会社", action: "見積もり提出", status: "提案済み" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    商談中: "bg-amber-100 text-amber-800 border-amber-200/80",
    提案済み: "bg-emerald-100 text-emerald-800 border-emerald-200/80",
    完了: "bg-slate-100 text-slate-800 border-slate-200/80",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-slate-100 text-slate-700"}`}
    >
      {status}
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-[5] border-b border-slate-200/80 bg-white/95 backdrop-blur-md md:top-0">
        <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
          <h1 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
            ダッシュボード
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 sm:mt-1">
            AI導入支援の商談状況を一覧で確認できます
          </p>
        </div>
      </header>

      <div className="p-4 sm:p-6 md:p-8">
        <section className="mb-8 sm:mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:mb-4 sm:text-sm">
            <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            現在のAI導入進捗
          </h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
            {progressCards.map((card) => {
              const CardIcon = card.Icon;
              return (
                <div
                  key={card.title}
                  className={`rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6 ${card.color}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">{card.title}</p>
                    <CardIcon className={`h-5 w-5 shrink-0 ${card.accent}`} strokeWidth={1.5} />
                  </div>
                  <p className="mt-2 flex items-baseline gap-1">
                    <span className={`text-2xl font-semibold tabular-nums sm:text-3xl ${card.accent}`}>
                      {card.value}
                    </span>
                    <span className="text-slate-500">{card.unit}</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{card.description}</p>
                  <p className="mt-3 text-xs font-medium text-slate-500">{card.trend}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:mb-4 sm:text-sm">
            <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            最新のアクティビティ
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/80">
                    <th className="px-3 py-3 font-semibold text-slate-700 sm:px-6 sm:py-4">
                      <span className="inline-flex items-center gap-1.5 sm:gap-2">
                        <Calendar className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        日付
                      </span>
                    </th>
                    <th className="px-3 py-3 font-semibold text-slate-700 sm:px-6 sm:py-4">
                      <span className="inline-flex items-center gap-1.5 sm:gap-2">
                        <Building2 className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        クライアント
                      </span>
                    </th>
                    <th className="px-3 py-3 font-semibold text-slate-700 sm:px-6 sm:py-4">
                      <span className="inline-flex items-center gap-1.5 sm:gap-2">
                        <FileText className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        アクティビティ
                      </span>
                    </th>
                    <th className="px-3 py-3 font-semibold text-slate-700 sm:px-6 sm:py-4">ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600 sm:px-6 sm:py-4">{row.date}</td>
                      <td className="min-w-[140px] px-3 py-3 font-medium text-slate-800 sm:min-w-0 sm:px-6 sm:py-4">{row.client}</td>
                      <td className="px-3 py-3 text-slate-600 sm:px-6 sm:py-4">{row.action}</td>
                      <td className="whitespace-nowrap px-3 py-3 sm:px-6 sm:py-4">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
