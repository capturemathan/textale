import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import type { Analysis } from '@/types';
import { formatDayKey, formatDuration, formatNumber, formatClock } from '@/lib/formatting';
import {
  IconClose,
  IconDownload,
  IconShare,
  IconShield,
  IconLogo,
} from '@/components/icons';

interface ShareCardProps {
  tab: string;
  analysis: Analysis;
  onClose: () => void;
}

export default function ShareCard({ tab, analysis, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const generateImage = async (node: HTMLElement): Promise<string> => {
    try {
      return await toPng(node, { pixelRatio: 2, cacheBust: false });
    } catch (err1) {
      console.warn('First toPng attempt failed, retrying with fallback options...', err1);
      try {
        return await toPng(node, { pixelRatio: 2, skipFonts: true });
      } catch (err2) {
        console.warn('Second toPng attempt failed, retrying with base ratio...', err2);
        return await toPng(node, { pixelRatio: 1, skipFonts: true });
      }
    }
  };

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await generateImage(cardRef.current);
      const link = document.createElement('a');
      link.download = `textale-${tab.toLowerCase()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      const file = new File([blob], `textale-${tab.toLowerCase()}.png`, { type: 'image/png' });

      if (typeof navigator !== 'undefined' && 'canShare' in navigator && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'TexTale Analysis',
          text: 'Check out my WhatsApp chat stats on TexTale!',
          files: [file],
        });
      } else if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await navigator.share({
          title: 'TexTale Analysis',
          text: 'Check out my WhatsApp chat stats on TexTale!',
          url: window.location.href,
        });
      } else {
        // Fallback to direct download if sharing files is unsupported
        const link = document.createElement('a');
        link.download = `textale-${tab.toLowerCase()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('Share error:', err);
      try {
        const dataUrl = await generateImage(cardRef.current);
        const link = document.createElement('a');
        link.download = `textale-${tab.toLowerCase()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        alert('Could not share or save image.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#24201D]/75 backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Opaque & Vibrant Modal Card Container */}
      <div className="rounded-[32px] border-2 border-[#EADFD5] bg-[#FFF8EA] p-6 sm:p-7 shadow-[0_25px_60px_rgba(36,32,29,0.35)] max-w-sm sm:max-w-md w-full relative flex flex-col items-center text-[#24201D]">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#F17141] animate-pulse" />
            <h2 className="text-[20px] font-extrabold text-[#24201D] tracking-tight">Share your stats</h2>
          </div>
          <button 
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full bg-[#FFECAE] text-[#F17141] hover:bg-[#F17141] hover:text-[#FFFCF5] transition cursor-pointer"
            aria-label="Close modal"
          >
            <IconClose className="size-4" />
          </button>
        </div>
        
        {/* Shareable Card Canvas Container */}
        <div className="w-full max-w-[370px] sm:max-w-[390px] rounded-[26px] overflow-hidden relative shadow-xl">
          {busy && (
            <div className="absolute inset-0 bg-[#24201D]/40 backdrop-blur-xs flex items-center justify-center z-10 rounded-[26px]">
              <div className="flex flex-col items-center gap-2 text-[#FFFCF5]">
                <svg className="animate-spin h-7 w-7 text-[#F17141]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Exporting Image...</span>
              </div>
            </div>
          )}

          <div 
            ref={cardRef} 
            className="flex min-h-[460px] flex-col justify-between p-5 sm:p-6 relative overflow-hidden bg-gradient-to-br from-[#FFF9F0] via-[#FFECAE] to-[#FFF8EA] text-[#24201D] border border-[#F17141]/30"
          >
            {/* Top Branding Bar */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#24201D]/15">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-xl bg-[#FFECAE] text-[#F17141] shadow-xs p-0.5">
                  <IconLogo className="size-full text-[#F17141]" featherAccent="#FFECAE" />
                </span>
                <span className="text-[16px] font-extrabold tracking-tight text-[#24201D]">
                  Tex<span className="text-[#F17141]">Tale</span>
                </span>
              </div>
              <span className="editorial-script text-[18px] text-[#F17141]">your chat, in numbers</span>
            </div>
            
            {/* Body Metric Visual */}
            <div className="flex-1 flex flex-col justify-center text-[#24201D] py-2">
              <CardBody tab={tab} analysis={analysis} />
            </div>
            
            {/* Bottom Footer Mark & TexTale Invitation Tagline */}
            <div className="pt-2.5 border-t border-[#24201D]/15 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-[#766F69] tracking-wider uppercase">
                <span className="flex items-center gap-1.5">
                  <IconShield className="size-3 text-[#F17141]" />
                  Processed locally
                </span>
              </div>

              {/* Tagline inviting viewers to visit TexTale */}
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

        {/* Action Buttons Outside the Card */}
        <div className="flex gap-3 w-full mt-6">
          <button 
            onClick={download}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-2 bg-[#F17141] text-[#FFFCF5] py-3.5 px-4 rounded-2xl font-extrabold text-[14px] shadow-[0_8px_20px_rgba(241,113,65,0.25)] hover:bg-[#D95F31] transition-all disabled:opacity-50 cursor-pointer"
          >
            <IconDownload className="size-4.5" />
            {busy ? 'Saving...' : 'Save PNG'}
          </button>
          
          <button 
            onClick={share}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FFECAE] text-[#6C4E2A] py-3.5 px-4 rounded-2xl font-extrabold text-[14px] hover:bg-[#F8C777] transition-all disabled:opacity-50 cursor-pointer"
          >
            <IconShare className="size-4.5" />
            {busy ? 'Exporting...' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CardBody({ tab, analysis }: { tab: string; analysis: Analysis }) {
  const tabLower = tab.toLowerCase();
  
  if (tabLower === 'overview') {
    return (
      <div className="space-y-4 my-auto">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">Total Messages</p>
          <p className="text-[44px] sm:text-[48px] font-extrabold leading-none tracking-[-0.05em] text-[#24201D] mt-1">
            {formatNumber(analysis.totalMessages)}
          </p>
        </div>
        <div className="space-y-2.5 pt-2 border-t border-[#24201D]/10">
          {[...analysis.participants]
            .sort((a, b) => b.messageCount - a.messageCount)
            .map(p => (
              <div key={p.id} className="flex justify-between items-center text-[13px] font-extrabold text-[#24201D]">
                <span className="truncate pr-2">{p.name}</span>
                <span className="text-[#F17141] font-extrabold">{formatNumber(p.messageCount)}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }
  
  if (tabLower === 'activity') {
    const days = analysis.days;
    const maxCount = days.reduce((max, d) => Math.max(max, d.messages), 0) || 1;
    const recentDays = days.slice(-35); // 35 days (5 weeks of heatmap tiles)

    return (
      <div className="my-auto space-y-3">
        <div>
          <span className="editorial-script text-[18px] text-[#F17141] block leading-none mb-1">activity observatory</span>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">Daily Message Density</p>
        </div>

        {/* Heatmap Graph Preview Card */}
        <div className="rounded-2xl border border-[#F17141]/20 bg-[#FFFCF5] p-3 sm:p-3.5 shadow-2xs">
          <div className="mb-2 flex items-center justify-between text-[10px] font-extrabold text-[#766F69]">
            <span className="uppercase tracking-wider">Activity Graph</span>
            <span className="text-[#F17141]">{formatNumber(analysis.activeDays)} active days</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 py-1">
            {recentDays.map((d) => {
              const ratio = d.messages / maxCount;
              const bg = ratio === 0 ? '#F3EBE2' : ratio >= 0.75 ? '#F17141' : ratio >= 0.45 ? '#F5935C' : ratio >= 0.2 ? '#F8C777' : '#FFECAE';
              return (
                <div
                  key={d.date}
                  className="aspect-square rounded-[3px]"
                  style={{ backgroundColor: bg }}
                  title={`${d.date}: ${d.messages} msgs`}
                />
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[9px] font-extrabold text-[#A59A90] uppercase tracking-wider">
            <span>{recentDays[0]?.date ? formatDayKey(recentDays[0].date) : ''}</span>
            <span>{recentDays.at(-1)?.date ? formatDayKey(recentDays.at(-1)!.date) : ''}</span>
          </div>
        </div>

        {analysis.busiestDay && (
          <div className="flex justify-between items-center bg-[#FFFCF5]/90 rounded-xl px-3 py-1.5 border border-[#F17141]/20">
            <span className="text-[11px] font-bold text-[#766F69]">Busiest Day</span>
            <span className="text-[12px] font-extrabold text-[#24201D]">
              {formatDayKey(analysis.busiestDay.date)} ({formatNumber(analysis.busiestDay.messages)} msgs)
            </span>
          </div>
        )}
      </div>
    );
  }
  
  if (tabLower === 'conversations') {
    const session = analysis.longestSession;
    if (!session) return <p className="text-[14px] font-extrabold">Not enough data yet.</p>;
    return (
      <div className="my-auto space-y-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">Longest Conversation</p>
          <p className="text-[42px] font-extrabold leading-none tracking-[-0.05em] text-[#F17141] mt-1">
            {formatDuration(session.durationMs)}
          </p>
          <p className="text-[13px] font-extrabold text-[#24201D] mt-1.5">{formatNumber(session.messageCount)} messages</p>
        </div>
        <div className="rounded-xl bg-[#FFFCF5]/80 p-3 border border-[#F17141]/20">
          <p className="text-[11px] font-extrabold text-[#24201D]">
            {formatClock(session.start)} → {formatClock(session.end)}
          </p>
          <p className="text-[10px] font-bold text-[#766F69] mt-0.5">{formatDayKey(new Date(session.start).toISOString().slice(0, 10))}</p>
        </div>
      </div>
    );
  }
  
  if (tabLower === 'words') {
    const topWord = analysis.topWords[0];
    return (
      <div className="my-auto space-y-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">Total Words</p>
          <p className="text-[44px] font-extrabold leading-none tracking-[-0.05em] text-[#24201D] mt-1">
            {formatNumber(analysis.totalWords)}
          </p>
        </div>
        {topWord && (
          <div className="rounded-xl bg-[#24201D] p-4 text-[#FFFCF5]">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFECAE]">Top Word</p>
            <p className="text-[26px] font-extrabold break-all text-[#F17141] leading-tight mt-0.5">"{topWord.key}"</p>
            <p className="text-[11px] font-bold text-[#BEB5AE] mt-1">{formatNumber(topWord.count)} times used</p>
          </div>
        )}
      </div>
    );
  }
  
  if (tabLower === 'emojis') {
    const emoji = analysis.topEmojis[0];
    if (!emoji) return <p className="text-[14px] font-extrabold">No emojis found.</p>;
    return (
      <div className="my-auto text-center space-y-2">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">#1 Most Used Emoji</p>
        <p className="text-[64px] sm:text-[72px] leading-none drop-shadow-md py-1">{emoji.key}</p>
        <p className="text-[32px] font-extrabold tracking-tight text-[#F17141] leading-none">{formatNumber(emoji.count)}</p>
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#766F69]">times used</p>
      </div>
    );
  }
  
  if (tabLower === 'links') {
    const topDomain = analysis.topDomains[0];
    return (
      <div className="my-auto space-y-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">Total Links Shared</p>
          <p className="text-[44px] font-extrabold leading-none tracking-[-0.05em] text-[#24201D] mt-1">
            {formatNumber(analysis.totalLinks)}
          </p>
        </div>
        {topDomain && (
          <div className="rounded-xl bg-[#FFFCF5]/80 p-3.5 border border-[#F17141]/20">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C4E2A]">Top Site</p>
            <p className="text-[18px] font-extrabold text-[#F17141] break-all leading-tight mt-0.5">{topDomain.key}</p>
            <p className="text-[11px] font-bold text-[#766F69] mt-1">{formatNumber(topDomain.count)} links</p>
          </div>
        )}
      </div>
    );
  }
  
  if (tabLower === 'records') {
    const busiest = analysis.busiestDay;
    const longest = analysis.longestSession;
    const mostWords = analysis.records.mostWordsInDay;
    const streak = analysis.longestStreak;
    const questions = analysis.records.mostQuestionsInDay;
    return (
      <div className="my-auto space-y-3">
        <div>
          <span className="editorial-script text-[18px] text-[#F17141] block">all-time records</span>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6C4E2A]">Hall of Fame Highlights</p>
        </div>

        <div className="space-y-2 text-[12px] font-extrabold">
          {busiest && (
            <div className="flex justify-between items-center bg-[#FFFCF5]/90 rounded-xl px-3 py-1.5 border border-[#F17141]/20">
              <span className="text-[#766F69]">Busiest Day</span>
              <span className="text-[#24201D] font-extrabold">{formatDayKey(busiest.date)}</span>
            </div>
          )}
          {longest && (
            <div className="flex justify-between items-center bg-[#FFFCF5]/90 rounded-xl px-3 py-1.5 border border-[#F17141]/20">
              <span className="text-[#766F69]">Longest Chat</span>
              <span className="text-[#F17141] font-extrabold">{formatDuration(longest.durationMs)}</span>
            </div>
          )}
          {mostWords && (
            <div className="flex justify-between items-center bg-[#FFFCF5]/90 rounded-xl px-3 py-1.5 border border-[#F17141]/20">
              <span className="text-[#766F69]">Most Words</span>
              <span className="text-[#24201D] font-extrabold">{formatNumber(mostWords.words)}</span>
            </div>
          )}
          {streak && (
            <div className="flex justify-between items-center bg-[#FFFCF5]/90 rounded-xl px-3 py-1.5 border border-[#F17141]/20">
              <span className="text-[#766F69]">Longest Streak</span>
              <span className="text-[#24201D] font-extrabold">{formatNumber(streak.days)} days</span>
            </div>
          )}
          {questions && (
            <div className="flex justify-between items-center bg-[#FFFCF5]/90 rounded-xl px-3 py-1.5 border border-[#F17141]/20">
              <span className="text-[#766F69]">Most Questions</span>
              <span className="text-[#24201D] font-extrabold">{formatNumber(questions.questions)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return <p className="text-2xl font-black">{tab}</p>;
}
