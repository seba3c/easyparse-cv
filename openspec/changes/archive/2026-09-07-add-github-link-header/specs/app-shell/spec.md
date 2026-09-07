## ADDED Requirements

### Requirement: GitHub Repository Link
The system SHALL display a "GitHub" link in the header, positioned in the same row as the theme switcher and immediately before it (to its left), pointing to `https://github.com/seba3c/easyparse-cv` and opening in a new browser tab. The link SHALL be styled consistently with the header's existing text/icon treatment (muted color that brightens on hover, monospace/text label paired with a small external-link indicator).

#### Scenario: User views the header
- **WHEN** a user views any page of the app
- **THEN** the header shows a "GitHub" link immediately to the left of the theme switcher, on the same line

#### Scenario: User activates the GitHub link
- **WHEN** the user clicks/taps the "GitHub" link in the header
- **THEN** the browser opens `https://github.com/seba3c/easyparse-cv` in a new tab, and the original app tab remains open and unaffected
