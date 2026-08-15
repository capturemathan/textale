import { IconInfo } from "@/components/icons";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { HoverLift } from "@/components/common/HoverLift";

export function MetricCard({
  eyebrow,
  value,
  subtitle,
  format,
  onInfo,
}: {
  eyebrow: string;
  value: number | string;
  subtitle?: string;
  format?: (n: number) => string;
  onInfo?: () => void;
}) {
  return (
    <HoverLift className="relative group">
      <div className="flex h-full flex-col justify-between gap-4 rounded-[26px] border border-[#EDE2D6] bg-[#FFFCF5] p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
            {eyebrow}
          </p>
          {onInfo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInfo();
              }}
              className="grid size-7 shrink-0 place-items-center rounded-full bg-[#24201D]/5 border border-[#24201D]/15 text-[#4A423B] transition-all hover:bg-[#FFECAE] hover:text-[#F17141] hover:border-[#F17141]/35 cursor-pointer shadow-2xs"
              aria-label={`Info about ${eyebrow}`}
              title="How we calculated this metric"
            >
              <IconInfo className="size-4" />
            </button>
          )}
        </div>
        
        <div>
          <div className="text-[28px] font-extrabold tracking-[-0.06em] text-[#24201D]">
            {typeof value === "number" ? (
              <AnimatedNumber value={value} format={format} />
            ) : (
              value
            )}
          </div>
          {subtitle && (
            <div className="mt-1.5 text-[13px] text-[#766F69]">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </HoverLift>
  );
}
