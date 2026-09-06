## Context

The app is a single Next.js App Router page (`src/app/page.tsx`) rendered under one root layout (`src/app/layout.tsx`). Theming already exists at the CSS level: `globals.css` defines a full `:root` / `.dark` OKLCH token set consumed via `@theme inline`, and `@custom-variant dark (&:is(.dark *))` makes `dark:` utilities work - but nothing currently toggles the `.dark` class, so dark mode is unreachable today. The project already depends on `@base-ui/react` (^1.8.0), which ships headless `collapsible` and `switch` primitives, and `lucide-react` for icons. There is no existing drag-and-drop dependency. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Wire up a working, persisted light/dark toggle using the token infrastructure that already exists, without a flash of the wrong theme.
- Reuse existing headless primitives (`@base-ui/react`) rather than adding new runtime dependencies where they already cover the need (collapsible, switch).
- Keep the upload form's existing validation logic (`cv-upload-constraints.ts`) untouched; only the input surface changes.

**Non-Goals:**
- No redesign of the parsing pipeline, API, or domain/value-object layer - this is presentation-only.
- No design system overhaul beyond updating theme tokens and component styling (no new component library, no CSS-in-JS migration).
- No multi-theme support beyond light/dark (no custom theme picker with more than two options).

## Decisions

### Theme switching: `next-themes`-style pattern implemented locally, no new dependency
Add a small client-side theme store (a context + `localStorage`, following the same approach the `next-themes` package uses) instead of pulling in `next-themes` itself, since the app only needs light/dark/system with a single toggle and the existing `.dark` class convention already matches what a from-scratch implementation needs. An inline, unhydrated `<script>` in `layout.tsx` (before hydration) reads `localStorage` and sets the `dark` class on `<html>` synchronously, preventing flash-of-wrong-theme. `@base-ui/react`'s `switch` primitive backs the visible toggle control in the top-right corner.
- Alternative considered: add the `next-themes` package. Rejected to avoid a new dependency for a single boolean preference the app can own directly.

### Collapsible sections: Base UI `collapsible`
`SectionCard` wraps its content in `@base-ui/react/collapsible` (`Collapsible.Root` / `Collapsible.Trigger` / `Collapsible.Panel`), keyed by section, defaulting to open. Each of the five section components passes through an `id` so open/closed state can be tracked independently per section in `CvResultView` (or within each `SectionCard` instance, if state doesn't need to be lifted). No new state is persisted across reloads - collapse state resets per parse result, since collapsing is a within-session convenience, not a saved preference.
- Alternative considered: hand-rolled `<details>/<summary>`. Rejected because animating height and matching the rest of the app's interaction/focus patterns is meaningfully easier with the existing headless primitive already in the dependency tree.

### Drag-and-drop upload: hand-rolled dropzone that stages a file, explicit button submits
`CvUploadForm` becomes a dropzone `div` handling `onDragOver`/`onDragLeave`/`onDrop` plus a hidden `<input type="file">` for the click-to-browse fallback, reusing the same `handleFile` validation path for both entry points. Dropping or browsing only *stages* a validated file (shown by name in the dropzone); a separate "Parse CV" button - disabled until a file is staged - triggers the actual submit. This two-step flow (matching the original pre-restyle interaction) gives the user a chance to confirm the right file before the parse request fires, rather than submitting the instant a file lands. No drag-and-drop library is added - the interaction is a handful of native DOM events and doesn't justify a new dependency.
- Alternative considered: submit immediately on drop/select (no button). Rejected per explicit product direction - an explicit trigger is preferred over an implicit one here.
- Alternative considered: `react-dropzone`. Rejected as unnecessary weight for a single dropzone with no multi-file or advanced-filtering requirements.

### Visual direction: editorial/typewriter aesthetic inspired by openspec.dev
Same token architecture as before (values only, `@theme inline` wiring untouched), but the values now target a warm cream (`:root`) / near-black warm (`.dark`) background pair with a single terracotta/rust accent hue, replacing the earlier violet-toned palette. `--radius` drops to `0.2rem` for crisp, mostly-square corners instead of soft rounded cards. `Card` (`src/components/ui/card.tsx`) switches from a soft `ring-1` to a real `border border-border` for a hairline-box look. `--font-sans` now resolves to the already-loaded `--font-geist-mono` instead of Geist Sans, giving the whole app a monospace/typewriter voice site-wide (no new font dependency). Existing `uppercase tracking-wide text-xs text-muted-foreground` label styling (already used for `InfoRow` labels) is reused for the new top announcement bar, matching the small-caps metadata labels in the reference design.
- Alternative considered: keep the earlier violet/rounded "friendly SaaS" direction. Superseded per explicit design feedback pointing at openspec.dev as the target look.

### Footer, disclaimer, and header: new components in `app-shell`
Add `src/components/app-shell/site-footer.tsx`, `src/components/app-shell/theme-toggle.tsx`, `src/components/app-shell/site-header.tsx`, and `src/components/app-shell/disclaimer-banner.tsx`. The disclaimer is now a full-bleed top announcement bar (mounted first in `layout.tsx`, above everything else), mirroring the reference site's top strip, rather than an inline card on the page. `site-header.tsx` is a new bordered header row (wordmark left, theme toggle right, bottom hairline) replacing the earlier floating fixed-position toggle button, echoing the reference's logo/nav row. A `theme-provider.tsx` supplies the theme context to the toggle and the inline anti-flash script's expectations.

## Risks / Trade-offs

- [Hand-rolled theme persistence could drift from `next-themes` semantics users may expect (e.g. system-preference change while tab is open)] → Scope to the two documented scenarios in `app-shell/spec.md` (reload persistence, first-visit OS default); live OS-preference-change tracking while the tab is open is not required by the spec.
- [Restyling shared tokens in `globals.css` affects every `src/components/ui/*` primitive at once] → Since this is presentation-only, verify each shadcn component visually (button, card, badge, alert, skeleton) in both themes after the token change, per tasks.md.
- [Native drag-and-drop has inconsistent browser affordances/accessibility compared to a library] → Keep the click-to-browse `<input>` as the primary accessible fallback and ensure the dropzone has proper `aria` labeling and keyboard focus support.

## Open Questions

None - the two-option (light/dark) scope and no-live-OS-tracking behavior are decided above.
