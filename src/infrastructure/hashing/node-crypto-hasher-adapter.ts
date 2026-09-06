import { createHash } from "node:crypto";
import type { FileHasherPort } from "../../domain/ports/file-hasher-port";
import { createFileHash, type FileHash } from "../../domain/value-objects/file-hash";

export class NodeCryptoHasherAdapter implements FileHasherPort {
  hash(fileBytes: Buffer): FileHash {
    const digest = createHash("sha256").update(fileBytes).digest("hex");
    return createFileHash(digest);
  }
}
