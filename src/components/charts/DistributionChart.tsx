import { motion, useReducedMotion } from "motion/react";


export function DistributionChart({
  buckets,
  color = "#F17141",
}: {
  buckets: { label: string; value: number; percentage?: number }[];
  color?: string;
}) {
  const reduced = useReducedMotion();
  const max = buckets.reduce((m, b) => Math.max(m, b.value), 0) || 1;
  const total = buckets.reduce((m, b) => m + b.value, 0) || 1;

  return (
    <div className="space-y-4">
      {buckets.map((bucket, i) => {
        const percentage = bucket.percentage ?? (bucket.value / total) * 100;
        
        return (
          <div key={bucket.label} className="grid grid-cols-[minmax(80px,25%)_1fr_auto] items-center gap-4 text-[12px]">
            <span className="font-bold text-[#24201D] truncate">{bucket.label}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-[#F3EBE2]">
              <motion.span
                className="block h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={reduced ? { width: `${(bucket.value / max) * 100}%` } : { width: 0 }}
                whileInView={{ width: `${(bucket.value / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.05 }}
              />
            </span>
            <span className="font-semibold text-[#766F69] tabular-nums">
              {bucket.value.toLocaleString()} · {percentage.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
