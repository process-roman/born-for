// Difficulty from the gap between current stats and a career's requirements (Pilot Content §4.6).

import type { AttributeId, Stats } from '../content/attributes';
import type { Career } from '../content/careers';

export type DifficultyLevel = 1 | 2 | 3;

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: 'Natural fit',
  2: 'Some training',
  3: 'Challenging but achievable',
};

/** A gap above this counts as a key gap. */
export const KEY_GAP = 10;
/** Any single gap above this makes a career Challenging on its own. */
export const LARGE_GAP = 30;

export interface AttributeGap {
  attribute: AttributeId;
  gap: number;
}

export interface Difficulty {
  level: DifficultyLevel;
  label: string;
  /** Key gaps, largest first: the attributes that need training. */
  keyGaps: AttributeGap[];
}

export function difficultyFor(career: Career, stats: Stats): Difficulty {
  const gaps = career.requirements.map((r) => ({ attribute: r.attribute, gap: r.required - stats[r.attribute] }));
  const keyGaps = gaps.filter((g) => g.gap > KEY_GAP).sort((a, b) => b.gap - a.gap);
  const level: DifficultyLevel =
    keyGaps.length >= 2 || gaps.some((g) => g.gap > LARGE_GAP) ? 3 : keyGaps.length === 1 ? 2 : 1;
  return { level, label: DIFFICULTY_LABELS[level], keyGaps };
}
