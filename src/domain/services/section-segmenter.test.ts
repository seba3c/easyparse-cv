import { describe, it, expect } from "vitest";
import { detectLowConfidenceSegmentation, segmentCv } from "./section-segmenter";

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

  it("recognizes a Summary/Perfil Profesional header as its own section", () => {
    const enLines = ["Jane Doe", "Summary", "Backend engineer focused on distributed systems.", "Experience"];
    const enResult = segmentCv(enLines);
    expect(enResult.sections.summary).toEqual(["Backend engineer focused on distributed systems."]);
    expect(enResult.personalInfoLines).toEqual(["Jane Doe"]);

    const esLines = ["Jane Doe", "Perfil Profesional", "Arquitecta con experiencia en modelado BIM.", "Experiencia"];
    const esResult = segmentCv(esLines);
    expect(esResult.sections.summary).toEqual(["Arquitecta con experiencia en modelado BIM."]);
  });

  it("recognizes Herramientas/Tools as a Skills header", () => {
    const esLines = ["Herramientas", "Revit, AutoCAD, SketchUp"];
    const esResult = segmentCv(esLines);
    expect(esResult.sections.skills).toEqual(["Revit, AutoCAD, SketchUp"]);

    const enLines = ["Tools", "Postman, JIRA, Figma"];
    const enResult = segmentCv(enLines);
    expect(enResult.sections.skills).toEqual(["Postman, JIRA, Figma"]);
  });

  it("excludes content after an achievements-style header from the preceding section and from Personal Info", () => {
    const lines = [
      "Jane Doe",
      "Educacion",
      "Licenciatura en Arquitectura",
      "Logros y Distinciones",
      "Mejor promedio de egreso",
      "Herramientas",
      "Revit, AutoCAD",
    ];
    const result = segmentCv(lines);
    expect(result.sections.education).toEqual(["Licenciatura en Arquitectura"]);
    expect(result.sections.skills).toEqual(["Revit, AutoCAD"]);
    expect(result.personalInfoLines).toEqual(["Jane Doe"]);
    expect(result.personalInfoLines).not.toContain("Mejor promedio de egreso");
  });

  it("sets warning to null when segmentation looks reliable", () => {
    const lines = ["Jane Doe", "Experience", "Senior Engineer at Acme", "Jan 2021 - Present"];
    expect(segmentCv(lines).warning).toBeNull();
  });

  it("sets a low-confidence warning when segmentCv encounters a concatenated all-caps header line", () => {
    const lines = ["PAOLA CANTOYA", "CONTACTO EXPERIENCIA PROFESIONAL", "2022-2025", "Gerente de atraccion de talento"];
    const result = segmentCv(lines);
    expect(result.warning).toMatch(/section boundaries may be unreliable/i);
  });
});

// Regression coverage modeled on the structural shape of real CVs used to
// ground this change (see design.md - Test data policy). All names, emails,
// phone numbers, and employer/institution names below are fabricated; no
// content is copied from the source documents, which are not stored in
// this repo.
describe("regression: real-CV-derived structural shapes", () => {
  it("segments a multi-employer Spanish CV with Herramientas and Logros y Distinciones headers", () => {
    const lines = [
      "ELENA MARCHETTI",
      "Arquitecta - Máster en BIM Management",
      "elena.marchetti.arq@example.com +34600111222",
      "Perfil Profesional",
      "Arquitecta especializada en coordinación BIM con experiencia en proyectos de edificación.",
      "Experiencia Laboral",
      "BIM Coordinator",
      "Estudio Delta BIM Ene 2023 – Actualidad",
      "Coordino un equipo de modeladores BIM.",
      "Arquitecta",
      "Constructora Nuevo Horizonte Mar 2020 - Dic 2022",
      "Modelé proyectos de urbanización.",
      "Educación",
      "Máster en Gestión BIM",
      "Universidad Politécnica Ejemplo · 2019 – 2020",
      "Logros y Distinciones",
      "Mejor promedio de egreso - Facultad de Arquitectura Ejemplo",
      "Herramientas",
      "Revit, AutoCAD, Navisworks",
    ];

    const result = segmentCv(lines);

    expect(result.sections.skills).toEqual(["Revit, AutoCAD, Navisworks"]);
    expect(result.sections.education.join(" ")).not.toContain("Mejor promedio de egreso");
    expect(result.personalInfoLines).not.toContain("Mejor promedio de egreso - Facultad de Arquitectura Ejemplo");
    expect(result.sections.summary).toEqual([
      "Arquitecta especializada en coordinación BIM con experiencia en proyectos de edificación.",
    ]);
  });

  it("segments an English CV with a multi-sentence, forward-looking Summary", () => {
    const lines = [
      "Marcus Whitfield",
      "marcus.whitfield.dev@example.com",
      "Summary",
      "Senior Software Engineer with 8+ years building distributed systems across fintech and health-tech.",
      "Looking to contribute in a senior engineering or technical lead role.",
      "Experience",
      "Senior Software Engineer at Nimbus Systems Inc",
      "Mar 2019 - Present",
      "Skills",
      "Python, AWS, Docker",
    ];

    const result = segmentCv(lines);

    expect(result.sections.summary).toEqual([
      "Senior Software Engineer with 8+ years building distributed systems across fintech and health-tech.",
      "Looking to contribute in a senior engineering or technical lead role.",
    ]);
    expect(result.personalInfoLines).toEqual(["Marcus Whitfield", "marcus.whitfield.dev@example.com"]);
  });

  it("flags a sidebar-style Spanish CV whose columns collide into a concatenated header line", () => {
    const lines = [
      "ROSA DELGADO",
      "Gerente de Reclutamiento",
      "CONTACTO EXPERIENCIA PROFESIONAL",
      "LOGROS DESTACADOS",
      "2021 - Actualidad",
      "Gerente de Reclutamiento Corporativo",
      "Habilidades",
      "Liderazgo de equipos, Employer Branding",
    ];

    const result = segmentCv(lines);

    expect(result.warning).toMatch(/section boundaries may be unreliable/i);
    expect(result.sections.skills).toEqual(["Liderazgo de equipos, Employer Branding"]);
  });
});

describe("detectLowConfidenceSegmentation", () => {
  it("returns a warning for two all-caps headers concatenated onto one line", () => {
    const warning = detectLowConfidenceSegmentation(["CONTACTO EXPERIENCIA PROFESIONAL"]);
    expect(warning).toMatch(/section boundaries may be unreliable/i);
  });

  it("returns null for ordinary prose that merely mentions a header word", () => {
    const warning = detectLowConfidenceSegmentation(["5 years of experience in backend systems"]);
    expect(warning).toBeNull();
  });

  it("returns null when every recognized header appears alone on its own line", () => {
    const warning = detectLowConfidenceSegmentation(["EXPERIENCE", "Senior Engineer", "EDUCATION"]);
    expect(warning).toBeNull();
  });
});
