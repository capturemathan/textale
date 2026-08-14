import { useRef, useState } from "react";
import { IconUpload } from "@/components/icons";

export function DecorativeOrbit() {
  return (
    <div className="pointer-events-none absolute -right-10 -top-14 size-64 opacity-80 sm:-right-14 sm:-top-20 sm:size-80" aria-hidden="true">
      <div className="absolute inset-4 rounded-full border border-[#F17141]/20" />
      <div className="absolute inset-12 rounded-full border border-dashed border-[#F17141]/30" />
      <div className="absolute inset-20 rounded-full bg-[#F17141]/10" />
      <span className="absolute left-3/4 top-1/4 size-3 rounded-full bg-[#F17141] shadow-[0_0_0_8px_rgba(241,113,65,0.12)]" />
      <span className="absolute bottom-1/4 left-1/4 size-2 rounded-full bg-[#24201D]/50" />
    </div>
  );
}

interface UploadDropzoneProps {
  onFileAccepted: (file: File) => void;
}

export function UploadDropzone({ onFileAccepted }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  
  const chooseFile = () => inputRef.current?.click();
  
  const receiveFile = (file?: File) => {
    if (!file) return;
    const valid = file.name.toLowerCase().endsWith(".txt") || file.name.toLowerCase().endsWith(".zip");
    if (!valid) {
      setFileError("Please choose a WhatsApp TXT or ZIP export.");
      return;
    }
    setFileError("");
    onFileAccepted(file);
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#E6D3AE] bg-[#FFECAE] p-6 shadow-[0_20px_70px_rgba(180,133,60,0.11)] sm:p-8 lg:p-9" data-testid="card-upload-panel">
      <DecorativeOrbit />
      <div className="relative">
        <div className="mb-6 flex items-center justify-between sm:mb-7">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#6C4E2A]">Private import</p>
            <p className="mt-1 text-[12px] font-medium text-[#806641]">Nothing leaves this browser.</p>
          </div>
          <span className="grid size-10 place-items-center rounded-2xl bg-[#FFFCF5]/70 text-[#F17141] shadow-2xs">
            <IconUpload className="size-[17px]" />
          </span>
        </div>
        <button
          type="button"
          onClick={chooseFile}
          onDragEnter={() => setDragging(true)}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); receiveFile(event.dataTransfer.files[0]); }}
          data-testid="dropzone-chat-import"
          aria-label="Drop your WhatsApp TXT or ZIP export here, or choose a file"
          className={`group relative flex min-h-[260px] w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed px-6 py-8 sm:py-10 text-center transition cursor-pointer ${
            dragging 
              ? "border-[#F17141] bg-[#FFF4D2]" 
              : "border-[#DFAF78]/80 bg-[#FFFCF5]/50 hover:border-[#F17141]/80 hover:bg-[#FFFCF5]/75"
          }`}
        >
          <span className="mb-4 grid size-14 place-items-center rounded-[20px] bg-[#FFFCF5] text-[#F17141] shadow-[0_10px_22px_rgba(139,94,41,0.12)]">
            <IconUpload className="size-[22px] text-[#A59A90] transition-colors group-hover:text-[#F17141]" />
          </span>
          <span className="text-[17px] sm:text-[19px] font-extrabold tracking-[-0.03em] text-[#24201D]">Drop your WhatsApp chat here</span>
          <span className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#806641]">TXT or ZIP · up to 200 MB</span>
          <span className="my-4 flex items-center gap-2.5 text-[11px] font-medium text-[#9A805A]">
            <span className="h-px w-7 bg-[#D4AC77]" />or<span className="h-px w-7 bg-[#D4AC77]" />
          </span>
          <span className="rounded-full bg-[#F17141] px-5 py-2.5 text-[12px] font-bold text-[#FFFCF5] shadow-[0_4px_14px_rgba(241,113,65,0.25)] group-hover:bg-[#e76537] transition duration-200">
            Choose a file
          </span>
        </button>
        <input 
          ref={inputRef} 
          type="file" 
          accept=".txt,.zip,text/plain,application/zip" 
          className="hidden" 
          onChange={(event) => receiveFile(event.target.files?.[0])} 
          data-testid="input-chat-file" 
        />
        {fileError ? (
          <p className="mt-4 text-center text-[11px] font-semibold text-[#B44D32]" role="alert" data-testid="status-import-error">
            {fileError}
          </p>
        ) : (
          <p className="mt-5 text-center text-[11.5px] font-medium text-[#806641]">Exports are read in memory and cleared when you leave.</p>
        )}
      </div>
    </div>
  );
}
