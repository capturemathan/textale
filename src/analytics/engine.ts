import type {
  Analysis,
  AnalysisFilter,
  Burst,
  Counted,
  DayBucket,
  Message,
  Participant,
  ResponseInterval,
  Session,
} from "@/types";
import { hostnameOf } from "@/parser/url-parser";
import { STOPWORDS } from "@/parser/word-parser";
import { applyFilter } from "./filter";

export const SESSION_GAP_THRESHOLD_MS = 30 * 60 * 1000;

export const TIME_OF_DAY_BUCKETS = [
  { key: "Night", label: "00:00–05:59", from: 0, to: 5 },
  { key: "Morning", label: "06:00–11:59", from: 6, to: 11 },
  { key: "Afternoon", label: "12:00–17:59", from: 12, to: 17 },
  { key: "Evening", label: "18:00–23:59", from: 18, to: 23 },
];

const RESPONSE_BUCKETS: { key: string; max: number }[] = [
  { key: "< 1 min", max: 60_000 },
  { key: "1–5 min", max: 5 * 60_000 },
  { key: "5–15 min", max: 15 * 60_000 },
  { key: "15–30 min", max: 30 * 60_000 },
  { key: "30–60 min", max: 60 * 60_000 },
  { key: "1–3 h", max: 3 * 3_600_000 },
  { key: "3–6 h", max: 6 * 3_600_000 },
  { key: "6–12 h", max: 12 * 3_600_000 },
  { key: "12–24 h", max: 24 * 3_600_000 },
  { key: "24 h+", max: Infinity },
];

const BURST_BUCKETS: { key: string; min: number; max: number }[] = [
  { key: "1", min: 1, max: 1 },
  { key: "2", min: 2, max: 2 },
  { key: "3–5", min: 3, max: 5 },
  { key: "6–10", min: 6, max: 10 },
  { key: "11–20", min: 11, max: 20 },
  { key: "21+", min: 21, max: Infinity },
];

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid] ?? null;
  const lo = sorted[mid - 1] ?? 0;
  const hi = sorted[mid] ?? 0;
  return (lo + hi) / 2;
}

export function dateKey(ts: number): string {
  const d = new Date(ts);
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function monthKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}`;
}

function topN(map: Map<string, number>, n: number): Counted[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}

function bump(map: Map<string, number>, key: string, by = 1) {
  map.set(key, (map.get(key) ?? 0) + by);
}

export function buildSessions(messages: Message[]): Session[] {
  const sessions: Session[] = [];
  let current: Session | null = null;
  let previousTs: number | null = null;
  messages.forEach((m) => {
    const isNew = current === null || previousTs === null || m.timestamp - previousTs > SESSION_GAP_THRESHOLD_MS;
    if (isNew) {
      current = {
        index: sessions.length,
        start: m.timestamp,
        end: m.timestamp,
        durationMs: 0,
        messageCount: 0,
        initiator: m.sender,
        senders: {},
      };
      sessions.push(current);
    }
    const session = sessions[sessions.length - 1];
    if (session) {
      session.messageCount += 1;
      session.end = m.timestamp;
      session.durationMs = session.end - session.start;
      session.senders[m.sender] = (session.senders[m.sender] ?? 0) + 1;
    }
    previousTs = m.timestamp;
  });
  return sessions;
}

/** Consecutive messages by the same sender collapse into one message run. */
export function buildResponseIntervals(messages: Message[]): ResponseInterval[] {
  const out: ResponseInterval[] = [];
  let runSender: string | null = null;
  let runStart = 0;
  messages.forEach((m) => {
    if (runSender === null) {
      runSender = m.sender;
      runStart = m.timestamp;
      return;
    }
    if (m.sender !== runSender) {
      out.push({ ms: m.timestamp - runStart, responder: m.sender, at: m.timestamp });
      runSender = m.sender;
      runStart = m.timestamp;
    }
  });
  return out;
}

export function buildBursts(messages: Message[]): Burst[] {
  const bursts: Burst[] = [];
  messages.forEach((m) => {
    const last = bursts[bursts.length - 1];
    if (last && last.sender === m.sender) last.count += 1;
    else bursts.push({ sender: m.sender, count: 1, start: m.timestamp });
  });
  return bursts;
}


function streaksFromDays(dayKeys: string[]) {
  const runs: { days: number; start: string; end: string }[] = [];
  let run: { days: number; start: string; end: string } | null = null;
  const oneDay = 86_400_000;
  dayKeys.forEach((key) => {
    const ts = new Date(`${key}T00:00:00`).getTime();
    if (run) {
      const prevTs = new Date(`${run.end}T00:00:00`).getTime();
      if (Math.round((ts - prevTs) / oneDay) === 1) {
        run.days += 1;
        run.end = key;
        return;
      }
      runs.push(run);
    }
    run = { days: 1, start: key, end: key };
  });
  if (run) runs.push(run);
  const longest = runs.reduce<typeof runs[number] | null>(
    (best, r) => (!best || r.days > best.days ? r : best),
    null,
  );
  return { longest, last: runs[runs.length - 1] ?? null };
}

export function analyze(
  allMessages: Message[],
  participantsAll: Participant[],
  filter: AnalysisFilter = {},
): Analysis {
  const messages = applyFilter(allMessages, filter);
  const totalMessages = messages.length;

  const participantNames = participantsAll.map((p) => p.name);
  const byParticipant: Analysis["byParticipant"] = {};
  participantNames.forEach((name) => {
    byParticipant[name] = {
      messages: 0,
      words: 0,
      messageShare: 0,
      wordShare: 0,
      emojis: 0,
      questions: 0,
      links: 0,
      initiations: 0,
      firstOfDay: 0,
      firstOfMonth: 0,
      medianResponseMs: null,
    };
  });
  const ensure = (name: string) => {
    let entry = byParticipant[name];
    if (!entry) {
      entry = {
        messages: 0,
        words: 0,
        messageShare: 0,
        wordShare: 0,
        emojis: 0,
        questions: 0,
        links: 0,
        initiations: 0,
        firstOfDay: 0,
        firstOfMonth: 0,
        medianResponseMs: null,
      };
      byParticipant[name] = entry;
    }
    return entry;
  };

  let totalWords = 0;
  let totalCharacters = 0;
  let totalEmojis = 0;
  let messagesWithEmoji = 0;
  let questionMessages = 0;
  let totalLinks = 0;

  const dayMap = new Map<string, DayBucket>();
  const monthMap = new Map<string, number>();
  const yearMap = new Map<string, number>();
  const questionMonthMap = new Map<string, number>();
  const hours = new Array(24).fill(0) as number[];
  const weekdays = new Array(7).fill(0) as number[];
  const timeOfDayMap = new Map<string, number>();
  const wordMap = new Map<string, number>();
  const wordTotals = new Map<string, number>();
  const emojiMap = new Map<string, number>();
  const domainMap = new Map<string, number>();
  const emojiMonthMap = new Map<string, Map<string, number>>();
  const messageWordCounts: number[] = [];
  let longestMessage: Analysis["longestMessage"] = null;
  const seenDayFirst = new Set<string>();
  const seenMonthFirst = new Set<string>();

  messages.forEach((m) => {
    const p = ensure(m.sender);
    p.messages += 1;
    p.words += m.wordCount;
    totalWords += m.wordCount;
    totalCharacters += m.characterCount;
    messageWordCounts.push(m.wordCount);
    if (!longestMessage || m.wordCount > longestMessage.words) {
      longestMessage = { words: m.wordCount, sender: m.sender, timestamp: m.timestamp };
    }

    const d = new Date(m.timestamp);
    const dk = dateKey(m.timestamp);
    const mk = monthKey(m.timestamp);
    const yk = `${d.getFullYear()}`;
    const hasQuestion = m.questionMarkCount > 0;
    if (hasQuestion) {
      questionMessages += 1;
      p.questions += 1;
      bump(questionMonthMap, mk);
    }
    totalEmojis += m.emojiCount;
    p.emojis += m.emojiCount;
    if (m.emojiCount > 0) messagesWithEmoji += 1;
    totalLinks += m.urls.length;
    p.links += m.urls.length;

    let day = dayMap.get(dk);
    if (!day) {
      day = { date: dk, messages: 0, words: 0, emojis: 0, questions: 0, links: 0, sessions: 0, bySender: {} };
      dayMap.set(dk, day);
    }
    day.messages += 1;
    day.words += m.wordCount;
    day.emojis += m.emojiCount;
    day.questions += hasQuestion ? 1 : 0;
    day.links += m.urls.length;
    day.bySender[m.sender] = (day.bySender[m.sender] ?? 0) + 1;

    bump(monthMap, mk);
    bump(yearMap, yk);
    hours[d.getHours()] = (hours[d.getHours()] ?? 0) + 1;
    weekdays[d.getDay()] = (weekdays[d.getDay()] ?? 0) + 1;
    const bucket = TIME_OF_DAY_BUCKETS.find((b) => d.getHours() >= b.from && d.getHours() <= b.to);
    if (bucket) bump(timeOfDayMap, bucket.key);

    if (!seenDayFirst.has(dk)) {
      seenDayFirst.add(dk);
      p.firstOfDay += 1;
    }
    if (!seenMonthFirst.has(mk)) {
      seenMonthFirst.add(mk);
      p.firstOfMonth += 1;
    }

    m.normalizedWords.forEach((w) => {
      bump(wordTotals, w);
      if (!STOPWORDS.has(w) && w.length > 2) bump(wordMap, w);
    });
    m.emojis.forEach((e) => {
      bump(emojiMap, e);
      let em = emojiMonthMap.get(mk);
      if (!em) {
        em = new Map();
        emojiMonthMap.set(mk, em);
      }
      bump(em, e);
    });
    m.urls.forEach((u) => bump(domainMap, hostnameOf(u)));
  });

  Object.values(byParticipant).forEach((p) => {
    p.messageShare = totalMessages ? (p.messages / totalMessages) * 100 : 0;
    p.wordShare = totalWords ? (p.words / totalWords) * 100 : 0;
  });

  const sessions = buildSessions(messages);
  sessions.forEach((s) => {
    ensure(s.initiator).initiations += 1;
    const day = dayMap.get(dateKey(s.start));
    if (day) day.sessions += 1;
  });

  const responses = buildResponseIntervals(messages);
  const responseMs = responses.map((r) => r.ms);
  participantNames.forEach((name) => {
    const own = responses.filter((r) => r.responder === name).map((r) => r.ms);
    const entry = ensure(name);
    entry.medianResponseMs = median(own);
  });

  const responseByHour: number[] = new Array(24).fill(0);
  responses.forEach((r) => {
    const h = new Date(r.at).getHours();
    if (h >= 0 && h < 24) {
      responseByHour[h] += 1;
    }
  });

  const bursts = buildBursts(messages);
  const burstDistribution = BURST_BUCKETS.map((b) => ({
    key: b.key,
    count: bursts.filter((x) => x.count >= b.min && x.count <= b.max).length,
  }));
  const largestBurst = bursts.reduce<Burst | null>((best, b) => (!best || b.count > best.count ? b : best), null);

  const turns = messages.reduce((count, m, i) => {
    const prev = messages[i - 1];
    return i === 0 ? 1 : count + (prev && prev.sender !== m.sender ? 1 : 0);
  }, 0);

  const days = [...dayMap.values()].sort((a, b) => a.date.localeCompare(b.date));
  const busiestDay = days.reduce<DayBucket | null>((best, d) => (!best || d.messages > best.messages ? d : best), null);
  const quietestDay = days.reduce<DayBucket | null>((best, d) => (!best || d.messages < best.messages ? d : best), null);
  const months = [...monthMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([key, count]) => ({ key, count }));
  const years = [...yearMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([key, count]) => ({ key, count }));

  const streaks = streaksFromDays(days.map((d) => d.date));
  const firstTimestamp = messages[0]?.timestamp ?? 0;
  const lastTimestamp = messages[messages.length - 1]?.timestamp ?? 0;

  const topEmojiKeys = topN(emojiMap, 5).map((e) => e.key);
  const emojiEvolution = [...emojiMonthMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, counts]) => {
      const row: Record<string, number> = {};
      topEmojiKeys.forEach((k) => {
        row[k] = counts.get(k) ?? 0;
      });
      return { month, counts: row };
    });

  const longestSession = sessions.reduce<Session | null>(
    (best, s) => (!best || s.durationMs > best.durationMs ? s : best),
    null,
  );
  const mostMessagesSession = sessions.reduce<Session | null>(
    (best, s) => (!best || s.messageCount > best.messageCount ? s : best),
    null,
  );

  const maxBy = (pick: (d: DayBucket) => number) =>
    days.reduce<DayBucket | null>((best, d) => (!best || pick(d) > pick(best) ? d : best), null);

  const uniqueWords = wordTotals.size;
  const weekendMessages = (weekdays[0] ?? 0) + (weekdays[6] ?? 0);

  return {
    filter,
    participants: participantNames.map((name) => ({
      id: name,
      name,
      messageCount: byParticipant[name]?.messages ?? 0,
      wordCount: byParticipant[name]?.words ?? 0,
    })),
    totalMessages,
    totalWords,
    totalCharacters,
    firstTimestamp,
    lastTimestamp,
    chatSpanMs: Math.max(0, lastTimestamp - firstTimestamp),
    activeDays: days.length,
    messagesPerActiveDay: days.length ? totalMessages / days.length : 0,
    byParticipant,
    days,
    busiestDay,
    quietestDay,
    months,
    busiestMonth: months.reduce<Counted | null>((best, m) => (!best || m.count > best.count ? m : best), null),
    years,
    busiestYear: years.reduce<Counted | null>((best, y) => (!best || y.count > best.count ? y : best), null),
    hours,
    peakHour: totalMessages ? hours.indexOf(Math.max(...hours)) : null,
    weekdays,
    peakWeekday: totalMessages ? weekdays.indexOf(Math.max(...weekdays)) : null,
    weekendShare: totalMessages ? (weekendMessages / totalMessages) * 100 : 0,
    timeOfDay: TIME_OF_DAY_BUCKETS.map((b) => ({ key: b.key, count: timeOfDayMap.get(b.key) ?? 0 })),
    sessionCount: sessions.length,
    averageSessionMessages: sessions.length ? totalMessages / sessions.length : 0,
    medianSessionMessages: median(sessions.map((s) => s.messageCount)) ?? 0,
    longestSession,
    mostMessagesSession,
    sessions,
    averageMessageWords: totalMessages ? totalWords / totalMessages : 0,
    medianMessageWords: median(messageWordCounts) ?? 0,
    longestMessage,
    totalTurns: turns,
    averageMessagesPerTurn: turns ? totalMessages / turns : 0,
    largestBurst,
    burstDistribution,
    medianResponseMs: median(responseMs),
    averageResponseMs: responseMs.length ? responseMs.reduce((a, b) => a + b, 0) / responseMs.length : null,
    fastestResponse: responses.reduce<ResponseInterval | null>((best, r) => (!best || r.ms < best.ms ? r : best), null),
    longestResponse: responses.reduce<ResponseInterval | null>((best, r) => (!best || r.ms > best.ms ? r : best), null),
    responseDistribution: RESPONSE_BUCKETS.map((b, i) => {
      const previous = RESPONSE_BUCKETS[i - 1];
      const min = previous ? previous.max : 0;
      return { key: b.key, count: responseMs.filter((ms) => ms >= min && ms < b.max).length };
    }),
    responseByHour,
    uniqueWords,
    topWords: topN(wordMap, 20),
    vocabularyVariety: totalWords ? (uniqueWords / totalWords) * 1000 : 0,
    questionMessages,
    questionRate: totalMessages ? (questionMessages / totalMessages) * 100 : 0,
    questionsByMonth: [...questionMonthMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, count]) => ({ key, count })),
    totalEmojis,
    messagesWithEmoji,
    emojisPerMessage: totalMessages ? totalEmojis / totalMessages : 0,
    topEmojis: topN(emojiMap, 20),
    emojiEvolution,
    totalLinks,
    uniqueDomains: domainMap.size,
    topDomains: topN(domainMap, 20),
    longestStreak: streaks.longest,
    lastStreak: streaks.last,
    streakEndsToday: streaks.last ? streaks.last.end === dateKey(Date.now()) : false,
    records: {
      mostWordsInDay: maxBy((d) => d.words),
      mostEmojisInDay: maxBy((d) => d.emojis),
      mostQuestionsInDay: maxBy((d) => d.questions),
      mostLinksInDay: maxBy((d) => d.links),
    },
  };
}
