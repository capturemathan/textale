import { IconShield, IconCheck, IconClose } from '@/components/icons';

interface PrivacyModalProps {
  onClose: () => void;
}

export function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#24201D]/30 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="privacy-title" data-testid="modal-privacy">
      <div className="relative w-full max-w-md rounded-[28px] border border-[#E7D9C7] bg-[#FFFCF5] p-7 shadow-[0_25px_80px_rgba(36,32,29,.18)]">
        <button onClick={onClose} className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-[#766F69] hover:bg-[#F3EBE2]" aria-label="Close privacy details" data-testid="button-close-privacy">
          <IconClose className="size-4" />
        </button>
        <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#FFECAE] text-[#F17141]">
          <IconShield className="size-[21px]" />
        </div>
        <h2 id="privacy-title" className="text-[26px] font-extrabold tracking-[-.05em]">Your chat stays on your device.</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#766F69]">
          TexTale uses your browser’s file picker and local processing only. The chat content is not sent to a server, saved to an account, or used to train anything.
        </p>
        <div className="mt-6 space-y-3 border-t border-[#EDE2D6] pt-5 text-[12px] text-[#4E4640]">
          {["TXT and ZIP exports are accepted", "ZIP media is ignored for message analytics", "No semantic or relationship interpretation"].map((line) => (
            <div key={line} className="flex items-center gap-2">
              <IconCheck className="size-3.5 text-[#F17141]" />
              {line}
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          data-testid="button-privacy-done"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#24201D] px-4 py-2.5 text-[12px] font-bold text-[#FFFCF5] transition duration-200 hover:-translate-y-0.5 hover:bg-[#3C3530]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
