## Purpose

Presents a single-page interface for uploading a CV PDF and viewing the extracted data as clearly labeled, color-accented sections, including honest handling of missing, low-confidence, or failed extraction.

## Requirements

### Requirement: File Upload Interface
The system SHALL present a single-page interface with a drag-and-drop dropzone for selecting one PDF file, which also supports clicking to browse and choose a file, plus a control to trigger parsing once a file is selected. The system SHALL show a loading state while the upload and parse are in progress.

#### Scenario: User uploads a PDF
- **WHEN** a user has selected a PDF file and activates the parse control
- **THEN** the system submits it for parsing and displays a loading state until a response is received

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
The system SHALL render each returned section (Personal Info, Experience, Education, Certifications, Skills) on the same page as the upload control, each with a visually distinct accent color, after a successful parse. Each section SHALL be independently collapsible and expandable, and SHALL be expanded by default immediately after a parse completes.

#### Scenario: Successful parse response received
- **WHEN** the upload completes and a structured response is returned
- **THEN** the page renders each section's data with its own accent color, expanded by default, replacing or supplementing the upload control

#### Scenario: User collapses a section
- **WHEN** a user activates a section's collapse control while it is expanded
- **THEN** that section's content is hidden while its header remains visible, and other sections are unaffected

#### Scenario: User expands a previously collapsed section
- **WHEN** a user activates a collapsed section's header or expand control
- **THEN** that section's content becomes visible again

### Requirement: Empty Section Handling
The system SHALL display an explicit empty-state indication for any section with no extracted content, rather than leaving a blank or missing region.

#### Scenario: CV with no certifications
- **WHEN** the response's certifications list is empty
- **THEN** the Certifications section displays a message indicating none were found, rather than blank space

### Requirement: Warning Display
The system SHALL visibly surface any warnings included in the response, associated with the section they describe, distinguishable from normally parsed data.

#### Scenario: Response includes a low-confidence warning
- **WHEN** the response contains a warning about a section that could not be confidently split into entries
- **THEN** the corresponding section displays that warning near its content

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
