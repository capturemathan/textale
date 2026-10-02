import { useState } from "react";
import { 
  IconSparkles, 
  IconCheck, 
  IconClose,
  IconArrowRight,
} from "@/components/icons";

type Platform = "ios" | "android";

interface CompactExportGuideProps {
  onOpenModal: () => void;
}

export function CompactExportGuide({ onOpenModal }: CompactExportGuideProps) {
  const [platform, setPlatform] = useState<Platform>("ios");

  return (
    <div className="mt-8 rounded-[26px] border border-[#E7D9C7] bg-[#FFF8EA] p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EADFD5]">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-lg bg-[#FFECAE] text-[#F17141]">
            <IconSparkles className="size-3.5" />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C4E2A]">
            How to export your chat in 3 quick steps
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-full border border-[#E4D5C5] bg-[#F5ECE1] p-1 shadow-inner">
            <button
              onClick={() => setPlatform("ios")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                platform === "ios"
                  ? "bg-[#FFFCF5] text-[#24201D] shadow-2xs"
                  : "text-[#766F69] hover:text-[#24201D]"
              }`}
            >
              <span>🍎 iPhone</span>
            </button>
            <button
              onClick={() => setPlatform("android")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                platform === "android"
                  ? "bg-[#FFFCF5] text-[#24201D] shadow-2xs"
                  : "text-[#766F69] hover:text-[#24201D]"
              }`}
            >
              <span>🤖 Android</span>
            </button>
          </div>

          <button
            onClick={onOpenModal}
            className="text-[11px] font-bold text-[#F17141] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Visual walkthrough</span>
            <span>↗</span>
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {/* Step 1 */}
        <div className="rounded-xl border border-[#EDE2D6] bg-[#FFFCF5] p-3.5 flex items-start gap-3">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#FFECAE] text-[11px] font-black text-[#F17141]">
            01
          </span>
          <div>
            <p className="text-[12px] font-extrabold text-[#24201D]">
              {platform === "ios" ? "Tap Contact Info" : "Tap Menu (⋮)"}
            </p>
            <p className="text-[11px] text-[#766F69] mt-0.5 leading-snug">
              {platform === "ios"
                ? "Open chat, tap the contact name at top."
                : "Open chat, tap 3 dots in top right."}
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-xl border border-[#EDE2D6] bg-[#FFFCF5] p-3.5 flex items-start gap-3">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#FFECAE] text-[11px] font-black text-[#F17141]">
            02
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[12px] font-extrabold text-[#24201D]">Export Chat</p>
              <span className="rounded bg-[#EBF7EE] px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">Without Media</span>
            </div>
            <p className="text-[11px] text-[#766F69] mt-0.5 leading-snug">
              Choose "Without Media" so the file stays lightweight and fast.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-xl border border-[#EDE2D6] bg-[#FFFCF5] p-3.5 flex items-start gap-3">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#FFECAE] text-[11px] font-black text-[#F17141]">
            03
          </span>
          <div>
            <p className="text-[12px] font-extrabold text-[#24201D]">Drop File Here</p>
            <p className="text-[11px] text-[#766F69] mt-0.5 leading-snug">
              Save the <code className="rounded bg-[#F4E3D0] px-1 py-0.2 text-[10px] font-bold text-[#844E29]">.txt</code> or <code className="rounded bg-[#F4E3D0] px-1 py-0.2 text-[10px] font-bold text-[#844E29]">.zip</code> and drop it in the box above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExportGuideModalProps {
  onClose: () => void;
}

export function ExportGuideModal({ onClose }: ExportGuideModalProps) {
  const [platform, setPlatform] = useState<Platform>("ios");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#24201D]/30 p-5 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true" data-testid="modal-export-guide">
      <div className="relative w-full max-w-2xl rounded-[30px] border border-[#E7D9C7] bg-[#FFFCF5] p-6 sm:p-8 shadow-[0_25px_80px_rgba(36,32,29,.18)] my-8">
        <button 
          onClick={onClose} 
          className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-[#766F69] hover:bg-[#F3EBE2] cursor-pointer" 
          aria-label="Close export guide"
        >
          <IconClose className="size-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="grid size-9 place-items-center rounded-2xl bg-[#FFECAE] text-[#F17141]">
            <IconSparkles className="size-4" />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C4E2A]">
            Step-by-step export walkthrough
          </span>
        </div>

        <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-[-0.04em] text-[#24201D]">
          Follow <span className="text-[#F17141]">3 quick steps</span> and voilà
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#766F69]">
          Takes less than 30 seconds. No media needed, and 100% processed privately inside your browser.
        </p>

        {/* Platform Toggle */}
        <div className="mt-5 flex justify-center">
          <div className="inline-flex rounded-full border border-[#E4D5C5] bg-[#F5ECE1] p-1.5 shadow-inner">
            <button
              onClick={() => setPlatform("ios")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-[12px] font-bold transition-all cursor-pointer ${
                platform === "ios"
                  ? "bg-[#FFFCF5] text-[#24201D] shadow-[0_3px_10px_rgba(36,32,29,0.08)]"
                  : "text-[#766F69] hover:text-[#24201D]"
              }`}
            >
              <span>🍎 iPhone / iOS</span>
            </button>
            <button
              onClick={() => setPlatform("android")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-[12px] font-bold transition-all cursor-pointer ${
                platform === "android"
                  ? "bg-[#FFFCF5] text-[#24201D] shadow-[0_3px_10px_rgba(36,32,29,0.08)]"
                  : "text-[#766F69] hover:text-[#24201D]"
              }`}
            >
              <span>🤖 Android</span>
            </button>
          </div>
        </div>

        {/* 3 Step Visual Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-2xl border border-[#E8DACB] bg-[#FFFBF0] p-4.5 flex flex-col justify-between">
            <div>
              <span className="inline-flex size-7 items-center justify-center rounded-xl bg-[#FFECAE] text-[11px] font-black text-[#F17141]">
                01
              </span>
              <h3 className="mt-3 text-[15px] font-extrabold text-[#24201D]">
                {platform === "ios" ? "Tap Contact Name" : "Tap Three Dots (⋮)"}
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#766F69]">
                {platform === "ios"
                  ? "Open WhatsApp, go to the conversation, and tap the contact or group name at the top."
                  : "Open WhatsApp, go to your chat, and tap the three vertical dots (⋮) in the top right."}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-[#E8DACB] bg-[#FFFBF0] p-4.5 flex flex-col justify-between">
            <div>
              <span className="inline-flex size-7 items-center justify-center rounded-xl bg-[#FFECAE] text-[11px] font-black text-[#F17141]">
                02
              </span>
              <h3 className="mt-3 text-[15px] font-extrabold text-[#24201D]">
                Export "Without Media"
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#766F69]">
                {platform === "ios"
                  ? "Scroll down, tap Export Chat, and select 'Without Media'. It keeps text and timestamps while staying tiny."
                  : "Tap More → Export chat, then select 'Without media'. A lightweight .txt file is created."}
              </p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 rounded bg-[#EBF7EE] px-2 py-0.5 text-[10px] font-bold text-emerald-700 w-fit">
              <IconCheck className="size-3" /> Recommended
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-[#F17141]/30 bg-gradient-to-b from-[#FFF9EE] to-[#FFECAE]/50 p-4.5 flex flex-col justify-between">
            <div>
              <span className="inline-flex size-7 items-center justify-center rounded-xl bg-[#F17141] text-[11px] font-black text-[#FFFCF5]">
                03
              </span>
              <h3 className="mt-3 text-[15px] font-extrabold text-[#24201D]">
                Drop File Here
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#766F69]">
                Save the exported <code className="rounded bg-[#F4E3D0] px-1 py-0.5 text-[11px] font-bold text-[#844E29]">_chat.txt</code> or <code className="rounded bg-[#F4E3D0] px-1 py-0.5 text-[11px] font-bold text-[#844E29]">.zip</code> and drop it right into TexTale.
              </p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#F17141]">
              <IconCheck className="size-3.5" /> Ready in 2 seconds
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-[#EBDCCF] bg-[#FFF8EA] px-4 py-2.5">
          <p className="text-[12px] text-[#766F69]">
            <strong className="text-[#24201D]">Why "Without Media"?</strong> It keeps the export file tiny (&lt; 2 MB), transfers instantly, and preserves 100% of messages, words, and emojis.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-[#F17141] px-6 py-2.5 text-[13px] font-bold text-[#FFFCF5] shadow-[0_8px_20px_rgba(241,113,65,0.2)] hover:bg-[#e76537] transition cursor-pointer"
          >
            <span>Ready to analyze</span>
            <IconArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Retain backwards-compatible default ExportSteps alias if needed
export function ExportSteps() {
  return null;
}
