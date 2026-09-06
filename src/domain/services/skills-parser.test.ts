import { describe, it, expect } from "vitest";
import { parseSkillsSection } from "./skills-parser";

describe("parseSkillsSection", () => {
  it("splits a comma-separated skills line", () => {
    expect(parseSkillsSection(["TypeScript, React, Node.js"])).toEqual([
      "TypeScript",
      "React",
      "Node.js",
    ]);
  });

  it("splits a pipe-separated skills line", () => {
    expect(parseSkillsSection(["TypeScript | React | Node.js"])).toEqual([
      "TypeScript",
      "React",
      "Node.js",
    ]);
  });

  it("handles a bullet-per-line list", () => {
    expect(parseSkillsSection(["- TypeScript", "- React", "- Node.js"])).toEqual([
      "TypeScript",
      "React",
      "Node.js",
    ]);
  });

  it("deduplicates case-insensitively", () => {
    expect(parseSkillsSection(["TypeScript, typescript, React"])).toEqual([
      "TypeScript",
      "React",
    ]);
  });

  it("returns an empty list for an empty section", () => {
    expect(parseSkillsSection([])).toEqual([]);
  });
});
