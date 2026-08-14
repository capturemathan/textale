import type { AnalysisFilter, Message } from "@/types";

export function applyFilter(messages: Message[], filter: AnalysisFilter): Message[] {
  return messages.filter((m) => {
    if (m.isSystemMessage) return false;
    if (filter.from !== undefined && m.timestamp < filter.from) return false;
    if (filter.to !== undefined && m.timestamp > filter.to) return false;
    if (filter.participant && m.sender !== filter.participant) return false;
    return true;
  });
}
