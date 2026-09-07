import { stripDiacritics } from "./text-normalization";

export type CvSectionKey = "summary" | "experience" | "education" | "certifications" | "skills";

export interface SegmentedCv {
  readonly personalInfoLines: readonly string[];
  readonly sections: Readonly<Record<CvSectionKey, readonly string[]>>;
  readonly warning: string | null;
}

const SECTION_HEADER_DICTIONARY: Record<CvSectionKey, readonly string[]> = {
  summary: [
    "summary",
    "professional summary",
    "profile",
    "about me",
    "objective",
    "perfil profesional",
    "resumen",
    "resumen profesional",
    "objetivo",
    "perfil",
    "acerca de mi",
    "sobre mi",
  ],
  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment history",
    "experiencia",
    "experiencia laboral",
    "experiencia profesional",
  ],
  education: [
    "education",
    "academic background",
    "educacion",
    "formacion academica",
    "formacion",
  ],
  certifications: [
    "certifications",
    "certificates",
    "certifications and licenses",
    "certificaciones",
    "certificados",
  ],
  skills: [
    "skills",
    "technical skills",
    "tools",
    "habilidades",
    "competencias",
    "habilidades tecnicas",
    "herramientas",
  ],
};

/**
 * Headers that are recognized purely as section boundaries: they stop their
 * content from bleeding into whichever tracked section preceded them, but
 * (unlike SECTION_HEADER_DICTIONARY keys) have no structured field to be
 * collected into in v1 - see design.md - Decisions (CvSectionKey gains a
 * "summary" member; segmentation state gains a non-exposed "ignored" mode).
 */
const IGNORED_HEADER_PHRASES: readonly string[] = [
  "achievements",
  "awards",
  "distinctions",
  "awards and achievements",
  "logros y distinciones",
  "logros destacados",
  "logros",
  "distinciones",
];

const ALL_RECOGNIZED_HEADER_PHRASES: readonly string[] = [
  ...Object.values(SECTION_HEADER_DICTIONARY).flat(),
  ...IGNORED_HEADER_PHRASES,
];

function normalizeHeaderLine(line: string): string {
  return stripDiacritics(line.trim().toLowerCase())
    .replace(/[:\-–—]+$/, "")
    .trim()
    .replace(/\s+/g, " ");
}

type HeaderMatch = { readonly kind: "tracked"; readonly key: CvSectionKey } | { readonly kind: "ignored" };

function matchHeader(line: string): HeaderMatch | null {
  const normalized = normalizeHeaderLine(line);
  if (!normalized) return null;
  for (const [key, phrases] of Object.entries(SECTION_HEADER_DICTIONARY) as [
    CvSectionKey,
    readonly string[],
  ][]) {
    if (phrases.includes(normalized)) return { kind: "tracked", key };
  }
  if (IGNORED_HEADER_PHRASES.includes(normalized)) return { kind: "ignored" };
  return null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isAllCapsLine(line: string): boolean {
  return /\p{Lu}/u.test(line) && !/\p{Ll}/u.test(line);
}

function lineHasPhraseWithExtraContent(line: string, phrase: string): boolean {
  const normalizedPhrase = normalizeHeaderLine(phrase);
  if (!normalizedPhrase) return false;
  const normalizedLine = normalizeHeaderLine(line);
  const phraseRegex = new RegExp(`(^|\\s)${escapeRegExp(normalizedPhrase)}(\\s|$)`, "i");
  if (!phraseRegex.test(normalizedLine)) return false;
  const remainder = normalizedLine.replace(phraseRegex, " ").trim();
  return remainder.length > 0;
}

const LOW_CONFIDENCE_SEGMENTATION_WARNING =
  "Section boundaries may be unreliable for this document: detected what looks like multiple headers concatenated onto a single line, which can happen with multi-column CV layouts.";

/**
 * Detects the signature of two visually separate all-caps headers being
 * concatenated onto one extracted line (e.g. from adjacent columns of a
 * multi-column CV whose text pdfjs's y-position line-grouping can't tell
 * apart) - see cv-parsing/spec.md - Low-Confidence Segmentation Warning.
 * Deliberately narrow (all-caps line + extra all-caps content beyond a
 * recognized phrase) to avoid flagging ordinary prose that merely mentions
 * a header word.
 */
export function detectLowConfidenceSegmentation(
  lines: readonly string[],
  recognizedPhrases: readonly string[] = ALL_RECOGNIZED_HEADER_PHRASES,
): string | null {
  for (const line of lines) {
    if (!isAllCapsLine(line)) continue;
    const hasEmbeddedHeader = recognizedPhrases.some((phrase) =>
      lineHasPhraseWithExtraContent(line, phrase),
    );
    if (hasEmbeddedHeader) return LOW_CONFIDENCE_SEGMENTATION_WARNING;
  }
  return null;
}

export function segmentCv(lines: readonly string[]): SegmentedCv {
  const sections: Record<CvSectionKey, string[]> = {
    summary: [],
    experience: [],
    education: [],
    certifications: [],
    skills: [],
  };
  const personalInfoLines: string[] = [];
  let mode: "personal-info" | CvSectionKey | "ignored" = "personal-info";

  for (const line of lines) {
    const headerMatch = matchHeader(line);
    if (headerMatch) {
      mode = headerMatch.kind === "tracked" ? headerMatch.key : "ignored";
      continue;
    }
    if (mode === "personal-info") {
      personalInfoLines.push(line);
    } else if (mode !== "ignored") {
      sections[mode].push(line);
    }
  }

  return { personalInfoLines, sections, warning: detectLowConfidenceSegmentation(lines) };
}
