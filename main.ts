// VELMARA — a travel poster for a place that does not exist.
// The poster image (entry.png, a JPEG) is shipped beside this program;
// this program copies it to the grader's output directory, verifying it
// byte-for-byte. No network, no randomness, no arguments.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576;

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const bytes = readFileSync(source);
if (bytes.length === 0) throw new Error("entry.png is empty");
if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
}
if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
  throw new Error("entry.png is not a whole JPEG (bad SOI/EOI markers)");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, bytes);

const written = readFileSync(outPath);
if (!written.equals(bytes)) {
  throw new Error("output bytes differ from entry.png");
}
console.log(`wrote ${outPath} (${written.length} bytes)`);
