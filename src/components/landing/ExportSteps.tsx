import { useState } from "react";
import { motion } from "motion/react";
import { 
  IconSparkles, 
  IconCheck, 
  IconArrowRight, 
  IconUpload, 
  IconDotsVertical, 
  IconShield
} from "@/components/icons";

type Platform = "ios" | "android";

export function ExportSteps() {
  const [platform, setPlatform] = useState<Platform>("ios");

  const scrollToImport = () => {
    document.getElementById("import")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="how-to-export" className="relative mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-60">
        <div className="h-[420px] w-[90vw] max-w-[960px] rounded-full bg-radial from-[#FFECAE]/60 via-[#FFF4D2]/30 to-transparent blur-3xl" />
      </div>

      {/* Header section */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E7D9C7] bg-[#FFFCF5] px-3.5 py-1.5 text-[11px] font-bold text-[#F17141] shadow-2xs">
          <IconSparkles className="size-3.5" />
          <span>SUPER SIMPLE PROCESS</span>
        </div>

        <h2 className="text-balance text-[34px] font-extrabold tracking-[-0.05em] text-[#24201D] sm:text-[46px] sm:leading-[1.05]">
          Follow <span className="text-[#F17141]">3 quick steps</span> &amp; voilà — <br className="hidden sm:inline" />
          your chat tale begins.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-[#766F69] sm:text-[16px]">
          Exporting takes less than 30 seconds. No passwords, no media needed, and 100% processed privately inside your browser.
        </p>

        {/* Platform Switcher Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-[#E4D5C5] bg-[#F5ECE1] p-1.5 shadow-inner">
            <button
              onClick={() => setPlatform("ios")}
              data-testid="tab-export-ios"
              className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-[12px] font-bold transition-all ${
                platform === "ios"
                  ? "bg-[#FFFCF5] text-[#24201D] shadow-[0_3px_10px_rgba(36,32,29,0.08)]"
                  : "text-[#766F69] hover:text-[#24201D]"
              }`}
            >
              <span className="text-[14px]">🍎</span>
              <span>iPhone / iOS</span>
            </button>
            <button
              onClick={() => setPlatform("android")}
              data-testid="tab-export-android"
              className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-[12px] font-bold transition-all ${
                platform === "android"
                  ? "bg-[#FFFCF5] text-[#24201D] shadow-[0_3px_10px_rgba(36,32,29,0.08)]"
                  : "text-[#766F69] hover:text-[#24201D]"
              }`}
            >
              <span className="text-[14px]">🤖</span>
              <span>Android</span>
            </button>
          </div>
        </div>
      </div>

      {/* Steps Cards Grid */}
      <div className="relative mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
        {/* Step 1 */}
        <motion.div
          key={`step1-${platform}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="group relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-[#E8DACB] bg-[#FFFCF5] p-6 shadow-[0_10px_35px_rgba(36,32,29,0.04)] transition hover:-translate-y-1 hover:border-[#F17141]/50 hover:shadow-[0_16px_40px_rgba(241,113,65,0.08)] sm:p-7"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-[#FFECAE] text-[13px] font-black text-[#F17141] shadow-2xs">
                01
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#A59A90]">
                {platform === "ios" ? "Contact Info" : "Chat Menu"}
              </span>
            </div>

            <h3 className="mt-5 text-[19px] font-extrabold tracking-[-0.03em] text-[#24201D]">
              {platform === "ios" ? "Open Chat & Tap Contact" : "Open Chat & Tap Menu"}
            </h3>

            <p className="mt-2 text-[13px] leading-relaxed text-[#766F69]">
              {platform === "ios"
                ? "Open WhatsApp, go to the conversation you want to analyze, and tap the contact or group name at the top."
                : "Open WhatsApp, open your chat, and tap the three vertical dots (⋮) in the top-right corner."}
            </p>
          </div>

          {/* Step 1 Visual Mockup */}
          <div className="mt-6 rounded-2xl border border-[#EDE2D6] bg-[#FFFBF0] p-3.5">
            <div className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-2xs border border-[#F0E6DA]">
              <div className="flex items-center gap-2.5">
                <div className="relative size-8 rounded-full bg-[#FFE5CE] flex items-center justify-center text-[12px] font-bold text-[#F17141]">
                  💬
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold text-[#24201D]">Favorite Chat</span>
                    {platform === "ios" && (
                      <span className="rounded-md bg-[#FFECAE] px-1.5 py-0.5 text-[9px] font-black text-[#F17141] animate-pulse">
                        Tap here 👆
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#A59A90]">Online</p>
                </div>
              </div>

              {platform === "android" ? (
                <div className="relative flex items-center gap-1">
                  <span className="rounded-md bg-[#FFECAE] px-1.5 py-0.5 text-[9px] font-black text-[#F17141] animate-pulse">
                    Tap ⋮
                  </span>
                  <div className="grid size-7 place-items-center rounded-lg bg-[#FFECAE]/70 text-[#F17141]">
                    <IconDotsVertical className="size-4" />
                  </div>
                </div>
              ) : (
                <div className="text-[10px] font-semibold text-[#A59A90]">Info ›</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          key={`step2-${platform}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="group relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-[#E8DACB] bg-[#FFFCF5] p-6 shadow-[0_10px_35px_rgba(36,32,29,0.04)] transition hover:-translate-y-1 hover:border-[#F17141]/50 hover:shadow-[0_16px_40px_rgba(241,113,65,0.08)] sm:p-7"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-[#FFECAE] text-[13px] font-black text-[#F17141] shadow-2xs">
                02
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF7EE] px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <IconCheck className="size-3" /> Recommended
              </span>
            </div>

            <h3 className="mt-5 text-[19px] font-extrabold tracking-[-0.03em] text-[#24201D]">
              Export <span className="text-[#F17141]">"Without Media"</span>
            </h3>

            <p className="mt-2 text-[13px] leading-relaxed text-[#766F69]">
              {platform === "ios"
                ? "Scroll down, tap Export Chat, and choose 'Without Media'. It keeps text, timestamps & emojis while staying tiny!"
                : "Tap More → Export chat, then choose 'Without media'. A lightweight .txt file is created instantly."}
            </p>
          </div>

          {/* Step 2 Visual Mockup */}
          <div className="mt-6 rounded-2xl border border-[#EDE2D6] bg-[#FFFBF0] p-3.5">
            <div className="space-y-2">
              {/* Option: Without Media */}
              <div className="flex items-center justify-between rounded-xl border border-[#F17141]/40 bg-[#FFF3E8] p-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-[#F17141] text-white text-[10px]">
                    ✓
                  </span>
                  <span className="text-[12px] font-bold text-[#24201D]">Without Media</span>
                </div>
                <span className="rounded bg-[#FFECAE] px-1.5 py-0.5 text-[9px] font-extrabold text-[#F17141]">
                  ⚡ Fast &lt; 2s
                </span>
              </div>

              {/* Option: Attach Media */}
              <div className="flex items-center justify-between rounded-xl border border-transparent bg-white/70 p-2 text-[#9A8F85]">
                <span className="text-[11px] font-medium">Attach Media (large files)</span>
                <span className="text-[9px]">Slow</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          key={`step3-${platform}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.19 }}
          className="group relative flex flex-col justify-between overflow-hidden rounded-[30px] border-2 border-[#F17141]/30 bg-gradient-to-b from-[#FFF9EE] to-[#FFECAE]/60 p-6 shadow-[0_12px_40px_rgba(241,113,65,0.12)] transition hover:-translate-y-1 hover:border-[#F17141] sm:p-7"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-[#F17141] text-[13px] font-black text-[#FFFCF5] shadow-[0_4px_12px_rgba(241,113,65,0.3)]">
                03
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F17141]/15 px-2.5 py-0.5 text-[11px] font-extrabold text-[#F17141]">
                <IconSparkles className="size-3" /> Voilà!
              </span>
            </div>

            <h3 className="mt-5 text-[19px] font-extrabold tracking-[-0.03em] text-[#24201D]">
              Drop File &amp; Uncover Magic
            </h3>

            <p className="mt-2 text-[13px] leading-relaxed text-[#766F69]">
              Save the exported <code className="rounded bg-[#F4E3D0] px-1 py-0.5 text-[11px] font-bold text-[#844E29]">_chat.txt</code> or <code className="rounded bg-[#F4E3D0] px-1 py-0.5 text-[11px] font-bold text-[#844E29]">.zip</code> and drop it right into TexTale.
            </p>
          </div>

          {/* Step 3 Visual Mockup & Button */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-[#E9CCA0] bg-white/90 p-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-xl bg-[#FFECAE] text-[#F17141]">
                  <IconUpload className="size-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-[#24201D]">_chat.txt ready</p>
                  <p className="text-[9.5px] text-[#766F69]">Instant private analysis</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9.5px] font-bold text-emerald-800">
                Ready
              </span>
            </div>

            <button
              onClick={scrollToImport}
              data-testid="button-step-dropzone"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#F17141] py-2.5 text-[12px] font-bold text-[#FFFCF5] shadow-[0_8px_20px_rgba(241,113,65,0.25)] transition hover:bg-[#e66332] cursor-pointer"
            >
              <span>Drop your export now</span>
              <IconArrowRight className="size-3.5 transition group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Pro tip banner */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#EBDCCF] bg-[#FFFCF5]/90 px-5 py-3.5 sm:flex-row sm:px-6">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#FFECAE] text-[15px]">
            💡
          </span>
          <p className="text-[12.5px] text-[#766F69]">
            <strong className="font-bold text-[#24201D]">Why "Without Media"?</strong> It keeps the export file tiny (&lt; 2 MB), transfers in seconds, and still contains 100% of messages, time stamps, emoji records, and participant streaks.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-[11px] font-bold text-[#A59A90]">
          <IconShield className="size-3.5 text-[#F17141]" />
          <span>Zero Server Uploads</span>
        </div>
      </div>
    </section>
  );
}
