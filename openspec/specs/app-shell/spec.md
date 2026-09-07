## Purpose

Provides the page-level chrome shared by every view of the app: light/dark theme switching, author attribution in a footer, and a disclaimer that this is an experimentation/learning project, not a production tool.

## Requirements

### Requirement: Theme Switcher
The system SHALL present a control fixed to the top right of the page that lets the user switch between light and dark color themes.

#### Scenario: User switches to dark mode
- **WHEN** the user activates the theme switcher while the light theme is active
- **THEN** the page immediately re-renders using the dark color theme and the switcher reflects the new state

#### Scenario: User switches back to light mode
- **WHEN** the user activates the theme switcher while the dark theme is active
- **THEN** the page immediately re-renders using the light color theme and the switcher reflects the new state

### Requirement: Theme Persistence
The system SHALL remember the user's chosen theme across page reloads and future visits, and SHALL apply it before the page becomes visible so no flash of the other theme occurs.

#### Scenario: User reloads after choosing dark mode
- **WHEN** a user who previously selected the dark theme reloads the page or returns in a new session
- **THEN** the page renders in the dark theme from first paint, without first flashing the light theme

#### Scenario: First-time visitor with no saved preference
- **WHEN** a user with no previously saved theme choice loads the page
- **THEN** the system SHALL use a reasonable default (e.g. the operating system's color scheme preference) rather than forcing a fixed theme

### Requirement: Footer Attribution
The system SHALL display a footer on every page, below a horizontal separator and centered, on a single line and in a single consistent font style throughout, containing a copyright symbol followed by the author's name and the year "2026", then a hyphen-separated credit for the tools used to build the app. The author's name SHALL link to the author's personal website, "Claude" SHALL link to the Claude Code product page, and "OpenSpec" SHALL link to the OpenSpec website.

#### Scenario: User views the footer
- **WHEN** a user views any page of the app
- **THEN** below a horizontal separator, a centered line reads "© Sebastián Castañeda 2026 - Built with Claude, OpenSpec and ❤️" in one consistent font style, with "Sebastián Castañeda" linking to `https://sebastiancastaneda.dev`

#### Scenario: User views the tooling credit links
- **WHEN** a user views the footer on any page of the app
- **THEN** "Claude" links to `https://claude.com/claude-code` and "OpenSpec" links to `https://openspec.dev`

### Requirement: Non-Production Disclaimer
The system SHALL visibly display a disclaimer stating that the application is not a production tool and exists for experimentation and learning purposes.

#### Scenario: User loads the app
- **WHEN** a user loads the app for the first time in a session
- **THEN** the disclaimer is visible without requiring any additional interaction
