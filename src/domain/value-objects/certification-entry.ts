export interface CertificationEntry {
  readonly name: string | null;
  readonly issuer: string | null;
  readonly date: string | null;
  readonly raw: string;
}

export function createCertificationEntry(params: {
  name?: string | null;
  issuer?: string | null;
  date?: string | null;
  raw: string;
}): CertificationEntry {
  if (!params.raw.trim()) {
    throw new Error("CertificationEntry requires non-empty raw text");
  }
  return {
    name: params.name ?? null,
    issuer: params.issuer ?? null,
    date: params.date ?? null,
    raw: params.raw,
  };
}
