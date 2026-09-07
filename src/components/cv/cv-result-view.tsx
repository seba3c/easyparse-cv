"use client";

import { useState } from "react";
import type { ParsedCvResult } from "@/domain/value-objects/parsed-cv-result";
import { WarningAlert } from "./warning-alert";
import { PersonalInfoSection } from "./personal-info-section";
import { SummarySection } from "./summary-section";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { CertificationsSection } from "./certifications-section";
import { SkillsSection } from "./skills-section";
import { findWarningFor, partitionGeneralWarnings } from "./warning-grouping";

type SectionId =
  | "personal-info"
  | "summary"
  | "experience"
  | "education"
  | "certifications"
  | "skills";

const FIRST_SECTION_ID: SectionId = "personal-info";

/**
 * Keyed by the caller with `result.hash` so a new parse result remounts this component,
 * naturally resetting `openSectionId` to the first section instead of needing an effect.
 */
export function CvResultView({ result }: { result: ParsedCvResult }) {
  const [openSectionId, setOpenSectionId] = useState<SectionId | null>(FIRST_SECTION_ID);

  function sectionProps(id: SectionId) {
    return {
      open: openSectionId === id,
      onOpenChange: (open: boolean) => setOpenSectionId(open ? id : null),
    };
  }

  const experienceWarning = findWarningFor(result.warnings, "experience");
  const educationWarning = findWarningFor(result.warnings, "education");
  const generalWarnings = partitionGeneralWarnings(result.warnings, [experienceWarning, educationWarning]);

  return (
    <div className="grid gap-4">
      {generalWarnings.map((warning, index) => (
        <WarningAlert key={index} message={warning} />
      ))}
      <PersonalInfoSection personalInfo={result.personalInfo} {...sectionProps("personal-info")} />
      <SummarySection summary={result.summary} {...sectionProps("summary")} />
      <ExperienceSection
        entries={result.experience}
        warning={experienceWarning}
        {...sectionProps("experience")}
      />
      <EducationSection
        entries={result.education}
        warning={educationWarning}
        {...sectionProps("education")}
      />
      <CertificationsSection entries={result.certifications} {...sectionProps("certifications")} />
      <SkillsSection skills={result.skills} {...sectionProps("skills")} />
    </div>
  );
}
