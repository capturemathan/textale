import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useTexTale } from '@/store/textale-store';
import { Reveal } from '@/components/common/Reveal';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { formatNumber, formatDayKey, formatDuration } from '@/lib/formatting';
import { IconDownload } from '@/components/icons';

interface RecordsTabProps {
  onShare?: () => void;
  onInfo?: (label: string) => void;
}

export default function RecordsTab({ onShare, onInfo }: RecordsTabProps) {
  const { analysis } = useTexTale();
  const recordsRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  if (!analysis) return null;

  const handleSaveImage = async () => {
    if (onShare) {
      onShare();
      return;
    }
    if (!recordsRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(recordsRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#FFFCF5',
      });
      const link = document.createElement('a');
      link.download = 'textale-all-time-records.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
    } finally {
      setBusy(false);
    }
  };

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
      value: analysis.longestSession ? formatDuration(analysis.longestSession.durationMs) : "N/A",
      subtitle: analysis.longestSession ? `${formatNumber(analysis.longestSession.messageCount)} messages` : "",
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
          <h2 className="text-[clamp(27px,4vw,43px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#24201D]">
            The all-time records.
          </h2>
        </div>
      </Reveal>

      <div ref={recordsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {records.map((record, i) => (
          <Reveal key={record.id} delay={0.1 + i * 0.05}>
            <div className={`relative overflow-hidden rounded-[26px] p-7 h-full flex flex-col justify-between ${record.bg} ${record.text} shadow-sm transition-transform hover:-translate-y-1`}>
              <div className={`absolute -right-2 -top-4 text-[100px] font-black leading-none ${record.numberOpacity}`}>
                {record.id}
              </div>
              <div className="relative z-10 mb-12 flex items-center justify-between">
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
                <div className="text-[26px] font-extrabold leading-tight tracking-tight mb-2">
                  {record.value}
                </div>
                <div className={`text-[13px] font-semibold ${record.subtitleColor}`}>
                  {record.subtitle}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.5}>
        <div className="mt-12 rounded-[30px] border border-[#E8D9C8] bg-[#FFFCF5] p-8 text-center sm:p-12 shadow-[0_20px_60px_rgba(180,133,60,0.05)]">
          <span className="editorial-script text-[28px] text-[#F17141] block mb-3">share the story</span>
          <h3 className="text-[24px] font-extrabold text-[#24201D] mb-6">
            Want to keep these records?
          </h3>
          <button
            onClick={handleSaveImage}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F17141] px-6 py-3.5 text-[14px] font-bold text-[#FFFCF5] shadow-[0_10px_25px_rgba(241,113,65,0.2)] hover:-translate-y-0.5 hover:bg-[#e76537] transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            <IconDownload className="size-5" />
            {busy ? 'Exporting...' : 'Save as Image'}
          </button>
        </div>
      </Reveal>
    </div>
  );
}
