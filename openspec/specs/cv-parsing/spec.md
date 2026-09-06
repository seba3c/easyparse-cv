## Purpose

Turns an uploaded CV PDF into structured personal, experience, education, certification, and skills data, entirely through local processing with no third-party service calls.

## Requirements

### Requirement: PDF Upload Validation
The system SHALL accept only PDF files for parsing and SHALL reject any other file type or an oversized file with a distinguishable error before attempting extraction.

#### Scenario: Valid PDF uploaded
- **WHEN** a user uploads a file with valid PDF content under the configured size limit
- **THEN** the system accepts the file and proceeds to extraction

#### Scenario: Non-PDF file uploaded
- **WHEN** a user uploads a file that is not a PDF
- **THEN** the system rejects the request with an error identifying an invalid file type, and performs no extraction

#### Scenario: Oversized file uploaded
- **WHEN** a user uploads a PDF larger than the configured size limit
- **THEN** the system rejects the request with an error identifying the file as too large, and performs no extraction

### Requirement: File Hash Computation
The system SHALL compute a SHA-256 hash of the uploaded file's raw bytes and include it in the response, deterministically, so identical files always produce the same hash.

#### Scenario: Same file uploaded twice
- **WHEN** the same PDF file is uploaded in two separate requests
- **THEN** both responses include an identical hash value

### Requirement: Local Text Extraction
The system SHALL extract embedded text from PDFs that contain a text layer, and SHALL reject PDFs with no extractable text (e.g. scanned/image-only PDFs) with an error distinguishable from other failure types, rather than returning empty or garbage structured data.

#### Scenario: PDF with embedded text layer
- **WHEN** a user uploads a PDF containing an embedded text layer
- **THEN** the system extracts the text content and proceeds to segmentation

#### Scenario: Scanned PDF with no text layer
- **WHEN** a user uploads a PDF with no extractable text (e.g. a scanned image)
- **THEN** the system returns an error indicating no text layer was found, and does not return partial or fabricated structured data

### Requirement: No External Service Calls
The system SHALL perform all text extraction, segmentation, and parsing logic locally within the server process, without making any network call to a third-party API or service.

#### Scenario: Parsing succeeds without network access
- **WHEN** a valid text-layer PDF is processed with outbound network access disabled
- **THEN** the system still successfully returns a structured response

### Requirement: Section Segmentation
The system SHALL segment extracted text into the recognized sections Personal Info, Experience, Education, Certifications, and Skills, recognizing section headers in both English and Spanish.

#### Scenario: CV with English section headers
- **WHEN** the extracted text contains English headers such as "Experience", "Education", "Skills", or "Certifications"
- **THEN** the corresponding sections are correctly identified and their content grouped under them

#### Scenario: CV with Spanish section headers
- **WHEN** the extracted text contains Spanish headers such as "Experiencia", "Educación", "Habilidades", or "Certificaciones"
- **THEN** the corresponding sections are correctly identified and their content grouped under them

#### Scenario: CV missing a recognized section
- **WHEN** the extracted text has no content matching a recognized section (e.g. no certifications)
- **THEN** the response returns that section as empty rather than raising an error

### Requirement: Personal Info Extraction
The system SHALL extract full name, email, phone, location, and links (e.g. LinkedIn, GitHub) from the document when present, and SHALL return a field as absent rather than erroring when it cannot be found.

#### Scenario: CV containing contact details
- **WHEN** the document contains an email address and a phone number
- **THEN** both are extracted into the personal info section of the response

#### Scenario: CV missing a personal info field
- **WHEN** the document does not contain a detectable value for a given personal info field (e.g. no phone number)
- **THEN** that field is returned as absent/null and no error is raised

### Requirement: Experience and Education Entry Parsing
The system SHALL parse the Experience and Education sections into individual entries using date-range detection as the primary anchor, capturing company/institution, title/degree, dates, and description when identifiable, and SHALL preserve each entry's original section text as a raw fallback.

#### Scenario: Multiple distinct experience entries with date ranges
- **WHEN** the Experience section contains multiple entries each with an identifiable date range
- **THEN** the system parses them into separate entries, each including its raw source text

#### Scenario: Entries that cannot be confidently split
- **WHEN** the system cannot confidently split a section's content into individual entries
- **THEN** the system returns the section's content as a single raw block, includes a warning describing the low-confidence split, and does not silently drop or merge content incorrectly

### Requirement: Certifications Extraction
The system SHALL parse the Certifications section into individual entries capturing name, issuer, and date when identifiable, and SHALL preserve each entry's original text as a raw fallback.

#### Scenario: Certification entry with name, issuer, and date
- **WHEN** the Certifications section contains an entry with an identifiable name, issuer, and date
- **THEN** the system parses these fields into a structured certification entry with its raw text preserved

### Requirement: Skills Extraction
The system SHALL extract the Skills section into a flat list of individual skill strings, splitting on common delimiters such as commas, bullets, or pipes.

#### Scenario: Comma-separated skills list
- **WHEN** the Skills section contains a comma-separated list of skills
- **THEN** the system returns each skill as a separate string in the response

### Requirement: Structured JSON Response Contract
The system SHALL return, for every successfully processed request, a JSON response containing a hash, file name, personal info, experience list, education list, certifications list, skills list, and a warnings list, with empty sections represented explicitly rather than omitted.

#### Scenario: Successful parse with some empty sections
- **WHEN** a PDF is successfully processed and one or more sections (e.g. certifications) have no detected content
- **THEN** the response includes all top-level fields, with the empty sections represented as empty lists rather than omitted

### Requirement: Processing Error Handling
The system SHALL return a distinguishable error response and status for each of: invalid file type, oversized file, no text layer found, and unexpected processing failure.

#### Scenario: Unexpected processing failure
- **WHEN** an unexpected error occurs while extracting or parsing a valid PDF
- **THEN** the system returns an error response indicating a processing failure, without exposing internal implementation details
