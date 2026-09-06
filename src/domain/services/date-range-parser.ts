import { createDateRange, type DateRange } from "../value-objects/date-range";
import { stripDiacritics } from "./text-normalization";

const MONTH_NUMBERS: Readonly<Record<string, string>> = {
  jan: "01",
  january: "01",
  ene: "01",
  enero: "01",
  feb: "02",
  february: "02",
  febrero: "02",
  mar: "03",
  march: "03",
  marzo: "03",
  apr: "04",
  april: "04",
  abr: "04",
  abril: "04",
  may: "05",
  mayo: "05",
  jun: "06",
  june: "06",
  junio: "06",
  jul: "07",
  july: "07",
  julio: "07",
  aug: "08",
  august: "08",
  ago: "08",
  agosto: "08",
  sep: "09",
  sept: "09",
  september: "09",
  septiembre: "09",
  setiembre: "09",
  oct: "10",
  october: "10",
  octubre: "10",
  nov: "11",
  november: "11",
  noviembre: "11",
  dec: "12",
  december: "12",
  dic: "12",
  diciembre: "12",
};

const PRESENT_WORDS = ["present", "current", "currently", "presente", "actualidad", "actual"];

const MONTH_PATTERN = Object.keys(MONTH_NUMBERS)
  .sort((a, b) => b.length - a.length)
  .join("|");
const POINT_PATTERN = `(?:(?:${MONTH_PATTERN})\\.?\\s+)?\\d{4}`;
const PRESENT_PATTERN = PRESENT_WORDS.join("|");
const SEPARATOR_PATTERN = `(?:\\s*[-–—]\\s*|\\s+to\\s+|\\s+a\\s+)`;

const DATE_RANGE_REGEX = new RegExp(
  `(${POINT_PATTERN})${SEPARATOR_PATTERN}(${POINT_PATTERN}|${PRESENT_PATTERN})`,
  "i",
);

function normalizePoint(text: string): string {
  const normalized = stripDiacritics(text.trim().toLowerCase());
  const monthYearMatch = /^([a-z]+)\.?\s+(\d{4})$/.exec(normalized);
  if (monthYearMatch) {
    const [, monthWord, year] = monthYearMatch;
    const monthNumber = MONTH_NUMBERS[monthWord];
    return monthNumber ? `${year}-${monthNumber}` : year;
  }
  return normalized;
}

/**
 * Finds the first date range in the given text (e.g. a CV entry's text block)
 * and returns it normalized, or null if no date range is present.
 */
export function parseDateRange(text: string): DateRange | null {
  const match = DATE_RANGE_REGEX.exec(text);
  if (!match) return null;

  const [raw, startRaw, endRaw] = match;
  const startDate = normalizePoint(startRaw);
  const endDate = PRESENT_WORDS.includes(stripDiacritics(endRaw.trim().toLowerCase()))
    ? "Present"
    : normalizePoint(endRaw);

  return createDateRange({ startDate, endDate, raw });
}

const SINGLE_POINT_REGEX = new RegExp(`\\b(${POINT_PATTERN})\\b`, "i");

export interface SingleDateMatch {
  readonly value: string;
  readonly raw: string;
}

/**
 * Finds a single date point (month+year or year-only) in text, for
 * one-off dates such as a certification's issue date (as opposed to a
 * start/end range - see parseDateRange).
 */
export function parseSingleDate(text: string): SingleDateMatch | null {
  const match = SINGLE_POINT_REGEX.exec(text);
  if (!match) return null;
  return { value: normalizePoint(match[1]), raw: match[1] };
}
