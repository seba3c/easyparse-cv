import { createPersonalInfo, type Links, type PersonalInfo } from "../value-objects/personal-info";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_CANDIDATE_REGEX = /\+?\(?\d[\d\s().-]{6,}\d/g;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s,)]+/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s,)]+/i;
const URL_REGEX = /https?:\/\/[^\s,)]+/;
const URL_REGEX_GLOBAL = /https?:\/\/[^\s,)]+/gi;
const NAME_LIKE_REGEX = /^[\p{L}\s.'-]+$/u;

function findEmail(lines: readonly string[]): string | null {
  for (const line of lines) {
    const match = EMAIL_REGEX.exec(line);
    if (match) return match[0].trim();
  }
  return null;
}

function findPhoneInLine(line: string): string | null {
  const matches = line.match(PHONE_CANDIDATE_REGEX) ?? [];
  for (const candidate of matches) {
    const digitsOnly = candidate.replace(/\D/g, "");
    if (digitsOnly.length >= 9 && digitsOnly.length <= 15) {
      return candidate.trim();
    }
  }
  return null;
}

function findPhone(lines: readonly string[]): string | null {
  for (const line of lines) {
    const match = findPhoneInLine(line);
    if (match) return match;
  }
  return null;
}

function extractLinks(allLines: readonly string[]): Links {
  const fullText = allLines.join("\n");
  const linkedin = LINKEDIN_REGEX.exec(fullText)?.[0]?.trim() ?? null;
  const github = GITHUB_REGEX.exec(fullText)?.[0]?.trim() ?? null;
  const other = Array.from(new Set(Array.from(fullText.matchAll(URL_REGEX_GLOBAL), (m) => m[0].trim()))).filter(
    (url) => url !== linkedin && url !== github,
  );
  return { linkedin, github, other };
}

/**
 * Extracts contact details (email/phone/links) from the whole document -
 * they sometimes appear outside the pre-header block (e.g. in a footer) -
 * and name/location from the personal-info lines that precede the first
 * recognized section header.
 */
export function extractPersonalInfo(params: {
  allLines: readonly string[];
  personalInfoLines: readonly string[];
}): PersonalInfo {
  const { allLines, personalInfoLines } = params;

  const email = findEmail(allLines);
  const phone = findPhone(allLines);
  const links = extractLinks(allLines);

  const candidateLines = personalInfoLines
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !EMAIL_REGEX.test(line) &&
        !URL_REGEX.test(line) &&
        !LINKEDIN_REGEX.test(line) &&
        !GITHUB_REGEX.test(line) &&
        !findPhoneInLine(line),
    );

  const fullName =
    candidateLines.find((line) => line.length <= 60 && NAME_LIKE_REGEX.test(line)) ?? null;
  const location = candidateLines.find((line) => line !== fullName) ?? null;

  return createPersonalInfo({ fullName, email, phone, location, links });
}
