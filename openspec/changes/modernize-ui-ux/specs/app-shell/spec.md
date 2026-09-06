## Purpose

Provides the page-level chrome shared by every view of the app: light/dark theme switching, author attribution in a footer, and a disclaimer that this is an experimentation/learning project, not a production tool.

## ADDED Requirements

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
The system SHALL display a footer on every page containing the author's name and the year "2026", where the name is a hyperlink to the author's personal website.

#### Scenario: User views the footer
- **WHEN** a user views any page of the app
- **THEN** the footer displays "Sebastián Castañeda 2026" with "Sebastián Castañeda" linking to `https://sebastiancastaneda.dev`

### Requirement: Non-Production Disclaimer
The system SHALL visibly display a disclaimer stating that the application is not a production tool and exists for experimentation and learning purposes.

#### Scenario: User loads the app
- **WHEN** a user loads the app for the first time in a session
- **THEN** the disclaimer is visible without requiring any additional interaction
