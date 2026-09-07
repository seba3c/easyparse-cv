import { describe, it, expect } from "vitest";
import { findWarningFor, partitionGeneralWarnings } from "./warning-grouping";

describe("findWarningFor", () => {
  it("finds a warning containing the given keyword, case-insensitively", () => {
    const warnings = ["Could not confidently split Experience into individual entries"];
    expect(findWarningFor(warnings, "experience")).toBe(warnings[0]);
  });

  it("returns undefined when no warning matches the keyword", () => {
    expect(findWarningFor(["Some other warning"], "experience")).toBeUndefined();
  });
});

describe("partitionGeneralWarnings", () => {
  it("excludes warnings already claimed by a section", () => {
    const experienceWarning = "Could not confidently split Experience into individual entries";
    const warnings = [experienceWarning];
    expect(partitionGeneralWarnings(warnings, [experienceWarning, undefined])).toEqual([]);
  });

  it("keeps a document-wide warning not claimed by any section", () => {
    const experienceWarning = "Could not confidently split Experience into individual entries";
    const segmentationWarning = "Section boundaries may be unreliable for this document: ...";
    const warnings = [experienceWarning, segmentationWarning];

    expect(partitionGeneralWarnings(warnings, [experienceWarning, undefined])).toEqual([
      segmentationWarning,
    ]);
  });
});
