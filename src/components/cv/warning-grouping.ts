/**
 * Splits a ParsedCvResult's flat warnings list into ones already claimed by
 * a specific section (e.g. an Experience/Education low-confidence split
 * warning matched via a section keyword) and the remainder, which aren't
 * tied to any single section (e.g. the document-wide low-confidence
 * segmentation warning) and should render as a general notice instead - see
 * cv-results-display/spec.md - Warning Display.
 */
export function findWarningFor(warnings: readonly string[], sectionKeyword: string): string | undefined {
  return warnings.find((warning) => warning.toLowerCase().includes(sectionKeyword.toLowerCase()));
}

export function partitionGeneralWarnings(
  warnings: readonly string[],
  claimedWarnings: readonly (string | undefined)[],
): readonly string[] {
  const claimed = new Set(claimedWarnings.filter((warning): warning is string => warning !== undefined));
  return warnings.filter((warning) => !claimed.has(warning));
}
