import { useState } from 'react';
import { useTexTale } from '@/store/textale-store';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { ChartBars } from '@/components/charts/ChartBars';
import { Reveal } from '@/components/common/Reveal';
import { DayDrawer } from '@/components/common/DayDrawer';
import { ChapterFooter } from '@/components/common/ChapterFooter';
import { formatNumber, formatPercent } from '@/lib/formatting';
import { IconClock } from '@/components/icons';
import type { ExplorerTab } from '@/components/explorer';

interface ActivityTabProps {
  onTabChange?: (tab: ExplorerTab) => void;
  onInfo?: (label: string) => void;
  onShare?: () => void;
}

export default function ActivityTab({ onTabChange, onInfo, onShare }: ActivityTabProps) {
  const { analysis } = useTexTale();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  if (!analysis) return null;

  const map = new Map(analysis.days.map((d) => [d.date, d.messages]));

  return (
    <div className="space-y-8 pb-20 w-full max-w-full overflow-hidden">
      <Reveal delay={0}>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
              <span className="size-1.5 rounded-full bg-[#F17141]" />
              Activity
            </div>
            <h2 className="text-balance text-[clamp(27px,4vw,43px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#24201D]">
              When did you talk the most?
            </h2>
            <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#766F69]">
              A calendar of message counts, plus the time patterns around them.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Overview Metrics Cards Row */}
      <Reveal delay={0.1}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard
            eyebrow="Busiest day"
            value={analysis.busiestDay?.date ?? '-'}
            subtitle={analysis.busiestDay ? `${formatNumber(analysis.busiestDay.messages)} msgs` : ''}
            onInfo={onInfo ? () => onInfo("Busiest day") : undefined}
          />
          <MetricCard
            eyebrow="Quietest day"
            value={analysis.quietestDay?.date ?? '-'}
            subtitle={analysis.quietestDay ? `${formatNumber(analysis.quietestDay.messages)} msgs` : ''}
            onInfo={onInfo ? () => onInfo("Quietest day") : undefined}
          />
          <MetricCard
            eyebrow="Weekend share"
            value={formatPercent(analysis.weekendShare)}
            subtitle="Saturday + Sunday messages"
            onInfo={onInfo ? () => onInfo("Weekend share") : undefined}
          />
          <MetricCard
            eyebrow="Peak hour"
            value={analysis.peakHour !== null ? `${analysis.peakHour}:00` : '-'}
            subtitle="Most active hour"
            onInfo={onInfo ? () => onInfo("Peak hour") : undefined}
          />
        </div>
      </Reveal>

      {/* Activity Calendar Box */}
      <Reveal delay={0.2}>
        <div className="rounded-[25px] border border-[#EDE2D6] bg-[#FFF9F0] p-6 sm:p-7 w-full max-w-full overflow-hidden shadow-sm">
          <ActivityHeatmap 
            data={map} 
            onDayClick={(date) => setSelectedDay(date)} 
            onInfo={onInfo ? () => onInfo("Activity calendar") : undefined}
            onShare={onShare}
          />
        </div>
      </Reveal>

      {/* 24-hour Volume Chart */}
      <Reveal delay={0.3}>
        <div className="rounded-[25px] border border-[#EDE2D6] bg-[#FFFCF5] p-6">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h3 className="text-[15px] font-extrabold">24-hour volume</h3>
              <p className="mt-1 text-[11px] text-[#766F69]">Message distribution throughout the day.</p>
            </div>
            <div className="flex items-center gap-2">
              <IconClock className="text-[#F17141] size-[17px]" />
              {onInfo && <MetricInfoButton onClick={() => onInfo("24-hour volume")} label="24-hour volume" />}
            </div>
          </div>
          <ChartBars 
            data={analysis.hours.map((val, i) => ({ label: `${i}h`, value: val }))} 
            showLabels
          />
        </div>
      </Reveal>
      
      {/* Time of Day Distribution */}
      <Reveal delay={0.4}>
        <div className="rounded-[25px] border border-[#EDE2D6] bg-[#FFF9F0] p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-[15px] font-extrabold">Time of day</h3>
              <p className="mt-1 text-[11px] text-[#766F69]">Fixed four-bucket distribution.</p>
            </div>
            {onInfo && <MetricInfoButton onClick={() => onInfo("Time of day")} label="Time of day" />}
          </div>
          <div className="space-y-4">
            {analysis.timeOfDay.map(tod => {
              const total = analysis.totalMessages || 1;
              const percent = (tod.count / total) * 100;
              return (
                <div key={tod.key}>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="font-bold">{tod.key}</span>
                    <span className="font-extrabold">{percent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#EDE2D6]">
                    <div className="h-full rounded-full bg-[#F17141]" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Day Details Slide-over Drawer */}
      <DayDrawer
        dayDate={selectedDay}
        analysis={analysis}
        onClose={() => setSelectedDay(null)}
      />

      {/* Storybook Chapter Progression Footer */}
      <ChapterFooter currentTab="Activity" onTabChange={onTabChange} />
    </div>
  );
}
