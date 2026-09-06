import { describe, it, expect } from "vitest";
import { NodeCryptoHasherAdapter } from "./node-crypto-hasher-adapter";

describe("NodeCryptoHasherAdapter", () => {
  it("hashes the same bytes to the same value deterministically", () => {
    const hasher = new NodeCryptoHasherAdapter();
    const bytes = Buffer.from("hello world");

    expect(hasher.hash(bytes)).toBe(hasher.hash(Buffer.from("hello world")));
  });

  it("hashes different bytes to different values", () => {
    const hasher = new NodeCryptoHasherAdapter();
    expect(hasher.hash(Buffer.from("a"))).not.toBe(hasher.hash(Buffer.from("b")));
  });

  it("produces a 64-character hex digest", () => {
    const hasher = new NodeCryptoHasherAdapter();
    expect(hasher.hash(Buffer.from("hello"))).toMatch(/^[0-9a-f]{64}$/);
  });
});
