import { describe, it, expect } from "vitest";
import { extractPersonalInfo } from "./personal-info-extractor";
import { segmentCv } from "./section-segmenter";

describe("extractPersonalInfo", () => {
  it("extracts name, email, and phone from the pre-header block", () => {
    const personalInfoLines = ["Jane Doe", "jane.doe@example.com", "+1 555-123-4567"];
    const result = extractPersonalInfo({
      allLines: personalInfoLines,
      personalInfoLines,
    });

    expect(result.fullName).toBe("Jane Doe");
    expect(result.email).toBe("jane.doe@example.com");
    expect(result.phone).toBe("+1 555-123-4567");
  });

  it("returns null fields (not an error) when a field is absent", () => {
    const personalInfoLines = ["Jane Doe", "jane.doe@example.com"];
    const result = extractPersonalInfo({ allLines: personalInfoLines, personalInfoLines });

    expect(result.phone).toBeNull();
    expect(result.location).toBeNull();
  });

  it("extracts LinkedIn and GitHub links", () => {
    const personalInfoLines = [
      "Jane Doe",
      "linkedin.com/in/janedoe",
      "https://github.com/janedoe",
    ];
    const result = extractPersonalInfo({ allLines: personalInfoLines, personalInfoLines });

    expect(result.links.linkedin).toBe("linkedin.com/in/janedoe");
    expect(result.links.github).toBe("https://github.com/janedoe");
  });

  it("does not mistake a year range elsewhere in the document for a phone number", () => {
    const personalInfoLines = ["Jane Doe", "jane.doe@example.com"];
    const allLines = [...personalInfoLines, "Experience", "Senior Engineer", "2015 - 2019"];
    const result = extractPersonalInfo({ allLines, personalInfoLines });

    expect(result.phone).toBeNull();
  });

  it("picks a plausible location line from the pre-header block", () => {
    const personalInfoLines = ["Jane Doe", "Berlin, Germany", "jane.doe@example.com"];
    const result = extractPersonalInfo({ allLines: personalInfoLines, personalInfoLines });

    expect(result.location).toBe("Berlin, Germany");
  });

  // Regression case modeled on a real Spanish CV's structural shape (a
  // Summary/Perfil Profesional block followed by an achievements header) -
  // see design.md - Test data policy. Fabricated name/email/phone only.
  it("does not let Summary or achievements content pollute name/email/phone extraction", () => {
    const allLines = [
      "ELENA MARCHETTI",
      "Valencia, España",
      "elena.marchetti.arq@example.com +34600111222",
      "Perfil Profesional",
      "Arquitecta especializada en coordinación BIM con experiencia en proyectos de edificación.",
      "Experiencia Laboral",
      "BIM Coordinator",
      "Educación",
      "Máster en Gestión BIM",
      "Logros y Distinciones",
      "Mejor promedio de egreso - Facultad de Arquitectura Ejemplo",
    ];
    const segmented = segmentCv(allLines);

    const result = extractPersonalInfo({ allLines, personalInfoLines: segmented.personalInfoLines });

    expect(result.fullName).toBe("ELENA MARCHETTI");
    expect(result.email).toBe("elena.marchetti.arq@example.com");
    expect(result.phone).toBe("+34600111222");
    expect(result.location).toBe("Valencia, España");
  });
});
