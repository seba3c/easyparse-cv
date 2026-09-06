const BULLET_PREFIX_REGEX = /^[\s•\-*·▪◦]+/;
const DELIMITER_REGEX = /[,|;]+/;

function dedupe(items: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

/**
 * Extracts a flat list of skills from a Skills section, splitting on
 * commas, pipes, semicolons, and/or bullet-per-line lists.
 */
export function parseSkillsSection(lines: readonly string[]): readonly string[] {
  const skills: string[] = [];

  for (const line of lines) {
    const withoutBullet = line.replace(BULLET_PREFIX_REGEX, "");
    for (const part of withoutBullet.split(DELIMITER_REGEX)) {
      const trimmed = part.trim();
      if (trimmed) skills.push(trimmed);
    }
  }

  return dedupe(skills);
}
