import type { Message, ParseIssue, ParseResult, Participant } from "@/types";
import { buildTimestamp, detectDateOrder, type RawStamp } from "./date-parser";
import { extractEmojis } from "./emoji-parser";
import { countWords, tokenize } from "./word-parser";
import { extractUrls } from "./url-parser";

// Matches both common WhatsApp headers:
//   12/08/26, 9:41 pm - Alice: Hello
//   [12/08/26, 21:41:00] Alice: Hello
const HEADER =
  /^\[?\s*(\d{1,4})[/.-](\d{1,2})[/.-](\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap])\.?\s?m\.?\]?\s*(?:[-–—]\s*)?(.*)$|^\[?\s*(\d{1,4})[/.-](\d{1,2})[/.-](\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\]?\s*(?:[-–—]\s*)?(.*)$/i;

const MEDIA_MARKERS = [
  "<media omitted>",
  "image omitted",
  "video omitted",
  "audio omitted",
  "sticker omitted",
  "gif omitted",
  "document omitted",
  "contact card omitted",
  "<attached:",
];

const SYSTEM_PATTERNS = [
  /messages and calls are end-to-end encrypted/i,
  /created (this )?group/i,
  /changed the subject/i,
  /changed this group's icon/i,
  /added you|added \+?\d/i,
  /joined using this group's invite link/i,
  /left$/i,
  /changed their phone number/i,
  /you were added/i,
  /security code changed/i,
  /waiting for this message/i,
  /missed (voice|video) call/i,
];

function cleanLine(line: string): string {
  // Strip bidi/invisible marks WhatsApp sprinkles into exports.
  return line.replace(/[\u200E\u200F\u202A-\u202E\uFEFF]/g, "").replace(/\u00A0|\u202F/g, " ");
}

interface RawEntry {
  stamp: RawStamp;
  sender: string | null;
  body: string;
  line: number;
}

function matchHeader(line: string): { stamp: RawStamp; rest: string } | null {
  const m = HEADER.exec(line);
  if (!m) return null;
  const twelveHour = m[1] !== undefined;
  const g = twelveHour ? m.slice(1, 9) : m.slice(9, 16);
  const stamp: RawStamp = {
    a: Number(g[0]),
    b: Number(g[1]),
    y: Number(g[2]),
    hour: Number(g[3]),
    minute: Number(g[4]),
    second: g[5] ? Number(g[5]) : 0,
    meridiem: twelveHour ? ((g[6] as string).toLowerCase() === "p" ? "pm" : "am") : null,
  };
  const rest = (twelveHour ? g[7] : g[6]) ?? "";
  if (!Number.isFinite(stamp.a) || !Number.isFinite(stamp.b) || !Number.isFinite(stamp.y)) {
    return null;
  }
  if (stamp.hour > 23 || stamp.minute > 59) return null;
  return { stamp, rest };
}

function splitSender(rest: string): { sender: string | null; body: string } {
  const idx = rest.indexOf(": ");
  if (idx > 0 && idx < 80) {
    const sender = rest.slice(0, idx).trim();
    if (sender && !/[\n]/.test(sender)) return { sender, body: rest.slice(idx + 2) };
  }
  if (rest.endsWith(":") && rest.length < 80) {
    return { sender: rest.slice(0, -1).trim(), body: "" };
  }
  return { sender: null, body: rest };
}

export function parseWhatsAppText(input: string): ParseResult {
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  const raw: RawEntry[] = [];
  const issues: ParseIssue[] = [];

  lines.forEach((original, i) => {
    const line = cleanLine(original);
    if (!line.trim()) return;
    const header = matchHeader(line);
    if (header) {
      const { sender, body } = splitSender(header.rest);
      raw.push({ stamp: header.stamp, sender, body, line: i + 1 });
      return;
    }
    const previous = raw[raw.length - 1];
    if (previous) {
      previous.body += `\n${line}`;
      return;
    }

    issues.push({ lineNumber: i + 1, line: original.slice(0, 200), reason: "No message header found before this line" });
  });

  const dateOrder = detectDateOrder(raw.map((r) => r.stamp));
  const messages: Message[] = [];
  const participants = new Map<string, Participant>();

  raw.forEach((entry, index) => {
    const timestamp = buildTimestamp(entry.stamp, dateOrder);
    if (!Number.isFinite(timestamp)) {
      issues.push({ lineNumber: entry.line, line: entry.body.slice(0, 200), reason: "Unreadable date" });
      return;
    }
    const text = entry.body;
    const lower = text.toLowerCase();
    const isSystemMessage =
      entry.sender === null || SYSTEM_PATTERNS.some((re) => re.test(lower.trim()));
    const isMediaMessage = MEDIA_MARKERS.some((marker) => lower.includes(marker));
    const emojis = extractEmojis(text);
    const normalizedWords = isMediaMessage ? [] : tokenize(text);
    const message: Message = {
      id: `m${index}`,
      timestamp,
      sender: entry.sender ?? "system",
      text,
      isSystemMessage,
      isMediaMessage,
      wordCount: isMediaMessage ? 0 : countWords(text),
      characterCount: [...text].length,
      emojiCount: emojis.length,
      emojis,
      questionMarkCount: (text.match(/\?/g) || []).length,
      exclamationMarkCount: (text.match(/!/g) || []).length,
      urls: extractUrls(text),
      normalizedWords,
    };
    messages.push(message);

    if (!isSystemMessage && entry.sender) {
      const existing = participants.get(entry.sender) ?? {
        id: entry.sender,
        name: entry.sender,
        messageCount: 0,
        wordCount: 0,
      };
      existing.messageCount += 1;
      existing.wordCount += message.wordCount;
      participants.set(entry.sender, existing);
    }
  });

  messages.sort((a, b) => a.timestamp - b.timestamp);

  return {
    messages,
    participants: [...participants.values()].sort((a, b) => b.messageCount - a.messageCount),
    issues,
    totalLines: lines.length,
    dateOrder,
  };
}

export function looksLikeWhatsAppExport(input: string): boolean {
  const lines = input.replace(/\r\n?/g, "\n").split("\n").slice(0, 400);
  let hits = 0;
  for (const line of lines) {
    if (matchHeader(cleanLine(line))) hits += 1;
    if (hits >= 3) return true;
  }
  return false;
}
