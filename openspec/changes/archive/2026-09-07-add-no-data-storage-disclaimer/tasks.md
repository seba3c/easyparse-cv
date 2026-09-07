## 1. Data Handling Disclaimer

- [x] 1.1 Add a small-print disclaimer inline with the "Parse CV" button in `src/components/cv/cv-upload-form.tsx` (text left-aligned, button right-aligned, same row), stating that uploaded CV data is processed in memory for the request only and is never stored, logged, or sent to any third party, styled smaller than the surrounding body text — verify by reading the component that the text and button share one flex row and the text uses a smaller font size than the intro paragraph above it.
- [x] 1.2 Run the app locally and confirm in the browser that the disclaimer and button render on the same row (text left, button right) on page load without any interaction, reads clearly and doesn't overlap the button at desktop, tablet, and mobile widths.
