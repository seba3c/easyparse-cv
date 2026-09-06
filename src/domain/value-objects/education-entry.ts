export interface EducationEntry {
  readonly institution: string | null;
  readonly degree: string | null;
  readonly fieldOfStudy: string | null;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly raw: string;
}

export function createEducationEntry(params: {
  institution?: string | null;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  raw: string;
}): EducationEntry {
  if (!params.raw.trim()) {
    throw new Error("EducationEntry requires non-empty raw text");
  }
  return {
    institution: params.institution ?? null,
    degree: params.degree ?? null,
    fieldOfStudy: params.fieldOfStudy ?? null,
    startDate: params.startDate ?? null,
    endDate: params.endDate ?? null,
    raw: params.raw,
  };
}
