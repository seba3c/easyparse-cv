import { createEducationEntry, type EducationEntry } from "../value-objects/education-entry";
import { extractTitleAndDescription, splitSectionIntoEntryBlocks } from "./entry-block-splitter";

export interface ParseEducationSectionResult {
  readonly entries: readonly EducationEntry[];
  readonly warning: string | null;
}

function parseDegreeLine(text: string): {
  degree: string | null;
  institution: string | null;
  fieldOfStudy: string | null;
} {
  if (!text) return { degree: null, institution: null, fieldOfStudy: null };

  let degreePart = text;
  let institution: string | null = null;

  const atMatch = /^(.+?)\s+at\s+(.+)$/i.exec(text);
  if (atMatch) {
    degreePart = atMatch[1].trim();
    institution = atMatch[2].trim();
  } else {
    const commaIndex = text.indexOf(",");
    if (commaIndex !== -1) {
      degreePart = text.slice(0, commaIndex).trim();
      institution = text.slice(commaIndex + 1).trim();
    }
  }

  const inMatch = /^(.+?)\s+in\s+(.+)$/i.exec(degreePart);
  const degree = inMatch ? inMatch[1].trim() : degreePart || null;
  const fieldOfStudy = inMatch ? inMatch[2].trim() : null;

  return { degree, institution, fieldOfStudy };
}

export function parseEducationSection(lines: readonly string[]): ParseEducationSectionResult {
  if (lines.length === 0) return { entries: [], warning: null };

  const split = splitSectionIntoEntryBlocks(lines);
  if (!split) {
    return {
      entries: [createEducationEntry({ raw: lines.join("\n") })],
      warning:
        "Could not confidently split Education into individual entries; showing raw section text",
    };
  }

  const entries = split.blocks.map((block) => {
    const { titleText } = extractTitleAndDescription(block);
    const { degree, institution, fieldOfStudy } = parseDegreeLine(titleText);

    return createEducationEntry({
      institution,
      degree,
      fieldOfStudy,
      startDate: block.dateRange.startDate,
      endDate: block.dateRange.endDate,
      raw: block.lines.join("\n"),
    });
  });

  return { entries, warning: null };
}
