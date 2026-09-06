import { describe, it, expect } from "vitest";
import { parseEducationSection } from "./education-entry-parser";

describe("parseEducationSection", () => {
  it("parses multiple entries with degree/institution on separate lines from the date", () => {
    const lines = [
      "BSc Computer Science, University X",
      "2015 - 2019",
      "MSc Software Engineering, University Y",
      "2019 - 2021",
    ];

    const result = parseEducationSection(lines);

    expect(result.warning).toBeNull();
    expect(result.entries).toHaveLength(2);
    expect(result.entries[0]).toMatchObject({
      degree: "BSc Computer Science",
      institution: "University X",
      startDate: "2015",
      endDate: "2019",
    });
    expect(result.entries[1]).toMatchObject({
      degree: "MSc Software Engineering",
      institution: "University Y",
      startDate: "2019",
      endDate: "2021",
    });
  });

  it("falls back to a single raw entry with a warning when no date range can be found", () => {
    const lines = ["Some school", "no discernible dates here"];

    const result = parseEducationSection(lines);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]).toMatchObject({ institution: null, degree: null, raw: lines.join("\n") });
    expect(result.warning).toMatch(/could not confidently split/i);
  });
});
