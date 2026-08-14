// Deterministic, Unicode-aware tokenization.
// No stemming, no semantics, no language models.
const TOKEN = /[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu;

export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const m of text.toLowerCase().matchAll(TOKEN)) {
    const token = m[0].replace(/^[-'’_]+|[-'’_]+$/g, "");
    if (token) out.push(token);
  }
  return out;
}

/**
 * Word count = number of whitespace/punctuation separated tokens.
 * Limitation: languages without whitespace word boundaries (e.g. Chinese,
 * Japanese, Thai) are undercounted by this rule.
 */
export function countWords(text: string): number {
  return tokenize(text).length;
}

export const STOPWORDS = new Set(
  ("a an and the to of in on at for is are was were be been being am i you he she it we they me him her them my your his its our their this that these those " +
    "do does did done have has had having will would can could should shall may might must not no yes so if then than as but or because with without about into " +
    "from by up down out off over under again just very too also only even much many more most any all some such own same s t d ll m o re ve y ain aren couldn didn " +
    "doesn hadn hasn haven isn ma mightn mustn needn shan shouldn wasn weren won wouldn u ur im ok okay oh hey hi yeah ya na haan k")
    .split(/\s+/)
    .filter(Boolean),
);
