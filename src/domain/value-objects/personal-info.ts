export interface Links {
  readonly linkedin: string | null;
  readonly github: string | null;
  readonly other: readonly string[];
}

export interface PersonalInfo {
  readonly fullName: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly location: string | null;
  readonly links: Links;
}

export function createPersonalInfo(
  partial: Partial<Omit<PersonalInfo, "links">> & { links?: Partial<Links> } = {},
): PersonalInfo {
  return {
    fullName: partial.fullName ?? null,
    email: partial.email ?? null,
    phone: partial.phone ?? null,
    location: partial.location ?? null,
    links: {
      linkedin: partial.links?.linkedin ?? null,
      github: partial.links?.github ?? null,
      other: partial.links?.other ?? [],
    },
  };
}
