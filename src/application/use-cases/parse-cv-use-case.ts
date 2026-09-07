import type { TextExtractorPort } from "../../domain/ports/text-extractor-port";
import type { FileHasherPort } from "../../domain/ports/file-hasher-port";
import { createParsedCvResult, type ParsedCvResult } from "../../domain/value-objects/parsed-cv-result";
import { segmentCv } from "../../domain/services/section-segmenter";
import { extractPersonalInfo } from "../../domain/services/personal-info-extractor";
import { parseExperienceSection } from "../../domain/services/experience-entry-parser";
import { parseEducationSection } from "../../domain/services/education-entry-parser";
import { parseCertificationsSection } from "../../domain/services/certification-entry-parser";
import { parseSkillsSection } from "../../domain/services/skills-parser";

export interface ParseCvInput {
  readonly fileBytes: Buffer;
  readonly fileName: string;
}

/**
 * Orchestrates the full CV parsing pipeline: hash -> extract -> segment ->
 * parse -> assemble. Depends only on domain types and ports (see
 * design.md - Decisions), never on Next.js, pdfjs, or Node's crypto directly.
 * Propagates NoTextLayerError as-is when the extractor can't find a text
 * layer (see cv-parsing/spec.md - Local Text Extraction).
 */
export class ParseCvUseCase {
  constructor(
    private readonly textExtractor: TextExtractorPort,
    private readonly fileHasher: FileHasherPort,
  ) {}

  async execute(input: ParseCvInput): Promise<ParsedCvResult> {
    const hash = this.fileHasher.hash(input.fileBytes);
    const extracted = await this.textExtractor.extract(input.fileBytes);

    const segmented = segmentCv(extracted.lines);
    const personalInfo = extractPersonalInfo({
      allLines: extracted.lines,
      personalInfoLines: segmented.personalInfoLines,
    });

    const experienceResult = parseExperienceSection(segmented.sections.experience);
    const educationResult = parseEducationSection(segmented.sections.education);
    const certificationsResult = parseCertificationsSection(segmented.sections.certifications);
    const skills = parseSkillsSection(segmented.sections.skills);
    const summaryText = segmented.sections.summary.join("\n").trim();
    const summary = summaryText.length > 0 ? summaryText : null;

    const warnings = [experienceResult.warning, educationResult.warning, segmented.warning].filter(
      (warning): warning is string => warning !== null,
    );

    return createParsedCvResult({
      hash,
      fileName: input.fileName,
      personalInfo,
      summary,
      experience: experienceResult.entries,
      education: educationResult.entries,
      certifications: certificationsResult.entries,
      skills,
      warnings,
    });
  }
}
