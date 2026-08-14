/// <reference lib="webworker" />
import { parseWhatsAppText, looksLikeWhatsAppExport } from "../parser/message-parser";
import { inspectZip, readZipTextEntry } from "../parser/zip-parser";
import { analyze } from "../analytics/engine";
import type { Analysis, AnalysisFilter, Message, ParseIssue, Participant } from "../types";

export type WorkerRequest =
  | { type: "import-text"; text: string }
  | { type: "import-zip"; bytes: ArrayBuffer; entryName?: string }
  | { type: "analyze"; filter: AnalysisFilter };

export type WorkerResponse =
  | { type: "stage"; stage: string }
  | { type: "choose-chat"; files: string[]; mediaFileCount: number }
  | {
      type: "imported";
      analysis: Analysis;
      participants: Participant[];
      issues: ParseIssue[];
      messageCount: number;
      mediaFileCount: number;
      sourceName: string | null;
    }
  | { type: "analysis"; analysis: Analysis }
  | { type: "error"; code: "invalid-txt" | "invalid-zip" | "empty" | "unknown"; message: string };

let messages: Message[] = [];
let participants: Participant[] = [];
let zipBytes: Uint8Array | null = null;
let mediaFileCount = 0;

const post = (msg: WorkerResponse) => self.postMessage(msg);
const stage = (s: string) => post({ type: "stage", stage: s });

function runImport(text: string, sourceName: string | null) {
  if (!looksLikeWhatsAppExport(text)) {
    post({
      type: "error",
      code: "invalid-txt",
      message: "This doesn't look like a supported WhatsApp chat export.",
    });
    return;
  }
  stage("Counting messages");
  const parsed = parseWhatsAppText(text);
  const real = parsed.messages.filter((m) => !m.isSystemMessage);
  if (real.length === 0) {
    post({ type: "error", code: "empty", message: "We couldn't find any messages in this export." });
    return;
  }
  messages = parsed.messages;
  participants = parsed.participants;
  stage("Mapping activity");
  stage("Building conversations");
  stage("Counting words & emojis");
  const analysis = analyze(messages, participants, {});
  stage("Creating your story");
  post({
    type: "imported",
    analysis,
    participants,
    issues: parsed.issues,
    messageCount: real.length,
    mediaFileCount,
    sourceName,
  });
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  try {
    if (request.type === "import-text") {
      stage("Reading your export");
      mediaFileCount = 0;
      runImport(request.text, null);
      return;
    }

    if (request.type === "import-zip") {
      stage("Reading your export");
      if (request.bytes.byteLength > 0) zipBytes = new Uint8Array(request.bytes);
      if (!zipBytes) {
        post({ type: "error", code: "invalid-zip", message: "We couldn't read this ZIP." });
        return;
      }
      stage("Finding the conversation");
      const inspection = await inspectZip(zipBytes);
      mediaFileCount = inspection.mediaFileCount;
      if (inspection.chatFiles.length === 0) {
        post({
          type: "error",
          code: "invalid-zip",
          message: "We couldn't find a WhatsApp chat inside this ZIP.",
        });
        return;
      }
      const entry =
        request.entryName ??
        (inspection.chatFiles.length === 1 ? inspection.chatFiles[0] : undefined);
      if (!entry) {
        post({ type: "choose-chat", files: inspection.chatFiles, mediaFileCount });
        return;
      }
      const text = await readZipTextEntry(zipBytes, entry);
      runImport(text, entry.split("/").pop() ?? entry);
      return;
    }

    if (request.type === "analyze") {
      post({ type: "analysis", analysis: analyze(messages, participants, request.filter) });
    }
  } catch (error) {
    post({
      type: "error",
      code: "unknown",
      message: error instanceof Error ? error.message : "Something went wrong while reading this file.",
    });
  }
};
