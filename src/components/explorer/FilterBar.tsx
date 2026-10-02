import { useMemo } from "react";
import { useTexTale } from "@/store/textale-store";
import { IconFilter, IconReset, IconShare } from "@/components/icons";
import type { ExplorerTab } from "./index";

function toInputDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;
}

function formatDayKeyShort(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function FilterBar({
  activeTab,
  shareLabel,
  onShare,
}: {
  activeTab: ExplorerTab;
  shareLabel?: string;
  onShare?: () => void;
}) {
  const { analysis, filter, setFilter, participants, recomputing, allTimeBounds } = useTexTale();

  const bounds = useMemo(() => {
    if (allTimeBounds) return allTimeBounds;
    if (!analysis) return null;
    return { from: analysis.firstTimestamp, to: analysis.lastTimestamp };
  }, [allTimeBounds, analysis]);

  if (!bounds) return null;
  const active = filter.participant !== undefined || filter.from !== undefined || filter.to !== undefined;

  const canShare = true;

  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#EADFD5] pb-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#A59A90] sm:flex">
          <IconFilter className="size-3.5" />
          Filter
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={filter.participant ?? ""}
            onChange={(e) => setFilter({ ...filter, participant: e.target.value || undefined })}
            className="rounded-full border border-[#EADFD5] bg-[#FFFCF5] px-3.5 py-2 text-[12px] font-bold text-[#4E4640] outline-none transition focus:border-[#F17141] hover:bg-[#FFF8EA]"
            aria-label="Participant filter"
          >
            <option value="">Everyone</option>
            {participants.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-1.5 rounded-full border border-[#EADFD5] bg-[#FFFCF5] px-1.5 py-1 transition focus-within:border-[#F17141] hover:bg-[#FFF8EA]">
            <input
              type="date"
              value={toInputDate(filter.from ?? bounds.from)}
              min={toInputDate(bounds.from)}
              max={toInputDate(bounds.to)}
              onChange={(e) =>
                setFilter({ ...filter, from: e.target.value ? new Date(`${e.target.value}T00:00:00`).getTime() : undefined })
              }
              className="bg-transparent px-2 py-1 text-[12px] font-bold text-[#4E4640] outline-none [color-scheme:light] cursor-pointer"
              title="Start date"
            />
            <span className="text-[12px] font-bold text-[#A59A90]">-</span>
            <input
              type="date"
              value={toInputDate(filter.to ?? bounds.to)}
              min={toInputDate(bounds.from)}
              max={toInputDate(bounds.to)}
              onChange={(e) =>
                setFilter({ ...filter, to: e.target.value ? new Date(`${e.target.value}T23:59:59`).getTime() : undefined })
              }
              className="bg-transparent px-2 py-1 text-[12px] font-bold text-[#4E4640] outline-none [color-scheme:light] cursor-pointer"
              title="End date"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {recomputing && (
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#F17141] animate-pulse">
            Recalculating...
          </span>
        )}
        
        {active ? (
          <button
            onClick={() => setFilter({})}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#EADFD5] bg-[#FFFCF5] px-3.5 py-2 text-[12px] font-bold text-[#766F69] transition hover:border-[#F17141]/40 hover:bg-[#FFF4E4] hover:text-[#F17141]"
          >
            <IconReset className="size-3.5" />
            Reset
          </button>
        ) : (
          <span className="hidden text-[11px] font-bold text-[#A59A90] lg:inline-block">
            {formatDayKeyShort(toInputDate(bounds.from))} → {formatDayKeyShort(toInputDate(bounds.to))}
          </span>
        )}
        
        {onShare && canShare && (
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 rounded-full bg-[#F17141] px-4 py-2 text-[12px] font-extrabold text-[#FFFCF5] shadow-[0_8px_20px_rgba(241,113,65,0.2)] transition hover:-translate-y-0.5 hover:bg-[#e76537] cursor-pointer"
          >
            <IconShare className="size-[14px]" />
            {shareLabel ?? `Share ${activeTab}`}
          </button>
        )}
      </div>
    </div>
  );
}
