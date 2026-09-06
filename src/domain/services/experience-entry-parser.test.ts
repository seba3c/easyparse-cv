import { describe, it, expect } from "vitest";
import { parseExperienceSection } from "./experience-entry-parser";

describe("parseExperienceSection", () => {
  it("parses multiple entries with title/date on separate lines", () => {
    const lines = [
      "Senior Engineer at Acme",
      "Jan 2021 - Present",
      "Built things.",
      "Engineer at Foo",
      "Jan 2019 - Dec 2020",
      "Did stuff.",
    ];

    const result = parseExperienceSection(lines);

    expect(result.warning).toBeNull();
    expect(result.entries).toHaveLength(2);

    expect(result.entries[0]).toMatchObject({
      title: "Senior Engineer",
      company: "Acme",
      startDate: "2021-01",
      endDate: "Present",
      description: "Built things.",
    });
    expect(result.entries[0].raw).toBe("Senior Engineer at Acme\nJan 2021 - Present\nBuilt things.");

    expect(result.entries[1]).toMatchObject({
      title: "Engineer",
      company: "Foo",
      startDate: "2019-01",
      endDate: "2020-12",
      description: "Did stuff.",
    });
  });

  it("parses multiple entries with title and date combined on one line", () => {
    const lines = [
      "Senior Engineer at Acme, Jan 2021 - Present",
      "Built things.",
      "Engineer at Foo, Jan 2019 - Dec 2020",
      "Did stuff.",
    ];

    const result = parseExperienceSection(lines);

    expect(result.entries).toHaveLength(2);
    expect(result.entries[0]).toMatchObject({
      title: "Senior Engineer",
      company: "Acme",
      description: "Built things.",
    });
    expect(result.entries[1]).toMatchObject({
      title: "Engineer",
      company: "Foo",
      description: "Did stuff.",
    });
  });

  it("falls back to a single raw entry with a warning when no date range can be found", () => {
    const lines = ["Some unusual layout", "with no dates at all", "just prose"];

    const result = parseExperienceSection(lines);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]).toMatchObject({
      company: null,
      title: null,
      startDate: null,
      endDate: null,
      raw: lines.join("\n"),
    });
    expect(result.warning).toMatch(/could not confidently split/i);
  });

  it("returns an empty result for an empty section", () => {
    const result = parseExperienceSection([]);
    expect(result).toEqual({ entries: [], warning: null });
  });
});
