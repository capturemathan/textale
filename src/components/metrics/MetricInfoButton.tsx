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
      title="How we came up with this value"
      className={`grid size-6 shrink-0 place-items-center rounded-full text-[#A59A90] transition hover:bg-[#FFECAE] hover:text-[#F17141] cursor-pointer ${className}`}
    >
      <IconInfo className="size-4" />
    </button>
  );
}
