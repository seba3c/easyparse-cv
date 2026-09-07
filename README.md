# easyparse-cv

Drop in a CV PDF, get structured data back — entirely locally, no third-party services.

**Live demo:** [easyparse-cv.vercel.app](https://easyparse-cv.vercel.app/)

## Purpose

Many company job portals still make candidates retype their entire work history by hand, even after they've already uploaded a CV. This project is a small demonstration of how easy it is to automate that: upload a CV PDF and it's parsed locally into structured JSON (personal info, experience, education, certifications, skills) that could directly auto-fill a job application form instead of leaving that work to the candidate.

## Tech Stack & Methodology

- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS 4 + shadcn/ui, `pdfjs-dist` for local-only PDF text extraction, Vitest for tests.
- **Architecture:** Hexagonal/DDD-lite — domain layer (value objects, parsing services, ports), application layer (use cases), infrastructure adapters (PDF extractor, hasher), and a thin Next.js presentation layer.
- **Methodology:** Built with Spec-Driven Development (SDD) via OpenSpec — every change goes through proposal → design → specs → tasks → implementation → archive (see `openspec/changes/archive/`).
