## MODIFIED Requirements

### Requirement: Footer Attribution
The system SHALL display a footer on every page, below a horizontal separator and centered, on a single line and in a single consistent font style throughout, containing a copyright symbol followed by the author's name and the year "2026", then a hyphen-separated credit for the tools used to build the app. The author's name SHALL link to the author's personal website, "Claude" SHALL link to the Claude Code product page, and "OpenSpec" SHALL link to the OpenSpec website.

#### Scenario: User views the footer
- **WHEN** a user views any page of the app
- **THEN** below a horizontal separator, a centered line reads "© Sebastián Castañeda 2026 - Built with Claude, OpenSpec and ❤️" in one consistent font style, with "Sebastián Castañeda" linking to `https://sebastiancastaneda.dev`

#### Scenario: User views the tooling credit links
- **WHEN** a user views the footer on any page of the app
- **THEN** "Claude" links to `https://claude.com/claude-code` and "OpenSpec" links to `https://openspec.dev`
