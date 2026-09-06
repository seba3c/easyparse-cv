import type { FileHash } from "../value-objects/file-hash";
import type { ParsedCvResult } from "../value-objects/parsed-cv-result";

/**
 * Seam for a future caching/persistence layer keyed by file hash.
 * No adapter implements this in v1 - see design.md - Decisions.
 */
export interface CvResultCachePort {
  get(hash: FileHash): Promise<ParsedCvResult | null>;
  set(hash: FileHash, result: ParsedCvResult): Promise<void>;
}
