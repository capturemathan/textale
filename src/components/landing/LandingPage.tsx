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
import { ExportSteps } from "./ExportSteps";
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

function PrivacyBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E7D9C7] bg-[#FFFCF5]/80 px-3 py-2 text-[11px] font-semibold text-[#766F69]" data-testid="status-local-processing">
      <IconShield className="size-[13px] text-[#F17141]" />
      Analyzed locally on your device
    </div>
  );
}

interface LandingPageProps {
  onFileAccepted: (file: File) => void;
}

export function LandingPage({ onFileAccepted }: LandingPageProps) {
  const [showDetails, setShowDetails] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="noise-layer min-h-[100dvh] bg-[#FFFCF5] text-[#24201D]">
      <header className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <BrandMark />
        <div className="hidden items-center gap-6 text-[11px] font-bold text-[#766F69] sm:flex">
          <button onClick={() => scrollTo("how-to-export")} data-testid="button-how-it-works" className="transition hover:text-[#F17141] cursor-pointer">How it works</button>
          <span className="h-4 w-px bg-[#E5DCD2]" />
          <PrivacyBadge />
        </div>
        <button onClick={() => setShowDetails(true)} className="grid size-9 place-items-center rounded-full bg-[#F3EBE2] text-[#766F69] sm:hidden cursor-pointer" aria-label="Show privacy details" data-testid="button-mobile-privacy">
          <IconShield className="size-[15px]" />
        </button>
      </header>

      <section className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 pb-14 pt-9 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="page-enter">
          <div className="mb-6 flex items-center gap-3">
            <span className="editorial-script -rotate-3 text-[22px] text-[#F17141]">a little observatory</span>
            <span className="h-px w-9 bg-[#F17141]/40" />
          </div>
          <h1 className="max-w-[700px] text-balance text-[clamp(48px,7vw,92px)] font-extrabold leading-[.94] tracking-[-0.075em]">
            Your chat has<br /><span className="text-[#F17141]">more data</span> than<br />you think.
          </h1>
          <p className="mt-7 max-w-[490px] text-[15px] leading-7 text-[#766F69] sm:text-[17px]">
            Drop your WhatsApp export and discover the patterns hiding in your conversation — measured carefully, kept completely private.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={() => scrollTo("import")} data-testid="button-start-import" className="group inline-flex items-center gap-3 rounded-full bg-[#F17141] px-5 py-3.5 text-[13px] font-bold text-[#FFFCF5] shadow-[0_12px_30px_rgba(241,113,65,0.22)] transition hover:-translate-y-0.5 cursor-pointer">
              Start with your export <IconArrowRight className="size-4 transition group-hover:translate-x-1" />
            </button>
            <button onClick={() => scrollTo("how-to-export")} data-testid="button-view-steps" className="inline-flex items-center gap-2 rounded-full border border-[#E7D9C7] px-4 py-3 text-[12px] font-bold text-[#766F69] hover:bg-[#F3EBE2] hover:text-[#24201D] transition cursor-pointer">
              How to export guide ↓
            </button>
            <button onClick={() => setShowDetails(true)} data-testid="button-privacy-note" className="inline-flex items-center gap-2 rounded-full px-3 py-3 text-[12px] font-bold text-[#766F69] hover:bg-[#F3EBE2] cursor-pointer">
              <IconShield className="size-3.5 text-[#F17141]" />Local by design
            </button>
          </div>
          <div className="mt-12 flex items-center gap-5 text-[11px] text-[#A59A90]">
            <span className="flex items-center gap-2"><IconCheck className="size-[13px] text-[#F17141]" />No account</span>
            <span className="flex items-center gap-2"><IconCheck className="size-[13px] text-[#F17141]" />No uploads</span>
            <span className="hidden items-center gap-2 sm:flex"><IconCheck className="size-[13px] text-[#F17141]" />No interpretation</span>
          </div>
        </div>
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

      {/* Flashy WhatsApp Export Step-by-Step Guide */}
      <ExportSteps />

      <section id="import" className="mx-auto grid max-w-[1080px] gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16 lg:pb-28">
        <div>
          <span className="editorial-script text-[25px] text-[#F17141]">let's see what happened...</span>
          <h2 className="mt-4 text-[33px] font-extrabold leading-[1.02] tracking-[-.06em] sm:text-[43px]">One file in.<br />A clearer picture out.</h2>
          <p className="mt-4 max-w-sm text-[13px] leading-6 text-[#766F69]">TexTale reads the export on this device, then turns counts, dates, runs, and rhythms into a story you can explore.</p>
        </div>
        <UploadDropzone onFileAccepted={onFileAccepted} />
      </section>

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

      {showDetails && <PrivacyModal onClose={() => setShowDetails(false)} />}
    </main>
  );
}
