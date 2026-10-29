// How related two careers are: shared worlds and shared key traits (Pilot Content §4.2).
// Used for "close to a job you picked" in ranking and for related-path suggestions.

import type { Career } from '../content/careers';

export const SIMILARITY_WEIGHTS = { worlds: 0.5, attributes: 0.5 } as const;

/** Jaccard over worlds: shared / all. */
function worldOverlap(a: Career, b: Career): number {
  const all = new Set([...a.worlds, ...b.worlds]);
  const shared = a.worlds.filter((w) => b.worlds.includes(w)).length;
  return all.size === 0 ? 0 : shared / all.size;
}

/** Σ min(weight) over key traits both careers share. */
function attributeOverlap(a: Career, b: Career): number {
  return a.requirements.reduce((sum, r) => {
    const other = b.requirements.find((o) => o.attribute === r.attribute);
    return sum + (other ? Math.min(r.weight, other.weight) : 0);
  }, 0);
}

/** 0–1, symmetric. */
export function careerSimilarity(a: Career, b: Career): number {
  return SIMILARITY_WEIGHTS.worlds * worldOverlap(a, b) + SIMILARITY_WEIGHTS.attributes * attributeOverlap(a, b);
}
