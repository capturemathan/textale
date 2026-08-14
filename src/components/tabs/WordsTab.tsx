import { useTexTale } from '@/store/textale-store';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { Reveal } from '@/components/common/Reveal';
import { formatNumber, formatPercent } from '@/lib/formatting';
import { cn } from '@/lib/utils';
import { IconType, IconZap } from '@/components/icons';

interface WordsTabProps {
  onInfo?: (label: string) => void;
}

export default function WordsTab({ onInfo }: WordsTabProps) {
  const { analysis } = useTexTale();
  if (!analysis) return null;

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

  return (
    <div className="space-y-12">
      <Reveal delay={0}>
        <div className="mb-8">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
              <span className="size-1.5 rounded-full bg-[#F17141]" />
              Vocabulary
            </div>
            <h2 className="text-[clamp(27px,4vw,43px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#24201D]">
              The words you use.
            </h2>
            <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#766F69]">
              A breakdown of your vocabulary, unique words, and question patterns.
            </p>
          </div>
        </div>
      </Reveal>

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
  );
}
