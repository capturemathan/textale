import { motion, AnimatePresence } from 'motion/react';
import type { Analysis, DayBucket } from '@/types';
import { MetricCard } from '@/components/metrics/MetricCard';
import { formatNumber, formatDayKey } from '@/lib/formatting';
import { IconClose } from '@/components/icons';

interface DayDrawerProps {
  dayDate: string | null;
  analysis: Analysis;
  onClose: () => void;
}

export function DayDrawer({ dayDate, analysis, onClose }: DayDrawerProps) {
  if (!dayDate) return null;

  const dayData: DayBucket | undefined = analysis.days.find((d) => d.date === dayDate);
  const formattedDate = formatDayKey(dayDate);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#24201D]/30 backdrop-blur-[2px]"
        />

        {/* Slide-over Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-md overflow-y-auto border-l border-[#EDE2D6] bg-[#FFFCF5] p-6 shadow-2xl sm:p-8"
        >
          <button
            onClick={onClose}
            className="mb-8 grid size-9 place-items-center rounded-full bg-[#F3EBE2] text-[#766F69] hover:bg-[#EDE2D6] hover:text-[#F17141] transition"
            aria-label="Close day details"
          >
            <IconClose className="size-4" />
          </button>

          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#F17141]">
            Day Details
          </span>
          <h2 className="mt-2 text-[26px] sm:text-[30px] font-extrabold tracking-[-0.05em] text-[#24201D]">
            {formattedDate}
          </h2>
          <p className="mt-2 text-[12px] leading-5 text-[#766F69]">
            A local breakdown of metrics recorded on this calendar date.
          </p>

          {dayData ? (
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  eyebrow="Messages"
                  value={formatNumber(dayData.messages)}
                  subtitle="Exact count"
                />
                <MetricCard
                  eyebrow="Words"
                  value={formatNumber(dayData.words)}
                  subtitle="Exact count"
                />
                <MetricCard
                  eyebrow="Emojis"
                  value={formatNumber(dayData.emojis)}
                  subtitle="Exact count"
                />
                <MetricCard
                  eyebrow="Questions"
                  value={formatNumber(dayData.questions)}
                  subtitle="Punctuation based"
                />
              </div>

              {dayData.bySender && Object.keys(dayData.bySender).length > 0 && (
                <div className="rounded-2xl border border-[#EDE2D6] bg-[#FFF9F0] p-5">
                  <h4 className="text-[11px] font-extrabold text-[#806641] uppercase tracking-[0.12em] mb-3">
                    Messages by Participant
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(dayData.bySender).map(([sender, count]) => {
                      const share = dayData.messages > 0 ? (count / dayData.messages) * 100 : 0;
                      return (
                        <div key={sender} className="space-y-1">
                          <div className="flex justify-between text-[12px] font-bold text-[#24201D]">
                            <span>{sender}</span>
                            <span>{formatNumber(count)} msgs ({share.toFixed(1)}%)</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#EDE2D6] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#F17141]"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-[#FFF9F0] border border-[#E8D9C8] p-4 text-[12px] leading-5 text-[#766F69]">
                <span className="font-extrabold text-[#24201D]">
                  {formatNumber(dayData.sessions)} conversation session{dayData.sessions === 1 ? '' : 's'}
                </span>{' '}
                were recorded on this date using the 30-minute gap rule.
              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-[#E6D3AE] bg-[#FFF9F0] p-8 text-center text-[13px] text-[#766F69]">
              No message activity recorded on this date.
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
