import { IconInfo } from "@/components/icons";

export function MetricInfoButton({
  onClick,
  label,
  className = "",
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Methodology details for ${label}`}
      title="How we calculated this metric"
      className={`grid size-7 shrink-0 place-items-center rounded-full bg-[#24201D]/5 hover:bg-[#FFECAE] text-[#4A423B] hover:text-[#F17141] transition-all border border-[#24201D]/15 hover:border-[#F17141]/35 cursor-pointer shadow-2xs ${className}`}
    >
      <IconInfo className="size-4" />
    </button>
  );
}
