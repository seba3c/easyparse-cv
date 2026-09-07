## Context

Builds on the pragmatic hexagonal architecture from `2026-09-06-add-cv-parser` (see its design.md, still current). Domain services are pure functions over `readonly string[]`; the use case wires them together; adapters/UI stay thin. This change stays inside that shape: no new ports, no new adapters, no new external dependencies.

The three real CVs used to ground this change (an architecture CV in Spanish, a software-engineering CV in English, a talent-acquisition CV in Spanish with a sidebar layout) are **not** committed anywhere in the repo. Their content only exists in this planning session; test fixtures are hand-written, fictionalized data inspired by their *structural shape* (header wording, paragraph-style summaries, multi-employer entry lists, sidebar-style header collisions), per proposal.md.

## Goals / Non-Goals

**Goals:**
- Close the three concrete accuracy gaps found by testing against real CVs: unmapped Skills/achievements headers, unrecognized Summary section, silent misattribution on multi-column layouts.
- Land regression coverage for those gaps using fabricated data only — no real names, emails, phone numbers, profile URLs, or verbatim employer/institution names from the source CVs.

**Non-Goals:**
- Reconstructing true visual reading order for multi-column PDFs (geometry-based column detection). Rejected for this change per explicit product decision — the fix here is "detect and warn," not "correctly reorder." Revisit as its own change if multi-column CVs turn out to be common.
- Adding a structured `achievements`/`awards` field to the response contract. The three sample CVs only showed this content causing *corruption* of Education/Experience; fixing that corruption doesn't require modeling achievements as their own capability. Adding that field is a natural follow-up but is out of scope here to keep this change proportional to the observed bug.
- Adding a `languages` field, even though "Idiomas"/"Languages" appeared in two of the three CVs — same reasoning: not shown to corrupt any existing section (it simply isn't captured), so it's a separate future enhancement, not a bug fix.

## Decisions

### `summary` is a new top-level `ParsedCvResult` field, not nested in `PersonalInfo`
`PersonalInfo` models contact facts (name/email/phone/location/links); a professional-summary paragraph is document-level narrative content, not a contact fact, and the existing UI already treats top-level `ParsedCvResult` fields as independent section cards. Adding it there keeps `PersonalInfo` semantically clean and matches how the UI will render it (its own `SummarySection` card, like `SkillsSection`/`CertificationsSection`).

### `CvSectionKey` gains a `"summary"` member; segmentation state gains a non-exposed `"ignored"` mode
`SECTION_HEADER_DICTIONARY` gets a new `summary` key (EN/ES phrases from proposal.md) exactly like the existing four keys — matched, tracked, and exposed via `SegmentedCv.sections.summary`.

Achievement/award headers are different: they must stop content from bleeding into the *previous* tracked section, but v1 has nowhere to put that content (no `achievements` field — see Non-Goals). `segmentCv`'s internal loop state changes from `currentSection: CvSectionKey | null` to a three-way mode: personal-info (before first header) / a tracked `CvSectionKey` / `"ignored"` (after an achievements-style header, before the next recognized header). Lines collected while `"ignored"` are dropped, not appended anywhere. This is the minimal change that stops corruption without inventing unused structure — alternative considered: silently ending the section (`currentSection = null`) was rejected because that re-routes the content into `personalInfoLines`, corrupting Personal Info extraction instead of Education/Experience.

`matchSectionHeader`'s dictionary therefore has two shapes of entry: phrases that map to an exposed `CvSectionKey`, and phrases that only mean "stop appending to whatever came before" (achievements/awards/distinctions, EN+ES). Both are matched the same way (exact normalized line equality, per existing behavior); they differ only in what the segmenter does with the match.

### Low-confidence detection: all-caps overlap heuristic, run once over all lines
Implemented as a small pure function taking the extracted lines and the full set of recognized header phrases (tracked + ignored), returning `string | null` (a single warning, not one per line — one signal is enough to tell the user "treat this document's sections with caution"). Trigger condition (see spec.md - Low-Confidence Segmentation Warning for the exact scenarios): a line is entirely upper-case (after trimming/punctuation), contains a recognized header phrase as a whole-phrase match, and has additional upper-case content beyond that phrase.

Alternatives considered and rejected:
- **Any line containing a header word as a substring** → false-positives constantly on ordinary prose ("...experience in backend systems"); rejected, would make the warning noise rather than signal.
- **Two-or-more distinct recognized phrases on one line** → doesn't actually catch the observed real case (`"CONTACTO EXPERIENCIA PROFESIONAL"` only contains *one* recognized phrase, "experiencia profesional" — "contacto" isn't a section header on its own); rejected as under-detecting the motivating example.
- **Full geometric/positional column analysis** → correctly handles the real case and more, but is a significantly larger effort explicitly deferred (see Non-Goals) — out of scope for a "detect and warn" fix.

This warning is produced once, at the `segmentCv` boundary, and surfaces at the top level of `ParsedCvResult.warnings` (same list `ParseCvUseCase` already assembles from entry-parsing warnings) — it is not associated with any single `CvSectionKey`, unlike the existing Experience/Education split warnings.

### UI: warnings not matched by `findWarningFor` render as a general notice
`CvResultView`'s existing `findWarningFor(warnings, sectionKeyword)` greps each warning string for a section-name keyword to attach it to that section's card. The new segmentation warning's text won't contain "experience"/"education"/etc., so it naturally falls through un-attached; `CvResultView` renders any warning not claimed by a known section keyword in a general notice near the top of the results (above the section cards), satisfying cv-results-display/spec.md - Warning Display without needing a new warning "kind"/type field in the response contract — the existing plain-string `warnings: string[]` shape is preserved.

### Test data policy: fabricated content, real structural shapes, no new binary fixtures
For each of the three real CVs, new test cases in the relevant `*.test.ts` files (`section-segmenter.test.ts`, `personal-info-extractor.test.ts`, and the section-specific entry parsers where relevant) use hand-written `string[]` line arrays — the same style as the existing "Jane Doe" fixtures — that reproduce the *structural* edge case (a Spanish CV with "Herramientas" and "Logros y Distinciones" headers and multiple employers; an English CV with a multi-sentence forward-looking Summary paragraph; a sidebar-style CV with an all-caps concatenated-header line) using fictional names, fake emails/phones, and genericized (not verbatim) company/institution names. No PDF binaries are added to `src/infrastructure/pdf/__fixtures__/`, and the three source PDF files are never read into the codebase or referenced by path from any test.

## Risks / Trade-offs

- **Achievements/awards content is still dropped from the response, just no longer misattributed** → Accepted per Non-Goals; the fix's job is "stop corrupting Education/Experience," not "capture achievements." A future change can add a structured field if needed.
- **The all-caps heuristic only catches the "concatenated all-caps headers" shape of multi-column collision, not every kind of column garbling** → Accepted; this is explicitly a cheap, low-false-positive signal per the scoping decision, not a general multi-column detector. Documented as a known gap here and in the spec's Non-Goals-equivalent framing.
- **Expanding the header dictionary (Herramientas/Tools, achievements variants, Summary variants) is still a fixed list, same maintenance shape as the existing EN/ES dictionary** → Consistent with the existing accepted trade-off from the original design; no new maintenance burden pattern introduced.

## Migration Plan

No data migration (stateless, no persistence). `summary: string | null` is an additive field on the JSON response contract — existing consumers reading known fields are unaffected; this is not a breaking change. Deploys the same way as any other change to this app (standard Vercel redeploy).
