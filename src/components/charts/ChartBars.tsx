import { motion, useReducedMotion } from "motion/react";


export function ChartBars({
  data,
  height = 160,
  showLabels = true,
  animate = true,
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showLabels?: boolean;
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const max = data.reduce((m, d) => Math.max(m, d.value), 0) || 1;
  const shouldAnimate = animate && !reduced;

  return (
    <div
      className="flex items-end gap-1.5 border-b border-[#EDE2D6] px-1"
      style={{ height: height }}
    >
      {data.map((item, index) => {
        const barHeight = Math.max(7, (item.value / max) * (height - 30)); // Reserve 30px for labels
        const color = item.color || "#F17141";
        
        return (
          <div key={`${item.label}-${index}`} className="group flex h-full flex-1 flex-col justify-end">
            <div className="relative flex flex-col justify-end items-center w-full h-full">
              <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-[#24201D] px-1.5 py-1 text-[9px] font-bold text-[#FFFCF5] group-hover:block z-10 whitespace-nowrap">
                {item.value}
              </span>
              <motion.div
                className="w-full rounded-t-[5px] transition-opacity group-hover:opacity-75 origin-bottom"
                style={{
                  height: `${barHeight}px`,
                  background: color,
                  opacity: 0.36 + (index % 4) * 0.15,
                }}
                initial={shouldAnimate ? { scaleY: 0 } : { scaleY: 1 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: shouldAnimate ? index * 0.03 : 0 }}
              />
            </div>
            {showLabels && (
              <span className="mt-3 truncate text-center text-[8px] font-bold uppercase tracking-[.1em] text-[#B4A99D]">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
