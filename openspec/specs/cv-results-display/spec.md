## Purpose

Presents a single-page interface for uploading a CV PDF and viewing the extracted data as clearly labeled, color-accented sections, including honest handling of missing, low-confidence, or failed extraction.

## Requirements

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

### Requirement: Empty Section Handling
The system SHALL display an explicit empty-state indication for any section with no extracted content, rather than leaving a blank or missing region.

#### Scenario: CV with no certifications
- **WHEN** the response's certifications list is empty
- **THEN** the Certifications section displays a message indicating none were found, rather than blank space

### Requirement: Warning Display
The system SHALL visibly surface any warnings included in the response. A warning tied to a specific section (e.g. a low-confidence entry split) SHALL be displayed near that section's content; a warning not tied to any single section (e.g. a document-wide low-confidence segmentation warning) SHALL be displayed in a general notice near the top of the results, distinguishable from section-specific warnings.

#### Scenario: Response includes a low-confidence warning
- **WHEN** the response contains a warning about a section that could not be confidently split into entries
- **THEN** the corresponding section displays that warning near its content

#### Scenario: Response includes a document-wide segmentation warning
- **WHEN** the response contains a warning that is not associated with any single section (e.g. section boundaries may be unreliable for the whole document)
- **THEN** the UI displays that warning in a general notice near the top of the results, rather than attaching it to one section

### Requirement: Raw Fallback Display
The system SHALL display an entry's or section's raw text when its structured fields are absent, so no successfully extracted content is hidden from the user.

#### Scenario: Entry with unparsed structured fields
- **WHEN** a returned entry has null/absent structured fields but non-empty raw text
- **THEN** the UI displays the raw text for that entry instead of showing it empty

### Requirement: Upload and Processing Error Display
The system SHALL show a clear, specific error message when the upload or parse request fails, distinguishing at least invalid file type, oversized file, no text layer found, and general processing failure.

#### Scenario: User uploads a scanned PDF
- **WHEN** the parse request fails because the PDF has no extractable text layer
- **THEN** the UI displays a message specifically indicating that scanned/image-only PDFs are not supported, rather than a generic error

#### Scenario: User uploads a non-PDF file
- **WHEN** the parse request fails because the uploaded file is not a PDF
- **THEN** the UI displays a message specifically indicating that only PDF files are supported
