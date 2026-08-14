// Unicode-aware emoji segmentation. Handles ZWJ sequences, skin tone
// modifiers, variation selectors, keycaps and regional-indicator flags.
const EMOJI_CLUSTER =
  /(?:\p{RI}\p{RI})|(?:[0-9#*]\uFE0F?\u20E3)|(?:\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D(?:\p{Extended_Pictographic}|\p{RI}\p{RI})(?:\uFE0F|\p{Emoji_Modifier})?)*)/gu;

export function extractEmojis(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(EMOJI_CLUSTER)) {
    const cluster = m[0];
    // Skip bare digits/asterisks that are not keycaps and plain text symbols.
    if (/^[0-9#*]$/.test(cluster)) continue;
    out.push(cluster);
  }
  return out;
}
