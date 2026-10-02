import React from 'react';
import { Reveal } from '@/components/common/Reveal';
import type { ExplorerTab } from '@/components/explorer';
import {
  IconActivity,
  IconMessageCircle,
  IconSmile,
  IconTrophy,
  IconHome,
  IconShare,
  IconArrowRight,
} from '@/components/icons';

interface ChapterFooterProps {
  currentTab: ExplorerTab;
  onTabChange?: (tab: ExplorerTab) => void;
  onShare?: () => void;
}

const CHAPTER_METADATA: Record<
  ExplorerTab,
  {
    chapterNumber: string;
    title: string;
    nextTab?: ExplorerTab;
    nextNumber?: string;
    nextTitle?: string;
    nextTeaser?: string;
    nextIcon?: React.FC<any>;
  }
> = {
  Overview: {
    chapterNumber: "01",
    title: "Overview",
    nextTab: "Activity",
    nextNumber: "02",
    nextTitle: "Activity & Heatmaps",
    nextTeaser: "Explore your daily rhythms, calendar heatmaps, peak active hours, and day-of-week patterns.",
    nextIcon: IconActivity,
  },
  Activity: {
    chapterNumber: "02",
    title: "Activity",
    nextTab: "Conversations",
    nextNumber: "03",
    nextTitle: "Conversations & Dynamics",
    nextTeaser: "See reply speeds, who initiates chats, and head-to-head comparison duel.",
    nextIcon: IconMessageCircle,
  },
  Conversations: {
    chapterNumber: "03",
    title: "Conversations",
    nextTab: "Expressions",
    nextNumber: "04",
    nextTitle: "Expressions & Vocabulary",
    nextTeaser: "Uncover your unique vocabulary, signature emojis, and all shared web links.",
    nextIcon: IconSmile,
  },
  Expressions: {
    chapterNumber: "04",
    title: "Expressions",
    nextTab: "Records",
    nextNumber: "05",
    nextTitle: "Hall of Fame Records",
    nextTeaser: "The grand finale: all-time records, streaks, superlatives, and marathon chat milestones.",
    nextIcon: IconTrophy,
  },
  Records: {
    chapterNumber: "05",
    title: "Records",
  },
};

export function ChapterFooter({ currentTab, onTabChange, onShare }: ChapterFooterProps) {
  const meta = CHAPTER_METADATA[currentTab];

  // Records (Final Chapter) - Storybook Grand Finale
  if (!meta.nextTab) {
    return (
      <Reveal delay={0.4}>
        <div className="mt-14 overflow-hidden rounded-[30px] border border-[#E8D9C8] bg-[#FFF8EA] p-8 sm:p-12 text-center shadow-[0_20px_60px_rgba(180,133,60,0.06)] relative">
          <div className="absolute right-0 top-0 size-72 -translate-y-1/2 translate-x-1/3 rounded-full border-[30px] border-[#FFECAE]/40 pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="editorial-script text-[32px] sm:text-[38px] text-[#F17141] block leading-none">
              to be continued...
            </span>
            <h3 className="text-[24px] sm:text-[28px] font-extrabold text-[#24201D] tracking-tight">
              It's just a chapter, not the end of the story.
            </h3>
            <p className="text-[13px] leading-relaxed text-[#766F69]">
              Every new message, joke, voice note, and late-night conversation keeps adding pages to your story.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              {onShare && (
                <button
                  onClick={onShare}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F17141] px-6 py-3.5 text-[13px] font-bold text-[#FFFCF5] shadow-[0_10px_25px_rgba(241,113,65,0.2)] hover:-translate-y-0.5 hover:bg-[#e76537] transition duration-200 cursor-pointer"
                >
                  <IconShare className="size-4" />
                  <span>Share Story Cards</span>
                </button>
              )}
              {onTabChange && (
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onTabChange('Overview');
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EADFD5] bg-[#FFFCF5] px-5 py-3 text-[13px] font-bold text-[#24201D] hover:bg-[#FFECAE] transition cursor-pointer"
                >
                  <IconHome className="size-4 text-[#F17141]" />
                  <span>Revisit Chapter 1: Overview</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    );
  }

  // Chapters 1 to 4 - Read Next Chapter Card
  const NextIcon = meta.nextIcon || IconArrowRight;
  return (
    <Reveal delay={0.4}>
      <div className="mt-14 overflow-hidden rounded-[30px] border border-[#EADFD5] bg-[#FFF8EA] p-7 sm:p-10 shadow-[0_15px_45px_rgba(180,133,60,0.05)] relative group">
        <div className="absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/3 rounded-full border-[30px] border-[#FFECAE]/30 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="editorial-script text-[22px] text-[#F17141]">continue reading</span>
              <span className="rounded-full bg-[#FFECAE] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#6C4E2A]">
                Chapter {meta.nextNumber} of 05
              </span>
            </div>
            <h3 className="text-[22px] sm:text-[26px] font-extrabold text-[#24201D] tracking-tight">
              {meta.nextTitle}
            </h3>
            <p className="text-[13px] leading-relaxed text-[#766F69]">
              {meta.nextTeaser}
            </p>
          </div>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onTabChange?.(meta.nextTab!);
            }}
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#F17141] px-7 py-4 text-[13.5px] font-extrabold text-[#FFFCF5] shadow-[0_10px_25px_rgba(241,113,65,0.25)] hover:-translate-y-0.5 hover:bg-[#e76537] hover:shadow-[0_14px_30px_rgba(241,113,65,0.35)] transition duration-200 shrink-0 cursor-pointer"
          >
            <NextIcon className="size-4.5" />
            <span>Read Chapter {meta.nextNumber}: {meta.nextTab}</span>
            <span className="text-[16px] transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </Reveal>
  );
}
