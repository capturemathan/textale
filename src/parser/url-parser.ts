const URL_RE = /(?:https?:\/\/|www\.)[^\s<>"'()[\]{}]+/gi;

export function extractUrls(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(URL_RE)) {
    out.push(m[0].replace(/[.,;:!?]+$/, ""));
  }
  return out;
}

/** Parses the hostname locally. URLs are never fetched or resolved. */
export function hostnameOf(url: string): string {
  try {
    const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "unknown";
  }
}
