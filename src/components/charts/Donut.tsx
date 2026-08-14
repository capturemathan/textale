export function Donut({
  segments,
  size = 160,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  
  let currentPercentage = 0;
  const gradientStops = segments.map(segment => {
    const percentage = (segment.value / total) * 100;
    const stop = `${segment.color} ${currentPercentage}% ${currentPercentage + percentage}%`;
    currentPercentage += percentage;
    return stop;
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        className="relative shrink-0" 
        style={{ width: size, height: size }}
      >
        <div 
          className="absolute inset-0 rounded-full" 
          style={{ 
            background: `conic-gradient(${gradientStops.join(', ')})` 
          }} 
        />
        <div className="absolute inset-5 grid place-items-center rounded-full bg-[#FFFCF5] text-center shadow-inner">
          <div className="flex flex-col">
            <span className="text-[25px] font-extrabold tracking-[-.07em] text-[#24201D]">
              {total.toLocaleString()}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[.13em] text-[#A59A90]">
              Total
            </span>
          </div>
        </div>
      </div>
      
      <div className="w-full space-y-4">
        {segments.map((segment) => {
          const percentage = ((segment.value / total) * 100).toFixed(1);
          return (
            <div key={segment.label}>
              <div className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-2 font-bold text-[#24201D]">
                  <span 
                    className="size-2.5 rounded-full" 
                    style={{ backgroundColor: segment.color }}
                  />
                  {segment.label}
                </span>
                <span className="font-extrabold text-[#24201D]">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
