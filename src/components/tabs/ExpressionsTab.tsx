import { useState } from 'react';
import { useTexTale } from '@/store/textale-store';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { Reveal } from '@/components/common/Reveal';
import { ChapterFooter } from '@/components/common/ChapterFooter';
import { DistributionChart } from '@/components/charts/DistributionChart';
import { formatNumber, formatPercent } from '@/lib/formatting';
import { cn } from '@/lib/utils';
import { IconType, IconZap, IconSmile, IconLink } from '@/components/icons';
import type { ExplorerTab } from '@/components/explorer';

export type ExpressionsSection = 'words' | 'emojis' | 'links';

interface ExpressionsTabProps {
  onTabChange?: (tab: ExplorerTab) => void;
  onInfo?: (label: string) => void;
  onShare?: () => void;
  activeSection?: ExpressionsSection;
  onSectionChange?: (section: ExpressionsSection) => void;
}

export default function ExpressionsTab({
  onTabChange,
  onInfo,
  onShare,
  activeSection: controlledSection,
  onSectionChange,
}: ExpressionsTabProps) {
  const { analysis } = useTexTale();
  const [internalSection, setInternalSection] = useState<ExpressionsSection>('words');

  const activeSection = controlledSection ?? internalSection;
  const setSection = (sec: ExpressionsSection) => {
    if (onSectionChange) onSectionChange(sec);
    else setInternalSection(sec);
  };

  if (!analysis) return null;

  // Words statistics
  const topWords = analysis.topWords.slice(0, 8);
  let topQuestioner = 'No one';
  let maxQuestions = 0;
  for (const p of analysis.participants) {
    const qCount = analysis.byParticipant[p.name]?.questions || analysis.byParticipant[p.id]?.questions || 0;
    if (qCount > maxQuestions) {
      maxQuestions = qCount;
      topQuestioner = p.name;
    }
  }

  // Emojis statistics
  const topEmojis = analysis.topEmojis.slice(0, 8);
  const topEmoji = topEmojis[0];
  const maxEmojiCount = topEmoji?.count || 1;

  // Links statistics
  const topDomains = analysis.topDomains.slice(0, 8);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <Reveal delay={0}>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
              <span className="size-1.5 rounded-full bg-[#F17141]" />
              Expressions
            </div>
            <h2 className="text-[clamp(27px,4vw,43px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#24201D]">
              The language you share.
            </h2>
            <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#766F69]">
              Vocabulary, signature emojis, reactions, and shared web links.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Segmented Sub-view Controller */}
      <Reveal delay={0.05}>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#EADFD5] bg-[#FFF8EA] p-2 sm:w-fit shadow-2xs">
          <button
            type="button"
            onClick={() => setSection('words')}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-extrabold transition cursor-pointer",
              activeSection === 'words'
                ? "bg-[#FFECAE] text-[#24201D] shadow-xs"
                : "text-[#766F69] hover:bg-[#F6EEDD] hover:text-[#24201D]"
            )}
          >
            <IconType className={cn("size-4", activeSection === 'words' ? "text-[#F17141]" : "text-[#A59A90]")} />
            <span>Words & Vocabulary</span>
            <span className="rounded-full bg-[#FFFCF5] px-2 py-0.5 text-[10px] font-bold text-[#806641] border border-[#EADFD5]/60">
              {formatNumber(analysis.totalWords)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSection('emojis')}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-extrabold transition cursor-pointer",
              activeSection === 'emojis'
                ? "bg-[#FFECAE] text-[#24201D] shadow-xs"
                : "text-[#766F69] hover:bg-[#F6EEDD] hover:text-[#24201D]"
            )}
          >
            <IconSmile className={cn("size-4", activeSection === 'emojis' ? "text-[#F17141]" : "text-[#A59A90]")} />
            <span>Emojis & Reactions</span>
            <span className="rounded-full bg-[#FFFCF5] px-2 py-0.5 text-[10px] font-bold text-[#806641] border border-[#EADFD5]/60">
              {formatNumber(analysis.totalEmojis)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSection('links')}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-extrabold transition cursor-pointer",
              activeSection === 'links'
                ? "bg-[#FFECAE] text-[#24201D] shadow-xs"
                : "text-[#766F69] hover:bg-[#F6EEDD] hover:text-[#24201D]"
            )}
          >
            <IconLink className={cn("size-4", activeSection === 'links' ? "text-[#F17141]" : "text-[#A59A90]")} />
            <span>Shared Links</span>
            <span className="rounded-full bg-[#FFFCF5] px-2 py-0.5 text-[10px] font-bold text-[#806641] border border-[#EADFD5]/60">
              {formatNumber(analysis.totalLinks)}
            </span>
          </button>
        </div>
      </Reveal>

      {/* VIEW 1: Words & Vocabulary */}
      {activeSection === 'words' && (
        <div className="space-y-12 animate-in fade-in duration-200">
          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                eyebrow="Total Words"
                value={analysis.totalWords}
                format={formatNumber}
                subtitle="Unicode-aware word count"
                onInfo={onInfo ? () => onInfo("Total words") : undefined}
              />
              <MetricCard
                eyebrow="Unique Words"
                value={analysis.uniqueWords}
                format={formatNumber}
                subtitle="Distinct words used"
                onInfo={onInfo ? () => onInfo("Unique words") : undefined}
              />
              <MetricCard
                eyebrow="Vocab Variety"
                value={analysis.vocabularyVariety}
                format={(n) => n.toFixed(1)}
                subtitle="Per 1,000 words"
                onInfo={onInfo ? () => onInfo("Vocab variety") : undefined}
              />
              <MetricCard
                eyebrow="Avg Words/Msg"
                value={analysis.averageMessageWords}
                format={(n) => n.toFixed(1)}
                subtitle="Average length"
                onInfo={onInfo ? () => onInfo("Avg words/msg") : undefined}
              />
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(300px,380px)]">
            <Reveal delay={0.2} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="editorial-script -rotate-2 text-[22px] text-[#F17141]">favorites</span>
                  <span className="h-px w-9 bg-[#F17141]/40" />
                  <h3 className="text-[22px] font-extrabold text-[#24201D]">Most used words</h3>
                </div>
                {onInfo && <MetricInfoButton onClick={() => onInfo("Most used words")} label="Most used words" />}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {topWords.map((word, i) => {
                  const isOrange = i % 2 === 0;
                  return (
                    <div 
                      key={word.key}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-5 py-3.5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5",
                        isOrange 
                          ? "bg-[#F17141] text-[#FFFCF5]" 
                          : "bg-[#24201D] text-[#FFFCF5]"
                      )}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span 
                          className={cn(
                            "text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg shrink-0",
                            isOrange 
                              ? "bg-[#FFFCF5]/20 text-[#FFFCF5]" 
                              : "bg-[#F17141]/20 text-[#F17141]"
                          )}
                        >
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-[15px] font-extrabold truncate text-[#FFFCF5]">
                          {word.key}
                        </span>
                      </div>
                      <span 
                        className={cn(
                          "text-[13px] font-extrabold shrink-0 ml-3",
                          isOrange ? "text-[#FFFCF5]/90" : "text-[#BEB5AE]"
                        )}
                      >
                        {formatNumber(word.count)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.3} className="space-y-6">
              <div className="rounded-[26px] border border-[#F17141]/20 bg-[#FFECAE] p-6 shadow-sm">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#6C4E2A]">
                      Message Length
                    </p>
                    <h3 className="mt-1 text-[20px] font-extrabold text-[#24201D]">How much you type</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="grid size-10 place-items-center rounded-2xl bg-[#FFFCF5]/70 text-[#F17141]">
                      <IconType className="size-5" />
                    </span>
                    {onInfo && <MetricInfoButton onClick={() => onInfo("How much you type")} label="How much you type" />}
                  </div>
                </div>
                
                <div>
                  <div className="text-[36px] font-extrabold tracking-tight text-[#24201D]">
                    {formatNumber(analysis.averageMessageWords, 1)}
                  </div>
                  <div className="mt-1 text-[12px] font-semibold text-[#806641]">Average words per message</div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <div className="overflow-hidden rounded-[26px] bg-[#24201D] text-[#FFFCF5] p-6 sm:p-8 relative">
              <div className="absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/3 rounded-full border-[40px] border-[#3C3530]/50" />
              <div className="relative z-10 grid gap-8 md:grid-cols-[1.5fr_1fr]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FFECAE]">
                      <IconZap className="size-3" />
                      Questions
                    </div>
                    {onInfo && <MetricInfoButton onClick={() => onInfo("Questions")} label="Questions" />}
                  </div>
                  <h3 className="text-[28px] font-extrabold leading-tight tracking-tight mb-2">
                    {topQuestioner} asks the most questions.
                  </h3>
                  <p className="text-[13px] text-[#BEB5AE] max-w-md">
                    About {formatPercent(analysis.questionRate)} of all messages contain at least one question mark.
                  </p>
                </div>
                
                <div className="flex flex-col justify-end gap-6 md:border-l md:border-[#3C3530] md:pl-8">
                  <div>
                    <div className="text-[36px] font-extrabold text-[#F17141]">
                      {formatNumber(analysis.questionMessages)}
                    </div>
                    <div className="text-[11px] font-semibold text-[#BEB5AE] uppercase tracking-wider">
                      Total Questions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      )}

      {/* VIEW 2: Emojis & Reactions */}
      {activeSection === 'emojis' && (
        <div className="space-y-12 animate-in fade-in duration-200">
          {analysis.totalEmojis === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-[#F3EBE2] text-[#F17141]">
                <IconSmile className="size-8" />
              </div>
              <h2 className="text-[24px] font-extrabold text-[#24201D]">No emojis found</h2>
              <p className="mt-2 text-[14px] text-[#766F69]">
                It looks like there weren't any emojis used in this conversation.
              </p>
            </div>
          ) : (
            <>
              <Reveal delay={0.1}>
                <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                  <div className="relative overflow-hidden rounded-[34px] bg-[#F17141] p-8 text-center shadow-[0_20px_40px_rgba(241,113,65,0.25)] flex flex-col items-center justify-center">
                    <div className="absolute -left-10 -top-10 size-40 rounded-full bg-[#FFFCF5]/10 blur-xl" />
                    <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-[#24201D]/10 blur-xl" />
                    <div className="relative z-10 w-full">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FFECAE]">
                          Most Used Emoji
                        </p>
                        {onInfo && <MetricInfoButton onClick={() => onInfo("Most used emoji")} label="Most used emoji" className="hover:bg-[#FFFCF5]/20 hover:text-[#FFECAE]" />}
                      </div>
                      <div className="text-[72px] leading-none mb-4 drop-shadow-md">
                        {topEmoji?.key}
                      </div>
                      <div className="text-[24px] font-extrabold text-[#FFFCF5]">
                        {formatNumber(topEmoji?.count || 0)} times
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-[#EDE2D6] bg-[#FFFCF5] p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="editorial-script -rotate-2 text-[22px] text-[#F17141]">the leaderboard</span>
                      {onInfo && <MetricInfoButton onClick={() => onInfo("The leaderboard")} label="Emoji leaderboard" />}
                    </div>
                    <div className="space-y-4">
                      {topEmojis.map((emoji, i) => (
                        <div key={emoji.key} className="flex items-center gap-4">
                          <span className="w-6 text-[10px] font-bold text-[#A59A90] text-right">
                            {(i + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="text-[24px] leading-none w-8 text-center">{emoji.key}</span>
                          <div className="flex-1">
                            <div className="h-2 w-full rounded-full bg-[#F3EBE2]">
                              <div 
                                className="h-full rounded-full bg-[#F17141]" 
                                style={{ width: `${(emoji.count / maxEmojiCount) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="w-12 text-right text-[12px] font-bold text-[#24201D]">
                            {formatNumber(emoji.count)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <MetricCard
                    eyebrow="Total Emojis"
                    value={analysis.totalEmojis}
                    format={formatNumber}
                    subtitle="Overall count"
                    onInfo={onInfo ? () => onInfo("Total emojis") : undefined}
                  />
                  <MetricCard
                    eyebrow="Messages w/ Emoji"
                    value={(analysis.messagesWithEmoji / analysis.totalMessages) * 100}
                    format={(n) => n.toFixed(1) + '%'}
                    subtitle="Of total messages"
                    onInfo={onInfo ? () => onInfo("Messages w/ emoji") : undefined}
                  />
                  <MetricCard
                    eyebrow="Emojis / Message"
                    value={analysis.totalEmojis / analysis.totalMessages}
                    format={(n) => n.toFixed(2)}
                    subtitle="Average frequency"
                    onInfo={onInfo ? () => onInfo("Emojis / message") : undefined}
                  />
                </div>
              </Reveal>
            </>
          )}
        </div>
      )}

      {/* VIEW 3: Shared Links */}
      {activeSection === 'links' && (
        <div className="space-y-12 animate-in fade-in duration-200">
          {analysis.totalLinks === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-[#FFECAE] text-[#F17141]">
                <IconLink className="size-8" />
              </div>
              <h2 className="text-[24px] font-extrabold text-[#24201D]">No links shared</h2>
              <p className="mt-2 text-[14px] text-[#766F69]">
                No URLs were detected in this conversation.
              </p>
            </div>
          ) : (
            <>
              <Reveal delay={0.1}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricCard
                    eyebrow="Total Links"
                    value={analysis.totalLinks}
                    format={formatNumber}
                    subtitle="All URLs shared"
                    onInfo={onInfo ? () => onInfo("Total links") : undefined}
                  />
                  <MetricCard
                    eyebrow="Unique Domains"
                    value={analysis.uniqueDomains}
                    format={formatNumber}
                    subtitle="Distinct websites"
                    onInfo={onInfo ? () => onInfo("Unique domains") : undefined}
                  />
                </div>
              </Reveal>

              <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                <Reveal delay={0.2} className="space-y-6">
                  <div className="rounded-[26px] border border-[#EDE2D6] bg-[#FFFCF5] p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-8">
                      <span className="editorial-script -rotate-2 text-[22px] text-[#F17141]">top domains</span>
                      {onInfo && <MetricInfoButton onClick={() => onInfo("Unique domains")} label="Top domains" />}
                    </div>
                    <DistributionChart 
                      buckets={topDomains.map(d => ({ label: d.key, value: d.count }))} 
                      color="#F17141"
                    />
                  </div>
                </Reveal>

                <Reveal delay={0.3} className="space-y-6">
                  <div className="rounded-[26px] border border-[#F17141]/20 bg-[#FFECAE] p-6 shadow-sm">
                    <div className="mb-6 flex items-start justify-between">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#6C4E2A]">
                        Who Shares More
                      </p>
                      {onInfo && <MetricInfoButton onClick={() => onInfo("Who shares more")} label="Who shares more" />}
                    </div>
                    
                    <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                      {[...analysis.participants]
                        .sort((a, b) => {
                          const linksA = analysis.byParticipant[a.name]?.links || analysis.byParticipant[a.id]?.links || 0;
                          const linksB = analysis.byParticipant[b.name]?.links || analysis.byParticipant[b.id]?.links || 0;
                          return linksB - linksA;
                        })
                        .map((p) => {
                          const links = analysis.byParticipant[p.name]?.links || analysis.byParticipant[p.id]?.links || 0;
                          const percent = analysis.totalLinks > 0 ? (links / analysis.totalLinks) * 100 : 0;
                          
                          return (
                            <div key={p.id}>
                              <div className="flex justify-between text-[13px] font-bold text-[#24201D] mb-1.5">
                                <span className="truncate pr-2">{p.name}</span>
                                <span className="shrink-0">{formatNumber(links)} ({percent.toFixed(0)}%)</span>
                              </div>
                              <div className="h-2.5 w-full rounded-full bg-[#F3EBE2] overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-[#F17141] transition-all duration-300" 
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </Reveal>
              </div>
            </>
          )}
        </div>
      )}

      {/* Storybook Chapter Progression Footer */}
      <ChapterFooter currentTab="Expressions" onTabChange={onTabChange} onShare={onShare} />
    </div>
  );
}
