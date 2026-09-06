import type { FileHash } from "./file-hash";
import type { PersonalInfo } from "./personal-info";
import type { ExperienceEntry } from "./experience-entry";
import type { EducationEntry } from "./education-entry";
import type { CertificationEntry } from "./certification-entry";

export interface ParsedCvResult {
  readonly hash: FileHash;
  readonly fileName: string;
  readonly personalInfo: PersonalInfo;
  readonly experience: readonly ExperienceEntry[];
  readonly education: readonly EducationEntry[];
  readonly certifications: readonly CertificationEntry[];
  readonly skills: readonly string[];
  readonly warnings: readonly string[];
}

export function createParsedCvResult(params: {
  hash: FileHash;
  fileName: string;
  personalInfo: PersonalInfo;
  experience?: readonly ExperienceEntry[];
  education?: readonly EducationEntry[];
  certifications?: readonly CertificationEntry[];
  skills?: readonly string[];
  warnings?: readonly string[];
}): ParsedCvResult {
  if (!params.fileName.trim()) {
    throw new Error("ParsedCvResult requires a non-empty fileName");
  }
  return {
    hash: params.hash,
    fileName: params.fileName,
    personalInfo: params.personalInfo,
    experience: params.experience ?? [],
    education: params.education ?? [],
    certifications: params.certifications ?? [],
    skills: params.skills ?? [],
    warnings: params.warnings ?? [],
  };
}
