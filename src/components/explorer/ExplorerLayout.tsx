import { ReactNode, useState } from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { FilterBar } from "./FilterBar";
import { AppFooter } from "@/components/common/Footer";
import type { ExplorerTab } from "./index";

export function ExplorerLayout({
  activeTab,
  onTabChange,
  onShare,
  children,
}: {
  activeTab: ExplorerTab;
  onTabChange: (tab: ExplorerTab) => void;
  onShare?: () => void;
  children: ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[100dvh] bg-[#FFFCF5] text-[#24201D] font-sans selection:bg-[#F17141]/20">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex w-full flex-col lg:min-w-0">
        <TopBar activeTab={activeTab} onMenuClick={() => setIsMobileOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-8 lg:px-12 pb-16 max-w-7xl mx-auto w-full flex flex-col justify-between">
          <div>
            <FilterBar activeTab={activeTab} onShare={onShare} />
            {children}
          </div>
          <footer className="mt-12 border-t border-[#EADFD5] pt-6 pb-2 text-center">
            <AppFooter />
          </footer>
        </main>
      </div>
      <MobileNavDrawer
        isOpen={isMobileOpen}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onClose={() => setIsMobileOpen(false)}
      />
    </div>
  );
}
