## MODIFIED Requirements

### Requirement: File Upload Interface
The system SHALL present a single-page interface with a drag-and-drop dropzone for selecting one PDF file, which also supports clicking to browse and choose a file, plus a control to trigger parsing once a file is selected. While the upload and parse are in progress, the system SHALL replace the parse control with an animated "Parsing file..." indicator, synced exactly with the request's lifetime (no artificial minimum display duration).

#### Scenario: User uploads a PDF
- **WHEN** a user has selected a PDF file and activates the parse control
- **THEN** the system submits it for parsing and replaces the parse control with an animated "Parsing file..." indicator until a response has been received

#### Scenario: Parse response returns quickly
- **WHEN** the parse request completes very quickly
- **THEN** the animated "Parsing file..." indicator is shown only for as long as the request is in flight and may be barely visible, with no artificial minimum display duration

#### Scenario: User selects a PDF via drag-and-drop
- **WHEN** a user drags a PDF file over the dropzone and drops it
- **THEN** the dropzone shows the selected file's name and the parse control becomes available, without submitting automatically

#### Scenario: User selects a PDF via click-to-browse
- **WHEN** a user clicks the dropzone and selects a PDF file through the resulting file picker
- **THEN** the dropzone shows the selected file's name and the parse control becomes available, without submitting automatically

#### Scenario: User drags a non-PDF file over the dropzone
- **WHEN** a user drags a file over the dropzone
- **THEN** the dropzone indicates it is ready to accept the drop without asserting the file is valid, and the existing file type/size validation still runs once the file is dropped or selected

### Requirement: Parsed Section Rendering
The system SHALL render each returned section (Personal Info, Experience, Education, Certifications, Skills) on the same page as the upload control, each with a visually distinct accent color, after a successful parse. Only one section SHALL be expanded at a time: immediately after a parse completes, the first section (Personal Info) SHALL be expanded and all others collapsed, and expanding any collapsed section SHALL collapse whichever section was previously expanded.

#### Scenario: Successful parse response received
- **WHEN** the upload completes and a structured response is returned
- **THEN** the page renders each section's data with its own accent color, with the first section (Personal Info) expanded and every other section collapsed

#### Scenario: User collapses a section
- **WHEN** a user activates the currently expanded section's header
- **THEN** that section's content is hidden while its header remains visible, and no other section's state changes

#### Scenario: User expands a previously collapsed section
- **WHEN** a user activates a collapsed section's header while another section is expanded
- **THEN** that section's content becomes visible and the previously expanded section collapses, so only the newly activated section is expanded
