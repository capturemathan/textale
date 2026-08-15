import { useTexTale } from '@/store/textale-store';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricInfoButton } from '@/components/metrics/MetricInfoButton';
import { Reveal } from '@/components/common/Reveal';
import { ChapterFooter } from '@/components/common/ChapterFooter';
import { formatNumber } from '@/lib/formatting';
import { IconLink } from '@/components/icons';
import { DistributionChart } from '@/components/charts/DistributionChart';
import type { ExplorerTab } from '@/components/explorer';

interface LinksTabProps {
  onTabChange?: (tab: ExplorerTab) => void;
  onInfo?: (label: string) => void;
}

export default function LinksTab({ onTabChange, onInfo }: LinksTabProps) {
  const { analysis } = useTexTale();
  if (!analysis) return null;

  const topDomains = analysis.topDomains.slice(0, 8);
  
  if (analysis.totalLinks === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-[#FFECAE] text-[#F17141]">
          <IconLink className="size-8" />
        </div>
        <h2 className="text-[24px] font-extrabold text-[#24201D]">No links shared</h2>
        <p className="mt-2 text-[14px] text-[#766F69]">
          No URLs were detected in this conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Reveal delay={0}>
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F17141]">
            <span className="size-1.5 rounded-full bg-[#F17141]" />
            Sharing
          </div>
          <h2 className="text-[clamp(27px,4vw,43px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#24201D]">
            The links you drop.
          </h2>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            eyebrow="Total Links"
            value={analysis.totalLinks}
            format={formatNumber}
            subtitle="All URLs shared"
            onInfo={onInfo ? () => onInfo("Total links") : undefined}
          />
          <MetricCard
            eyebrow="Unique Domains"
            value={analysis.uniqueDomains}
            format={formatNumber}
            subtitle="Distinct websites"
            onInfo={onInfo ? () => onInfo("Unique domains") : undefined}
          />
        </div>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <Reveal delay={0.2} className="space-y-6">
          <div className="rounded-[26px] border border-[#EDE2D6] bg-[#FFFCF5] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <span className="editorial-script -rotate-2 text-[22px] text-[#F17141]">top domains</span>
              {onInfo && <MetricInfoButton onClick={() => onInfo("Unique domains")} label="Top domains" />}
            </div>
            <DistributionChart 
              buckets={topDomains.map(d => ({ label: d.key, value: d.count }))} 
              color="#F17141"
            />
          </div>
        </Reveal>

        <Reveal delay={0.3} className="space-y-6">
          <div className="rounded-[26px] border border-[#F17141]/20 bg-[#FFECAE] p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#6C4E2A]">
                Who Shares More
              </p>
              {onInfo && <MetricInfoButton onClick={() => onInfo("Who shares more")} label="Who shares more" />}
            </div>
            
            <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {[...analysis.participants]
                .sort((a, b) => {
                  const linksA = analysis.byParticipant[a.name]?.links || analysis.byParticipant[a.id]?.links || 0;
                  const linksB = analysis.byParticipant[b.name]?.links || analysis.byParticipant[b.id]?.links || 0;
                  return linksB - linksA;
                })
                .map((p) => {
                  const links = analysis.byParticipant[p.name]?.links || analysis.byParticipant[p.id]?.links || 0;
                  const percent = analysis.totalLinks > 0 ? (links / analysis.totalLinks) * 100 : 0;
                  
                  return (
                    <div key={p.id}>
                      <div className="flex justify-between text-[13px] font-bold text-[#24201D] mb-1.5">
                        <span className="truncate pr-2">{p.name}</span>
                        <span className="shrink-0">{formatNumber(links)} ({percent.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-[#F3EBE2] overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#F17141] transition-all duration-300" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Storybook Chapter Progression Footer */}
      <ChapterFooter currentTab="Links" onTabChange={onTabChange} />
    </div>
  );
}
