import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getMethodology } from '@/lib/methodology';
import { IconClose, IconInfo, IconShield } from '@/components/icons';

interface MetricInfoModalProps {
  label: string | null;
  onClose: () => void;
}

export function MetricInfoModal({ label, onClose }: MetricInfoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!label) return null;

  const info = getMethodology(label);

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#24201D]/75 backdrop-blur-md p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[32px] border-2 border-[#EADFD5] bg-[#FFF8EA] p-6 sm:p-8 shadow-[0_25px_60px_rgba(36,32,29,0.35)] text-[#24201D] custom-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 grid size-8 place-items-center rounded-full bg-[#FFECAE] text-[#F17141] hover:bg-[#F17141] hover:text-[#FFFCF5] transition cursor-pointer"
            aria-label="Close metric methodology details"
          >
            <IconClose className="size-4" />
          </button>

          {/* Header */}
          <div className="mb-6 flex items-center gap-3.5 pr-8">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#F17141] text-[#FFFCF5] shadow-[0_6px_18px_rgba(241,113,65,0.22)]">
              <IconInfo className="size-5.5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#F17141]">
                  Methodology & Receipts
                </span>
              </div>
              <h2 className="text-[23px] font-extrabold tracking-[-0.05em] text-[#24201D] leading-tight">
                {info.title}
              </h2>
            </div>
          </div>

          {/* Content Breakdown */}
          <div className="space-y-5">
            <div>
              <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#806641]">
                What it measures
              </p>
              <p className="text-[13px] leading-6 text-[#24201D] font-medium">
                {info.measures}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#806641]">
                Formula
              </p>
              <code className="block rounded-xl bg-[#24201D] px-4 py-3 font-mono text-[12px] font-bold text-[#FFECAE] leading-relaxed break-all">
                {info.formula}
              </code>
            </div>

            <div>
              <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#806641]">
                Method
              </p>
              <p className="text-[13px] leading-6 text-[#24201D] font-medium">
                {info.method}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#806641]">
                Limitations & Edge Cases
              </p>
              <p className="text-[13px] leading-6 text-[#766F69] font-medium">
                {info.limitations}
              </p>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="mt-7 flex items-center justify-between border-t border-[#EADFD5] pt-5">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                info.classification === 'Derived'
                  ? 'bg-[#F17141] text-[#FFFCF5]'
                  : 'bg-[#FFECAE] text-[#6C4E2A]'
              }`}
            >
              {info.classification} Metric
            </span>

            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#766F69]">
              <IconShield className="size-3.5 text-[#F17141]" />
              Calculated locally
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
