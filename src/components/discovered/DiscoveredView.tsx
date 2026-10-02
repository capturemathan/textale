import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useTexTale } from '@/store/textale-store';
import { IconMessageCircle, IconArrowRight, IconLogo } from '@/components/icons';
import { AppFooter } from '@/components/common/Footer';
import { getChatSpanYMDParts } from '@/lib/formatting';
import WrappedCard from '@/components/share/WrappedCard';

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-[13px] bg-[#FFECAE] text-[#F17141] shadow-[0_6px_18px_rgba(241,113,65,0.15)] p-1">
        <IconLogo className="size-full text-[#F17141]" featherAccent="#FFECAE" />
      </span>
      <span className="text-[19px] font-extrabold tracking-[-0.05em] text-[#24201D]">
        Tex<span className="text-[#F17141]">Tale</span>
      </span>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => new Intl.NumberFormat("en-US").format(Math.round(latest)));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export function DiscoveredView() {
  const { analysis, participants, messageCount, revealStory } = useTexTale();
  const [showWrapped, setShowWrapped] = useState(false);

  if (!analysis) return null;

  const participantNames = participants.map(p => p.name).join(" + ");
  const activeDays = analysis.activeDays || 0;
  
  const firstDate = analysis.days?.[0]?.date || analysis.firstTimestamp;
  const lastDate = analysis.days?.[analysis.days.length - 1]?.date || analysis.lastTimestamp;
  const ymd = (firstDate && lastDate) ? getChatSpanYMDParts(firstDate, lastDate) : null;

  return (
    <main className="noise-layer min-h-[100dvh] bg-[#FFFCF5] px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1060px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
          <BrandMark />
        </motion.div>

        <div className="mx-auto max-w-3xl py-20 text-center sm:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="editorial-script text-[28px] text-[#F17141]">look what we found</span>
            <h1 className="mt-3 text-[clamp(42px,7vw,74px)] font-extrabold leading-[.95] tracking-[-.07em]">
              We found your<br />
              <span className="text-[#F17141]">conversation.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[13px] leading-6 text-[#766F69]">
              Here is the factual outline before we open the story.
            </p>
          </motion.div>

          {/* Separate Modular Cards Container */}
          <div className="mt-14 space-y-4 text-left">
            {/* Header Identity Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              className="rounded-[24px] border border-[#E8D9C8] bg-[#FFECAE] p-5 sm:p-6 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#FFFCF5] text-[#F17141] shadow-2xs">
                    <IconMessageCircle className="w-5 h-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[15px] font-extrabold text-[#24201D] leading-snug break-words line-clamp-3">
                        {participants.length <= 3 
                          ? participantNames 
                          : `${participants.slice(0, 3).map(p => p.name).join(" + ")} ... and ${participants.length - 3} more`}
                      </p>
                      {participants.length > 2 && (
                        <span className="rounded-full bg-[#F17141]/10 px-2.5 py-0.5 text-[10px] font-extrabold text-[#F17141]">
                          Group Chat ({participants.length})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="inline-flex shrink-0 items-center self-start sm:self-center rounded-full bg-[#F17141]/12 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#BA4F27]">
                  Local file
                </span>
              </div>
            </motion.div>

            {/* 4 Separate Metric Cards */}
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }} 
                className="rounded-2xl border border-[#EDE2D6] bg-[#FFFCF5] p-5 shadow-2xs flex flex-col justify-between min-h-[105px]"
              >
                <div className="text-[24px] sm:text-[30px] font-extrabold tracking-[-.06em] text-[#24201D] flex items-baseline">
                  <AnimatedNumber value={messageCount} />
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#806641] mt-2">messages</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5 }} 
                className="rounded-2xl border border-[#EDE2D6] bg-[#FFFCF5] p-5 shadow-2xs flex flex-col justify-between min-h-[105px]"
              >
                <div className="text-[24px] sm:text-[30px] font-extrabold tracking-[-.06em] text-[#24201D] flex items-baseline">
                  <AnimatedNumber value={participants.length} />
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#806641] mt-2">participants</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6 }} 
                className="rounded-2xl border border-[#EDE2D6] bg-[#FFFCF5] p-5 shadow-2xs flex flex-col justify-between min-h-[105px]"
              >
                <div className="text-[24px] sm:text-[30px] font-extrabold tracking-[-.06em] text-[#24201D] flex items-baseline">
                  <AnimatedNumber value={activeDays} />
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#806641] mt-2">active days</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.7 }} 
                className="rounded-2xl border border-[#EDE2D6] bg-[#FFFCF5] p-5 shadow-2xs flex flex-col justify-between min-h-[105px]"
              >
                <div className="flex items-baseline gap-x-2 gap-y-1 flex-wrap">
                  {ymd ? (
                    <>
                      {ymd.years > 0 && (
                        <span className="inline-flex items-baseline gap-1">
                          <span className="text-[22px] sm:text-[26px] font-extrabold tracking-[-.06em] text-[#24201D]">{ymd.years}</span>
                          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#806641]">
                            {ymd.years === 1 ? "YR" : "YRS"}
                          </span>
                        </span>
                      )}
                      {(ymd.years > 0 || ymd.months > 0) && (
                        <span className="inline-flex items-baseline gap-1">
                          <span className="text-[22px] sm:text-[26px] font-extrabold tracking-[-.06em] text-[#24201D]">{ymd.months}</span>
                          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#806641]">
                            {ymd.months === 1 ? "MO" : "MOS"}
                          </span>
                        </span>
                      )}
                      {(ymd.days > 0 || (ymd.years === 0 && ymd.months === 0)) && (
                        <span className="inline-flex items-baseline gap-1">
                          <span className="text-[22px] sm:text-[26px] font-extrabold tracking-[-.06em] text-[#24201D]">{ymd.days}</span>
                          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#806641]">
                            {ymd.days === 1 ? "DAY" : "DAYS"}
                          </span>
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[24px] sm:text-[30px] font-extrabold tracking-[-.06em] text-[#24201D]">—</span>
                  )}
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#806641] mt-2">chat span</div>
              </motion.div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button 
                onClick={revealStory} 
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#F17141] text-[#FFFCF5] shadow-[0_10px_25px_rgba(241,113,65,0.2)] hover:-translate-y-0.5 hover:bg-[#e76537] px-6 py-3.5 text-[12px] font-bold transition duration-200 cursor-pointer"
              >
                Reveal the story <IconArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowWrapped(true)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#EADFD5] bg-[#FFFCF5] text-[#24201D] hover:bg-[#FFECAE] px-6 py-3.5 text-[12px] font-bold transition duration-200 cursor-pointer"
              >
                See your Chat Wrapped
              </button>
            </div>
            <p className="mt-5 text-[11px] text-[#A59A90] mb-6">Everything was processed in your browser.</p>
            <div className="border-t border-[#EADFD5]/60 pt-4">
              <AppFooter />
            </div>
          </motion.div>
        </div>
      </div>

      {showWrapped && analysis && (
        <WrappedCard
          analysis={analysis}
          participants={participants}
          onClose={() => setShowWrapped(false)}
          source="discovered"
        />
      )}
    </main>
  );
}
