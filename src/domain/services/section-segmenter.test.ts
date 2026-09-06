import { describe, it, expect } from "vitest";
import { segmentCv } from "./section-segmenter";

describe("segmentCv", () => {
  it("segments a CV with English section headers", () => {
    const lines = [
      "Jane Doe",
      "jane@example.com",
      "Experience",
      "Senior Engineer at Acme",
      "Jan 2021 - Present",
      "Education",
      "BSc Computer Science",
      "2015 - 2019",
      "Skills",
      "TypeScript, React",
    ];

    const result = segmentCv(lines);

    expect(result.personalInfoLines).toEqual(["Jane Doe", "jane@example.com"]);
    expect(result.sections.experience).toEqual(["Senior Engineer at Acme", "Jan 2021 - Present"]);
    expect(result.sections.education).toEqual(["BSc Computer Science", "2015 - 2019"]);
    expect(result.sections.skills).toEqual(["TypeScript, React"]);
    expect(result.sections.certifications).toEqual([]);
  });

  it("segments a CV with Spanish section headers into the same section keys", () => {
    const lines = [
      "Jane Doe",
      "jane@example.com",
      "Experiencia",
      "Ingeniera Senior en Acme",
      "Ene 2021 - Presente",
      "Educacion",
      "Licenciatura en Ciencias de la Computacion",
      "2015 - 2019",
      "Habilidades",
      "TypeScript, React",
    ];

    const result = segmentCv(lines);

    expect(result.personalInfoLines).toEqual(["Jane Doe", "jane@example.com"]);
    expect(result.sections.experience).toEqual(["Ingeniera Senior en Acme", "Ene 2021 - Presente"]);
    expect(result.sections.education).toEqual([
      "Licenciatura en Ciencias de la Computacion",
      "2015 - 2019",
    ]);
    expect(result.sections.skills).toEqual(["TypeScript, React"]);
  });

  it("matches an accented Spanish header (e.g. Educación) the same as its unaccented form", () => {
    const lines = ["Educación", "Licenciatura en Ciencias"];
    const result = segmentCv(lines);
    expect(result.sections.education).toEqual(["Licenciatura en Ciencias"]);
  });

  it("does not treat a line merely mentioning a section keyword as a header", () => {
    const lines = ["5 years of experience in backend systems", "Some Company"];
    const result = segmentCv(lines);
    expect(result.personalInfoLines).toEqual([
      "5 years of experience in backend systems",
      "Some Company",
    ]);
    expect(result.sections.experience).toEqual([]);
  });
});
