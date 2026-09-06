const SHA256_HEX_PATTERN = /^[0-9a-f]{64}$/;

export type FileHash = string & { readonly __brand: "FileHash" };

export function createFileHash(hex: string): FileHash {
  const normalized = hex.trim().toLowerCase();
  if (!SHA256_HEX_PATTERN.test(normalized)) {
    throw new Error(
      `Invalid file hash: expected a 64-character hex SHA-256 digest, got "${hex}"`,
    );
  }
  return normalized as FileHash;
}
