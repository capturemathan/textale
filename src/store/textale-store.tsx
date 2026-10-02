import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Analysis, AnalysisFilter, Participant } from "../types";
import type { WorkerRequest, WorkerResponse } from "../workers/analytics.worker";

export const PROCESSING_STAGES = [
  "Reading your export",
  "Finding the conversation",
  "Counting messages",
  "Mapping activity",
  "Building conversations",
  "Counting words & emojis",
  "Creating your story",
];

export type Phase = "idle" | "processing" | "choose-chat" | "discovered" | "ready";

export interface TexTaleState {
  phase: Phase;
  stage: string;
  stageIndex: number;
  analysis: Analysis | null;
  participants: Participant[];
  messageCount: number;
  chatName: string;
  fileName: string;
  filter: AnalysisFilter;
  recomputing: boolean;
  error: string | null;
  chatEntries: string[];
  mediaFileCount: number;
  allTimeBounds: { from: number; to: number } | null;
}

const initialState: TexTaleState = {
  phase: "idle",
  stage: "",
  stageIndex: 0,
  analysis: null,
  participants: [],
  messageCount: 0,
  chatName: "",
  fileName: "",
  filter: {},
  recomputing: false,
  error: null,
  chatEntries: [],
  mediaFileCount: 0,
  allTimeBounds: null,
};

export interface TexTaleContextValue extends TexTaleState {
  processFile: (file: File) => Promise<void>;
  chooseChatFile: (entryName: string) => void;
  setFilter: (filter: AnalysisFilter) => void;
  reset: () => void;
  revealStory: () => void;
}

const TexTaleContext = createContext<TexTaleContextValue | null>(null);

export function TexTaleProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TexTaleState>(initialState);
  const workerRef = useRef<Worker | null>(null);

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    
    // Create the worker
    const worker = new Worker(new URL("../workers/analytics.worker.ts", import.meta.url), {
      type: "module",
    });
    
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const msg = event.data;
      setState((prev) => {
        switch (msg.type) {
          case "stage": {
            const index = Math.max(0, PROCESSING_STAGES.indexOf(msg.stage));
            return {
              ...prev,
              stage: msg.stage,
              stageIndex: index,
            };
          }
          case "choose-chat":
            return {
              ...prev,
              phase: "choose-chat",
              chatEntries: msg.files,
              mediaFileCount: msg.mediaFileCount,
            };
          case "imported":
            return {
              ...prev,
              phase: "discovered", // Set to discovered, not ready
              stage: "",
              stageIndex: PROCESSING_STAGES.length,
              analysis: msg.analysis,
              participants: msg.participants,
              messageCount: msg.messageCount,
              mediaFileCount: msg.mediaFileCount,
              chatName: msg.sourceName || prev.fileName,
              filter: {},
              error: null,
              allTimeBounds: {
                from: msg.analysis.firstTimestamp,
                to: msg.analysis.lastTimestamp,
              },
            };
          case "analysis":
            return {
              ...prev,
              analysis: msg.analysis,
              recomputing: false,
            };
          case "error":
            return {
              ...prev,
              phase: "idle", // Reset phase or keep error state? The user only specified those phases, so let's stick to idle and set error.
              error: msg.message,
              stage: "",
              stageIndex: 0,
            };
          default:
            return prev;
        }
      });
    };
    
    workerRef.current = worker;
    return worker;
  }, []);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const send = useCallback(
    (request: WorkerRequest, transfer?: Transferable[]) => {
      const worker = ensureWorker();
      worker.postMessage(request, transfer ?? []);
    },
    [ensureWorker],
  );

  const processFile = useCallback(
    async (file: File) => {
      setState({
        ...initialState,
        phase: "processing",
        stage: PROCESSING_STAGES[0] ?? "Reading your export",
        stageIndex: 0,
        fileName: file.name,
      });

      const isZip = file.name.toLowerCase().endsWith(".zip") || file.type === "application/zip";
      
      try {
        if (isZip) {
          const bytes = await file.arrayBuffer();
          send({ type: "import-zip", bytes }, [bytes]);
        } else {
          const text = await file.text();
          send({ type: "import-text", text });
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          phase: "idle",
          error: err instanceof Error ? err.message : "Failed to read file",
        }));
      }
    },
    [send],
  );

  const chooseChatFile = useCallback(
    (entryName: string) => {
      setState((prev) => ({
        ...prev,
        phase: "processing",
        chatEntries: [],
      }));
      send({ type: "import-zip", bytes: new ArrayBuffer(0), entryName });
    },
    [send],
  );

  const setFilter = useCallback(
    (filter: AnalysisFilter) => {
      setState((prev) => ({
        ...prev,
        filter,
        recomputing: true,
      }));
      send({ type: "analyze", filter });
    },
    [send],
  );

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const revealStory = useCallback(() => {
    setState((prev) => {
      if (prev.phase === "discovered") {
        return { ...prev, phase: "ready" };
      }
      return prev;
    });
  }, []);

  const value = useMemo<TexTaleContextValue>(
    () => ({
      ...state,
      processFile,
      chooseChatFile,
      setFilter,
      reset,
      revealStory,
    }),
    [state, processFile, chooseChatFile, setFilter, reset, revealStory],
  );

  return <TexTaleContext.Provider value={value}>{children}</TexTaleContext.Provider>;
}

export function useTexTale(): TexTaleContextValue {
  const value = useContext(TexTaleContext);
  if (!value) {
    throw new Error("useTexTale must be used within a TexTaleProvider");
  }
  return value;
}
