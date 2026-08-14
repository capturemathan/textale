export function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export function formatCompact(value: number): string {
  if (Math.abs(value) < 1000) return formatNumber(value);
  return value.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 });
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatDuration(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || !Number.isFinite(ms)) return "—";
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  if (hours < 24) return restMinutes ? `${hours}h ${restMinutes}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const restHours = hours % 24;
  return restHours ? `${days}d ${restHours}h` : `${days}d`;
}

export function formatSpan(ms: number): string {
  const days = Math.floor(ms / 86_400_000);
  const years = Math.floor(days / 365);
  const months = Math.floor((days - years * 365) / 30);
  if (years > 0) return months ? `${years}y ${months}m` : `${years}y`;
  if (months > 0) return `${months}m ${days - months * 30}d`;
  return `${days}d`;
}

export interface YMDParts {
  years: number;
  months: number;
  days: number;
}

export function getChatSpanYMDParts(start: string | number, end: string | number): YMDParts | null {
  if (!start || !end) return null;

  let d1: Date;
  let d2: Date;

  if (typeof start === "number") {
    d1 = new Date(start);
  } else if (typeof start === "string" && start.includes("-") && !start.includes("T")) {
    const [y, m, d] = start.split("-").map(Number);
    d1 = new Date(y, m - 1, d);
  } else {
    d1 = new Date(start);
  }

  if (typeof end === "number") {
    d2 = new Date(end);
  } else if (typeof end === "string" && end.includes("-") && !end.includes("T")) {
    const [y, m, d] = end.split("-").map(Number);
    d2 = new Date(y, m - 1, d);
  } else {
    d2 = new Date(end);
  }

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

export function formatChatSpanYMD(start: string | number, end: string | number): string {
  if (!start || !end) return "—";
  const p = getChatSpanYMDParts(start, end);
  if (!p) return "—";

  const parts: string[] = [];
  if (p.years > 0) parts.push(`${p.years} ${p.years === 1 ? "year" : "years"}`);
  if (p.months > 0) parts.push(`${p.months} ${p.months === 1 ? "month" : "months"}`);
  if (p.days > 0 || parts.length === 0) parts.push(`${p.days} ${p.days === 1 ? "day" : "days"}`);

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]}, ${parts[1]}`;
  return `${parts[0]}, ${parts[1]} & ${parts[2]}`;
}



const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatDayKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  if (!y || !m || !d) return key;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function formatDayKeyShort(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  if (!y || !m || !d) return key;
  return `${(MONTHS[m - 1] ?? "").slice(0, 3)} ${d}, ${y}`;
}

export function formatMonthKey(key: string): string {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  return `${MONTHS[m - 1]} ${y}`;
}

export function formatMonthKeyShort(key: string): string {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  return `${(MONTHS[m - 1] ?? "").slice(0, 3)} ${`${y}`.slice(2)}`;
}

export function formatHour(hour: number | null): string {
  if (hour === null) return "—";
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

export function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

