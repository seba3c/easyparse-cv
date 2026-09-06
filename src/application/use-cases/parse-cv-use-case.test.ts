import { describe, it, expect } from "vitest";
import { ParseCvUseCase } from "./parse-cv-use-case";
import { NoTextLayerError, type TextExtractorPort } from "../../domain/ports/text-extractor-port";
import type { FileHasherPort } from "../../domain/ports/file-hasher-port";
import { createFileHash } from "../../domain/value-objects/file-hash";

const FIXED_HASH = createFileHash("b".repeat(64));

function fakeHasher(): FileHasherPort {
  return { hash: () => FIXED_HASH };
}

function fakeExtractor(lines: readonly string[]): TextExtractorPort {
  return { extract: async () => ({ lines }) };
}

function fakeExtractorThatThrows(error: Error): TextExtractorPort {
  return {
    extract: async () => {
      throw error;
    },
  };
}

describe("ParseCvUseCase", () => {
  it("assembles a full ParsedCvResult from extracted lines", async () => {
    const lines = [
      "Jane Doe",
      "jane.doe@example.com",
      "Experience",
      "Senior Engineer at Acme",
      "Jan 2021 - Present",
      "Built things.",
      "Education",
      "BSc Computer Science, University X",
      "2015 - 2019",
      "Certifications",
      "AWS Certified Solutions Architect - Associate, Amazon Web Services, 2022",
      "Skills",
      "TypeScript, React, Node.js",
    ];

    const useCase = new ParseCvUseCase(fakeExtractor(lines), fakeHasher());
    const result = await useCase.execute({ fileBytes: Buffer.from("irrelevant"), fileName: "cv.pdf" });

    expect(result.hash).toBe(FIXED_HASH);
    expect(result.fileName).toBe("cv.pdf");
    expect(result.personalInfo.fullName).toBe("Jane Doe");
    expect(result.personalInfo.email).toBe("jane.doe@example.com");
    expect(result.experience).toHaveLength(1);
    expect(result.experience[0]).toMatchObject({ title: "Senior Engineer", company: "Acme" });
    expect(result.education).toHaveLength(1);
    expect(result.education[0]).toMatchObject({ degree: "BSc Computer Science", institution: "University X" });
    expect(result.certifications).toHaveLength(1);
    expect(result.certifications[0]).toMatchObject({ name: "AWS Certified Solutions Architect - Associate" });
    expect(result.skills).toEqual(["TypeScript", "React", "Node.js"]);
    expect(result.warnings).toEqual([]);
  });

  it("collects warnings when a section could not be confidently split", async () => {
    const lines = ["Experience", "Some unusual layout", "with no dates at all"];
    const useCase = new ParseCvUseCase(fakeExtractor(lines), fakeHasher());
    const result = await useCase.execute({ fileBytes: Buffer.from("irrelevant"), fileName: "cv.pdf" });

    expect(result.experience).toHaveLength(1);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toMatch(/could not confidently split/i);
  });

  it("propagates NoTextLayerError from the extractor for scanned/no-text PDFs", async () => {
    const useCase = new ParseCvUseCase(fakeExtractorThatThrows(new NoTextLayerError()), fakeHasher());

    await expect(
      useCase.execute({ fileBytes: Buffer.from("irrelevant"), fileName: "scanned.pdf" }),
    ).rejects.toBeInstanceOf(NoTextLayerError);
  });
});
