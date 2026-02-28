"use client";

import { useState, useRef, useMemo } from "react";
import { MessageCircle, FileCheck, CheckCircle2, Activity, Calendar, Building2, FileText, BarChart3, FileSpreadsheet, PieChart as PieChartIcon } from "lucide-react";
import { parseExcelBuffer, type ActivityRow, type ImportResult } from "@/lib/parseExcel";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DEFAULT_ACTIVITIES: ActivityRow[] = [
  { id: 1, date: "2025-03-01", client: "株式会社テックソリューション", action: "提案書送付", status: "提案済み" },
  { id: 2, date: "2025-02-28", client: "グローバル商事株式会社", action: "初回ヒアリング実施", status: "商談中" },
  { id: 3, date: "2025-02-27", client: "株式会社イノベート", action: "導入完了・キックオフ", status: "完了" },
  { id: 4, date: "2025-02-26", client: "サンプル電機株式会社", action: "デモ実施", status: "商談中" },
  { id: 5, date: "2025-02-25", client: "未来システム株式会社", action: "見積もり提出", status: "提案済み" },
];

const DEFAULT_SUMMARY = { 商談中: 2, 提案済み: 2, 完了: 1 };

const CARD_CONFIG = [
  {
    title: "商談中",
    key: "商談中" as const,
    unit: "件",
    description: "現在進行中の商談",
    trend: "+2今月",
    color: "from-amber-500/10 to-amber-600/5 border-amber-200/80",
    accent: "text-amber-700",
    Icon: MessageCircle,
  },
  {
    title: "提案済み",
    key: "提案済み" as const,
    unit: "件",
    description: "提案書送付済み",
    trend: "先月比+1",
    color: "from-emerald-500/10 to-emerald-600/5 border-emerald-200/80",
    accent: "text-emerald-700",
    Icon: FileCheck,
  },
  {
    title: "導入完了",
    key: "完了" as const,
    unit: "件",
    description: "本年度の実績",
    trend: "目標の80%",
    color: "from-slate-500/10 to-slate-600/5 border-slate-200/80",
    accent: "text-slate-700",
    Icon: CheckCircle2,
  },
];

const PIE_COLORS = ["#f59e0b", "#10b981", "#64748b"]; // amber, emerald, slate

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
  const [activities, setActivities] = useState<ActivityRow[]>(DEFAULT_ACTIVITIES);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // グラフ用: ステータス別（ドーナツ）
  const pieData = useMemo(
    () => [
      { name: "商談中", value: summary.商談中, fill: PIE_COLORS[0] },
      { name: "提案済み", value: summary.提案済み, fill: PIE_COLORS[1] },
      { name: "完了", value: summary.完了, fill: PIE_COLORS[2] },
    ].filter((d) => d.value > 0),
    [summary]
  );

  // グラフ用: 月別アクティビティ数（棒）
  const monthlyData = useMemo(() => {
    const map = new Map<string, number>();
    activities.forEach((a) => {
      const month = a.date.slice(0, 7);
      map.set(month, (map.get(month) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([month, count]) => ({ month, 件数: count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [activities]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      setImportError("Excel ファイル（.xlsx / .xls）を選択してください。");
      return;
    }
    try {
      const buffer = await file.arrayBuffer();
      const result: ImportResult = parseExcelBuffer(buffer);
      setActivities(result.activities);
      setSummary(result.summary);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "インポートに失敗しました。");
    }
    e.target.value = "";
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-[5] border-b border-slate-200/80 bg-white/95 backdrop-blur-md md:top-0">
        <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
                ダッシュボード
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 sm:mt-1">
                AI導入支援の商談状況を一覧で確認できます
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                className="hidden"
                aria-label="Excelを選択"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                <FileSpreadsheet className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                Excelをインポート
              </button>
              {importError && (
                <p className="text-xs text-red-600" role="alert">
                  {importError}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 md:p-8">
        <section className="mb-8 sm:mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:mb-4 sm:text-sm">
            <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            現在のAI導入進捗
          </h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
            {CARD_CONFIG.map((card) => {
              const CardIcon = card.Icon;
              const value = String(summary[card.key]);
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
                      {value}
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

        {/* グラフ */}
        <section className="mb-8 sm:mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:mb-4 sm:text-sm">
            <PieChartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            視覚分析
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ステータス別 内訳（ドーナツ） */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">進捗の内訳</h3>
              {pieData.length === 0 ? (
                <div className="flex h-[260px] items-center justify-center text-slate-400 text-sm">
                  データがありません
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name} ${value}件`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value ?? 0} 件`, "件数"]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* 月別 アクティビティ数（棒） */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">月別アクティビティ</h3>
              {monthlyData.length === 0 ? (
                <div className="flex h-[260px] items-center justify-center text-slate-400 text-sm">
                  データがありません
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#64748b" allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [value ?? 0, "件数"]}
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    />
                    <Legend />
                    <Bar dataKey="件数" fill="#6366f1" radius={[4, 4, 0, 0]} name="件数" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
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
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        データがありません。Excel をインポートしてください。
                      </td>
                    </tr>
                  ) : (
                    activities.map((row) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
