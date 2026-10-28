// Constellation unlock rules (Blueprint §5).
//
// Stars light in order within a tier (1→2 for Taste, 3→4 for Try). The Test star needs at least one
// Try star. The spec doesn't say when Try opens; since the first quest is always a Taste quest,
// Try opens once any Taste star is lit.

import type { Career, Quest, QuestTier, StarNumber } from '../content/careers';

export const STARS_PER_PATH = 5;

const TIER_ORDER: Record<QuestTier, number> = { taste: 0, try: 1, test: 2 };

export function isStarAvailable(star: StarNumber, lit: readonly StarNumber[]): boolean {
  if (lit.includes(star)) return false;
  const has = (s: StarNumber) => lit.includes(s);
  switch (star) {
    case 1:
      return true;
    case 2:
      return has(1);
    case 3:
      return has(1) || has(2);
    case 4:
      return has(3);
    case 5:
      return has(3) || has(4);
  }
}

export function availableQuests(career: Career, lit: readonly StarNumber[]): Quest[] {
  return career.quests.filter((q) => isStarAvailable(q.star, lit));
}

/** The next star to recommend on this path, or null when the constellation is complete. */
export function nextQuest(career: Career, lit: readonly StarNumber[]): Quest | null {
  return availableQuests(career, lit)[0] ?? null;
}

/** For "Too hard": an available quest on the same path in a lower tier, if any. */
export function easierQuest(career: Career, lit: readonly StarNumber[], current: Quest): Quest | null {
  return availableQuests(career, lit).find((q) => TIER_ORDER[q.tier] < TIER_ORDER[current.tier]) ?? null;
}

/** A line draws only when both of its stars are lit. */
export function litLines(career: Career, lit: readonly StarNumber[]): [StarNumber, StarNumber][] {
  return career.constellation.lines.filter(([a, b]) => lit.includes(a) && lit.includes(b));
}

export function isConstellationComplete(lit: readonly StarNumber[]): boolean {
  return new Set(lit).size === STARS_PER_PATH;
}
