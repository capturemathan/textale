import { useTexTale } from '@/store/textale-store';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { Reveal } from '@/components/common/Reveal';
import { ChapterFooter } from '@/components/common/ChapterFooter';
import { formatNumber } from '@/lib/formatting';
import { IconSmile } from '@/components/icons';
import type { ExplorerTab } from '@/components/explorer';

interface EmojisTabProps {
  onTabChange?: (tab: ExplorerTab) => void;
  onInfo?: (label: string) => void;
}

export default function EmojisTab({ onTabChange, onInfo }: EmojisTabProps) {
  const { analysis } = useTexTale();
  if (!analysis) return null;

  const topEmojis = analysis.topEmojis.slice(0, 8);
  const topEmoji = topEmojis[0];
  const maxEmojiCount = topEmoji?.count || 1;

  if (analysis.totalEmojis === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-[#F3EBE2] text-[#F17141]">
          <IconSmile className="size-8" />
        </div>
        <h2 className="text-[24px] font-extrabold text-[#24201D]">No emojis found</h2>
        <p className="mt-2 text-[14px] text-[#766F69]">
          It looks like there weren't any emojis used in this conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Reveal delay={0}>
        <div className="mb-8">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
              <span className="size-1.5 rounded-full bg-[#F17141]" />
              Expressions
            </div>
            <h2 className="text-[clamp(27px,4vw,43px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#24201D]">
              The emojis you share.
            </h2>
          </div>
        </div>
      </Reveal>

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
            eyebrow="Avg Emojis/Msg"
            value={analysis.emojisPerMessage}
            format={(n) => n.toFixed(1)}
            subtitle="When used"
            onInfo={onInfo ? () => onInfo("Avg emojis/msg") : undefined}
          />
        </div>
      </Reveal>

      {/* Storybook Chapter Progression Footer */}
      <ChapterFooter currentTab="Emojis" onTabChange={onTabChange} />
    </div>
  );
}
