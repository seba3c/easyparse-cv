## Why

Testing extraction against real-world CVs (an architecture CV, a software engineering CV, and a talent-acquisition CV) surfaced two accuracy gaps: recognized-but-unmapped section headers (e.g. Spanish "Herramientas" for tools/skills, "Logros y Distinciones" for achievements) cause section content to bleed into the wrong structured section, and the common "Summary"/"Perfil Profesional" header block — present in most of these CVs — isn't recognized as a section at all, so it gets treated as personal-info text and is never returned as its own field. The parser also has no real-CV-derived regression coverage; its tests use a single synthetic fixture per concern.

## What Changes

- Extend the section-header dictionary with header phrases observed in real CVs: Spanish "Herramientas" (and English "Tools") mapped to Skills, and achievement/award headers ("Logros y Distinciones", "Logros Destacados", "Awards", "Achievements", "Distinctions") recognized as a section boundary so their content stops bleeding into the preceding Education/Experience entry, even though v1 does not surface achievements as their own structured field.
- Add a new recognized "Summary" section (English: Summary, Professional Summary, Profile, About Me, Objective; Spanish: Perfil Profesional, Resumen, Resumen Profesional, Objetivo, Perfil, Acerca de Mí, Sobre Mí) that captures the CV's opening narrative/profile paragraph (often including forward-looking statements like desired next role) as its own field, instead of it being swept into personal-info lines.
- Add a low-confidence segmentation warning: when an all-caps line contains a recognized section-header phrase plus other all-caps text (the signature of two column headers concatenated by pdfjs's y-position line grouping), the response includes a warning that section boundaries may be unreliable, rather than silently misattributing content — without flagging ordinary prose that merely mentions a header word. Full multi-column reading-order reconstruction is explicitly out of scope for this change.
- Add unit test coverage derived from the three real CVs' structural patterns (multi-employer Spanish CV with achievements/tools sections, English CV with a forward-looking summary paragraph, sidebar-style CV with embedded headers) with all personally identifying content (names, emails, phone numbers, real employer/institution names, profile URLs) fabricated — the original PDF files are not stored anywhere in the repository or used as test fixtures.

## Capabilities

### New Capabilities
_None — this change extends the existing `cv-parsing` and `cv-results-display` capabilities; no new capability is introduced._

### Modified Capabilities
- `cv-parsing`: Section Segmentation gains additional recognized header phrases and a new Summary section; a new Header/Summary Extraction requirement; a new Low-Confidence Segmentation Warning requirement; the Structured JSON Response Contract requirement gains a `summary` field.
- `cv-results-display`: Parsed Section Rendering gains a Summary section card; Warning Display is extended to cover segmentation-level warnings (not just entry-splitting warnings).

## Impact

- `src/domain/services/section-segmenter.ts`: header dictionary additions, new `summary` section key, low-confidence detection.
- `src/domain/value-objects/parsed-cv-result.ts` and a new/extended personal-info or top-level `summary` value: new field in the response contract.
- `src/application/use-cases/parse-cv-use-case.ts`: wires the new summary extraction and segmentation warning into the pipeline.
- `src/components/cv/`: new Summary section component, wired into `cv-result-view.tsx`.
- `src/domain/services/*.test.ts`: new obfuscated-fixture test cases; no new binary PDF fixtures added, and the three source PDFs are not committed to the repo.
- No changes to upload validation, hashing, PDF text extraction internals (`pdfjs-text-extractor-adapter.ts`), or the API route's error contract.
