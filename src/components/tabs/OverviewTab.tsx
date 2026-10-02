import { useTexTale } from '@/store/textale-store';
import { MetricHero } from '@/components/metrics/MetricHero';
import { MetricCard } from '@/components/metrics/MetricCard';
import { Donut } from '@/components/charts/Donut';
import { ChartBars } from '@/components/charts/ChartBars';
import { Reveal } from '@/components/common/Reveal';
import { formatNumber, formatSpan } from '@/lib/formatting';
import { IconBarChart } from '@/components/icons';
import type { ExplorerTab } from '@/components/explorer';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { ChapterFooter } from '@/components/common/ChapterFooter';

interface OverviewTabProps {
  onTabChange?: (tab: ExplorerTab) => void;
  onInfo?: (label: string) => void;
}

const PALETTE = ['#F17141', '#F8C777', '#6C4E2A', '#3C3530', '#D95F31', '#B4A99D', '#E6D3AE', '#806641'];

export default function OverviewTab({ onTabChange, onInfo }: OverviewTabProps) {
  const { analysis } = useTexTale();
  if (!analysis) return null;

  const monthly = analysis.months.slice(-12);
  const monthLabels = monthly.map((item) => item.key.slice(5));

  return (
    <div className="space-y-10 pb-20">
      <Reveal delay={0}>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
              <span className="size-1.5 rounded-full bg-[#F17141]" />
              The big picture
            </div>
            <h2 className="text-balance text-[clamp(27px,4vw,43px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#24201D]">
              Every message tells a story.
            </h2>
            <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#766F69]">
              A factual overview of the messages, words, days, and conversations in this export.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#FFECAE] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#6C4E2A]">
            {analysis.days[0]?.date ?? "No dates"} → {analysis.days.at(-1)?.date ?? "present"}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <MetricHero 
          eyebrow="Messages counted"
          value={analysis.totalMessages}
          subtitle={`Across ${formatNumber(analysis.sessionCount)} conversation sessions and ${formatNumber(analysis.activeDays)} active calendar days.`}
          format={formatNumber}
          onInfo={onInfo ? () => onInfo("Messages counted") : undefined}
        />
      </Reveal>

      <Reveal delay={0.2}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            eyebrow="Total words"
            value={formatNumber(analysis.totalWords)}
            subtitle="Unicode-aware word count"
            onInfo={onInfo ? () => onInfo("Total words") : undefined}
          />
          <MetricCard
            eyebrow="Active days"
            value={formatNumber(analysis.activeDays)}
            subtitle="Unique calendar dates"
            onInfo={onInfo ? () => onInfo("Active days") : undefined}
          />
          <MetricCard
            eyebrow="Conversation count"
            value={formatNumber(analysis.sessionCount)}
            subtitle="Using a 30 minute gap"
            onInfo={onInfo ? () => onInfo("Conversation count") : undefined}
          />
          <MetricCard
            eyebrow="Chat span"
            value={formatSpan(analysis.chatSpanMs)}
            subtitle="Time between first and last message"
            onInfo={onInfo ? () => onInfo("Chat span") : undefined}
          />
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[25px] border border-[#EDE2D6] bg-[#FFF9F0] p-6">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h3 className="text-[15px] font-extrabold">Message share</h3>
                <p className="mt-1 text-[11px] text-[#766F69]">Count of messages by participant.</p>
              </div>
              {onInfo && <MetricInfoButton onClick={() => onInfo("Message share")} label="Message share" />}
            </div>
            <div className="flex flex-col items-center gap-8 sm:flex-row">
              {(() => {
                const sortedParticipants = [...analysis.participants].sort((a, b) => b.messageCount - a.messageCount);
                return (
                  <>
                    <Donut 
                      segments={sortedParticipants.map((p, i) => ({
                        label: p.name,
                        value: p.messageCount,
                        color: PALETTE[i % PALETTE.length],
                      }))} 
                    />
                    <div className="w-full space-y-4 max-h-[320px] overflow-y-auto pr-1.5 custom-scrollbar">
                      {sortedParticipants.map((participant, index) => {
                        const share = analysis.byParticipant[participant.id]?.messageShare ?? 
                                      (analysis.totalMessages > 0 ? (participant.messageCount / analysis.totalMessages) * 100 : 0);
                        const color = PALETTE[index % PALETTE.length];

                        return (
                          <div key={participant.id}>
                            <div className="flex items-center justify-between text-[12px]">
                              <span className="flex items-center gap-2 font-bold truncate pr-2">
                                <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                <span className="truncate">{participant.name}</span>
                              </span>
                              <span className="font-extrabold shrink-0">{share.toFixed(1)}% · {formatNumber(participant.messageCount)}</span>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-[#EDE2D6] overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${share}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
          
          <div className="rounded-[25px] border border-[#EDE2D6] bg-[#FFFCF5] p-6">
            <div className="mb-7 flex items-start justify-between">
              <div>
                <h3 className="text-[15px] font-extrabold">The shape of activity</h3>
                <p className="mt-1 text-[11px] text-[#766F69]">Messages by month.</p>
              </div>
              <div className="flex items-center gap-2">
                <IconBarChart className="text-[#F17141] size-[17px]" />
                {onInfo && <MetricInfoButton onClick={() => onInfo("24-hour volume")} label="The shape of activity" />}
              </div>
            </div>
            <ChartBars 
              data={monthly.map((item, i) => ({ label: monthLabels[i], value: item.count }))} 
            />
          </div>
        </div>
      </Reveal>

      {/* Storybook Chapter Progression Footer */}
      <ChapterFooter currentTab="Overview" onTabChange={onTabChange} />
    </div>
  );
}
