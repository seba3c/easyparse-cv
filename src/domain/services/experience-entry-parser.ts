import { createExperienceEntry, type ExperienceEntry } from "../value-objects/experience-entry";
import { extractTitleAndDescription, splitSectionIntoEntryBlocks } from "./entry-block-splitter";

export interface ParseExperienceSectionResult {
  readonly entries: readonly ExperienceEntry[];
  readonly warning: string | null;
}

function parseTitleLine(titleText: string): { title: string | null; company: string | null } {
  if (!titleText) return { title: null, company: null };
  const atMatch = /^(.+?)\s+at\s+(.+)$/i.exec(titleText);
  if (atMatch) return { title: atMatch[1].trim(), company: atMatch[2].trim() };
  const commaIndex = titleText.indexOf(",");
  if (commaIndex !== -1) {
    return {
      title: titleText.slice(0, commaIndex).trim(),
      company: titleText.slice(commaIndex + 1).trim(),
    };
  }
  return { title: titleText, company: null };
}

export function parseExperienceSection(lines: readonly string[]): ParseExperienceSectionResult {
  if (lines.length === 0) return { entries: [], warning: null };

  const split = splitSectionIntoEntryBlocks(lines);
  if (!split) {
    return {
      entries: [createExperienceEntry({ raw: lines.join("\n") })],
      warning:
        "Could not confidently split Experience into individual entries; showing raw section text",
    };
  }

  const entries = split.blocks.map((block) => {
    const { titleText, description } = extractTitleAndDescription(block);
    const { title, company } = parseTitleLine(titleText);

    return createExperienceEntry({
      company,
      title,
      startDate: block.dateRange.startDate,
      endDate: block.dateRange.endDate,
      description,
      raw: block.lines.join("\n"),
    });
  });

  return { entries, warning: null };
}
