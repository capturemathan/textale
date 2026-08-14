import { IconInfo } from "@/components/icons";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";

export function MetricHero({
  eyebrow,
  value,
  subtitle,
  format,
  onInfo,
}: {
  eyebrow: string;
  value: number;
  subtitle?: string;
  format?: (n: number) => string;
  onInfo?: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[34px] bg-[#24201D] p-6 text-[#FFFCF5] sm:p-9 shadow-[0_20px_40px_rgba(36,32,29,0.3)]">
      <div className="absolute -right-14 -top-20 size-72 rounded-full border border-[#FFECAE]/15" aria-hidden="true" />
      <div className="absolute -right-3 -top-9 size-48 rounded-full border border-[#F17141]/30" aria-hidden="true" />
      
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FFECAE]">
            {eyebrow}
          </p>
          {onInfo && (
            <button
              onClick={onInfo}
              className="grid size-7 shrink-0 place-items-center rounded-full text-[#BEB5AE] transition hover:bg-[#FFFCF5]/20 hover:text-[#FFECAE] cursor-pointer"
              aria-label={`Info about ${eyebrow}`}
              title="How we came up with this value"
            >
              <IconInfo className="size-4" />
            </button>
          )}
        </div>
        <div className="mt-4 text-[clamp(48px,7vw,92px)] font-extrabold leading-none tracking-[-0.08em] text-[#F17141]">
          <AnimatedNumber value={value} format={format} />
        </div>
        {subtitle && (
          <p className="mt-4 max-w-md text-[13px] leading-5 text-[#BEB5AE]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
