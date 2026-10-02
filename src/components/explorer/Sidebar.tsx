import { useTexTale } from "@/store/textale-store";
import {
  IconHome,
  IconActivity,
  IconMessageCircle,
  IconSmile,
  IconTrophy,
  IconLock,
  IconChevronRight,
  IconLogo,
} from "@/components/icons";
import type { ExplorerTab } from "./index";

const tabs: { label: ExplorerTab; icon: React.FC<any> }[] = [
  { label: "Overview", icon: IconHome },
  { label: "Activity", icon: IconActivity },
  { label: "Conversations", icon: IconMessageCircle },
  { label: "Expressions", icon: IconSmile },
  { label: "Records", icon: IconTrophy },
];

export function Sidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: ExplorerTab;
  onTabChange: (tab: ExplorerTab) => void;
}) {
  const { reset } = useTexTale();

  return (
    <aside className="sticky top-0 hidden h-[100dvh] w-[232px] shrink-0 flex-col border-r border-[#EADFD5] bg-[#FFF8EA] px-4 py-6 lg:flex">
      <div className="mb-8 px-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-[13px] bg-[#FFECAE] text-[#F17141] shadow-[0_6px_18px_rgba(241,113,65,0.15)] p-1">
            <IconLogo className="size-full text-[#F17141]" featherAccent="#FFECAE" />
          </span>
          <span className="text-[19px] font-extrabold tracking-[-0.05em] text-[#24201D]">
            Tex<span className="text-[#F17141]">Tale</span>
          </span>
        </div>
      </div>
      
      <div className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#B4A99D]">
        Your observatory
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto pb-4 custom-scrollbar" aria-label="Analytics sections">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onTabChange(label)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold transition ${
              activeTab === label
                ? "bg-[#FFECAE] text-[#24201D]"
                : "text-[#766F69] hover:bg-[#F6EEDD] hover:text-[#24201D]"
            }`}
            aria-current={activeTab === label ? "page" : undefined}
          >
            <Icon className={`size-[18px] ${activeTab === label ? "text-[#F17141]" : ""}`} />
            {label}
            {activeTab === label && <IconChevronRight className="ml-auto size-3.5 text-[#F17141]" />}
          </button>
        ))}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-[#EADFD5]/50">
        <div className="mb-4 rounded-[20px] bg-[#24201D] p-5 text-[#FFFCF5]">
          <IconLock className="mb-4 size-[18px] text-[#FFECAE]" />
          <p className="text-[12px] font-extrabold">This is private.</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#BEB5AE]">
            Your data exists only in this browser session. Nothing leaves your device.
          </p>
        </div>
        <button
          onClick={reset}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E7D9C7] bg-[#FFFCF5] px-3 py-2.5 text-[12px] font-bold text-[#766F69] transition hover:border-[#F17141]/40 hover:bg-[#FFF4E4] hover:text-[#F17141] cursor-pointer"
        >
          Analyze another chat
        </button>
      </div>
    </aside>
  );
}
