// Confirmed and current stats (Blueprint §8, Pilot Content §4.1).

import { ATTRIBUTE_IDS, BANDS, STAT_MAX, type AttributeId, type Band, type Stats } from '../content/attributes';
import { getSignStats, type SignId } from '../content/signs';

export type PollAnswer = 'yes' | 'sometimes' | 'no' | 'skip';

export type PollAnswers = Partial<Record<AttributeId, PollAnswer>>;

export const ANSWER_TARGETS: Record<Exclude<PollAnswer, 'skip'>, number> = {
  yes: 85,
  sometimes: 55,
  no: 25,
};

/**
 * round(0.3 × sign + 0.7 × target), computed in integer tenths and rounded half to even
 * so .5 cases match the documented persona values (e.g. Liam's Analytical 74.5 → 74).
 */
export function confirmValue(signValue: number, answer: PollAnswer): number {
  if (answer === 'skip') return signValue;
  const tenths = 3 * signValue + 7 * ANSWER_TARGETS[answer];
  const whole = Math.floor(tenths / 10);
  const rest = tenths % 10;
  if (rest > 5) return whole + 1;
  if (rest < 5) return whole;
  return whole % 2 === 0 ? whole : whole + 1;
}

/** Unanswered attributes count as Skip and keep the sign's value. */
export function confirmStats(sign: SignId, answers: PollAnswers): Stats {
  const signStats = getSignStats(sign);
  return mapStats((a) => confirmValue(signStats[a], answers[a] ?? 'skip'));
}

export function currentStats(confirmed: Stats, earned: Stats): Stats {
  return mapStats((a) => Math.min(STAT_MAX, confirmed[a] + earned[a]));
}

export function bandFor(value: number): Band {
  return (BANDS.find((b) => value >= b.min) ?? BANDS[BANDS.length - 1]!).band;
}

export function mapStats(fn: (attribute: AttributeId) => number): Stats {
  return Object.fromEntries(ATTRIBUTE_IDS.map((a) => [a, fn(a)])) as Stats;
}
