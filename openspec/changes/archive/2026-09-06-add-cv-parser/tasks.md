## 1. Project Setup

- [x] 1.1 Scaffold the Next.js App Router project (TypeScript, Tailwind, shadcn/ui) and verify `npm run dev` starts and the default page loads
- [x] 1.2 Add `pdfjs-dist` and confirm it runs server-side under the Node.js runtime by extracting text from a sample text-layer PDF in a throwaway script
- [x] 1.3 Create the base folder structure (`src/domain`, `src/application`, `src/infrastructure`) with TypeScript path aliases, and verify the project still builds/type-checks

## 2. Domain Layer

- [x] 2.1 Define domain value objects/types (`PersonalInfo`, `ExperienceEntry`, `EducationEntry`, `CertificationEntry`, `ParsedCvResult`, `FileHash`, `DateRange`) and verify with unit tests for basic construction
- [x] 2.2 Define port interfaces (`TextExtractorPort`, `FileHasherPort`, `CvResultCachePort`) in the domain layer, with no implementations yet, and verify the project type-checks with them referenced only by type
- [x] 2.3 Implement `SectionSegmenter` with the English/Spanish header keyword dictionary and verify unit tests cover an English-header sample and a Spanish-header sample segmenting into the same section set
- [x] 2.4 Implement `DateRangeParser` covering English/Spanish month names, "Present"/"Actualidad", and year-only ranges, and verify unit tests for each format
- [x] 2.5 Implement the Experience/Education entry parser using date-range anchors to split entries and extract company/institution, title/degree, dates, description, and verify unit tests for (a) multiple clean entries and (b) a section that can't be confidently split, producing a raw block plus a warning
- [x] 2.6 Implement the Certifications entry parser (name/issuer/date + raw fallback) and verify unit tests
- [x] 2.7 Implement the Skills parser (comma/bullet/pipe delimiters) and verify unit tests
- [x] 2.8 Implement `PersonalInfoExtractor` (name/email/phone/location/links) and verify unit tests including fields that are absent from the source text returning null without error

## 3. Application Layer

- [x] 3.1 Implement `ParseCvUseCase` orchestrating hash -> extract -> segment -> parse -> assemble `ParsedCvResult`, surfacing a distinct error for the no-text-layer case, and verify unit tests using fake `TextExtractorPort`/`FileHasherPort` implementations for both the success path and the no-text-layer path

## 4. Infrastructure Adapters

- [x] 4.1 Implement `PdfjsTextExtractorAdapter` (implements `TextExtractorPort`) using `pdfjs-dist`, and verify an integration test against a real sample text-layer PDF fixture
- [x] 4.2 Implement `NodeCryptoHasherAdapter` (implements `FileHasherPort`) using Node's `crypto` SHA-256, and verify a unit test that hashing the same bytes twice yields the same hash

## 5. API Route (Presentation)

- [x] 5.1 Implement `app/api/parse-cv/route.ts` on the Node.js runtime with an explicit `maxDuration`, accepting a multipart upload, validating file type and size before invoking `ParseCvUseCase`, and mapping use-case results/errors to JSON responses with correct status codes; verify with request tests covering a valid PDF, a non-PDF file, an oversized file, and a no-text-layer PDF
- [x] 5.2 Verify via an integration test that a successful request's response body matches the documented JSON contract (`hash`, `fileName`, `personalInfo`, `experience[]`, `education[]`, `certifications[]`, `skills[]`, `warnings[]`), including empty sections represented as empty arrays

## 6. UI (Presentation)

- [x] 6.1 Build the upload component (file picker, client-side size guard, loading state) and verify manually that selecting a PDF triggers the upload and shows a loading state
- [x] 6.2 Build the per-section display components (Personal Info, Experience, Education, Certifications, Skills) with distinct accent colors and explicit empty-state messaging, and verify manually against a sample response with both populated and empty sections
- [x] 6.3 Add warning and raw-fallback display to the section components, and verify manually with a sample response containing a section warning and a raw-only entry
- [x] 6.4 Build error-state display distinguishing invalid file type, oversized file, no text layer found, and general processing failure, and verify manually by triggering each case against the running app
- [x] 6.5 Wire `app/page.tsx` to drive the full upload -> parse -> render flow in one page, and verify end-to-end manually by uploading a real sample CV PDF and confirming all sections render correctly

## 7. Deployment

- [x] 7.1 Configure Vercel deployment settings (Node.js runtime and `maxDuration` for the route, any required `vercel.json`) and verify a preview deployment succeeds with the full upload -> parse -> render flow working against the deployed URL (config in place; local `next build`/`next start` verification done - live Vercel deployment left to the user, see conversation)
