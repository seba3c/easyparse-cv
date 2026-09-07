## 1. Pixel-block wordmark

- [x] 1.1 Author the pixel-block glyph paths for "EASYPARSE.CV" (grid of `<path>` rectangles on the same 16-unit-cell technique as openspec.dev's wordmark) as a new `Wordmark` component/markup; verify it renders correctly by eye in the browser at the header's actual size
- [x] 1.2 Replace the plain-text title span in `src/components/app-shell/site-header.tsx` with the new SVG wordmark, keeping `fill="currentColor"` so it follows the current text color/theme, and preserving the existing `.cv` accent-color treatment on the corresponding glyphs; verify it renders correctly in both light and dark mode
- [x] 1.3 Reduce the wordmark's rendered size (`h-4` → `h-3`) to match openspec.dev's own header proportions after a side-by-side comparison showed the initial size reading larger/bolder than the reference; verify visually against a zoomed screenshot of the reference wordmark

## 2. Section heading typography

- [x] 2.1 Add `IBM_Plex_Mono` (weight `600`, Latin subset) as a new `next/font/google` variable (`--font-plex-mono`) in `src/app/layout.tsx`; verify the app builds and the new CSS variable is present on `<html>`
- [x] 2.2 Apply the verified openspec.dev heading treatment (`font-family: IBM Plex Mono`, uppercase, `letter-spacing: .22em`, `font-weight: 600`, accent color) to `CardTitle` inside `src/components/cv/section-card.tsx`; verify visually against a parsed result in both themes
- [x] 2.3 Change the section title text color from `text-primary` to a fixed `text-[#d89074]` per explicit color spec; verify visually in both light and dark mode that the color stays constant (not theme-derived)
- [x] 2.4 Replace each section's `border-l-4` left-edge accent strip with a small `size-2.5` colored square next to the title (reusing `DisclaimerBanner`'s swatch pattern), changing `accentClassName` from a `border-l-*` to a `bg-*` utility in `section-card.tsx` and all five section components; verify visually against the reference screenshot in both themes

## 3. Centered parse control

- [x] 3.1 Change the parse button's wrapper in `src/components/cv/cv-upload-form.tsx` from left-aligned (`self-start`) to centered; verify visually in the browser
- [x] 3.2 Shrink `ThemeToggle`'s `Switch.Root`/`Switch.Thumb`/icon sizes (`h-8 w-14` → `h-3 w-6`, `size-6` → `size-2`, `size-3.5` → `size-1.5`) so it's visually aligned in height with the now-smaller wordmark; verify visually in the header in both themes
- [x] 3.3 Bump `ThemeToggle` back up slightly (`h-3 w-6` → `h-4 w-7`, thumb `size-2` → `size-3`, icon `size-1.5` → `size-2`) after feedback that the exact wordmark-matched size read as too small/hard to use; verify visually in the header in both themes
- [x] 3.4 Bump `ThemeToggle` up again by 2 Tailwind spacing steps per explicit follow-up (`h-4 w-7` → `h-6 w-9`, thumb `size-3` → `size-5`, icon `size-2` → `size-3`); verify visually in the header in both themes

## 4. Parsing animation synced with the request

- [x] 4.1 ~~Add `MIN_PARSING_ANIMATION_MS`~~ - superseded: `page.tsx` passes `isLoading={state.status === "loading"}` straight to `CvUploadForm` with no minimum-duration constant, timer, or ref; verify `src/lib/cv-upload-constraints.ts` no longer exports a parsing-animation constant
- [x] 4.2 `page.tsx` renders `ErrorBanner`/`CvResultView` as soon as `state.status` becomes `"error"`/`"success"`, with no gating `isAnimating` state; verify with a fast parse that the result appears the instant the response resolves, not after an artificial delay
- [x] 4.3 While `isLoading` is true, `CvUploadForm` replaces the `<Button>` with a centered, animated "Parsing file..." text node (CSS-only animation); verify by watching a real parse request in the running app (`npm run dev`) with both a fast and a throttled network
- [x] 4.4 Manually verify `openspec/specs/cv-results-display/spec.md`'s "User uploads a PDF" and "Parse response returns quickly" scenarios end-to-end

## 5. Footer tooling credit

- [x] 5.1 Extend the existing footer line in `src/components/app-shell/site-footer.tsx` to a single line reading "© Sebastián Castañeda 2026 - Built with Claude, OpenSpec and ❤️" (© first, matching openspec.dev's own "© 2026 Fission" ordering), with "Claude" linking to `https://claude.com/claude-code` and "OpenSpec" linking to `https://openspec.dev`; verify by inspecting the rendered footer and its link hrefs in the browser in both themes
- [x] 5.2 Add a `border-t border-border` hairline separator above the footer, matching openspec.dev's own footer treatment; verify visually against the reference screenshot in both themes
- [x] 5.3 Drop the author link's distinct `font-medium text-foreground` styling so the whole line reads in one consistent font style, and reduce the line from `text-sm` to `text-xs`; verify visually in both themes
- [x] 5.4 Set the footer's alignment to centered (tried left-aligned first per a literal reading of openspec.dev's own layout, corrected to centered per explicit follow-up feedback); verify visually in both themes
- [x] 5.5 Manually verify `openspec/specs/app-shell/spec.md`'s "User views the footer" and "User views the tooling credit links" scenarios

## 6. Single-open accordion for result sections

- [x] 6.1 Change `src/components/cv/section-card.tsx` to accept `open: boolean` and `onOpenChange: (open: boolean) => void` as props instead of owning `open` via internal `useState`; verify the component still compiles and typechecks (`npx tsc --noEmit` or equivalent)
- [x] 6.2 Update `src/components/cv/personal-info-section.tsx`, `experience-section.tsx`, `education-section.tsx`, `certifications-section.tsx`, `skills-section.tsx` to accept and forward `open`/`onOpenChange` (and a stable section `id`) to their `SectionCard`; verify each still renders its existing content correctly
- [x] 6.3 In `src/components/cv/cv-result-view.tsx`, add `openSectionId` state that resets to the first section ("Personal Info") whenever a new `result` is received, and derive each section's `open`/`onOpenChange` from it so opening one section closes whichever was previously open; verify by parsing a CV and clicking through sections in the running app
- [x] 6.4 Manually verify `openspec/specs/cv-results-display/spec.md`'s "Successful parse response received", "User expands a collapsed section", and "User collapses the currently expanded section" scenarios end-to-end

## 7. Final verification

- [x] 7.1 Run `npm run lint` and `npm run test` and confirm both pass
- [x] 7.2 Run `npm run build` to confirm the production build succeeds with the new font, wordmark, and components
- [x] 7.3 Manually walk through the full flow (load page, see the new wordmark, parse a CV, confirm only the first section is open and clicking others swaps which one is open, confirm the centered button and the "Parsing file..." animation synced exactly with the request, check the footer line and its links) in both light and dark mode
