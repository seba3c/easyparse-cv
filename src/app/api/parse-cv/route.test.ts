import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { POST } from "./route";

const FIXTURES_DIR = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "infrastructure",
  "pdf",
  "__fixtures__",
);

function buildRequest(file: File): Request {
  const formData = new FormData();
  formData.set("file", file);
  return new Request("http://localhost/api/parse-cv", { method: "POST", body: formData });
}

describe("POST /api/parse-cv", () => {
  it("returns the structured JSON contract for a valid text-layer PDF", async () => {
    const bytes = await readFile(path.join(FIXTURES_DIR, "sample-cv.pdf"));
    const file = new File([new Uint8Array(bytes)], "cv.pdf", { type: "application/pdf" });

    const response = await POST(buildRequest(file));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.fileName).toBe("cv.pdf");
    expect(typeof body.hash).toBe("string");
    expect(body.hash).toMatch(/^[0-9a-f]{64}$/);

    expect(body.personalInfo).toMatchObject({
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
    });
    expect(body.personalInfo.links).toEqual({ linkedin: null, github: null, other: [] });

    expect(Array.isArray(body.experience)).toBe(true);
    expect(body.experience.length).toBeGreaterThan(0);
    expect(Array.isArray(body.education)).toBe(true);
    expect(body.education.length).toBeGreaterThan(0);
    expect(Array.isArray(body.skills)).toBe(true);
    expect(body.skills).toEqual(expect.arrayContaining(["TypeScript", "React", "Node.js"]));

    // The fixture CV has no Certifications section - it must come back as an
    // empty array, not be omitted from the response (see cv-parsing/spec.md -
    // Structured JSON Response Contract).
    expect(body.certifications).toEqual([]);
    expect(Array.isArray(body.warnings)).toBe(true);
  });

  it("rejects a non-PDF file", async () => {
    const file = new File(["just some text"], "notes.txt", { type: "text/plain" });

    const response = await POST(buildRequest(file));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("invalid_file_type");
  });

  it("rejects an oversized file", async () => {
    const oversized = new Uint8Array(4 * 1024 * 1024 + 1);
    const file = new File([oversized], "big.pdf", { type: "application/pdf" });

    const response = await POST(buildRequest(file));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("file_too_large");
  });

  it("returns a distinguishable error for a PDF with no text layer", async () => {
    const bytes = await readFile(path.join(FIXTURES_DIR, "no-text-layer.pdf"));
    const file = new File([new Uint8Array(bytes)], "scanned.pdf", { type: "application/pdf" });

    const response = await POST(buildRequest(file));
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.error).toBe("no_text_layer");
  });

  it("rejects a request with no file field", async () => {
    const formData = new FormData();
    const request = new Request("http://localhost/api/parse-cv", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("missing_file");
  });
});
