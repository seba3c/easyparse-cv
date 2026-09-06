## Why

The current UI uses a plain grayscale shadcn theme, a bare `<input type="file">` control, static non-collapsible section cards, and has no footer, theme switcher, or disclaimer. It reads as a formal internal tool rather than the modern, approachable, experimental project it actually is, and it gives no visual indication that this is a learning/experimentation project rather than a production service.

## What Changes

- Restyle the visual theme (colors, typography scale, spacing, radii) to a more informal, modern look, replacing the current neutral grayscale palette. Both light and dark variants are updated since dark mode becomes user-facing.
- Add a light/dark mode switcher fixed to the top right of the page, with the choice persisted across visits (`localStorage`) and no flash of the wrong theme on load.
- Make each CV result section (Personal Info, Experience, Education, Certifications, Skills) collapsible/expandable, expanded by default after a parse.
- Replace the plain file `<input>` with a drag-and-drop dropzone component (click-to-browse still supported as a fallback), reusing the existing PDF type/size validation.
- Add a page footer containing "Sebastián Castañeda 2026", where the name links to `https://sebastiancastaneda.dev`.
- Add a persistent, visible disclaimer stating this is not a production tool and exists for experimentation/learning purposes.

## Capabilities

### New Capabilities
- `app-shell`: Page-level chrome shared across the app - theme (light/dark) switching and persistence, footer with author attribution, and the non-production disclaimer.

### Modified Capabilities
- `cv-results-display`: The file upload control becomes a drag-and-drop dropzone (in addition to click-to-browse), and each rendered result section becomes independently collapsible/expandable.

## Impact

- `src/app/layout.tsx`, `src/app/globals.css`: new color tokens/theme values, theme provider/script to avoid flash-of-wrong-theme.
- `src/app/page.tsx`: mounts the theme switcher, footer, and disclaimer around the existing upload/result flow.
- `src/components/cv/cv-upload-form.tsx`: reworked into a drag-and-drop dropzone.
- `src/components/cv/section-card.tsx` and the five section components: add collapsible behavior.
- New components: a theme switcher, a footer, and a disclaimer banner (exact locations decided in design.md).
- No changes to the parsing API, domain logic, or response shapes - this change is presentation-only.
