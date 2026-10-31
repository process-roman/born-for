// Difficulty from the gap between current stats and a career's requirements (Pilot Content §4.6),
// plus age: a long route into a career costs more when you start later. Age never closes a door;
// it raises the level and says why.

import type { AttributeId, Stats } from '../content/attributes';
import { CAREER_TRAINING, type CareerTraining } from '../content/careerTraining';
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
/** From this age, a long route in (see below) makes a career harder. */
export const LATE_START_AGE = 25;
/** Training of at least this many years from scratch adds one level after LATE_START_AGE… */
export const LONG_TRAINING_YEARS = 3;
/** …and at least this many adds two. */
export const VERY_LONG_TRAINING_YEARS = 7;

export interface AttributeGap {
  attribute: AttributeId;
  gap: number;
}

export interface Difficulty {
  level: DifficultyLevel;
  label: string;
  /** Key gaps, largest first: the attributes that need training. */
  keyGaps: AttributeGap[];
  /** Why age made it harder, e.g. "About 3–5 years of study to qualify from scratch…". Null otherwise. */
  ageNote: string | null;
}

function years(range: readonly [number, number]): string {
  const one = (y: number) => (y < 1 ? `${Math.round(y * 12)} months` : String(y));
  const [min, max] = range;
  if (min === max) return min < 1 ? one(min) : `${min} ${min === 1 ? 'year' : 'years'}`;
  return max < 1 ? `${one(min)}–${one(max)}` : `${one(min)}–${max} years`;
}

/** Extra levels and the reason, from the user's age and the career's route in. */
export function ageEffect(training: CareerTraining, age: number | null): { bump: number; longShot: boolean; note: string | null } {
  if (age === null) return { bump: 0, longShot: false, note: null };
  if (training.usualStartBy !== undefined && age > training.usualStartBy) {
    return { bump: 0, longShot: true, note: `Most people start before ${training.usualStartBy}. At ${age} it’s a long shot, and the careers around it stay open.` };
  }
  const [min] = training.years;
  if (age < LATE_START_AGE || min < LONG_TRAINING_YEARS) return { bump: 0, longShot: false, note: null };
  return {
    bump: min >= VERY_LONG_TRAINING_YEARS ? 2 : 1,
    longShot: false,
    note: `About ${years(training.years)} of study to qualify from scratch, less with a related degree. Harder to fit in at ${age}, still possible.`,
  };
}

/** `age` is optional: without it, difficulty comes from stats alone. */
export function difficultyFor(career: Career, stats: Stats, age: number | null = null): Difficulty {
  const gaps = career.requirements.map((r) => ({ attribute: r.attribute, gap: r.required - stats[r.attribute] }));
  const keyGaps = gaps.filter((g) => g.gap > KEY_GAP).sort((a, b) => b.gap - a.gap);
  const fromStats: DifficultyLevel =
    keyGaps.length >= 2 || gaps.some((g) => g.gap > LARGE_GAP) ? 3 : keyGaps.length === 1 ? 2 : 1;
  const effect = ageEffect(CAREER_TRAINING[career.id], age);
  const level = (effect.longShot ? 3 : Math.min(3, fromStats + effect.bump)) as DifficultyLevel;
  return { level, label: DIFFICULTY_LABELS[level], keyGaps, ageNote: effect.note };
}
