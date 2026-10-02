import { useState } from "react";
import { 
  IconArrowRight, 
  IconShield, 
  IconCheck, 
  IconActivity, 
  IconBarChart, 
  IconHash,
  IconLogo,
} from "@/components/icons";
import { UploadDropzone } from "./UploadDropzone";
import { PrivacyModal } from "./PrivacyModal";
import { CompactExportGuide, ExportGuideModal } from "./ExportSteps";
import { AppFooter } from "@/components/common/Footer";

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" data-testid="brand-text">
      <span className="grid size-9 place-items-center rounded-[13px] bg-[#FFECAE] text-[#F17141] shadow-[0_6px_18px_rgba(241,113,65,0.15)] p-1">
        <IconLogo className="size-full text-[#F17141]" featherAccent="#FFECAE" />
      </span>
      {!compact && (
        <span className="text-[19px] font-extrabold tracking-[-0.05em] text-[#24201D]">
          Tex<span className="text-[#F17141]">Tale</span>
        </span>
      )}
    </div>
  );
}

function PrivacyBadge({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-[#E7D9C7] bg-[#FFFCF5]/80 px-3 py-2 text-[11px] font-semibold text-[#766F69] hover:border-[#F17141]/40 hover:bg-[#FFF8EA] hover:text-[#24201D] transition cursor-pointer" 
      data-testid="status-local-processing"
    >
      <IconShield className="size-[13px] text-[#F17141]" />
      <span>Analyzed locally on your device</span>
    </button>
  );
}

interface LandingPageProps {
  onFileAccepted: (file: File) => void;
}

export function LandingPage({ onFileAccepted }: LandingPageProps) {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showExportGuide, setShowExportGuide] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="noise-layer min-h-[100dvh] bg-[#FFFCF5] text-[#24201D]">
      <header className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <BrandMark />
        <div className="hidden items-center gap-6 text-[11px] font-bold text-[#766F69] sm:flex">
          <button 
            onClick={() => setShowExportGuide(true)} 
            data-testid="button-how-it-works" 
            className="transition hover:text-[#F17141] cursor-pointer"
          >
            How to export
          </button>
          <span className="h-4 w-px bg-[#E5DCD2]" />
          <PrivacyBadge onClick={() => setShowPrivacy(true)} />
        </div>
        <button 
          onClick={() => setShowPrivacy(true)} 
          className="grid size-9 place-items-center rounded-full bg-[#F3EBE2] text-[#766F69] sm:hidden cursor-pointer" 
          aria-label="Show privacy details" 
          data-testid="button-mobile-privacy"
        >
          <IconShield className="size-[15px]" />
        </button>
      </header>

      <section className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 pb-14 pt-9 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:px-12 lg:pb-20 lg:pt-16">
        <div className="page-enter">
          <div className="mb-6 flex items-center gap-3">
            <span className="editorial-script -rotate-3 text-[22px] text-[#F17141]">Your tiny chat detective</span>
            <span className="h-px w-9 bg-[#F17141]/40" />
          </div>
          <h1 className="max-w-[700px] text-balance text-[clamp(48px,7vw,92px)] font-extrabold leading-[.94] tracking-[-0.075em]">
            Your chat has<br /><span className="text-[#F17141]">more data</span> than<br />you think.
          </h1>
          <p className="mt-7 max-w-[560px] text-[17px] leading-8 text-[#766F69] sm:text-[19px]">
            Drop your WhatsApp export and discover the patterns hiding in your conversation, measured carefully and <span className="whitespace-nowrap font-extrabold text-[#24201D] bg-[#FFECAE] px-2.5 py-0.5 rounded-lg border border-[#EADFD5] shadow-2xs">kept completely private.</span>
          </p>

          {/* Prominent Privacy & Trust Guarantee Strip */}
          <div className="mt-8 rounded-2xl border border-[#EADFD5] bg-[#FFF8EA] p-4.5 sm:p-5 shadow-2xs max-w-[580px]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-lg bg-[#FFECAE] text-[#F17141]">
                  <IconShield className="size-3.5" />
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C4E2A]">
                  Private &amp; Local by Design
                </span>
              </div>
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-[11px] font-bold text-[#F17141] hover:underline cursor-pointer"
              >
                Security details →
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-start gap-2.5">
                <IconCheck className="size-4 shrink-0 text-[#F17141] mt-0.5" />
                <div>
                  <p className="text-[12px] font-extrabold text-[#24201D]">100% On-Device</p>
                  <p className="text-[11px] text-[#766F69] leading-snug">Calculated purely inside your browser memory</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <IconCheck className="size-4 shrink-0 text-[#F17141] mt-0.5" />
                <div>
                  <p className="text-[12px] font-extrabold text-[#24201D]">Zero Uploads</p>
                  <p className="text-[11px] text-[#766F69] leading-snug">Your chats never leave your computer or phone</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <IconCheck className="size-4 shrink-0 text-[#F17141] mt-0.5" />
                <div>
                  <p className="text-[12px] font-extrabold text-[#24201D]">No Sign-up</p>
                  <p className="text-[11px] text-[#766F69] leading-snug">No account, no database, no cookies</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button 
              onClick={() => scrollTo("import")} 
              data-testid="button-start-import" 
              className="group inline-flex items-center gap-3 rounded-full bg-[#F17141] px-5 py-3.5 text-[13px] font-bold text-[#FFFCF5] shadow-[0_12px_30px_rgba(241,113,65,0.22)] transition hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Drop your export below</span>
              <IconArrowRight className="size-4 transition group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => setShowExportGuide(true)} 
              data-testid="button-view-steps" 
              className="inline-flex items-center gap-2 rounded-full border border-[#E7D9C7] bg-[#FFFCF5] px-4 py-3 text-[12px] font-bold text-[#766F69] hover:bg-[#F3EBE2] hover:text-[#24201D] transition cursor-pointer"
            >
              How to export guide ↗
            </button>
          </div>
        </div>

        {/* Visually Appealing Decorative Chart Preview */}
        <div className="relative page-enter [animation-delay:120ms]">
          <div className="relative mx-auto max-w-[550px] rotate-[1.5deg] rounded-[34px] border border-[#EAD8B6] bg-[#FFECAE] p-4 shadow-[0_28px_80px_rgba(141,102,40,0.15)] sm:p-6 float-slow">
            <div className="absolute -left-4 top-12 z-20 hidden -rotate-6 rounded-2xl border border-[#EADFD5] bg-[#FFFCF5] px-4 py-3 shadow-[0_12px_30px_rgba(61,47,35,0.12)] sm:block">
              <p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#A59A90]">Peak hour</p>
              <p className="mt-1 text-[24px] font-extrabold tracking-[-.06em] text-[#24201D]">9 PM</p>
            </div>
            <div className="absolute -right-4 sm:-right-6 bottom-8 z-20 hidden rotate-6 rounded-2xl border border-[#F3C9BB] bg-[#F17141] px-4.5 py-3 text-[#FFFCF5] shadow-[0_14px_35px_rgba(241,113,65,0.3)] sm:block">
              <p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#FFECAE]">Longest run</p>
              <p className="mt-1 text-[24px] font-extrabold tracking-[-.06em]">4h 37m</p>
            </div>
            <div className="rounded-[25px] bg-[#FFFCF5] p-5 sm:p-7 relative z-10">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#A59A90]">A conversation, observed</p>
                  <p className="mt-1 text-[17px] font-extrabold tracking-[-.04em]">The little things add up.</p>
                </div>
                <span className="grid size-9 place-items-center rounded-xl bg-[#F3EBE2] text-[#F17141]"><IconActivity className="size-[17px]" /></span>
              </div>
              <div className="mb-7 flex items-end gap-3">
                <span className="text-[58px] font-extrabold leading-none tracking-[-.08em] text-[#24201D]">48,291</span>
                <span className="mb-1 text-[12px] font-semibold text-[#766F69]">messages<br />counted</span>
              </div>
              <div className="flex h-32 items-end gap-1.5 border-b border-[#EFE5D9] pb-0">
                {[32, 49, 42, 75, 58, 88, 54, 64, 98, 68, 79, 51, 72, 45, 83, 62, 91, 66, 74, 100, 80, 57, 87, 70].map((height, index) => (
                  <span key={index} className="chart-bar flex-1 rounded-t-[5px] bg-[#F17141]" style={{ height: `${height}%`, animationDelay: `${index * 25}ms`, opacity: .35 + (index % 5) * .13 }} />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[9px] font-bold uppercase tracking-[.13em] text-[#B4A99D]"><span>Jan 24</span><span>Aug 26</span></div>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-12 -left-2 size-24 rounded-full border border-dashed border-[#F17141]/35 sm:-left-8" />
        </div>
      </section>

      {/* Immediate Import Section with Dropzone and Compact Helper */}
      <section id="import" className="mx-auto max-w-[1180px] px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <span className="editorial-script text-[25px] text-[#F17141]">let's see what happened...</span>
            <h2 className="mt-3 text-[33px] font-extrabold leading-[1.02] tracking-[-.06em] sm:text-[43px]">
              One file in.<br />A clearer picture out.
            </h2>
            <p className="mt-4 max-w-sm text-[13px] leading-6 text-[#766F69]">
              TexTale reads the export on this device, then turns counts, dates, runs, and rhythms into a story you can explore.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowExportGuide(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#E7D9C7] bg-[#FFF8EA] px-4 py-2.5 text-[12px] font-bold text-[#6C4E2A] hover:bg-[#FFECAE] transition cursor-pointer"
              >
                <span>Need help exporting?</span>
                <span className="text-[#F17141]">View guide ↗</span>
              </button>
            </div>
          </div>
          <UploadDropzone onFileAccepted={onFileAccepted} />
        </div>

        {/* Trimmed, Elegant 3-Step Helper Ribbon */}
        <CompactExportGuide onOpenModal={() => setShowExportGuide(true)} />
      </section>

      {/* Trust & Methodology Features */}
      <section className="border-y border-[#EDE2D6] bg-[#FFF8EA]">
        <div className="mx-auto grid max-w-[1080px] gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8 lg:py-16">
          {[
            { icon: IconShield, title: "Private at the source", copy: "Your export is processed in memory. There is no account, server, or upload step." },
            { icon: IconBarChart, title: "Numbers with receipts", copy: "Every metric is labeled exact or derived, with the rule and limitation beside it." },
            { icon: IconHash, title: "A story, not a spreadsheet", copy: "Start with the guided reveal, then open the detailed explorer whenever curiosity wins." },
          ].map(({ icon: Icon, title, copy }, index) => (
            <div key={title} className={`page-enter ${index === 1 ? "[animation-delay:80ms]" : index === 2 ? "[animation-delay:160ms]" : ""}`}>
              <Icon className="mb-5 size-[19px] text-[#F17141]" />
              <h3 className="text-[14px] font-extrabold tracking-[-.025em]">{title}</h3>
              <p className="mt-2 text-[12px] leading-5 text-[#766F69]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1320px] flex-col gap-3 px-5 py-8 text-[11px] text-[#A59A90] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <BrandMark compact />
        <span>Made for the conversations you choose to look at twice.</span>
        <AppFooter />
      </footer>

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showExportGuide && <ExportGuideModal onClose={() => setShowExportGuide(false)} />}
    </main>
  );
}
