import { useState, useMemo, useEffect } from 'react';
import posthog from 'posthog-js';
import { useTexTale } from '@/store/textale-store';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { Donut } from '@/components/charts/Donut';
import { ChartBars } from '@/components/charts/ChartBars';
import { Reveal } from '@/components/common/Reveal';
import { ChapterFooter } from '@/components/common/ChapterFooter';
import {
  formatNumber,
  formatPercent,
  formatDuration,
  formatSessionDate,
  formatSessionTimeRange,
  formatMessageDateTime,
  isMultiDaySession,
  getDaysDifference,
} from '@/lib/formatting';
import { cn } from '@/lib/utils';
import { IconActivity, IconMessageCircle, IconUsers, IconShare } from '@/components/icons';
import type { ExplorerTab } from '@/components/explorer';
import type { Analysis, Participant } from '@/types';

const PALETTE = ['#F17141', '#F8C777', '#6C4E2A', '#3C3530', '#D95F31', '#B4A99D', '#E6D3AE', '#806641'];

export type ConversationsSubView = 'sessions' | 'compare';

interface ConversationsTabProps {
  onTabChange?: (tab: ExplorerTab) => void;
  onInfo?: (label: string) => void;
  onShare?: () => void;
  comparePair?: [string, string] | null;
  onComparePairChange?: (pair: [string, string]) => void;
  activeSubView?: ConversationsSubView;
  onSubViewChange?: (subView: ConversationsSubView) => void;
}

// Compare stats helper
function statsFor(analysis: Analysis, participant: Participant) {
  const entry = analysis.byParticipant[participant.id] ?? analysis.byParticipant[participant.name];
  return {
    messageShare: entry?.messageShare ?? 0,
    wordShare: entry?.wordShare ?? 0,
    emojis: entry?.emojis ?? 0,
    questions: entry?.questions ?? 0,
    initiations: entry?.initiations ?? 0,
    firstOfDay: entry?.firstOfDay ?? 0,
    medianResponseMs: entry?.medianResponseMs ?? null,
  };
}

interface DuelRow {
  label: string;
  infoLabel?: string;
  lowerWins?: boolean;
  getValue: (stats: ReturnType<typeof statsFor>) => number | null;
  format: (value: number | null) => string;
}

const DUEL_ROWS: DuelRow[] = [
  { label: 'Messages sent', getValue: (s) => s.messageShare, format: (v) => formatPercent(v ?? 0) },
  { label: 'Words typed', getValue: (s) => s.wordShare, format: (v) => formatPercent(v ?? 0) },
  { label: 'Conversations started', infoLabel: 'Initiations', getValue: (s) => s.initiations, format: (v) => formatNumber(v ?? 0) },
  { label: 'First to text (daily)', infoLabel: 'First Of Day', getValue: (s) => s.firstOfDay, format: (v) => formatNumber(v ?? 0) },
  { label: 'Reply speed', infoLabel: 'Median Response Time', getValue: (s) => s.medianResponseMs, format: (v) => (v === null ? '—' : formatDuration(v)), lowerWins: true },
  { label: 'Emojis used', getValue: (s) => s.emojis, format: (v) => formatNumber(v ?? 0) },
  { label: 'Questions asked', getValue: (s) => s.questions, format: (v) => formatNumber(v ?? 0) },
];

export default function ConversationsTab({
  onTabChange,
  onInfo,
  onShare,
  comparePair,
  onComparePairChange,
  activeSubView: controlledSubView,
  onSubViewChange,
}: ConversationsTabProps) {
  const { analysis, participants } = useTexTale();
  const [internalSubView, setInternalSubView] = useState<ConversationsSubView>('sessions');

  const subView = controlledSubView ?? internalSubView;
  const setSubView = (sv: ConversationsSubView) => {
    if (onSubViewChange) onSubViewChange(sv);
    else setInternalSubView(sv);
  };

  // Compare pair setup
  const defaultPair = useMemo<[string, string]>(() => {
    const sorted = [...participants].sort((a, b) => b.messageCount - a.messageCount);
    const first = sorted[0]?.id ?? '';
    const second = sorted.find((p) => p.id !== first)?.id ?? sorted[1]?.id ?? '';
    return [first, second];
  }, [participants]);

  const [rawLeftId, rawRightId] = comparePair ?? defaultPair;
  let leftId = rawLeftId;
  let rightId = rawRightId;

  if (leftId === rightId && participants.length > 1) {
    const fallback = participants.find((p) => p.id !== leftId);
    if (fallback) {
      rightId = fallback.id;
    }
  }

  const left = participants.find((p) => p.id === leftId) ?? participants[0];
  const right = participants.find((p) => p.id === rightId && p.id !== left?.id)
    ?? participants.find((p) => p.id !== left?.id)
    ?? participants[1];

  const setPerson = (side: 'left' | 'right', id: string) => {
    if (!onComparePairChange) return;
    if (side === 'left') {
      if (id === rightId) {
        onComparePairChange([id, leftId]);
      } else {
        onComparePairChange([id, rightId]);
      }
    } else {
      if (id === leftId) return;
      onComparePairChange([leftId, id]);
    }
  };

  useEffect(() => {
    if (subView === 'compare') {
      posthog.capture('compare_tab_viewed', { participant_count: participants.length });
    }
  }, [subView, participants.length]);

  if (!analysis) return null;

  // Sessions statistics
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

  // Compare statistics
  const leftStats = left ? statsFor(analysis, left) : null;
  const rightStats = right ? statsFor(analysis, right) : null;

  let leftWins = 0;
  let rightWins = 0;
  if (leftStats && rightStats) {
    DUEL_ROWS.forEach((row) => {
      const lv = row.getValue(leftStats);
      const rv = row.getValue(rightStats);
      if (lv === null || rv === null || lv === rv) return;
      if (row.lowerWins ? lv < rv : lv > rv) leftWins += 1;
      else rightWins += 1;
    });
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <Reveal delay={0}>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
              <span className="size-1.5 rounded-full bg-[#F17141]" />
              Conversations
            </div>
            <h2 className="text-balance text-[clamp(27px,4vw,43px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#24201D]">
              How you talk.
            </h2>
            <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#766F69]">
              Sessions, reply speeds, conversation flow, and head-to-head duel.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Segmented Sub-view Controller */}
      <Reveal delay={0.05}>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#EADFD5] bg-[#FFF8EA] p-2 sm:w-fit shadow-2xs">
          <button
            type="button"
            onClick={() => setSubView('sessions')}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-extrabold transition cursor-pointer",
              subView === 'sessions'
                ? "bg-[#FFECAE] text-[#24201D] shadow-xs"
                : "text-[#766F69] hover:bg-[#F6EEDD] hover:text-[#24201D]"
            )}
          >
            <IconMessageCircle className={cn("size-4", subView === 'sessions' ? "text-[#F17141]" : "text-[#A59A90]")} />
            <span>Session Dynamics</span>
            <span className="rounded-full bg-[#FFFCF5] px-2 py-0.5 text-[10px] font-bold text-[#806641] border border-[#EADFD5]/60">
              {formatNumber(analysis.sessionCount)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubView('compare')}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-extrabold transition cursor-pointer",
              subView === 'compare'
                ? "bg-[#FFECAE] text-[#24201D] shadow-xs"
                : "text-[#766F69] hover:bg-[#F6EEDD] hover:text-[#24201D]"
            )}
          >
            <IconUsers className={cn("size-4", subView === 'compare' ? "text-[#F17141]" : "text-[#A59A90]")} />
            <span>Head-to-Head Compare</span>
            <span className="rounded-full bg-[#FFFCF5] px-2 py-0.5 text-[10px] font-bold text-[#806641] border border-[#EADFD5]/60">
              Duel
            </span>
          </button>
        </div>
      </Reveal>

      {/* VIEW 1: Session Dynamics */}
      {subView === 'sessions' && (
        <div className="space-y-8 animate-in fade-in duration-200">
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
        </div>
      )}

      {/* VIEW 2: Head-to-Head Compare */}
      {subView === 'compare' && (
        <div className="space-y-12 animate-in fade-in duration-200">
          {!left || !right || left.id === right.id ? (
            <div className="rounded-[26px] border border-[#EADFD5] bg-[#FFFCF5] p-8 text-center text-[#766F69]">
              <p className="text-[15px] font-bold">At least two participants are required to compare head-to-head.</p>
              <p className="text-[12px] text-[#A59A90] mt-1">If a participant filter is applied, select &quot;Everyone&quot; in the filter bar above.</p>
            </div>
          ) : (
            <>
              {participants.length > 2 && (
                <Reveal delay={0.05}>
                  <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-[#EADFD5] bg-[#FFF8EA] p-4">
                    <select
                      value={leftId}
                      onChange={(e) => setPerson('left', e.target.value)}
                      className="w-full sm:w-auto flex-1 rounded-xl border border-[#EADFD5] bg-[#FFFCF5] px-3 py-2 text-[13px] font-bold text-[#24201D] outline-none transition focus:border-[#F17141]"
                      aria-label="Compare participant left"
                    >
                      {participants.map((p) => (
                        <option key={p.id} value={p.id} disabled={p.id === rightId}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => onComparePairChange?.([rightId, leftId])}
                      title="Swap participants"
                      className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#A59A90] hover:text-[#F17141] transition cursor-pointer select-none"
                    >
                      vs
                    </button>
                    <select
                      value={rightId}
                      onChange={(e) => setPerson('right', e.target.value)}
                      className="w-full sm:w-auto flex-1 rounded-xl border border-[#EADFD5] bg-[#FFFCF5] px-3 py-2 text-[13px] font-bold text-[#24201D] outline-none transition focus:border-[#F17141]"
                      aria-label="Compare participant right"
                    >
                      {participants.map((p) => (
                        <option key={p.id} value={p.id} disabled={p.id === leftId}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.1}>
                <div className="rounded-[26px] border border-[#EADFD5] bg-[#FFFCF5] overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-[#EADFD5] bg-[#FFECAE]/40">
                    <div className="p-5 text-center">
                      <p className="text-[15px] font-extrabold text-[#24201D] truncate">{left.name}</p>
                      <p className="text-[11px] font-bold text-[#806641] mt-0.5">{leftWins} categories won</p>
                    </div>
                    <div className="p-5 text-center">
                      <p className="text-[15px] font-extrabold text-[#24201D] truncate">{right.name}</p>
                      <p className="text-[11px] font-bold text-[#806641] mt-0.5">{rightWins} categories won</p>
                    </div>
                  </div>

                  <div className="divide-y divide-[#EADFD5]">
                    {DUEL_ROWS.map((row) => {
                      const lv = leftStats ? row.getValue(leftStats) : null;
                      const rv = rightStats ? row.getValue(rightStats) : null;
                      const hasWinner = lv !== null && rv !== null && lv !== rv;
                      const leftIsWinner = hasWinner && (row.lowerWins ? lv! < rv! : lv! > rv!);
                      const rightIsWinner = hasWinner && !leftIsWinner;

                      return (
                        <div key={row.label} className="relative">
                          <div className="grid grid-cols-2 divide-x divide-[#EADFD5]">
                            <div className={cn('py-5 sm:py-6 px-4 text-center transition-colors', leftIsWinner && 'bg-[#FFECAE]/50')}>
                              <p className={cn('text-[18px] sm:text-[22px] font-extrabold tracking-tight', leftIsWinner ? 'text-[#F17141]' : 'text-[#24201D]')}>
                                {row.format(lv)}
                              </p>
                            </div>
                            <div className={cn('py-5 sm:py-6 px-4 text-center transition-colors', rightIsWinner && 'bg-[#FFECAE]/50')}>
                              <p className={cn('text-[18px] sm:text-[22px] font-extrabold tracking-tight', rightIsWinner ? 'text-[#F17141]' : 'text-[#24201D]')}>
                                {row.format(rv)}
                              </p>
                            </div>
                          </div>

                          {/* Metric badge centered between columns */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-[#EADFD5] bg-[#FFFCF5] px-3.5 py-1 shadow-2xs">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#766F69] whitespace-nowrap">
                                {row.label}
                              </span>
                              {onInfo && row.infoLabel && (
                                <MetricInfoButton
                                  onClick={() => onInfo(row.infoLabel!)}
                                  label={row.infoLabel}
                                  className="size-4.5 border-0 bg-transparent text-[#A59A90] hover:text-[#F17141] shadow-none p-0 -mr-0.5"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>

              {onShare && (
                <Reveal delay={0.15}>
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={onShare}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F17141] px-6 py-3.5 text-[13px] font-bold text-[#FFFCF5] shadow-[0_10px_25px_rgba(241,113,65,0.2)] hover:-translate-y-0.5 hover:bg-[#e76537] transition duration-200 cursor-pointer"
                    >
                      <IconShare className="size-4" />
                      <span>Share this comparison</span>
                    </button>
                  </div>
                </Reveal>
              )}
            </>
          )}
        </div>
      )}

      {/* Storybook Chapter Progression Footer */}
      <ChapterFooter currentTab="Conversations" onTabChange={onTabChange} onShare={onShare} />
    </div>
  );
}
