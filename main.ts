import { mkdirSync, writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";
import { join } from "node:path";

// One line about a small good thing that happened today (Tue 24 Nov 2026,
// Jakarta morning): the warteg auntie's unasked kindness, and the turn at
// the end — an egg I never ordered, eaten like a gift.
const LINE =
  "This morning the warteg auntie slipped an extra fried egg onto my rice and whispered, 'for the early bird' — I hadn't ordered it, but I ate it like a gift.";

// Byte ceiling matching the 200-char limit: the widest BMP character is
// 3 UTF-8 bytes, so no valid line can exceed 600 bytes.
const MAX_BYTES = 600;

function assertValidLine(line: unknown): asserts line is string {
  if (typeof line !== "string") {
    throw new Error("line must be a string");
  }
  if (line.length < 1 || line.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${line.length}`);
  }
  const byteLength = Buffer.byteLength(line, "utf8");
  if (byteLength > MAX_BYTES) {
    throw new Error(`line must be at most ${MAX_BYTES} UTF-8 bytes, got ${byteLength}`);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (line !== line.trim()) {
    throw new Error("line must not have leading or trailing whitespace");
  }
  if (/[\x00-\x1F\x7F]/.test(line)) {
    throw new Error("line must not contain control characters");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
assertValidLine(LINE);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
