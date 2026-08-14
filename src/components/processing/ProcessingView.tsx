
import { motion } from 'motion/react';
import { useTexTale, PROCESSING_STAGES } from '@/store/textale-store';
import { IconActivity, IconCheck, IconLoader, IconMessageCircle, IconArrowRight, IconLogo } from '@/components/icons';
import { AppFooter } from '@/components/common/Footer';

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

export function ProcessingView() {
  const { phase, stageIndex, chatEntries, mediaFileCount, chooseChatFile, reset, fileName } = useTexTale();

  if (phase === 'choose-chat') {
    return (
      <main className="noise-layer grid min-h-[100dvh] place-items-center bg-[#FFFCF5] px-5 py-12">
        <div className="w-full max-w-xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-14 flex items-center justify-between">
            <BrandMark />
            <button onClick={reset} className="inline-flex items-center gap-2 text-[11px] font-bold text-[#766F69] hover:text-[#F17141]">
              Cancel
            </button>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 text-center">
            <p className="editorial-script text-[26px] text-[#F17141]">one small choice</p>
            <h1 className="mt-2 text-[38px] font-extrabold tracking-[-.065em]">Which chat should we read?</h1>
            <p className="mx-auto mt-3 max-w-sm text-[13px] leading-6 text-[#766F69]">
              This ZIP contains several text exports. Choose one; everything still stays in your browser.
              {mediaFileCount > 0 && ` We also found ${mediaFileCount} media files, which will be ignored.`}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2 rounded-[26px] border border-[#EDE2D6] bg-[#FFF9F0] p-4 sm:p-5">
            {chatEntries.map((entry) => (
              <button
                key={entry}
                onClick={() => chooseChatFile(entry)}
                className="flex w-full items-center gap-3 rounded-2xl border border-[#EDE2D6] bg-[#FFFCF5] px-4 py-4 text-left transition hover:border-[#F17141] hover:bg-[#FFF4E4]"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#FFECAE] text-[#F17141]">
                  <IconMessageCircle className="w-5 h-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-extrabold">{entry}</span>
                </span>
                <IconArrowRight className="w-4 h-4 text-[#F17141]" />
              </button>
            ))}
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="noise-layer grid min-h-[100dvh] place-items-center bg-[#FFFCF5] px-5 py-12">
      <div className="w-full max-w-xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-14 flex items-center justify-between">
          <BrandMark />
          <button onClick={reset} className="inline-flex items-center gap-2 text-[11px] font-bold text-[#766F69] hover:text-[#F17141]">
            Cancel
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 text-center">
          <div className="relative mx-auto mb-8 grid size-28 place-items-center rounded-full border border-[#F3C9BB] bg-[#FFF4E4]">
            <span className="absolute inset-3 rounded-full border border-dashed border-[#F17141]/45 animate-[spin_8s_linear_infinite]" />
            <IconActivity className="w-8 h-8 text-[#F17141]" />
          </div>
          <p className="editorial-script text-[26px] text-[#F17141]">a moment, please</p>
          <h1 className="mt-2 text-[38px] font-extrabold tracking-[-.065em]">Reading the shape of your chat.</h1>
          <p className="mx-auto mt-3 max-w-sm text-[13px] leading-6 text-[#766F69]">
            Everything is happening locally. We never fake a percentage — just a sequence of real steps.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[26px] border border-[#EDE2D6] bg-[#FFF9F0] p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#24201D]">
              <IconMessageCircle className="w-4 h-4 text-[#F17141]" />
              {fileName}
            </div>
          </div>
          
          <div className="space-y-3">
            {PROCESSING_STAGES.map((item, index) => {
              const isPast = index < stageIndex;
              const isCurrent = index === stageIndex;

              return (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
                  className={`flex items-center gap-3 text-[12px] transition-colors duration-300 ${
                    isPast ? "text-[#24201D]" : isCurrent ? "font-bold text-[#F17141]" : "text-[#B3A79A]"
                  }`}
                >
                  <span
                    className={`grid size-5 place-items-center rounded-full border transition-colors duration-300 ${
                      isPast
                        ? "border-[#F17141] bg-[#F17141] text-[#FFFCF5]"
                        : isCurrent
                        ? "border-[#F17141] bg-[#FFF4E4]"
                        : "border-[#DCD0C5]"
                    }`}
                  >
                    {isPast ? (
                      <IconCheck className="w-3 h-3" />
                    ) : isCurrent ? (
                      <IconLoader className="w-3 h-3 animate-spin text-[#F17141]" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-[#DCD0C5]" />
                    )}
                  </span>
                  {item}
                  {isCurrent && (
                    <span className="ml-auto text-[10px] uppercase tracking-[.14em] text-[#F17141]">working</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <AppFooter />
        </div>
      </div>
    </main>
  );
}
