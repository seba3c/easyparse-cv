## Why

Users upload a CV PDF containing personal data, but the app gives them no explicit assurance about what happens to it. The app already processes everything in-memory per request and stores nothing (confirmed: no database, blob storage, or file writes anywhere in the codebase; the parsed result is returned in the HTTP response and discarded — see `src/domain/ports/cv-result-cache-port.ts`, an explicitly unimplemented seam for a future persistence layer). That fact should be stated plainly in the UI so users don't have to trust it implicitly.

## What Changes

- Add a small-print disclaimer inline with the "Parse CV" button (text left-aligned, button right-aligned, same row), stating that uploaded CV data is processed in memory for the request only and is never stored, logged, or sent to any third party.
- Keep it visually distinct from (smaller than) the surrounding body text and from the existing top-of-page non-production disclaimer banner, since it covers a different concern (data handling, not production-readiness).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `app-shell`: The page-level chrome's disclaimer gains a new requirement covering data-handling/no-storage disclosure, alongside the existing non-production disclaimer.

## Impact

- Affected code: `src/components/cv/cv-upload-form.tsx` (disclaimer text placed inline with the "Parse CV" button).
- No backend, API, or data model impact — this documents existing behavior, it does not change how CV data is processed.
- No new dependencies.
