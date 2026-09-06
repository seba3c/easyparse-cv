import {
  createCertificationEntry,
  type CertificationEntry,
} from "../value-objects/certification-entry";
import { parseSingleDate } from "./date-range-parser";

export interface ParseCertificationsSectionResult {
  readonly entries: readonly CertificationEntry[];
}

function stripDateAndPunctuation(line: string, dateRaw: string): string {
  const idx = line.toLowerCase().indexOf(dateRaw.toLowerCase());
  const stripped = idx === -1 ? line : line.slice(0, idx) + line.slice(idx + dateRaw.length);
  return stripped.replace(/^[\s,.\-–—()]+|[\s,.\-–—()]+$/g, "").trim();
}

function parseNameAndIssuer(text: string): { name: string | null; issuer: string | null } {
  if (!text) return { name: null, issuer: null };
  const lastCommaIndex = text.lastIndexOf(",");
  if (lastCommaIndex === -1) return { name: text, issuer: null };
  return {
    name: text.slice(0, lastCommaIndex).trim(),
    issuer: text.slice(lastCommaIndex + 1).trim(),
  };
}

/**
 * Certifications are typically one entry per line (unlike Experience/
 * Education, which need date-range anchors to split multi-line blocks),
 * so each non-empty line becomes its own entry.
 */
export function parseCertificationsSection(
  lines: readonly string[],
): ParseCertificationsSectionResult {
  const nonEmptyLines = lines.map((line) => line.trim()).filter(Boolean);

  const entries = nonEmptyLines.map((line) => {
    const dateMatch = parseSingleDate(line);
    const remainder = dateMatch ? stripDateAndPunctuation(line, dateMatch.raw) : line;
    const { name, issuer } = parseNameAndIssuer(remainder);

    return createCertificationEntry({
      name,
      issuer,
      date: dateMatch?.value ?? null,
      raw: line,
    });
  });

  return { entries };
}
