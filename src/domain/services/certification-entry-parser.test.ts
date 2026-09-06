import { describe, it, expect } from "vitest";
import { parseCertificationsSection } from "./certification-entry-parser";

describe("parseCertificationsSection", () => {
  it("parses name, issuer, and date from a single-line certification entry", () => {
    const result = parseCertificationsSection([
      "AWS Certified Solutions Architect - Associate, Amazon Web Services, 2022",
    ]);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]).toMatchObject({
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      date: "2022",
    });
    expect(result.entries[0].raw).toBe(
      "AWS Certified Solutions Architect - Associate, Amazon Web Services, 2022",
    );
  });

  it("treats each non-empty line as a separate entry", () => {
    const result = parseCertificationsSection(["Cert A, Issuer A, 2020", "", "Cert B, Issuer B, 2021"]);
    expect(result.entries).toHaveLength(2);
    expect(result.entries[0].name).toBe("Cert A");
    expect(result.entries[1].name).toBe("Cert B");
  });

  it("handles an entry with no identifiable date", () => {
    const result = parseCertificationsSection(["Just a certification name"]);
    expect(result.entries[0]).toMatchObject({
      name: "Just a certification name",
      issuer: null,
      date: null,
    });
  });
});
