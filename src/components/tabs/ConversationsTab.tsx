import { useTexTale } from '@/store/textale-store';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { Donut } from '@/components/charts/Donut';
import { ChartBars } from '@/components/charts/ChartBars';
import { Reveal } from '@/components/common/Reveal';
import { ChapterFooter } from '@/components/common/ChapterFooter';
import {
  formatNumber,
  formatDuration,
  formatSessionDate,
  formatSessionTimeRange,
  formatMessageDateTime,
  isMultiDaySession,
  getDaysDifference,
} from '@/lib/formatting';
import { IconActivity } from '@/components/icons';
import type { ExplorerTab } from '@/components/explorer';

const PALETTE = ['#F17141', '#F8C777', '#6C4E2A', '#3C3530', '#D95F31', '#B4A99D', '#E6D3AE', '#806641'];

interface ConversationsTabProps {
  onTabChange?: (tab: ExplorerTab) => void;
  onInfo?: (label: string) => void;
}

export default function ConversationsTab({ onTabChange, onInfo }: ConversationsTabProps) {
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

  const longestSession = analysis.longestSession;
  const isMultiDay = longestSession ? isMultiDaySession(longestSession.start, longestSession.end) : false;
  const daysDiff = longestSession ? getDaysDifference(longestSession.start, longestSession.end) : 0;

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

      {/* Longest Conversation Spotlight Card */}
      {longestSession && (
        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-[26px] bg-[#24201D] text-[#FFFCF5] p-6 sm:p-8 relative">
            <div className="absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/3 rounded-full border-[40px] border-[#3C3530]/50 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[#F17141]" />
                      All-Time Highlight
                    </span>
                    {isMultiDay && (
                      <span className="rounded-full bg-[#F8C777]/20 border border-[#F8C777]/35 px-2.5 py-0.5 text-[9px] font-extrabold text-[#F8C777] tracking-normal lowercase first-letter:uppercase">
                        🌙 spans {daysDiff + 1} calendar days (cross-midnight)
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 text-[22px] font-extrabold tracking-tight sm:text-[26px]">
                    Longest single conversation
                  </h3>
                  <p className="mt-1 text-[13px] text-[#A59A90]">
                    The most continuous run of conversation in your chat history.
                  </p>
                </div>
                {onInfo && (
                  <MetricInfoButton
                    onClick={() => onInfo("Longest conversation")}
                    label="Longest conversation"
                    className="hover:bg-[#FFFCF5]/20 hover:text-[#FFECAE]"
                  />
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-[#3C3530]/50 p-4 border border-[#FFFCF5]/10">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#A59A90]">Duration</div>
                  <div className="mt-1 text-[28px] font-extrabold text-[#F17141] leading-none">
                    {formatDuration(longestSession.durationMs)}
                  </div>
                  <div className="mt-1 text-[11px] text-[#BEB5AE]">continuous chat</div>
                </div>

                <div className="rounded-2xl bg-[#3C3530]/50 p-4 border border-[#FFFCF5]/10">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#A59A90]">Messages</div>
                  <div className="mt-1 text-[28px] font-extrabold text-[#FFFCF5] leading-none">
                    {formatNumber(longestSession.messageCount)}
                  </div>
                  <div className="mt-1 text-[11px] text-[#BEB5AE]">exchanged in this run</div>
                </div>

                <div className="rounded-2xl bg-[#3C3530]/50 p-4 border border-[#FFFCF5]/10">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#A59A90]">Date</div>
                  <div className="mt-1 text-[17px] font-extrabold text-[#FFFCF5] leading-snug">
                    {formatSessionDate(longestSession.start, longestSession.end)}
                  </div>
                  <div className="mt-1 text-[11px] text-[#BEB5AE]">
                    {isMultiDay ? `across ${daysDiff + 1} days` : 'calendar date'}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#3C3530]/50 p-4 border border-[#FFFCF5]/10">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#A59A90]">Time Range</div>
                  <div className="mt-1 text-[17px] font-extrabold text-[#FFECAE] leading-snug">
                    {formatSessionTimeRange(longestSession.start, longestSession.end)}
                  </div>
                  <div className="mt-1 text-[11px] text-[#BEB5AE]">
                    Started by <span className="text-[#FFFCF5] font-bold">{longestSession.initiator}</span>
                  </div>
                </div>
              </div>

              {/* First & Last Message Previews */}
              {(longestSession.firstMessage || longestSession.lastMessage) && (
                <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-[#FFFCF5]/10">
                  {longestSession.firstMessage && (
                    <div className="rounded-2xl bg-[#FFFCF5]/5 p-4 border border-[#FFFCF5]/10">
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-[#A59A90] uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1.5 text-[#F17141]">
                          <span className="size-1.5 rounded-full bg-[#F17141]" />
                          First Message
                        </span>
                        <span className="text-[#BEB5AE]">
                          {formatMessageDateTime(longestSession.firstMessage.timestamp, isMultiDay)}
                        </span>
                      </div>
                      <div className="text-[12px] font-bold text-[#FFECAE] mb-1">
                        {longestSession.firstMessage.sender}
                      </div>
                      <p className="text-[13px] italic leading-relaxed text-[#FFFCF5]/90">
                        "{longestSession.firstMessage.text}"
                      </p>
                    </div>
                  )}

                  {longestSession.lastMessage && (
                    <div className="rounded-2xl bg-[#FFFCF5]/5 p-4 border border-[#FFFCF5]/10">
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-[#A59A90] uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1.5 text-[#F8C777]">
                          <span className="size-1.5 rounded-full bg-[#F8C777]" />
                          Last Message
                        </span>
                        <span className="text-[#BEB5AE]">
                          {formatMessageDateTime(longestSession.lastMessage.timestamp, isMultiDay)}
                        </span>
                      </div>
                      <div className="text-[12px] font-bold text-[#FFECAE] mb-1">
                        {longestSession.lastMessage.sender}
                      </div>
                      <p className="text-[13px] italic leading-relaxed text-[#FFFCF5]/90">
                        "{longestSession.lastMessage.text}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      )}

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

      {/* Storybook Chapter Progression Footer */}
      <ChapterFooter currentTab="Conversations" onTabChange={onTabChange} />
    </div>
  );
}
