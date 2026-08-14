export interface Message {
  id: string;
  timestamp: number; // epoch ms (structured-clone friendly)
  sender: string;
  text: string;

  isSystemMessage: boolean;
  isMediaMessage: boolean;

  wordCount: number;
  characterCount: number;

  emojiCount: number;
  emojis: string[];

  questionMarkCount: number;
  exclamationMarkCount: number;

  urls: string[];
  normalizedWords: string[];
}

export interface Participant {
  id: string;
  name: string;
  messageCount: number;
  wordCount: number;
}

export interface ParseIssue {
  lineNumber: number;
  line: string;
  reason: string;
}

export interface ParseResult {
  messages: Message[];
  participants: Participant[];
  issues: ParseIssue[];
  totalLines: number;
  dateOrder: "day-first" | "month-first";
}


export interface Session {
  index: number;
  start: number;
  end: number;
  durationMs: number;
  messageCount: number;
  initiator: string;
  senders: Record<string, number>;
}

export interface ResponseInterval {
  ms: number;
  responder: string;
  at: number;
}

export interface Burst {
  sender: string;
  count: number;
  start: number;
}

export interface DayBucket {
  date: string; // YYYY-MM-DD
  messages: number;
  words: number;
  emojis: number;
  questions: number;
  links: number;
  sessions: number;
  bySender: Record<string, number>;
}

export interface Counted {
  key: string;
  count: number;
}


export interface AnalysisFilter {
  from?: number | undefined;
  to?: number | undefined;
  participant?: string | undefined; // undefined => everyone
}

export interface Analysis {
  filter: AnalysisFilter;
  participants: Participant[];
  totalMessages: number;
  totalWords: number;
  totalCharacters: number;
  firstTimestamp: number;
  lastTimestamp: number;
  chatSpanMs: number;
  activeDays: number;
  messagesPerActiveDay: number;

  byParticipant: Record<
    string,
    {
      messages: number;
      words: number;
      messageShare: number;
      wordShare: number;
      emojis: number;
      questions: number;
      links: number;
      initiations: number;
      firstOfDay: number;
      firstOfMonth: number;
      medianResponseMs: number | null;
    }
  >;

  days: DayBucket[];
  busiestDay: DayBucket | null;
  quietestDay: DayBucket | null;
  months: Counted[];
  busiestMonth: Counted | null;
  years: Counted[];
  busiestYear: Counted | null;

  hours: number[]; // 24
  peakHour: number | null;
  weekdays: number[]; // 7, 0 = Sunday
  peakWeekday: number | null;
  weekendShare: number;
  timeOfDay: { key: string; count: number }[];

  sessionCount: number;
  averageSessionMessages: number;
  medianSessionMessages: number;
  longestSession: Session | null;
  mostMessagesSession: Session | null;
  sessions: Session[];

  averageMessageWords: number;
  medianMessageWords: number;
  longestMessage: { words: number; sender: string; timestamp: number } | null;
  totalTurns: number;
  averageMessagesPerTurn: number;
  largestBurst: Burst | null;
  burstDistribution: Counted[];

  medianResponseMs: number | null;
  averageResponseMs: number | null;
  fastestResponse: ResponseInterval | null;
  longestResponse: ResponseInterval | null;
  responseDistribution: Counted[];
  responseByHour: number[];

  uniqueWords: number;
  topWords: Counted[];
  vocabularyVariety: number;

  questionMessages: number;
  questionRate: number;
  questionsByMonth: Counted[];

  totalEmojis: number;
  messagesWithEmoji: number;
  emojisPerMessage: number;
  topEmojis: Counted[];
  emojiEvolution: { month: string; counts: Record<string, number> }[];

  totalLinks: number;
  uniqueDomains: number;
  topDomains: Counted[];

  longestStreak: { days: number; start: string; end: string } | null;
  lastStreak: { days: number; start: string; end: string } | null;
  streakEndsToday: boolean;

  records: {
    mostWordsInDay: DayBucket | null;
    mostEmojisInDay: DayBucket | null;
    mostQuestionsInDay: DayBucket | null;
    mostLinksInDay: DayBucket | null;
  };
}
