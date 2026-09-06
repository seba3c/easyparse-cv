export interface ExperienceEntry {
  readonly company: string | null;
  readonly title: string | null;
  readonly location: string | null;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly description: string | null;
  readonly raw: string;
}

export function createExperienceEntry(params: {
  company?: string | null;
  title?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  raw: string;
}): ExperienceEntry {
  if (!params.raw.trim()) {
    throw new Error("ExperienceEntry requires non-empty raw text");
  }
  return {
    company: params.company ?? null,
    title: params.title ?? null,
    location: params.location ?? null,
    startDate: params.startDate ?? null,
    endDate: params.endDate ?? null,
    description: params.description ?? null,
    raw: params.raw,
  };
}
