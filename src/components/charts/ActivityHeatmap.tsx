import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { MetricInfoButton } from "@/components/metrics/MetricInfoButton";
import { IconShare } from "@/components/icons";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function levelOf(count: number, max: number): number {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio >= 0.75) return 4;
  if (ratio >= 0.45) return 3;
  if (ratio >= 0.20) return 2;
  return 1;
}

const LEVEL_COLORS = [
  "#F3EBE2", // 0 messages
  "#FFECAE", // < 20%
  "#F8C777", // < 45%
  "#F5935C", // < 75%
  "#F17141", // >= 75%
];

export type RangeOption = "3m" | "6m" | "1y" | "all";

export function ActivityHeatmap({
  data,
  onDayClick,
  onInfo,
  onShare,
}: {
  data: Map<string, number>; // YYYY-MM-DD -> count
  onDayClick?: (date: string, count: number) => void;
  onInfo?: () => void;
  onShare?: () => void;
}) {
  const reduced = useReducedMotion();
  const [range, setRange] = useState<RangeOption>("3m");

  const { columns, max, activeCount, startDateStr, endDateStr } = useMemo(() => {
    const dates = Array.from(data.keys()).sort();
    const maxCount = Array.from(data.values()).reduce((m, c) => Math.max(m, c), 0) || 1;
    
    if (dates.length === 0) {
      return { columns: [] as (string | null)[][], max: maxCount, activeCount: 0, startDateStr: "", endDateStr: "" };
    }

    const lastDateStr = dates[dates.length - 1];
    const lastDate = new Date(`${lastDateStr}T00:00:00`);

    let targetWeeks = 13; // default 3m (13 weeks)
    if (range === "6m") targetWeeks = 26;
    if (range === "1y") targetWeeks = 52;
    if (range === "all") {
      const firstDate = new Date(`${dates[0]}T00:00:00`);
      const diffMs = lastDate.getTime() - firstDate.getTime();
      targetWeeks = Math.max(13, Math.ceil(diffMs / (7 * 86400000)) + 1);
    }

    // Calculate start date based on targetWeeks going backwards from lastDate
    const firstDate = new Date(lastDate);
    if (range !== "all") {
      firstDate.setDate(firstDate.getDate() - (targetWeeks * 7 - 1));
    } else {
      firstDate.setTime(new Date(`${dates[0]}T00:00:00`).getTime());
    }

    // Adjust to Monday
    const start = new Date(firstDate);
    const dayOfWeek = start.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    start.setDate(start.getDate() - diffToMonday);

    const cols: (string | null)[][] = [];
    let cursor = new Date(start);
    let active = 0;

    for (let w = 0; w < targetWeeks; w++) {
      const week: (string | null)[] = [];
      for (let d = 0; d < 7; d++) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
        const isValid = cursor >= firstDate && cursor <= lastDate;
        week.push(isValid ? key : null);
        if (isValid && data.has(key)) active++;
        cursor.setDate(cursor.getDate() + 1);
      }
      cols.push(week);
    }

    const startStr = `${firstDate.getFullYear()}-${String(firstDate.getMonth() + 1).padStart(2, "0")}-${String(firstDate.getDate()).padStart(2, "0")}`;
    return { columns: cols, max: maxCount, activeCount: active, startDateStr: startStr, endDateStr: lastDateStr };
  }, [data, range]);

  return (
    <div className="w-full">
      {/* Header with Title & Range Control Pills */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-extrabold text-[#24201D]">Activity calendar</h3>
          <p className="mt-0.5 text-[11px] text-[#766F69]">
            Click any square to view metrics ({activeCount} active days shown)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Range Selector Pills */}
          <div className="inline-flex items-center rounded-full bg-[#EDE2D6]/60 p-1 text-[10px] font-extrabold">
            {(
              [
                { id: "3m", label: "3 Months" },
                { id: "6m", label: "6 Months" },
                { id: "1y", label: "1 Year" },
                { id: "all", label: "All" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setRange(item.id)}
                className={`rounded-full px-2.5 py-1 transition-all cursor-pointer ${
                  range === item.id
                    ? "bg-[#F17141] text-[#FFFCF5] shadow-sm"
                    : "text-[#766F69] hover:text-[#24201D]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {onInfo && <MetricInfoButton onClick={onInfo} label="Activity calendar" />}

          {onShare && (
            <button
              onClick={onShare}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#F17141] px-3.5 py-1.5 text-[11px] font-extrabold text-[#FFFCF5] shadow-[0_6px_16px_rgba(241,113,65,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e76537] cursor-pointer"
            >
              <IconShare className="size-3.5" />
              Share Activity
            </button>
          )}
        </div>
      </div>

      {/* Heatmap Grid Wrapper */}
      <div className="w-full overflow-x-auto pb-2">
        {/* Month Labels Header */}
        <div className="flex gap-1.5 mb-2 pl-5 sm:pl-6 min-w-max">
          {columns.map((week, wi) => {
            const firstDayKey = week.find((d) => d !== null);
            if (!firstDayKey) return <div key={wi} className="w-3.5 sm:w-4" />;
            
            const date = new Date(`${firstDayKey}T00:00:00`);
            const isFirstWeekOfMonth = date.getDate() <= 7 || wi === 0;
            
            return (
              <div key={wi} className="w-3.5 sm:w-4 relative">
                {isFirstWeekOfMonth && (
                  <span className="absolute -top-4 left-0 text-[9px] font-extrabold text-[#806641] uppercase tracking-[0.1em]">
                    {date.toLocaleString("default", { month: "short" })}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid: Weekdays + Tiles */}
        <div className="flex gap-1.5 min-w-max">
          <div className="flex flex-col gap-1.5 justify-between py-0.5 pr-1 text-[9px] font-extrabold text-[#B4A99D]">
            {WEEKDAYS.map((initial, i) => (
              <span key={i} className="size-3.5 sm:size-4 flex items-center justify-center">
                {initial}
              </span>
            ))}
          </div>

          {columns.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1.5">
              {week.map((key, di) => {
                if (!key) {
                  return <span key={di} className="size-3.5 sm:size-4 rounded-[3px] bg-[#F3EBE2]/40" />;
                }
                const count = data.get(key) || 0;
                const level = levelOf(count, max);
                const color = LEVEL_COLORS[level];
                
                return (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => onDayClick?.(key, count)}
                    className="size-3.5 sm:size-4 rounded-[3px] transition-all duration-150 hover:scale-125 hover:z-20 hover:ring-2 hover:ring-[#F17141]/70 focus-visible:ring-2 focus-visible:ring-[#F17141] focus-visible:outline-none cursor-pointer"
                    style={{ backgroundColor: color }}
                    initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.15, delay: reduced ? 0 : Math.min(0.4, wi * 0.008) }}
                    title={`${key} · ${count.toLocaleString()} messages (click for details)`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-[#A59A90] uppercase tracking-[0.12em]">
        <span>{startDateStr && endDateStr ? `${startDateStr} to ${endDateStr}` : ""}</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {LEVEL_COLORS.map((color, i) => (
            <span key={i} className="size-2.5 rounded-[2px]" style={{ backgroundColor: color }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
