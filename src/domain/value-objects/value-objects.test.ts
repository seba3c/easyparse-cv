import { describe, it, expect } from "vitest";
import { createFileHash } from "./file-hash";
import { createDateRange } from "./date-range";
import { createPersonalInfo } from "./personal-info";
import { createExperienceEntry } from "./experience-entry";
import { createEducationEntry } from "./education-entry";
import { createCertificationEntry } from "./certification-entry";
import { createParsedCvResult } from "./parsed-cv-result";

const VALID_HASH = "a".repeat(64);

describe("FileHash", () => {
  it("accepts a 64-character hex digest and normalizes case", () => {
    expect(createFileHash(VALID_HASH.toUpperCase())).toBe(VALID_HASH);
  });

  it("rejects a non-hex or wrong-length value", () => {
    expect(() => createFileHash("not-a-hash")).toThrow();
    expect(() => createFileHash("a".repeat(63))).toThrow();
  });
});

describe("DateRange", () => {
  it("defaults missing start/end to null", () => {
    const range = createDateRange({ raw: "2019 - 2021" });
    expect(range).toEqual({ startDate: null, endDate: null, raw: "2019 - 2021" });
  });

  it("rejects empty raw text", () => {
    expect(() => createDateRange({ raw: "   " })).toThrow();
  });
});

describe("PersonalInfo", () => {
  it("defaults all fields to null/empty when constructed with no data", () => {
    expect(createPersonalInfo()).toEqual({
      fullName: null,
      email: null,
      phone: null,
      location: null,
      links: { linkedin: null, github: null, other: [] },
    });
  });

  it("preserves provided fields", () => {
    const info = createPersonalInfo({
      fullName: "Jane Doe",
      email: "jane@example.com",
      links: { linkedin: "linkedin.com/in/jane" },
    });
    expect(info.fullName).toBe("Jane Doe");
    expect(info.email).toBe("jane@example.com");
    expect(info.links).toEqual({ linkedin: "linkedin.com/in/jane", github: null, other: [] });
  });
});

describe("ExperienceEntry", () => {
  it("constructs with defaults for omitted structured fields", () => {
    const entry = createExperienceEntry({ raw: "Senior Engineer at Acme" });
    expect(entry.company).toBeNull();
    expect(entry.raw).toBe("Senior Engineer at Acme");
  });

  it("rejects empty raw text", () => {
    expect(() => createExperienceEntry({ raw: "" })).toThrow();
  });
});

describe("EducationEntry", () => {
  it("constructs with defaults for omitted structured fields", () => {
    const entry = createEducationEntry({ raw: "BSc Computer Science" });
    expect(entry.institution).toBeNull();
    expect(entry.raw).toBe("BSc Computer Science");
  });

  it("rejects empty raw text", () => {
    expect(() => createEducationEntry({ raw: "" })).toThrow();
  });
});

describe("CertificationEntry", () => {
  it("constructs with defaults for omitted structured fields", () => {
    const entry = createCertificationEntry({ raw: "AWS SA - Associate" });
    expect(entry.name).toBeNull();
    expect(entry.raw).toBe("AWS SA - Associate");
  });

  it("rejects empty raw text", () => {
    expect(() => createCertificationEntry({ raw: "" })).toThrow();
  });
});

describe("ParsedCvResult", () => {
  it("defaults list fields to empty arrays and summary to null", () => {
    const result = createParsedCvResult({
      hash: createFileHash(VALID_HASH),
      fileName: "cv.pdf",
      personalInfo: createPersonalInfo(),
    });
    expect(result.experience).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.certifications).toEqual([]);
    expect(result.skills).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.summary).toBeNull();
  });

  it("preserves a provided summary", () => {
    const result = createParsedCvResult({
      hash: createFileHash(VALID_HASH),
      fileName: "cv.pdf",
      personalInfo: createPersonalInfo(),
      summary: "Backend engineer focused on distributed systems.",
    });
    expect(result.summary).toBe("Backend engineer focused on distributed systems.");
  });

  it("rejects an empty fileName", () => {
    expect(() =>
      createParsedCvResult({
        hash: createFileHash(VALID_HASH),
        fileName: "  ",
        personalInfo: createPersonalInfo(),
      }),
    ).toThrow();
  });
});
