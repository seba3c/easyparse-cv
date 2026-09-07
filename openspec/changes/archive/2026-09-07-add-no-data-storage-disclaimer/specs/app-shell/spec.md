## ADDED Requirements

### Requirement: Data Handling Disclaimer
The system SHALL visibly disclose that uploaded CV data is processed only for the duration of the request and is never stored, logged, or shared with any third party.

#### Scenario: User loads the app
- **WHEN** a user loads the app for the first time in a session
- **THEN** a disclaimer stating that uploaded CV data is not stored, logged, or sent to any third party is visible without requiring any additional interaction

#### Scenario: User reads the disclaimer before uploading
- **WHEN** a user views the disclaimer prior to uploading a CV
- **THEN** the disclaimer text makes clear that the uploaded file and its extracted data exist only in memory for that request and are discarded afterward
