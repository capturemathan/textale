import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useTexTale } from '@/store/textale-store';
import { Reveal } from '@/components/common/Reveal';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { ChapterFooter } from '@/components/common/ChapterFooter';
import { IconSparkles } from '@/components/icons';
import WrappedCard from '@/components/share/WrappedCard';
import {
  formatNumber,
  formatDayKey,
  formatDuration,
  formatSessionDate,
  formatSessionTimeRange,
  formatMessageDateTime,
  isMultiDaySession,
} from '@/lib/formatting';
import type { ExplorerTab } from '@/components/explorer';

interface RecordsTabProps {
  onTabChange?: (tab: ExplorerTab) => void;
  onShare?: () => void;
  onInfo?: (label: string) => void;
}

export default function RecordsTab({ onTabChange, onShare, onInfo }: RecordsTabProps) {
  const { analysis, participants } = useTexTale();
  const [showWrapped, setShowWrapped] = useState(false);
  const recordsRef = useRef<HTMLDivElement>(null);

  if (!analysis) return null;

  const handleSaveImage = async () => {
    if (onShare) {
      onShare();
      return;
    }
    if (!recordsRef.current) return;
    try {
      const dataUrl = await toPng(recordsRef.current, {
        pixelRatio: 2,
        cacheBust: false,
        backgroundColor: '#FFFCF5',
      });
      const link = document.createElement('a');
      link.download = 'textale-all-time-records.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export image:', err);
    }
  };

  const longestSession = analysis.longestSession;
  const isMultiDayLongest = longestSession ? isMultiDaySession(longestSession.start, longestSession.end) : false;

  const records = [
    {
      id: "01",
      title: "Busiest Day",
      value: analysis.busiestDay ? formatDayKey(analysis.busiestDay.date) : "N/A",
      subtitle: analysis.busiestDay ? `${formatNumber(analysis.busiestDay.messages)} messages` : "",
      bg: "bg-[#FFECAE]",
      text: "text-[#24201D]",
      numberOpacity: "opacity-20 text-[#DFAF78]",
      eyebrowColor: "text-[#DFAF78]",
      subtitleColor: "text-[#806641]",
    },
    {
      id: "02",
      title: "Longest Conversation",
      value: longestSession ? formatDuration(longestSession.durationMs) : "N/A",
      subtitle: longestSession ? `${formatNumber(longestSession.messageCount)} messages` : "",
      meta: longestSession ? `${formatSessionDate(longestSession.start, longestSession.end)} · ${formatSessionTimeRange(longestSession.start, longestSession.end)}` : undefined,
      firstMessage: longestSession?.firstMessage,
      lastMessage: longestSession?.lastMessage,
      isMultiDay: isMultiDayLongest,
      bg: "bg-[#F17141]",
      text: "text-[#FFFCF5]",
      numberOpacity: "opacity-20 text-[#FFFCF5]",
      eyebrowColor: "text-[#FFCCB8]",
      subtitleColor: "text-[#FFCCB8]",
    },
    {
      id: "03",
      title: "Most Words in a Day",
      value: analysis.records.mostWordsInDay ? formatDayKey(analysis.records.mostWordsInDay.date) : "N/A",
      subtitle: analysis.records.mostWordsInDay ? `${formatNumber(analysis.records.mostWordsInDay.words)} words` : "",
      bg: "bg-[#FFF0DA]",
      text: "text-[#24201D]",
      numberOpacity: "opacity-20 text-[#DFAF78]",
      eyebrowColor: "text-[#DFAF78]",
      subtitleColor: "text-[#806641]",
    },
    {
      id: "04",
      title: "Longest Streak",
      value: analysis.longestStreak ? `${formatNumber(analysis.longestStreak.days)} days` : "N/A",
      subtitle: analysis.longestStreak ? `${formatDayKey(analysis.longestStreak.start)} to ${formatDayKey(analysis.longestStreak.end)}` : "",
      bg: "bg-[#24201D]",
      text: "text-[#FFFCF5]",
      numberOpacity: "opacity-10 text-[#FFFCF5]",
      eyebrowColor: "text-[#A59A90]",
      subtitleColor: "text-[#BEB5AE]",
    },
    {
      id: "05",
      title: "Most Questions",
      value: analysis.records.mostQuestionsInDay ? formatDayKey(analysis.records.mostQuestionsInDay.date) : "N/A",
      subtitle: analysis.records.mostQuestionsInDay ? `${formatNumber(analysis.records.mostQuestionsInDay.questions)} questions` : "",
      bg: "bg-[#F17141]",
      text: "text-[#FFFCF5]",
      numberOpacity: "opacity-20 text-[#FFFCF5]",
      eyebrowColor: "text-[#FFCCB8]",
      subtitleColor: "text-[#FFCCB8]",
    },
  ];

  return (
    <div className="space-y-12">
      <Reveal delay={0}>
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
            <span className="size-1.5 rounded-full bg-[#F17141]" />
            Hall of Fame
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-[clamp(27px,4vw,43px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#24201D]">
              The all-time records.
            </h2>
            <button
              onClick={() => setShowWrapped(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F17141] text-[#FFFCF5] shadow-[0_10px_25px_rgba(241,113,65,0.2)] hover:-translate-y-0.5 hover:bg-[#e76537] px-5 py-2.5 text-[12px] font-bold transition duration-200 self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <IconSparkles className="size-4" />
              See your Chat Wrapped
            </button>
          </div>
        </div>
      </Reveal>

      <div ref={recordsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {records.map((record, i) => (
          <Reveal key={record.id} delay={0.1 + i * 0.05}>
            <div className={`relative overflow-hidden rounded-[26px] p-7 h-full flex flex-col justify-between ${record.bg} ${record.text} shadow-sm transition-transform hover:-translate-y-1`}>
              <div className={`absolute -right-2 -top-4 text-[100px] font-black leading-none ${record.numberOpacity}`}>
                {record.id}
              </div>
              <div className="relative z-10 mb-8 flex items-center justify-between">
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.15em] ${record.eyebrowColor}`}>
                  {record.title}
                </p>
                {onInfo && (
                  <MetricInfoButton
                    onClick={() => onInfo(record.title)}
                    label={record.title}
                    className={record.bg === 'bg-[#24201D]' || record.bg === 'bg-[#F17141]' ? 'hover:bg-[#FFFCF5]/20 hover:text-[#FFECAE]' : ''}
                  />
                )}
              </div>
              <div className="relative z-10">
                <div className="text-[26px] font-extrabold leading-tight tracking-tight mb-1">
                  {record.value}
                </div>
                <div className={`text-[13px] font-semibold ${record.subtitleColor}`}>
                  {record.subtitle}
                </div>
                {record.meta && (
                  <div className={`mt-2 text-[11px] font-bold ${record.subtitleColor}`}>
                    {record.meta}
                  </div>
                )}
                {(record.firstMessage || record.lastMessage) && (
                  <div className="mt-3.5 space-y-1.5 pt-3 border-t border-current/20 text-[11px]">
                    {record.firstMessage && (
                      <div className="rounded-xl bg-black/15 p-2">
                        <div className={`text-[9px] font-extrabold uppercase tracking-wider mb-0.5 ${record.eyebrowColor}`}>
                          Start · {record.firstMessage.sender} ({formatMessageDateTime(record.firstMessage.timestamp, record.isMultiDay)})
                        </div>
                        <div className="italic line-clamp-1 opacity-95">
                          "{record.firstMessage.text}"
                        </div>
                      </div>
                    )}
                    {record.lastMessage && (
                      <div className="rounded-xl bg-black/15 p-2">
                        <div className={`text-[9px] font-extrabold uppercase tracking-wider mb-0.5 ${record.eyebrowColor}`}>
                          End · {record.lastMessage.sender} ({formatMessageDateTime(record.lastMessage.timestamp, record.isMultiDay)})
                        </div>
                        <div className="italic line-clamp-1 opacity-95">
                          "{record.lastMessage.text}"
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Storybook Grand Finale Footer */}
      <ChapterFooter
        currentTab="Records"
        onTabChange={onTabChange}
        onShare={onShare || handleSaveImage}
      />

      {showWrapped && analysis && (
        <WrappedCard
          analysis={analysis}
          participants={participants}
          onClose={() => setShowWrapped(false)}
          source="records"
        />
      )}
    </div>
  );
}
