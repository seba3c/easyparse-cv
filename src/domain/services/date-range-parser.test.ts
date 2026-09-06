import { describe, it, expect } from "vitest";
import { parseDateRange } from "./date-range-parser";

describe("parseDateRange", () => {
  it("parses an English month-year range ending in Present", () => {
    const result = parseDateRange("Senior Engineer, Jan 2021 - Present");
    expect(result).toEqual({
      startDate: "2021-01",
      endDate: "Present",
      raw: "Jan 2021 - Present",
    });
  });

  it("parses a full English month name range", () => {
    const result = parseDateRange("January 2019 - December 2020");
    expect(result?.startDate).toBe("2019-01");
    expect(result?.endDate).toBe("2020-12");
  });

  it("parses a Spanish month-year range ending in Actualidad", () => {
    const result = parseDateRange("Ingeniera Senior, Ene 2021 - Actualidad");
    expect(result).toEqual({
      startDate: "2021-01",
      endDate: "Present",
      raw: "Ene 2021 - Actualidad",
    });
  });

  it("parses a Spanish full month name range ending in Presente", () => {
    const result = parseDateRange("Septiembre 2018 - Presente");
    expect(result?.startDate).toBe("2018-09");
    expect(result?.endDate).toBe("Present");
  });

  it("parses a year-only range", () => {
    const result = parseDateRange("BSc Computer Science, 2015 - 2019");
    expect(result).toEqual({ startDate: "2015", endDate: "2019", raw: "2015 - 2019" });
  });

  it("parses an en-dash separated range", () => {
    const result = parseDateRange("2015 – 2019");
    expect(result?.startDate).toBe("2015");
    expect(result?.endDate).toBe("2019");
  });

  it("returns null when no date range is present", () => {
    expect(parseDateRange("Senior Engineer at Acme")).toBeNull();
  });
});
