import { useTexTale } from "@/store/textale-store";
import { IconShield, IconReset, IconMenu, IconLogo } from "@/components/icons";
import type { ExplorerTab } from "./index";

export function TopBar({
  activeTab = "Overview",
  onMenuClick,
}: {
  activeTab?: ExplorerTab;
  onMenuClick?: () => void;
}) {
  const { participants, fileName, reset } = useTexTale();
  
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#EADFD5] bg-[#FFFCF5]/90 px-4 py-3 backdrop-blur-md sm:px-8 lg:px-12">
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        {/* Mobile Chapters Drawer Trigger */}
        <button
          onClick={onMenuClick}
          className="flex items-center gap-2 rounded-xl bg-[#FFECAE] px-2.5 py-1.5 text-[#24201D] transition hover:bg-[#F8C777] lg:hidden shadow-xs cursor-pointer border border-[#EADFD5] shrink-0"
          aria-label="Open 7 chapters navigation menu"
        >
          <div className="relative">
            <IconMenu className="size-4 text-[#F17141]" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-[#F17141] animate-pulse" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#806641]">7 Chapters</span>
            <span className="text-[11.5px] font-extrabold text-[#24201D] flex items-center gap-0.5">
              <span>{activeTab}</span>
              <span className="text-[#F17141] font-black text-[10px]">▾</span>
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="grid size-8 place-items-center rounded-xl bg-[#FFECAE] text-[#F17141] shadow-[0_4px_12px_rgba(241,113,65,0.15)] p-1">
            <IconLogo className="size-full text-[#F17141]" featherAccent="#FFECAE" />
          </span>
          <span className="hidden text-[17px] font-extrabold tracking-[-0.05em] text-[#24201D] sm:block">
            Tex<span className="text-[#F17141]">Tale</span>
          </span>
        </div>
        
        <div className="hidden h-4 w-px bg-[#EADFD5] lg:block" />
        
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-extrabold tracking-[-0.03em] text-[#24201D] truncate max-w-[150px] sm:max-w-[300px]">
              {participants.map(p => p.name).join(" + ")}
            </span>
            <span className="text-[10px] font-semibold text-[#A59A90] truncate max-w-[150px] sm:max-w-[300px]">
              {fileName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-1.5 rounded-full border border-[#E7D9C7] bg-[#FFF8EA] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#766F69] sm:flex">
          <IconShield className="size-3 text-[#F17141]" />
          Processed locally
        </div>
        <button
          onClick={reset}
          className="grid size-8 place-items-center rounded-full bg-[#F3EBE2] text-[#766F69] transition hover:bg-[#EADFD5] hover:text-[#F17141]"
          title="Analyze another export"
        >
          <IconReset className="size-4" />
        </button>
      </div>
    </header>
  );
}
