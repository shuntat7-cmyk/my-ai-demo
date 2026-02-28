import * as XLSX from "xlsx";

const STATUSES = ["商談中", "提案済み", "完了"] as const;
export type Status = (typeof STATUSES)[number];

export type ActivityRow = {
  id: number;
  date: string;
  client: string;
  action: string;
  status: Status;
};

export type ImportResult = {
  activities: ActivityRow[];
  summary: { 商談中: number; 提案済み: number; 完了: number };
};

function normalizeStatus(value: unknown): Status {
  const s = String(value).trim();
  if (STATUSES.includes(s as Status)) return s as Status;
  return "商談中";
}

/** Excel のシリアル日付（1900-01-01 からの日数）を YYYY-MM-DD に変換 */
function excelDateToYYYYMMDD(n: number): string {
  const epoch = new Date(1899, 11, 30);
  const d = new Date(epoch.getTime() + n * 86400 * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDate(value: unknown): string {
  if (value == null || value === "") return "";
  const s = String(value).trim();
  if (typeof value === "number" && !Number.isNaN(value) && value > 0) {
    return excelDateToYYYYMMDD(value);
  }
  return s;
}

/**
 * Excel (.xlsx) の ArrayBuffer をパースし、アクティビティ一覧と進捗サマリを返す。
 * 1シート目・1行目をヘッダーとし、列名「日付」「クライアント」「アクティビティ」「ステータス」を期待する。
 */
export function parseExcelBuffer(buffer: ArrayBuffer): ImportResult {
  const wb = XLSX.read(buffer, { type: "array" });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

  const activities: ActivityRow[] = [];
  const summary = { 商談中: 0, 提案済み: 0, 完了: 0 };

  if (rows.length < 2) return { activities, summary };

  const header = rows[0].map((c) => String(c).trim());
  const col = (name: string) => {
    const i = header.indexOf(name);
    return i >= 0 ? i : -1;
  };
  const idxDate = col("日付");
  const idxClient = col("クライアント");
  const idxAction = col("アクティビティ");
  const idxStatus = col("ステータス");

  if (idxDate < 0 || idxClient < 0 || idxAction < 0 || idxStatus < 0) {
    throw new Error("Excel に「日付」「クライアント」「アクティビティ」「ステータス」の列が必要です。");
  }

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    const date = formatDate(row[idxDate] ?? "");
    const client = String(row[idxClient] ?? "").trim();
    const action = String(row[idxAction] ?? "").trim();
    const status = normalizeStatus(row[idxStatus] ?? "");

    if (!date && !client && !action) continue;

    const id = i;
    activities.push({ id, date: date || "-", client: client || "-", action: action || "-", status });
    summary[status]++;
  }

  return { activities, summary };
}
