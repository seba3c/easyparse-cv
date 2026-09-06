## Why

There's currently no way to turn a CV PDF into structured data without either retyping it by hand or sending it to a third-party service. This change adds a personal-use Next.js app that extracts personal info, experience, education, certifications, and skills entirely locally (no external API calls), so the data never leaves the machine running the app.

## What Changes

- New Next.js (App Router) app deployable to Vercel with no database and no authentication.
- A file upload endpoint that accepts a single PDF, computes a SHA-256 hash of the raw bytes (returned in the response, unused for caching in v1 but reserved for it), and extracts embedded text via `pdfjs-dist`.
- PDFs with no embedded text layer (scanned/image-only) are rejected with a clear error; OCR is out of scope for v1.
- Heuristic, regex/keyword-based segmentation of extracted text into Personal Info, Experience, Education, Certifications, and Skills, recognizing both English and Spanish section headers and date formats.
- A structured JSON response where each Experience/Education/Certification entry includes a `raw` fallback and top-level `warnings` flag sections the heuristics couldn't confidently split into entries, so the UI never silently drops content.
- A single-page UI: upload control plus a minimalist, professional layout that renders each section with its own accent color and skills as colored pill tags.
- Hexagonal/DDD-lite architecture: domain layer (value objects + parsing services + ports, no framework dependencies), application layer (`ParseCvUseCase` orchestrating the pipeline), infrastructure adapters (pdfjs text extractor, Node `crypto` hasher), and a thin presentation layer (Next.js route handler + page) with no business logic. A `CvResultCachePort` is declared in the domain layer but left unimplemented in v1, so a future caching/persistence layer can be added as a new adapter without touching domain or application code.

## Capabilities

### New Capabilities
- `cv-parsing`: Upload validation, file hashing, local text extraction, section segmentation, and entry-parsing rules that turn a CV PDF into the structured JSON contract (including error and fallback/warning behavior).
- `cv-results-display`: The single-page UI's upload interaction and rendering of the parsed JSON into colored, per-section views, including error and low-confidence states.

### Modified Capabilities
_None — greenfield project, no existing specs._

## Impact

- New Next.js project scaffold (package.json, app directory, Tailwind/shadcn setup) — no existing app code to affect.
- New dependencies: `pdfjs-dist` (text extraction); UI relies on Tailwind/shadcn per the project's existing `nextjs-react-typescript` skill.
- New API surface: one route handler (e.g. `app/api/parse-cv/route.ts`) running on the Node.js runtime (not Edge) with an explicit `maxDuration` and a client-side upload size guard (~4MB, under Vercel's request body ceiling).
- No database, no auth, no outbound network calls introduced.
