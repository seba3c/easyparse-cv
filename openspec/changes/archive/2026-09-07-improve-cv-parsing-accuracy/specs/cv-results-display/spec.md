## MODIFIED Requirements

### Requirement: Parsed Section Rendering
The system SHALL render each returned section (Personal Info, Summary, Experience, Education, Certifications, Skills) on the same page as the upload control, each with a visually distinct accent color, after a successful parse. Only one section SHALL be expanded at a time: immediately after a parse completes, the first section (Personal Info) SHALL be expanded and all others collapsed, and expanding any collapsed section SHALL collapse whichever section was previously expanded.

#### Scenario: Successful parse response received
- **WHEN** the upload completes and a structured response is returned
- **THEN** the page renders each section's data with its own accent color, with the first section (Personal Info) expanded and every other section collapsed

#### Scenario: User collapses a section
- **WHEN** a user activates the currently expanded section's header
- **THEN** that section's content is hidden while its header remains visible, and no other section's state changes

#### Scenario: User expands a previously collapsed section
- **WHEN** a user activates a collapsed section's header while another section is expanded
- **THEN** that section's content becomes visible and the previously expanded section collapses, so only the newly activated section is expanded

#### Scenario: CV with a Summary
- **WHEN** the response's `summary` field is non-null
- **THEN** the Summary section displays that text

### Requirement: Warning Display
The system SHALL visibly surface any warnings included in the response. A warning tied to a specific section (e.g. a low-confidence entry split) SHALL be displayed near that section's content; a warning not tied to any single section (e.g. a document-wide low-confidence segmentation warning) SHALL be displayed in a general notice near the top of the results, distinguishable from section-specific warnings.

#### Scenario: Response includes a low-confidence warning
- **WHEN** the response contains a warning about a section that could not be confidently split into entries
- **THEN** the corresponding section displays that warning near its content

#### Scenario: Response includes a document-wide segmentation warning
- **WHEN** the response contains a warning that is not associated with any single section (e.g. section boundaries may be unreliable for the whole document)
- **THEN** the UI displays that warning in a general notice near the top of the results, rather than attaching it to one section
