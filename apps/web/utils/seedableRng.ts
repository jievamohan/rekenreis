/**
 * Mulberry32 - fast deterministic PRNG.
 * Same seed always produces same sequence.
 */
export function createSeededRng(seed: number): () => number {
  return function mulberry32() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
