import { stripDiacritics } from "./text-normalization";

export type CvSectionKey = "experience" | "education" | "certifications" | "skills";

export interface SegmentedCv {
  readonly personalInfoLines: readonly string[];
  readonly sections: Readonly<Record<CvSectionKey, readonly string[]>>;
}

const SECTION_HEADER_DICTIONARY: Record<CvSectionKey, readonly string[]> = {
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
  skills: ["skills", "technical skills", "habilidades", "competencias", "habilidades tecnicas"],
};

function normalizeHeaderLine(line: string): string {
  return stripDiacritics(line.trim().toLowerCase())
    .replace(/[:\-–—]+$/, "")
    .trim()
    .replace(/\s+/g, " ");
}

function matchSectionHeader(line: string): CvSectionKey | null {
  const normalized = normalizeHeaderLine(line);
  if (!normalized) return null;
  for (const [key, phrases] of Object.entries(SECTION_HEADER_DICTIONARY) as [
    CvSectionKey,
    readonly string[],
  ][]) {
    if (phrases.includes(normalized)) return key;
  }
  return null;
}

export function segmentCv(lines: readonly string[]): SegmentedCv {
  const sections: Record<CvSectionKey, string[]> = {
    experience: [],
    education: [],
    certifications: [],
    skills: [],
  };
  const personalInfoLines: string[] = [];
  let currentSection: CvSectionKey | null = null;

  for (const line of lines) {
    const headerMatch = matchSectionHeader(line);
    if (headerMatch) {
      currentSection = headerMatch;
      continue;
    }
    if (currentSection) {
      sections[currentSection].push(line);
    } else {
      personalInfoLines.push(line);
    }
  }

  return { personalInfoLines, sections };
}
