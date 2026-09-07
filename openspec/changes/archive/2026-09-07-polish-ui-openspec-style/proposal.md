## Why

The previous restyle (`modernize-ui-ux`) adopted an openspec.dev-inspired editorial look at the token/color/font-family level, but several details still don't match the reference: the header title is plain text instead of the pixel-block wordmark treatment openspec.dev uses, result section headings don't use openspec.dev's small-caps IBM Plex Mono label style, the parse button sits left-aligned instead of centered, a fast parse response gives almost no perceptible loading feedback, the footer has no credit line for the tools used to build the app, and all result sections expand at once instead of one focused section at a time. This change closes those gaps.

## What Changes

- Replace the plain-text "easyparse.cv" wordmark in `SiteHeader` with a custom pixel-block SVG wordmark (built from a grid of rectangles, matching the construction technique openspec.dev uses for its own "OPENSPEC" wordmark), spelling out "EASYPARSE.CV".
- Apply openspec.dev's section-heading treatment (IBM Plex Mono, small-caps-style uppercase, wide letter-spacing, semi-bold, accent color) to the CV result section titles (`SectionCard`'s heading).
- Center the "Parse CV" button under the dropzone instead of left-aligning it.
- Replace the parse button with an animated "Parsing file..." text while a parse request is in flight, synced exactly to the request's duration (no artificial minimum display time).
- Extend the existing footer line to read "Sebastián Castañeda 2026 - Built with Claude, OpenSpec and ❤️" on a single line, with "Claude" and "OpenSpec" as hyperlinks alongside the existing author link.
- Change result section collapse behavior from "all independently collapsible, all expanded by default" to an accordion: immediately after a parse, only the first section (Personal Info) is expanded and the rest are collapsed; opening any collapsed section collapses whichever section was open, so at most one section is open at a time.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `app-shell`: the Footer Attribution requirement extends the existing footer line with a hyphen-separated, hyperlinked credit for the tools used to build the app.
- `cv-results-display`: the File Upload Interface requirement's loading state becomes an animated "Parsing file..." state (replacing the button), synced exactly with the request; the Parsed Section Rendering requirement changes from "all sections independently collapsible, all expanded by default" to a single-open accordion where only the first section is expanded after a parse.

## Impact

- `src/components/app-shell/site-header.tsx`: new inline SVG wordmark component/markup replacing the text span.
- `src/components/app-shell/site-footer.tsx`: extend the existing line with a hyphen-separated, hyperlinked tooling credit.
- `src/components/cv/section-card.tsx`: heading typography (font, tracking, case, weight, color) updated to the openspec.dev section-label style; `open`/`onOpenChange` become controlled props (owned by the parent) instead of internal state, to support the single-open accordion.
- `src/components/cv/cv-result-view.tsx`: owns which section id is currently open and passes controlled open state down to each section, defaulting to the first section (Personal Info) open after a parse.
- `src/components/cv/personal-info-section.tsx`, `experience-section.tsx`, `education-section.tsx`, `certifications-section.tsx`, `skills-section.tsx`: accept and forward the new controlled open-state props to `SectionCard`.
- `src/components/cv/cv-upload-form.tsx`: button centered; loading state reworked to show animated "Parsing file..." text in place of the button, directly reflecting the `isLoading` prop.
- `src/app/layout.tsx` or `globals.css`: load IBM Plex Mono (via `next/font/google`) alongside the existing Geist fonts, scoped to section headings.
- No changes to the parsing API, domain logic, or response shapes - this change is presentation-only.
