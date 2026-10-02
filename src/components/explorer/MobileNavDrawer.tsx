import { motion, AnimatePresence } from 'motion/react';
import { useTexTale } from '@/store/textale-store';
import {
  IconHome,
  IconActivity,
  IconMessageCircle,
  IconSmile,
  IconTrophy,
  IconShield,
  IconClose,
  IconChevronRight,
  IconLogo,
} from '@/components/icons';
import type { ExplorerTab } from './index';

const tabs: { label: ExplorerTab; icon: React.FC<any>; description: string }[] = [
  { label: "Overview", icon: IconHome, description: "Total messages, active days & chat span" },
  { label: "Activity", icon: IconActivity, description: "Daily calendar, peak hours & volume" },
  { label: "Conversations", icon: IconMessageCircle, description: "Sessions, reply speeds & head-to-head" },
  { label: "Expressions", icon: IconSmile, description: "Words, signature emojis & shared links" },
  { label: "Records", icon: IconTrophy, description: "Hall of fame all-time records" },
];

export function MobileNavDrawer({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
}: {
  isOpen: boolean;
  activeTab: ExplorerTab;
  onTabChange: (tab: ExplorerTab) => void;
  onClose: () => void;
}) {
  const { participants, reset } = useTexTale();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 lg:hidden flex justify-start">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#24201D]/40 backdrop-blur-[3px]"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-[85%] max-w-xs h-[100dvh] flex flex-col overflow-y-auto border-r border-[#EADFD5] bg-[#FFF8EA] p-5 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EADFD5]">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-[#FFECAE] text-[#F17141] shadow-[0_4px_12px_rgba(241,113,65,0.15)] p-1">
                <IconLogo className="size-full text-[#F17141]" featherAccent="#FFECAE" />
              </span>
              <span className="text-[17px] font-extrabold tracking-[-0.05em] text-[#24201D]">
                Tex<span className="text-[#F17141]">Tale</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="grid size-8 place-items-center rounded-full bg-[#F3EBE2] text-[#766F69] hover:text-[#F17141]"
              aria-label="Close menu"
            >
              <IconClose className="size-4" />
            </button>
          </div>

          <div className="py-3 px-1">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#B4A99D]">
              Navigation · 5 Chapters
            </span>
            {participants.length > 0 && (
              <p className="text-[11px] font-bold text-[#806641] mt-0.5 truncate">
                {participants.map(p => p.name).join(" + ")}
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto py-2 pr-1 custom-scrollbar" aria-label="Mobile Navigation">
            {tabs.map(({ label, icon: Icon, description }) => {
              const isActive = activeTab === label;
              return (
                <button
                  key={label}
                  onClick={() => {
                    onTabChange(label);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                    isActive
                      ? "bg-[#FFECAE] text-[#24201D] shadow-sm"
                      : "text-[#766F69] hover:bg-[#F6EEDD] hover:text-[#24201D]"
                  }`}
                >
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${isActive ? "bg-[#F17141] text-[#FFFCF5]" : "bg-[#F3EBE2] text-[#766F69]"}`}>
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-extrabold">{label}</span>
                      {isActive && <IconChevronRight className="size-3.5 text-[#F17141]" />}
                    </div>
                    <p className="text-[10px] text-[#A59A90] truncate mt-0.5">{description}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-[#EADFD5]">
            <div className="mb-3 rounded-[16px] bg-[#24201D] p-4 text-[#FFFCF5]">
              <div className="flex items-center gap-2 mb-1">
                <IconShield className="size-4 text-[#F17141]" />
                <span className="text-[11px] font-extrabold">Processed locally</span>
              </div>
              <p className="text-[10px] text-[#BEB5AE] leading-relaxed">
                Your data stays entirely in your browser session.
              </p>
            </div>
            <button
              onClick={() => {
                reset();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E7D9C7] bg-[#FFFCF5] px-3 py-2.5 text-[12px] font-bold text-[#766F69] transition hover:text-[#F17141] cursor-pointer"
            >
              Analyze another chat
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
