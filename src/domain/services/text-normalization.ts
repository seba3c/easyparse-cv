const COMBINING_DIACRITICAL_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

export function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(COMBINING_DIACRITICAL_MARKS, "");
}
