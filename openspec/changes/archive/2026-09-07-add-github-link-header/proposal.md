## Why

The app has no visible link to its source repository. Visitors who want to inspect the code, star the project, or report an issue have no way to find it from the UI. openspec.dev's header demonstrates a clean, minimal pattern for this (a text link with a small external-link glyph) that fits this app's existing terminal/monospace-inspired aesthetic.

## What Changes

- Add a "GitHub" link in the top-right header area, pointing to `https://github.com/seba3c/easyparse-cv`, opening in a new tab.
- Style the link to match openspec.dev's header link treatment (uppercase-ish/monospace text label with a small arrow glyph, muted color that brightens on hover) adapted to this app's existing header styling.
- Position the link immediately to the left of (before) the theme switcher, on the same line/row.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `app-shell`: The page-level chrome (currently covering the theme switcher, footer, and disclaimer) gains a new requirement: a GitHub repository link displayed in the header, positioned before the theme switcher.

## Impact

- Affected code: the header/top-bar component that currently renders the theme switcher (in the app's page chrome layer).
- No new dependencies expected; the external-link icon can reuse whatever icon set is already in use, or be inlined as SVG/Unicode arrow.
- No backend, API, or data model impact.
