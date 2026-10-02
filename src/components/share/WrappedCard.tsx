import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import type { Analysis, Participant } from '@/types';
import { formatNumber, formatDuration, formatDayKey, formatMonthKey } from '@/lib/formatting';
import { IconClose, IconDownload, IconShare, IconShield, IconLogo, IconArrowRight } from '@/components/icons';
import posthog from 'posthog-js';

interface WrappedCardProps {
  analysis: Analysis;
  participants: Participant[];
  onClose: () => void;
  source: 'discovered' | 'records';
}

interface Slide {
  key: string;
  render: (analysis: Analysis, participants: Participant[]) => React.ReactNode;
}

const SLIDES: Slide[] = [
  {
    key: 'cover',
    render: (analysis, participants) => (
      <div className="my-auto text-center space-y-3">
        <span className="editorial-script text-[20px] text-[#F17141] block">your chat, wrapped</span>
        <p className="text-[15px] font-extrabold text-[#24201D] leading-snug break-words px-2 line-clamp-3">
          {participants.length <= 2 
            ? participants.map(p => p.name).join(' + ')
            : `Group Chat (${participants.length} members)`}
        </p>
        <p className="text-[46px] font-extrabold leading-none tracking-[-0.05em] text-[#24201D]">
          {formatNumber(analysis.totalMessages)}
        </p>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">messages, and counting</p>
      </div>
    ),
  },
  {
    key: 'busiest',
    render: (analysis) => (
      <div className="my-auto space-y-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">Your busiest day</p>
        <p className="text-[28px] font-extrabold leading-tight text-[#F17141]">
          {analysis.busiestDay ? formatDayKey(analysis.busiestDay.date) : 'Not enough data'}
        </p>
        {analysis.busiestDay && (
          <p className="text-[13px] font-bold text-[#24201D]">{formatNumber(analysis.busiestDay.messages)} messages in a single day</p>
        )}
        {analysis.busiestMonth && (
          <div className="pt-3 border-t border-[#24201D]/10">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#766F69]">Busiest month</p>
            <p className="text-[16px] font-extrabold text-[#24201D]">{formatMonthKey(analysis.busiestMonth.key)}</p>
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'favorites',
    render: (analysis) => (
      <div className="my-auto grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#24201D] p-4 text-[#FFFCF5]">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#FFECAE]">Top word</p>
          <p className="text-[18px] font-extrabold break-all text-[#F17141] mt-1">
            {analysis.topWords[0] ? `"${analysis.topWords[0].key}"` : '—'}
          </p>
        </div>
        <div className="rounded-xl bg-[#FFFCF5]/90 p-4 border border-[#F17141]/20 text-center">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#766F69]">Top emoji</p>
          <p className="text-[36px] leading-tight mt-1">{analysis.topEmojis[0]?.key ?? '—'}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'streak',
    render: (analysis) => (
      <div className="my-auto space-y-3 text-center">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">Longest streak</p>
        <p className="text-[44px] font-extrabold leading-none text-[#24201D]">
          {analysis.longestStreak ? formatNumber(analysis.longestStreak.days) : '0'}
        </p>
        <p className="text-[12px] font-bold text-[#766F69]">days talking back to back</p>
      </div>
    ),
  },
  {
    key: 'marathon',
    render: (analysis) => (
      <div className="my-auto space-y-3 text-center">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">Longest single conversation</p>
        <p className="text-[36px] font-extrabold leading-none text-[#F17141]">
          {analysis.longestSession ? formatDuration(analysis.longestSession.durationMs) : '—'}
        </p>
        {analysis.longestSession && (
          <p className="text-[12px] font-bold text-[#24201D]">{formatNumber(analysis.longestSession.messageCount)} messages, back to back</p>
        )}
      </div>
    ),
  },
  {
    key: 'finale',
    render: () => (
      <div className="my-auto text-center space-y-4">
        <span className="editorial-script text-[22px] text-[#F17141] block">to be continued...</span>
        <p className="text-[13px] font-bold text-[#24201D] leading-relaxed px-4">
          Every new message adds another page. Come back and wrap it again anytime.
        </p>
      </div>
    ),
  },
];

export default function WrappedCard({ analysis, participants, onClose, source }: WrappedCardProps) {
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const slide = SLIDES[index];

  useEffect(() => {
    posthog.capture('wrapped_opened', { source });
    // Fire once per open, not on every slide change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = () => setIndex((i) => Math.min(i + 1, SLIDES.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const generateImage = async (node: HTMLElement): Promise<string> => {
    try {
      return await toPng(node, { pixelRatio: 2, cacheBust: false });
    } catch {
      return await toPng(node, { pixelRatio: 2, skipFonts: true });
    }
  };

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await generateImage(cardRef.current);
      const link = document.createElement('a');
      link.download = `textale-wrapped-${slide.key}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      posthog.capture('wrapped_slide_downloaded', { slide: slide.key });
    } catch (err) {
      console.error('Failed to save image:', err);
      alert('Could not export image. Please try taking a screenshot instead.');
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await generateImage(cardRef.current);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `textale-wrapped-${slide.key}.png`, { type: 'image/png' });

      if (typeof navigator !== 'undefined' && 'canShare' in navigator && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'My TexTale Wrapped', text: 'Check out my WhatsApp chat, wrapped!', files: [file] });
        posthog.capture('wrapped_slide_shared', { slide: slide.key });
      } else {
        await download();
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Share error:', err);
      await download();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#24201D]/75 backdrop-blur-md p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="rounded-[32px] border-2 border-[#EADFD5] bg-[#FFF8EA] p-6 sm:p-7 shadow-[0_25px_60px_rgba(36,32,29,0.35)] max-w-sm sm:max-w-md w-full relative flex flex-col items-center text-[#24201D]">
        <div className="flex items-center justify-between w-full mb-5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#F17141] animate-pulse" />
            <h2 className="text-[20px] font-extrabold text-[#24201D] tracking-tight">Your Chat, Wrapped</h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full bg-[#FFECAE] text-[#F17141] hover:bg-[#F17141] hover:text-[#FFFCF5] transition cursor-pointer"
            aria-label="Close modal"
          >
            <IconClose className="size-4" />
          </button>
        </div>

        <div className="w-full max-w-[370px] sm:max-w-[390px] rounded-[26px] overflow-hidden relative shadow-xl">
          {busy && (
            <div className="absolute inset-0 bg-[#24201D]/40 backdrop-blur-xs flex items-center justify-center z-10 rounded-[26px]">
              <div className="flex flex-col items-center gap-2 text-[#FFFCF5]">
                <svg className="animate-spin h-7 w-7 text-[#F17141]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Exporting...</span>
              </div>
            </div>
          )}

          <div
            ref={cardRef}
            className="flex min-h-[460px] flex-col justify-between p-5 sm:p-6 relative overflow-hidden bg-gradient-to-br from-[#FFF9F0] via-[#FFECAE] to-[#FFF8EA] text-[#24201D] border border-[#F17141]/30"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-[#24201D]/15">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-xl bg-[#FFECAE] text-[#F17141] shadow-xs p-0.5">
                  <IconLogo className="size-full text-[#F17141]" featherAccent="#FFECAE" />
                </span>
                <span className="text-[16px] font-extrabold tracking-tight text-[#24201D]">
                  Tex<span className="text-[#F17141]">Tale</span>
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-[#A59A90]">{index + 1} / {SLIDES.length}</span>
            </div>

            <div className="flex-1 flex flex-col justify-center py-2">
              {slide.render(analysis, participants)}
            </div>

            <div className="pt-2.5 border-t border-[#24201D]/15 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-[#766F69] tracking-wider uppercase">
                <span className="flex items-center gap-1.5">
                  <IconShield className="size-3 text-[#F17141]" />
                  Processed locally
                </span>
              </div>
              <a
                href="https://capturemathan.github.io/textale/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#F17141]/10 px-3 py-1.5 flex items-center justify-between text-[10px] font-extrabold text-[#24201D] hover:bg-[#F17141]/20 transition-colors"
              >
                <span>Discover your chat stories</span>
                <span className="text-[#F17141] font-black">Visit TexTale →</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-4">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-[#F17141]' : 'w-1.5 bg-[#EADFD5]'}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between w-full mt-4 gap-3">
          <button
            onClick={prev}
            disabled={index === 0}
            className="grid size-10 place-items-center rounded-full border border-[#EADFD5] bg-[#FFFCF5] text-[#766F69] disabled:opacity-30 hover:text-[#F17141] transition cursor-pointer"
            aria-label="Previous slide"
          >
            <IconArrowRight className="size-4 rotate-180" />
          </button>

          <div className="flex gap-2 flex-1">
            <button
              onClick={download}
              disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 bg-[#F17141] text-[#FFFCF5] py-3 px-4 rounded-2xl font-extrabold text-[13px] shadow-[0_8px_20px_rgba(241,113,65,0.25)] hover:bg-[#D95F31] transition-all disabled:opacity-50 cursor-pointer"
            >
              <IconDownload className="size-4" />
              {busy ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={share}
              disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FFECAE] text-[#6C4E2A] py-3 px-4 rounded-2xl font-extrabold text-[13px] hover:bg-[#F8C777] transition-all disabled:opacity-50 cursor-pointer"
            >
              <IconShare className="size-4" />
              Share
            </button>
          </div>

          <button
            onClick={next}
            disabled={index === SLIDES.length - 1}
            className="grid size-10 place-items-center rounded-full border border-[#EADFD5] bg-[#FFFCF5] text-[#766F69] disabled:opacity-30 hover:text-[#F17141] transition cursor-pointer"
            aria-label="Next slide"
          >
            <IconArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
