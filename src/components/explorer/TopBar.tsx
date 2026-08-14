import { useTexTale } from "@/store/textale-store";
import { IconShield, IconReset, IconMenu, IconLogo } from "@/components/icons";

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { participants, fileName, reset } = useTexTale();
  
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#EADFD5] bg-[#FFFCF5]/90 px-4 py-3 backdrop-blur-md sm:px-8 lg:px-12">
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onMenuClick}
          className="grid size-9 place-items-center rounded-xl bg-[#FFECAE] text-[#F17141] transition hover:bg-[#F8C777] lg:hidden shadow-2xs cursor-pointer"
          aria-label="Open menu navigation"
        >
          <IconMenu className="size-5" />
        </button>

        <div className="flex items-center gap-2.5">
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
