## 1. Theme tokens and restyle

- [x] 1.1 Update `:root` and `.dark` OKLCH token values in `src/app/globals.css` (colors, radius, add an accent hue) for the new informal/modern look; verify by running `npm run dev` and visually comparing the home page against the current build
- [x] 1.2 Adjust typography scale/spacing on the page header and section headings in `src/app/page.tsx` / `src/components/cv/*` to match the new style; verify visually in the browser
- [x] 1.3 Spot-check every `src/components/ui/*` primitive (button, card, badge, alert, skeleton) renders correctly with the new tokens; verify by triggering each state (loading, error, success) in the running app

## 2. Theme switcher

- [x] 2.1 Add `src/components/app-shell/theme-provider.tsx` exposing the current theme and a setter via context, reading/writing `localStorage`; verify with a manual toggle in the browser that the value persists in `localStorage`
- [x] 2.2 Add an inline anti-flash `<script>` in `src/app/layout.tsx` that sets the `dark` class on `<html>` from `localStorage` (falling back to `prefers-color-scheme`) before hydration; verify by reloading with dark mode selected and confirming no light-theme flash
- [x] 2.3 Add `src/components/app-shell/theme-toggle.tsx` using `@base-ui/react`'s `switch` primitive, fixed to the top right of the layout; verify clicking it flips the theme immediately and the control reflects current state
- [x] 2.4 Wire `ThemeProvider` and `ThemeToggle` into `src/app/layout.tsx`; verify `openspec/specs/app-shell/spec.md` Theme Switcher and Theme Persistence scenarios manually (switch themes, reload, first-visit default)

## 3. Collapsible result sections

- [x] 3.1 Update `src/components/cv/section-card.tsx` to wrap its content in `@base-ui/react/collapsible` (`Collapsible.Root`/`Trigger`/`Panel`), defaulting to open, with a visible expand/collapse affordance in the header; verify by rendering a section with content and toggling it
- [x] 3.2 Verify open/closed state is independent per section - each `SectionCard` instance owns its own collapsed-state via local component state, so no id plumbing through `personal-info-section.tsx`, `experience-section.tsx`, `education-section.tsx`, `certifications-section.tsx`, `skills-section.tsx` is needed; verify by collapsing one section in `CvResultView` and confirming the others stay expanded
- [x] 3.3 Manually verify `openspec/specs/cv-results-display/spec.md` collapse/expand scenarios end-to-end with a parsed CV result

## 4. Drag-and-drop upload

- [x] 4.1 Rework `src/components/cv/cv-upload-form.tsx` into a dropzone `div` with `onDragOver`/`onDragLeave`/`onDrop` handlers and a visually distinct hover/drag-active state, keeping a hidden `<input type="file">` for click-to-browse; verify both entry points call the same validation path
- [x] 4.2 Confirm existing validation from `src/lib/cv-upload-constraints.ts` (file type, size) still runs for both dropped and browsed files; verify by running the existing test suite (`npm run test`) and manually dropping an invalid file to see the existing error messaging
- [x] 4.3 Manually verify `openspec/specs/cv-results-display/spec.md` drag-and-drop and click-to-browse scenarios with a valid PDF

## 5. Footer and disclaimer

- [x] 5.1 Add `src/components/app-shell/site-footer.tsx` rendering "Sebastián Castañeda 2026" with the name linking to `https://sebastiancastaneda.dev` (`target="_blank"`, `rel="noopener noreferrer"`); mount it in `src/app/layout.tsx` so it appears on every page; verify by inspecting the rendered link's `href`
- [x] 5.2 Add `src/components/app-shell/disclaimer-banner.tsx` stating the app is not a production tool and is for experimentation/learning; mount it in `src/app/page.tsx` near the top of the content; verify it is visible without interaction on page load

## 6. Final verification

- [x] 6.1 Run `npm run lint` and `npm run test` and confirm both pass
- [x] 6.2 Run `npm run build` to confirm the production build succeeds with the new components and theme script
- [x] 6.3 Manually walk through the full flow (load page, see disclaimer, toggle theme, reload to confirm persistence, drag-and-drop a PDF, collapse/expand a result section, check footer link) in both light and dark mode
