## Context

Greenfield Next.js project (App Router), deployed to Vercel, for personal use only: no auth, no database, no outbound network calls. See proposal.md - Why/What Changes for motivation and scope. The `nextjs-react-typescript` skill is already installed in this repo, so the stack assumes TypeScript, React, Tailwind, and shadcn/Radix components.

The hard constraint shaping this design: "parsing" here is text extraction + heuristic segmentation, not semantic understanding, since no LLM or external service is allowed. Requirements in cv-parsing/spec.md around raw fallbacks and warnings exist specifically to keep that limitation honest to the user rather than hidden.

## Goals / Non-Goals

**Goals:**
- Keep business logic (segmentation, entry parsing, hashing orchestration) fully decoupled from Next.js and from the specific PDF/hashing libraries, via a pragmatic hexagonal/ports-and-adapters structure.
- Make future persistence/caching (keyed by the file hash) addable as a single new adapter, with no change to domain or application code.
- Deploy cleanly to Vercel's Node.js serverless runtime within default (Hobby-tier) request size and execution time limits.

**Non-Goals:**
- OCR / scanned-PDF support (explicitly deferred; see cv-parsing/spec.md - Local Text Extraction).
- Any persistence, caching backend, auth, or multi-user concerns (v1 is single-request, stateless).
- Full textbook DDD (aggregates, repositories, domain events) - out of scope by explicit choice; see Decisions below.

## Decisions

### Architecture: pragmatic hexagonal, not textbook DDD
Layers, dependency direction points inward:
- **Domain** (`src/domain`): value objects (`PersonalInfo`, `ExperienceEntry`, `EducationEntry`, `CertificationEntry`, `FileHash`, `DateRange`), pure parsing/segmentation services (`SectionSegmenter`, `DateRangeParser`, per-section entry parsers), and port interfaces (`TextExtractorPort`, `FileHasherPort`, `CvResultCachePort`). No imports from Next.js, pdfjs, or Node built-ins.
- **Application** (`src/application`): `ParseCvUseCase` orchestrates the pipeline (hash -> extract -> segment -> parse each section -> assemble DTO) using only domain types and ports.
- **Infrastructure** (`src/infrastructure`): adapters implementing the ports - `PdfjsTextExtractorAdapter`, `NodeCryptoHasherAdapter`. No `CvResultCachePort` adapter is implemented in v1; the port exists purely as a seam.
- **Presentation** (`app/`): the route handler (`app/api/parse-cv/route.ts`) does request parsing, calls the use case, and maps results/errors to HTTP responses - no business logic. `app/page.tsx` and components render the response - no business logic.

Chosen over textbook DDD (aggregates/repositories/domain events) because v1 has no persistence, no entity lifecycle, and no multi-step state to protect with invariants - that ceremony would model a lifecycle that doesn't exist yet. Confirmed with the user (see conversation).

### PDF text extraction: `pdfjs-dist`
Pure JavaScript, no native binaries required, so it runs on Vercel's Node.js serverless runtime without special build steps (rules out tools like `pdftotext`/poppler that need a system binary). `pdf-parse` was considered as a thinner wrapper around the same underlying engine; going directly to `pdfjs-dist` gives access to per-text-item font size/position, useful as a secondary signal for header detection.

### Hashing: Node's built-in `crypto`
SHA-256 over the raw uploaded bytes. Requires the route handler to run on the **Node.js runtime** (`export const runtime = 'nodejs'`), not Edge - Edge doesn't support `Buffer`/`crypto` the same way, and pdfjs also needs Node.

### Segmentation strategy: keyword/header regex + date-range anchors
Section boundaries are detected by matching lines against an English/Spanish header keyword dictionary. Within Experience/Education, individual entries are anchored by date-range regex matches (since virtually every entry has one), with everything between two date-range matches (or between a header and the first date-range match) treated as one entry's raw text; structured fields (company, title, etc.) are then extracted from that entry's text via secondary regex/positional heuristics. Skills/Certifications use simpler delimiter-based splitting. This is a heuristic, not a grammar - it is expected to misfire on unconventional layouts, which is why every entry keeps a `raw` field and low-confidence sections emit a `warnings` entry instead of guessing silently.

### Response contract includes `raw` and `warnings`
Chosen so that a parsing failure degrades to "shows the original text, flagged as unstructured" instead of "silently wrong" or "field missing with no explanation." This is a direct requirement from cv-parsing/spec.md and shapes the UI's fallback rendering (cv-results-display/spec.md - Raw Fallback Display, Warning Display).

### `CvResultCachePort` defined now, unimplemented
The proposal calls for hexagonal separation specifically so persistence can be added later without refactoring. Defining the port (keyed by the already-computed file hash) now, with zero adapters wired to it in v1, satisfies that without building unused infrastructure (no cache store, no TTL policy, no eviction logic - all deferred to whichever future change actually adds caching).

### Vercel deployment constraints
- Route handler forced to Node.js runtime (see above).
- Explicit `maxDuration` set on the route so a pathological PDF fails with a clear timeout error rather than hanging.
- Client-side upload size guard (~4MB) ahead of Vercel's ~4.5MB Hobby-tier request body ceiling, so oversized files are rejected with the app's own clear error message before hitting the platform's generic one.

## Risks / Trade-offs

- **Heuristic parsing accuracy** -> Mitigated by the `raw` fallback + `warnings` contract (never silently wrong or empty); accepted as the fundamental trade-off of "no LLM, no external service."
- **Non-conventional CV layouts (multi-column, graphic-heavy templates, tables)** -> Text extracted via pdfjs will interleave in reading order that may not match visual order; no mitigation planned for v1 beyond the raw-fallback safety net. Could be revisited in a future change using pdfjs's positional data more heavily.
- **Vercel execution time on large/complex PDFs** -> Mitigated by explicit `maxDuration` and upload size cap, so failures are fast and clear rather than silent hangs.
- **Two-language (EN/ES) header dictionary maintenance** -> Small, fixed list owned by the domain layer; adding a third language later is additive, not a redesign.

## Migration Plan

Greenfield project - no existing users or data to migrate. Initial deployment is a normal Vercel project import/deploy; rollback is redeploying a previous Vercel deployment (Vercel's standard instant-rollback behavior), no data migration involved.

## Open Questions

- Exact accent color palette per section and precise visual styling details are left to implementation/tasks - they don't affect the spec-level behavior or architecture above.
