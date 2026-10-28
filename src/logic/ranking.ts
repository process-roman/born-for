// Career matching: preference, attribute fit, work style, feedback and reasons (Pilot Content §4.2–4.8).

import { ATTRIBUTE_LABELS, type Stats } from '../content/attributes';
import { CAREER_IDS, CAREERS, type Career, type CareerId } from '../content/careers';
import { PREFERENCE_LABELS, WORK_STYLE_LABELS, type PreferenceId, type WorkStyleId } from '../content/preferences';
import { difficultyFor, type Difficulty } from './difficulty';
import { bandFor } from './stats';

export const WEIGHTS = { preference: 0.52, attributes: 0.43, workStyle: 0.05 } as const;

export const FEEDBACK_EFFECTS = {
  interested: 10,
  enjoyedQuest: 5,
  dislikedQuest: -10,
} as const;

export type PathInterest = 'interested' | 'unsure' | 'not_for_me';

export interface CareerFeedback {
  interest?: PathInterest;
  /** Enjoyment (1–5) from each reflected quest on this path. */
  questEnjoyment?: number[];
}

export type FeedbackMap = Partial<Record<CareerId, CareerFeedback>>;

export interface MatchInput {
  stats: Stats;
  enjoy: readonly PreferenceId[];
  workStyle: WorkStyleId;
  feedback?: FeedbackMap;
}

export interface CareerMatch {
  careerId: CareerId;
  /** Base match score, 0–100. Internal only; never shown to users. */
  score: number;
  /** Base score plus feedback adjustments; this is what ranking sorts by. */
  adjustedScore: number;
  preference: number;
  attributeFit: number;
  workStyle: number;
  difficulty: Difficulty;
  reasons: string[];
}

export interface Ranking {
  /** Ranked careers; the first three are the top paths. */
  ranked: CareerMatch[];
  /** Careers marked Not for me, kept at the bottom and never in the top 3. */
  notForMe: CareerMatch[];
}

/** P = min(1, (w1 + 0.5 × w2) / 1.5) over the career's weights for the user's picks. */
export function preferenceScore(career: Career, enjoy: readonly PreferenceId[]): number {
  const [w1 = 0, w2 = 0] = enjoy.map((p) => career.interestTags[p] ?? 0).sort((a, b) => b - a);
  return Math.min(1, (w1 + 0.5 * w2) / 1.5);
}

/** A = Σ weight × min(current / required, 1). */
export function attributeFit(career: Career, stats: Stats): number {
  return career.requirements.reduce((sum, r) => sum + r.weight * Math.min(stats[r.attribute] / r.required, 1), 0);
}

export function workStyleScore(career: Career, workStyle: WorkStyleId): number {
  if (career.workStyles.includes(workStyle)) return 1;
  return workStyle === 'unsure' ? 0.5 : 0;
}

export function feedbackAdjustment(feedback: CareerFeedback | undefined): number {
  if (!feedback) return 0;
  let adjustment = feedback.interest === 'interested' ? FEEDBACK_EFFECTS.interested : 0;
  for (const enjoyment of feedback.questEnjoyment ?? []) {
    if (enjoyment >= 4) adjustment += FEEDBACK_EFFECTS.enjoyedQuest;
    else if (enjoyment <= 2) adjustment += FEEDBACK_EFFECTS.dislikedQuest;
  }
  return adjustment;
}

/** 2–3 reasons: preference, strength, then growth area or work-style fit. */
export function reasonsFor(career: Career, input: MatchInput, difficulty: Difficulty): string[] {
  const reasons: string[] = [];

  // Ties between equally weighted tags go to the user's earlier pick.
  let bestPref: PreferenceId | undefined;
  for (const p of input.enjoy) {
    const w = career.interestTags[p] ?? 0;
    if (w > 0 && (bestPref === undefined || w > (career.interestTags[bestPref] ?? 0))) bestPref = p;
  }
  if (bestPref) reasons.push(`You enjoy ${lowerFirst(PREFERENCE_LABELS[bestPref])}`);

  const strengths = career.requirements
    .filter((r) => input.stats[r.attribute] >= r.required)
    .sort((a, b) => input.stats[b.attribute] - input.stats[a.attribute]);
  const strength = strengths[0];
  if (strength) {
    const value = input.stats[strength.attribute];
    reasons.push(`Your ${ATTRIBUTE_LABELS[strength.attribute]} is ${bandFor(value)}`);
  }

  const growth = difficulty.keyGaps[0];
  const workFits = career.workStyles.includes(input.workStyle);
  const workReason = `Fits how you like to work: ${lowerFirst(WORK_STYLE_LABELS[input.workStyle])}`;
  if (growth) {
    reasons.push(`${ATTRIBUTE_LABELS[growth.attribute]} needs some training`);
    // Not in the spec's order: keeps a card at 2 reasons when it has no preference or strength reason.
    if (reasons.length < 2 && workFits) reasons.push(workReason);
  } else if (workFits) {
    reasons.push(workReason);
  }

  return reasons;
}

export function matchCareer(career: Career, input: MatchInput): CareerMatch {
  const preference = preferenceScore(career, input.enjoy);
  const fit = attributeFit(career, input.stats);
  const work = workStyleScore(career, input.workStyle);
  const score = 100 * (WEIGHTS.preference * preference + WEIGHTS.attributes * fit + WEIGHTS.workStyle * work);
  const difficulty = difficultyFor(career, input.stats);
  return {
    careerId: career.id,
    score,
    adjustedScore: score + feedbackAdjustment(input.feedback?.[career.id]),
    preference,
    attributeFit: fit,
    workStyle: work,
    difficulty,
    reasons: reasonsFor(career, input, difficulty),
  };
}

const EPSILON = 1e-9;

/** Sort by score, then preference, then attribute fit, then career name. */
export function compareMatches(a: CareerMatch, b: CareerMatch): number {
  if (Math.abs(a.adjustedScore - b.adjustedScore) > EPSILON) return b.adjustedScore - a.adjustedScore;
  if (Math.abs(a.preference - b.preference) > EPSILON) return b.preference - a.preference;
  if (Math.abs(a.attributeFit - b.attributeFit) > EPSILON) return b.attributeFit - a.attributeFit;
  return CAREERS[a.careerId].name.localeCompare(CAREERS[b.careerId].name);
}

export function rankCareers(input: MatchInput, careers: readonly Career[] = CAREER_IDS.map((id) => CAREERS[id])): Ranking {
  const matches = careers.map((c) => matchCareer(c, input)).sort(compareMatches);
  const isNotForMe = (m: CareerMatch) => input.feedback?.[m.careerId]?.interest === 'not_for_me';
  return {
    ranked: matches.filter((m) => !isNotForMe(m)),
    notForMe: matches.filter(isNotForMe),
  };
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
