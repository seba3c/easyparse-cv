import type { FileHash } from "../value-objects/file-hash";

export interface FileHasherPort {
  hash(fileBytes: Buffer): FileHash;
}
