import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PdfjsTextExtractorAdapter } from "./pdfjs-text-extractor-adapter";
import { NoTextLayerError } from "../../domain/ports/text-extractor-port";

const FIXTURES_DIR = path.join(__dirname, "__fixtures__");

describe("PdfjsTextExtractorAdapter", () => {
  it("extracts lines from a real text-layer PDF fixture", async () => {
    const bytes = await readFile(path.join(FIXTURES_DIR, "sample-cv.pdf"));
    const adapter = new PdfjsTextExtractorAdapter();

    const result = await adapter.extract(bytes);

    expect(result.lines.length).toBeGreaterThan(0);
    const fullText = result.lines.join("\n");
    expect(fullText).toContain("Jane Doe");
    expect(fullText).toContain("jane.doe@example.com");
    expect(fullText).toContain("Experience");
    expect(fullText).toContain("Senior Engineer at Acme");
    expect(fullText).toContain("Education");
    expect(fullText).toContain("Skills");

    expect(result.lines).toContain("Experience");
  });

  it("throws NoTextLayerError for a PDF with no extractable text", async () => {
    const bytes = await readFile(path.join(FIXTURES_DIR, "no-text-layer.pdf"));
    const adapter = new PdfjsTextExtractorAdapter();

    await expect(adapter.extract(bytes)).rejects.toBeInstanceOf(NoTextLayerError);
  });
});
