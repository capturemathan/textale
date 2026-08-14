import { useTexTale } from '@/store/textale-store';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { Donut } from '@/components/charts/Donut';
import { ChartBars } from '@/components/charts/ChartBars';
import { Reveal } from '@/components/common/Reveal';
import { formatNumber, formatDuration } from '@/lib/formatting';
import { IconActivity } from '@/components/icons';

const PALETTE = ['#F17141', '#F8C777', '#6C4E2A', '#3C3530', '#D95F31', '#B4A99D', '#E6D3AE', '#806641'];

interface ConversationsTabProps {
  onInfo?: (label: string) => void;
}

export default function ConversationsTab({ onInfo }: ConversationsTabProps) {
  const { analysis } = useTexTale();
  if (!analysis) return null;

  const sortedParticipants = [...analysis.participants].sort((a, b) => {
    const initA = analysis.byParticipant[a.id]?.initiations ?? analysis.byParticipant[a.name]?.initiations ?? 0;
    const initB = analysis.byParticipant[b.id]?.initiations ?? analysis.byParticipant[b.name]?.initiations ?? 0;
    return initB - initA;
  });

  const initSegments = sortedParticipants.map((p, i) => ({
    label: p.name,
    value: analysis.byParticipant[p.id]?.initiations ?? analysis.byParticipant[p.name]?.initiations ?? 0,
    color: PALETTE[i % PALETTE.length],
  }));

  const totalInitiations = initSegments.reduce((sum, s) => sum + s.value, 0) || 1;
  const monthlySessions = analysis.months.slice(-12);

  return (
    <div className="space-y-8 pb-20">
      <Reveal delay={0}>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
              <span className="size-1.5 rounded-full bg-[#F17141]" />
              Conversations
            </div>
            <h2 className="text-balance text-[clamp(27px,4vw,43px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#24201D]">
              How you talk.
            </h2>
            <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#766F69]">
              Sessions, reply speeds, bursts, and who starts the chat.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            eyebrow="Total conversations"
            value={formatNumber(analysis.sessionCount)}
            onInfo={onInfo ? () => onInfo("Conversation count") : undefined}
          />
          <MetricCard
            eyebrow="Average messages"
            value={formatNumber(analysis.averageSessionMessages, 1)}
            subtitle="Per session"
            onInfo={onInfo ? () => onInfo("Average session") : undefined}
          />
          <MetricCard
            eyebrow="Average reply"
            value={formatDuration(analysis.averageResponseMs)}
            subtitle="Mean turn interval"
            onInfo={onInfo ? () => onInfo("Average reply") : undefined}
          />
          <MetricCard
            eyebrow="Longest gap"
            value={formatDuration(analysis.longestResponse?.ms)}
            subtitle="Between turn runs"
            onInfo={onInfo ? () => onInfo("Longest gap") : undefined}
          />
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-8 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[25px] border border-[#EDE2D6] bg-[#FFF9F0] p-6">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-[15px] font-extrabold">Who starts it?</h3>
              {onInfo && <MetricInfoButton onClick={() => onInfo("Who starts it?")} label="Who starts it?" />}
            </div>
            <div className="flex flex-col items-center gap-8 sm:flex-row">
              <Donut segments={initSegments} />
              <div className="w-full space-y-4 max-h-[320px] overflow-y-auto pr-1.5 custom-scrollbar">
                {sortedParticipants.map((p, i) => {
                  const init = analysis.byParticipant[p.id]?.initiations ?? analysis.byParticipant[p.name]?.initiations ?? 0;
                  const pct = (init / totalInitiations) * 100;
                  const color = PALETTE[i % PALETTE.length];
                  return (
                    <div key={p.id} className="flex justify-between items-center text-[12px]">
                      <span className="font-bold flex items-center gap-2 truncate pr-2 text-[#24201D]">
                        <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="truncate">{p.name}</span>
                      </span>
                      <span className="font-extrabold shrink-0">{pct.toFixed(1)}% ({formatNumber(init)})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="rounded-[25px] border border-[#EDE2D6] bg-[#FFFCF5] p-6">
            <div className="mb-7 flex items-start justify-between">
              <div>
                <h3 className="text-[15px] font-extrabold">Monthly sessions</h3>
              </div>
              <div className="flex items-center gap-2">
                <IconActivity className="text-[#F17141] size-[17px]" />
                {onInfo && <MetricInfoButton onClick={() => onInfo("Conversation count")} label="Monthly sessions" />}
              </div>
            </div>
            <ChartBars 
              data={monthlySessions.map(item => ({ label: item.key.slice(5), value: item.count }))} 
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-8 rounded-[25px] border border-[#EDE2D6] bg-[#FFF9F0] p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[15px] font-extrabold">Message burst sizes</h3>
            {onInfo && <MetricInfoButton onClick={() => onInfo("Burst distribution")} label="Message burst sizes" />}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {analysis.burstDistribution.map(b => (
              <div key={b.key} className="rounded-2xl border border-[#EDE2D6] bg-[#FFFCF5] p-4 text-center">
                <div className="text-[20px] font-extrabold text-[#24201D]">{formatNumber(b.count)}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#766F69]">{b.key} msgs</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
