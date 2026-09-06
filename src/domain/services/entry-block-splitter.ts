import { parseDateRange } from "./date-range-parser";
import type { DateRange } from "../value-objects/date-range";

export interface EntryBlock {
  readonly lines: readonly string[];
  readonly dateRange: DateRange;
}

export interface SplitSectionResult {
  readonly blocks: readonly EntryBlock[];
}

export function isDateOnlyLine(line: string, dateRaw: string): boolean {
  const idx = line.toLowerCase().indexOf(dateRaw.toLowerCase());
  if (idx === -1) return false;
  const remainder = line.slice(0, idx) + line.slice(idx + dateRaw.length);
  return remainder.replace(/[\s,.\-–—()]/g, "") === "";
}

export function stripDateFromLine(line: string, dateRaw: string): string {
  const idx = line.toLowerCase().indexOf(dateRaw.toLowerCase());
  if (idx === -1) return line.trim();
  const stripped = line.slice(0, idx) + line.slice(idx + dateRaw.length);
  return stripped.replace(/^[\s,.\-–—()]+|[\s,.\-–—()]+$/g, "").trim();
}

/**
 * Splits a section's lines into per-entry blocks anchored on date-range
 * matches. Returns null when no date range can be found anywhere in the
 * section, signaling the caller to fall back to a single raw block.
 *
 * The line immediately before a date-only anchor line is pulled into the
 * same entry as the anchor (it's almost always the title/company line),
 * while an anchor line that already carries other text (title and date
 * combined) is used as-is - see design.md - Decisions (Segmentation strategy).
 */
export function splitSectionIntoEntryBlocks(lines: readonly string[]): SplitSectionResult | null {
  const anchors: { index: number; dateRange: DateRange }[] = [];
  lines.forEach((line, index) => {
    const dateRange = parseDateRange(line);
    if (dateRange) anchors.push({ index, dateRange });
  });

  if (anchors.length === 0) return null;

  const boundaries = anchors.map((anchor, k) => {
    if (k === 0) return 0;
    const previous = anchors[k - 1];
    const dateOnly = isDateOnlyLine(lines[anchor.index], anchor.dateRange.raw);
    return dateOnly ? Math.max(anchor.index - 1, previous.index + 1) : anchor.index;
  });

  const blocks: EntryBlock[] = anchors.map((anchor, k) => {
    const start = boundaries[k];
    const end = k + 1 < boundaries.length ? boundaries[k + 1] : lines.length;
    return { lines: lines.slice(start, end), dateRange: anchor.dateRange };
  });

  return { blocks };
}

/**
 * Splits a block into its title/heading text (e.g. "Senior Engineer at
 * Acme") and any remaining description lines, accounting for both the
 * "title and date on the same line" and "title and date on separate
 * lines" cases.
 */
export function extractTitleAndDescription(block: EntryBlock): {
  titleText: string;
  description: string | null;
} {
  const dateLineIndex = block.lines.findIndex((line) => line.includes(block.dateRange.raw));
  const dateOnly =
    dateLineIndex !== -1 && isDateOnlyLine(block.lines[dateLineIndex], block.dateRange.raw);
  const titleLineIndex = dateOnly && dateLineIndex > 0 ? dateLineIndex - 1 : dateLineIndex;

  const titleText =
    titleLineIndex === dateLineIndex
      ? stripDateFromLine(block.lines[titleLineIndex] ?? "", block.dateRange.raw)
      : (block.lines[titleLineIndex] ?? "").trim();

  const excludedIndices = new Set([titleLineIndex, dateLineIndex]);
  const descriptionLines = block.lines.filter((_, index) => !excludedIndices.has(index));
  const description = descriptionLines.length > 0 ? descriptionLines.join("\n") : null;

  return { titleText, description };
}
