## MODIFIED Requirements

### Requirement: Section Segmentation
The system SHALL segment extracted text into the recognized sections Personal Info, Summary, Experience, Education, Certifications, and Skills, recognizing section headers in both English and Spanish, including regional phrasing variants of a recognized section (e.g. "Herramientas" or "Tools" as a Skills header).

#### Scenario: CV with English section headers
- **WHEN** the extracted text contains English headers such as "Experience", "Education", "Skills", or "Certifications"
- **THEN** the corresponding sections are correctly identified and their content grouped under them

#### Scenario: CV with Spanish section headers
- **WHEN** the extracted text contains Spanish headers such as "Experiencia", "Educación", "Habilidades", or "Certificaciones"
- **THEN** the corresponding sections are correctly identified and their content grouped under them

#### Scenario: CV missing a recognized section
- **WHEN** the extracted text has no content matching a recognized section (e.g. no certifications)
- **THEN** the response returns that section as empty rather than raising an error

#### Scenario: CV using a regional header variant for Skills
- **WHEN** the extracted text contains a header such as "Herramientas" (Spanish) or "Tools" (English) instead of "Skills"/"Habilidades"
- **THEN** the content under that header is grouped into the Skills section

#### Scenario: CV containing a header for a section with no structured field
- **WHEN** the extracted text contains an achievements/awards-style header (e.g. "Logros y Distinciones", "Logros Destacados", "Awards", "Achievements", "Distinctions")
- **THEN** the content following that header is excluded from the section that preceded it (it is not appended to Education or Experience) and is not treated as Personal Info

### Requirement: Structured JSON Response Contract
The system SHALL return, for every successfully processed request, a JSON response containing a hash, file name, personal info, summary, experience list, education list, certifications list, skills list, and a warnings list, with empty sections represented explicitly rather than omitted, and the `summary` field represented as null rather than omitted when no summary was found.

#### Scenario: Successful parse with some empty sections
- **WHEN** a PDF is successfully processed and one or more sections (e.g. certifications) have no detected content
- **THEN** the response includes all top-level fields, with the empty sections represented as empty lists rather than omitted

#### Scenario: Successful parse without a summary section
- **WHEN** a PDF has no recognized Summary/Profile header
- **THEN** the response includes a `summary` field with value null rather than omitting the field

## ADDED Requirements

### Requirement: Header/Summary Extraction
The system SHALL recognize a Summary/Profile header (English: "Summary", "Professional Summary", "Profile", "About Me", "Objective"; Spanish: "Perfil Profesional", "Resumen", "Resumen Profesional", "Objetivo", "Perfil", "Acerca de Mí", "Sobre Mí") as a distinct Summary section, and SHALL return the text following that header as the response's `summary` field, excluding it from Personal Info.

#### Scenario: CV with an explicit Summary/Profile header
- **WHEN** the extracted text contains a recognized Summary/Profile header followed by one or more lines of narrative text (e.g. a professional profile paragraph, potentially including a forward-looking statement about a desired next role)
- **THEN** the response's `summary` field contains that text, and none of it appears among the Personal Info candidate lines

#### Scenario: CV without a Summary/Profile header
- **WHEN** the extracted text contains no recognized Summary/Profile header
- **THEN** the response's `summary` field is null and no error is raised

### Requirement: Low-Confidence Segmentation Warning
The system SHALL detect when a line is entirely upper-case, contains a recognized section-header phrase, and also contains other upper-case text beyond that phrase — a signal that two visually separate all-caps headers (e.g. from adjacent columns of a multi-column CV) were concatenated onto one extracted line, producing an unreliable reading order — and SHALL include a warning describing that section boundaries for the document may be unreliable, in addition to (not instead of) segmenting the document using its normal header-matching rules. The system SHALL NOT raise this warning merely because a line of ordinary prose happens to mention a header word.

#### Scenario: Two all-caps headers concatenated onto one line
- **WHEN** a line is entirely upper-case and contains a recognized section-header phrase (e.g. "EXPERIENCIA PROFESIONAL") along with other upper-case text that is not part of that phrase (e.g. "CONTACTO EXPERIENCIA PROFESIONAL")
- **THEN** the response's `warnings` list includes a warning indicating that section boundaries may be unreliable for this document, and that line is still treated as ordinary content of whichever section was active (the embedded phrase alone does not create a new section boundary)

#### Scenario: Ordinary prose mentions a header word
- **WHEN** a line of normal-case prose contains a recognized header word as part of a sentence (e.g. "5 years of experience in backend systems")
- **THEN** no low-confidence segmentation warning is added for that line

#### Scenario: No concatenated headers found
- **WHEN** every recognized header phrase in the extracted text appears alone on its own line
- **THEN** no low-confidence segmentation warning is added to the response
