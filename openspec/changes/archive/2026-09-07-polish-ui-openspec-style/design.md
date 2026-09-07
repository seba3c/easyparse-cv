## Context

See proposal.md for motivation. Relevant current state:

- `SiteHeader` (`src/components/app-shell/site-header.tsx`) renders the title as a plain `<span>` of text.
- `SectionCard` (`src/components/cv/section-card.tsx`) wraps `@base-ui/react/collapsible` and currently owns its own `open` state locally (`useState`), defaulting to `true`. Each of the five section components (`personal-info-section.tsx`, `experience-section.tsx`, `education-section.tsx`, `certifications-section.tsx`, `skills-section.tsx`) renders exactly one `SectionCard` with a fixed `title` and no id.
- `CvResultView` (`src/components/cv/cv-result-view.tsx`) renders the five section components in a fixed order and has no state of its own today.
- `CvUploadForm` (`src/components/cv/cv-upload-form.tsx`) receives `isLoading` as a prop from `page.tsx` and renders `{isLoading ? "Parsing..." : "Parse CV"}` inside the same `<Button>` element, left-aligned (`self-start`).
- The app already self-hosts two variable fonts via `next/font/google` (`Geist`, `Geist_Mono`) as CSS variables consumed through Tailwind's `@theme inline` (`globals.css`); `--font-sans` currently resolves to `--font-geist-mono`, so the whole app is already monospace.
- openspec.dev's title is not a font: it's an inline `<svg viewBox="0 0 640 80" fill="currentColor">` built from `<path>` rectangles on a 16x16 unit grid, one glyph at a time (confirmed by fetching the live page's HTML). Its section headings use `font-family: IBM Plex Mono` at `font-size: .72rem; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: var(--accent-strong)`, and its footer is `display:flex; justify-content:space-between; border-top: 1px solid var(--hairline)` with small, letter-spaced text (confirmed the same way).

## Goals / Non-Goals

**Goals:**
- Match openspec.dev's actual, verified implementation details (SVG construction technique, font family/weight/tracking, footer line/border treatment) rather than an approximation.
- Lift `SectionCard`'s open/closed state to a controlled prop so `CvResultView` can enforce single-open-section behavior without each section component knowing about its siblings.
- Keep the parsing animation a direct, unmodified reflection of the request's in-flight state - no artificial minimum display duration.

**Non-Goals:**
- No redesign of the color tokens, radii, or overall layout established in `modernize-ui-ux` - this change only touches the specific elements listed in the proposal.
- No persistence of section open/closed state across reloads or across separate parses - it resets to "first section open" on every new successful parse, matching current (non-persisted) collapse behavior.
- No new backend/API changes.

## Decisions

### Pixel-block wordmark: hand-authored SVG, generated once and committed as static markup
Build a small pixel-grid glyph set (rectangles on a 16-unit grid, same technique as openspec.dev's `wordmark` SVG) covering the characters needed for "EASYPARSE.CV" (`E A S Y P R C V .`), then compose the final wordmark's `<path>` list with a short local script (not shipped/committed) and paste the resulting static SVG markup into `SiteHeader` as a new `Wordmark` component. It's authored once as data, not generated at runtime, so there is no new runtime dependency and no risk of layout-shift from a font loading late. `fill="currentColor"` is kept so the wordmark tracks the current text color (and theme) automatically, matching openspec.dev's approach and the current header's `text-primary` accent on `.cv`.
- Alternative considered: render via a real pixel/bitmap web font (the rejected option from the earlier scoping question). Rejected per explicit product direction - the SVG block technique was specifically requested to match openspec.dev's real implementation, not just its look.
- Alternative considered: generate the SVG at runtime from a small glyph-map data structure. Rejected as unnecessary complexity for a title that never changes at runtime; a static SVG is simpler to maintain and diff.
- Sizing: rendered at `h-3` (12px tall) in `SiteHeader`, down from an initial `h-4` (16px) that read visibly larger/bolder than openspec.dev's own header wordmark when compared side by side - `h-3` matches that reference proportion better against the theme toggle and header padding.

### Section heading font: self-hosted IBM Plex Mono via `next/font/google`, scoped to `CardTitle`
Add `IBM_Plex_Mono` (weight `600`, matching the verified openspec.dev value) as a third `next/font/google` variable in `layout.tsx` (`--font-plex-mono`), alongside the existing `Geist`/`Geist_Mono` variables, and apply it - along with the verified `font-size: .72rem`-equivalent Tailwind scale, `tracking-[0.22em] uppercase font-semibold` - to `CardTitle` only within `SectionCard`, not globally. Scoping to the section heading (rather than swapping the app's global `--font-sans`) keeps the change additive and matches openspec.dev, where IBM Plex Mono is the site-wide font but the *heading treatment* (size/tracking/case/color) is what visually distinguishes a section label like "SYNOPSIS" - reusing the app's existing Geist Mono for body text and only bringing in Plex Mono for headings gets the same distinguishing effect without a full font swap the proposal didn't ask for.
- Alternative considered: swap `--font-sans` to IBM Plex Mono site-wide to fully match openspec.dev's font choice. Rejected as out of scope - the request was specifically about "the fonts used for sections," not a site-wide font change, and the app's existing Geist Mono already gives a comparable monospace voice elsewhere.
- Color: the heading text uses a fixed hex `text-[#d89074]` rather than the `text-primary` token used initially, per explicit follow-up color spec - this is a deliberate one-off literal color, not theme-derived, so it renders identically in light and dark mode.

### Section accent: small color swatch next to the title, not a left border
`SectionCard` no longer wraps `Card` in `border-l-4` plus an `accentClassName` border color; instead each section component now passes `accentClassName` as a background-color utility (e.g. `bg-violet-500` instead of `border-l-violet-500`), and `SectionCard` renders a small `size-2.5` square (`<span className={cn("inline-block size-2.5 shrink-0", accentClassName)} />`) immediately before the title text, reusing the same "small colored square as a category marker" pattern already established by `DisclaimerBanner`'s bullet (`size-1.5 bg-primary`). `Card` itself is now a plain bordered box with no per-section styling.
- Superseded decision: the initial implementation kept the per-section accent as a `border-l-4` colored strip down the left edge of each card (carried over unchanged from the pre-existing `modernize-ui-ux` design). Replaced per explicit follow-up feedback and a reference screenshot showing a small isolated color swatch instead of a full-height border.

### Theme toggle: resized down, then back up twice, landing at `h-6 w-9`
`ThemeToggle`'s `Switch.Root` shrinks from the original `h-8 w-14` to `h-6 w-9`, with `Switch.Thumb` reduced from `size-6` to `size-5` (translate distance recalculated: `translate-x-0.5` unchecked, `translate-x-3.5` checked) and its `Moon`/`Sun` icon from `size-3.5` to `size-3`. A sizing correction arrived at iteratively based on direct visual feedback rather than a single formula.
- Superseded decision (v1): shrunk all the way to `h-3 w-6` (thumb `size-2`, icon `size-1.5`) to exactly match the wordmark's `h-3`. Corrected as too small/hard to use.
- Superseded decision (v2): bumped to `h-4 w-7` (thumb `size-3`, icon `size-2`). Corrected again per explicit follow-up ("make the switcher bigger 2 points more") - increased each Tailwind spacing step by 2 (`h-4`→`h-6`, `w-7`→`w-9`, thumb `size-3`→`size-5`, icon `size-2`→`size-3`) to land at the current size, still well short of the original `h-8 w-14`.

### Single-open accordion: controlled state lifted to `CvResultView`
`SectionCard` changes from owning `open` via internal `useState` to accepting `open: boolean` and `onOpenChange: (open: boolean) => void` as props (dropping its own `useState`). Each section component (`PersonalInfoSection`, etc.) forwards an `id`, `open`, and `onOpenChange` prop it receives from `CvResultView` straight through to its `SectionCard`. `CvResultView` holds a single `openSectionId` state (`useState<SectionId | null>`, initialized to `"personal-info"` whenever it receives a new `result`, via a `key`-driven remount or a `useEffect` keyed on `result`) and passes each section `open={openSectionId === id}` and `onOpenChange={(open) => setOpenSectionId(open ? id : null)}`. This keeps the five section components simple (no accordion logic duplicated five times) while giving `CvResultView` the single point of coordination the single-open constraint needs.
- Alternative considered: keep state inside `SectionCard` and coordinate via a shared context. Rejected as more machinery than five sibling components need; plain lifted state and prop drilling is simpler here and matches the existing prop-passing style already used for `warning`.

### Parsing animation: directly reflects `page.tsx`'s request lifecycle, no minimum-duration timer
`page.tsx` passes `isLoading={state.status === "loading"}` straight through to `CvUploadForm`, and renders `ErrorBanner`/`CvResultView` as soon as `state.status` becomes `"error"`/`"success"` - no intermediate `isAnimating` state, ref, or timer. While `isLoading` is true, `CvUploadForm` replaces the `<Button>` with the animated "Parsing file..." text; the instant the fetch resolves, the animation is gone and the button or result appears in the same render. A very fast response may make the animation barely perceptible - that's intentional per explicit product direction ("just sync with the request, even if it's not visible at all if the request is too fast").
- Superseded decision: an earlier version of this change added a `MIN_PARSING_ANIMATION_MS` constant and a start-time ref/timer (in `CvUploadForm`, then later lifted to `page.tsx` to also gate the result/error reveal) so the animation stayed visible for at least 2 seconds regardless of actual request duration. Removed per explicit follow-up feedback: the perceived-performance padding was not wanted - the loading indicator should be an honest, exact reflection of the request, not a manufactured minimum.

### Button centering
`CvUploadForm`'s button wrapper changes from `self-start` to `self-center` (or the button's container gets `flex justify-center`), a pure Tailwind class change with no state implications.

### Footer: single line, hairline separator, centered, hyperlinked tool names, with ©
`SiteFooter` gets a `border-t border-border` hairline (matching the verified openspec.dev `.man-foot` treatment) and renders one centered, `text-xs` line: "© Sebastián Castañeda 2026 - Built with Claude, OpenSpec and ❤️", where "Sebastián Castañeda" links to `https://sebastiancastaneda.dev`, "Claude" links to `https://claude.com/claude-code`, and "OpenSpec" links to `https://openspec.dev` (all `target="_blank" rel="noopener noreferrer"`, matching the existing author link's pattern). The author link carries no distinct weight/color styling (dropped the earlier `font-medium text-foreground`) so the whole line reads in one consistent font style, matching openspec.dev's own unstyled "© 2026 Fission" text.
- Superseded decision (v1): split this into two lines (existing attribution, then a horizontal rule, then a left-aligned, unlinked credit line), reading the original request's "using a hyphen - as separator" as referring to the rule-then-text openspec.dev footer layout.
- Superseded decision (v2): merged into one centered line with links but no separator or copyright symbol, after feedback clarified the hyphen was meant literally as an in-line separator.
- Superseded decision (v3): added the hairline separator, left-alignment, and `©` - but placed `©` between the name and the year ("Sebastián Castañeda © 2026") and kept the name bolded/colored differently from the rest of the line.
- Superseded decision (v4): moved `©` to the front and unified the font style/size (`text-xs`), but kept left-alignment (matching openspec.dev's own left-aligned footer literally).
- Final correction: alignment changed back to centered per explicit follow-up feedback, while keeping the hairline separator, `©`-first ordering, and unified font style from v4.

## Risks / Trade-offs

- [Hand-authoring pixel-block glyphs for `E A S Y P R C V .` is manual, error-prone box-pushing] → Build and visually verify the wordmark in the browser (both themes) before committing the final `<path>` list; keep the glyph grid simple (reuse letterforms already present in "OPENSPEC" where the same letter recurs, e.g. `E`, `S`, `P`, `C`) to reduce the amount of new pixel art needed.
- [Adding a third `next/font/google` family increases initial font payload] → IBM Plex Mono is loaded only for the single weight (`600`) actually used, and only the Latin subset, keeping the added weight small; it's applied to short heading text only, not body copy.
- [Lifting `SectionCard`'s open state to a required controlled prop is a breaking change to its existing internal-state API] → This component has no consumers outside the five CV section components being updated in the same change, so there's no external call site left uninformed of the new prop contract.
