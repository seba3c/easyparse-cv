import type { ParsedCvResult } from "@/domain/value-objects/parsed-cv-result";
import { PersonalInfoSection } from "./personal-info-section";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { CertificationsSection } from "./certifications-section";
import { SkillsSection } from "./skills-section";

function findWarningFor(warnings: readonly string[], sectionKeyword: string): string | undefined {
  return warnings.find((warning) => warning.toLowerCase().includes(sectionKeyword.toLowerCase()));
}

export function CvResultView({ result }: { result: ParsedCvResult }) {
  const experienceWarning = findWarningFor(result.warnings, "experience");
  const educationWarning = findWarningFor(result.warnings, "education");

  return (
    <div className="grid gap-4">
      <PersonalInfoSection personalInfo={result.personalInfo} />
      <ExperienceSection entries={result.experience} warning={experienceWarning} />
      <EducationSection entries={result.education} warning={educationWarning} />
      <CertificationsSection entries={result.certifications} />
      <SkillsSection skills={result.skills} />
    </div>
  );
}
