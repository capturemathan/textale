import { unzip, unzipSync, type Unzipped } from "fflate";

export interface ZipInspection {
  chatFiles: string[];
  mediaFileCount: number;
  entryNames: string[];
}

function isChatCandidate(name: string): boolean {
  const base = name.split("/").pop() ?? name;
  if (base.startsWith(".") || base.startsWith("__MACOSX")) return false;
  return base.toLowerCase().endsWith(".txt");
}

function rank(name: string): number {
  const base = (name.split("/").pop() ?? name).toLowerCase();
  if (base === "_chat.txt") return 0;
  if (base.startsWith("whatsapp chat")) return 1;
  if (base.startsWith("chat")) return 2;
  return 3;
}

/** Lists archive entries without decompressing media payloads. */
export async function inspectZip(bytes: Uint8Array): Promise<ZipInspection> {
  const unzipped = await unzipAsync(bytes, (name) => !isChatCandidate(name));
  const entryNames = Object.keys(unzipped);
  const chatFiles = entryNames.filter(isChatCandidate).sort((a, b) => rank(a) - rank(b));
  return {
    chatFiles,
    mediaFileCount: entryNames.filter((n) => !isChatCandidate(n) && !n.endsWith("/")).length,
    entryNames,
  };
}

/** Decompresses a single text entry from the archive. */
export async function readZipTextEntry(bytes: Uint8Array, entryName: string): Promise<string> {
  const unzipped = await unzipAsync(bytes, (name) => name !== entryName);
  const data = unzipped[entryName];
  if (!data) throw new Error(`Entry not found: ${entryName}`);
  return new TextDecoder("utf-8").decode(data);
}

function unzipAsync(bytes: Uint8Array, skip: (name: string) => boolean): Promise<Unzipped> {
  return new Promise((resolve, reject) => {
    try {
      unzip(bytes, { filter: (file) => !skip(file.name) }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    } catch (error) {
      try {
        resolve(unzipSync(bytes, { filter: (file) => !skip(file.name) }));
      } catch {
        reject(error instanceof Error ? error : new Error("Could not read this ZIP"));
      }
    }
  });
}
