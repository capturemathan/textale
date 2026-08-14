export interface RawStamp {
  a: number; // first date component
  b: number; // second date component
  y: number;
  hour: number;
  minute: number;
  second: number;
  meridiem: "am" | "pm" | null;
}

export type DateOrder = "day-first" | "month-first";

/**
 * Decides whether the export uses D/M/Y or M/D/Y by looking for a component
 * that can only be a day. Defaults to day-first (WhatsApp's most common form).
 */
export function detectDateOrder(stamps: RawStamp[]): DateOrder {
  let firstOver12 = false;
  let secondOver12 = false;
  for (const s of stamps) {
    if (s.a > 12) firstOver12 = true;
    if (s.b > 12) secondOver12 = true;
  }
  if (firstOver12 && !secondOver12) return "day-first";
  if (secondOver12 && !firstOver12) return "month-first";
  return "day-first";
}

export function normalizeYear(y: number): number {
  if (y >= 1000) return y;
  return y >= 70 ? 1900 + y : 2000 + y;
}

export function buildTimestamp(stamp: RawStamp, order: DateOrder): number {
  const day = order === "day-first" ? stamp.a : stamp.b;
  const month = order === "day-first" ? stamp.b : stamp.a;
  let hour = stamp.hour;
  if (stamp.meridiem === "pm" && hour < 12) hour += 12;
  if (stamp.meridiem === "am" && hour === 12) hour = 0;
  return new Date(
    normalizeYear(stamp.y),
    Math.max(0, month - 1),
    day,
    hour,
    stamp.minute,
    stamp.second,
    0,
  ).getTime();
}
