// Career matching, direction first: interest (picked jobs, chosen worlds), trait fit, work style,
// feedback, reasons and result groups (Pilot Content §4.2–4.8).

import { ATTRIBUTE_IDS, ATTRIBUTE_LABELS, type AttributeId, type Stats } from '../content/attributes';
import { CAREER_IDS, CAREERS, type Career, type CareerId } from '../content/careers';
import { WORK_STYLE_LABELS, type WorkStyleId } from '../content/preferences';
import { WORLDS, type WorldId } from '../content/worlds';
import { difficultyFor, type Difficulty } from './difficulty';
import { careerSimilarity } from './similarity';
import { bandFor } from './stats';

export const WEIGHTS = { interest: 0.5, attributes: 0.4, workStyle: 0.1 } as const;

export const INTEREST = { picked: 1, inWorld: 0.6, nearPickFactor: 0.5 } as const;

/** Below this similarity a career doesn't count as "close to" a picked job. */
export const NEAR_PICK_MIN = 0.4;

/** Wildcards are careers outside the user's worlds where traits fit at least this well… */
export const WILDCARD_MIN_FIT = 0.9;
/** …and whose main trait is one of the user's strongest few. */
export const WILDCARD_TOP_TRAITS = 4;
export const MAX_WILDCARDS = 2;

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
  /** "Which worlds pull you?" */
  worlds: readonly WorldId[];
  /** "Any of these catch your eye?" */
  picks: readonly CareerId[];
  workStyle: WorkStyleId;
  feedback?: FeedbackMap;
}

export type MatchSource = 'picked' | 'world' | 'near_pick' | 'other';

export interface CareerMatch {
  careerId: CareerId;
  /** Base match score, 0–100. Internal only; never shown to users. */
  score: number;
  /** Base score plus feedback adjustments; this is what ranking sorts by. */
  adjustedScore: number;
  interest: number;
  source: MatchSource;
  attributeFit: number;
  /** How much the career runs on the user's strongest traits (Σ weight × stat / 100); breaks ties. */
  alignment: number;
  workStyle: number;
  difficulty: Difficulty;
  reasons: string[];
}

export interface Ranking {
  /** Ranked careers; the first is the top path. */
  ranked: CareerMatch[];
  /** Careers marked Not for me, kept at the bottom and never at the top. */
  notForMe: CareerMatch[];
}

/** The closest picked job to a career, and how close it is. */
function nearestPick(career: Career, picks: readonly CareerId[]): { careerId: CareerId; similarity: number } | null {
  let best: { careerId: CareerId; similarity: number } | null = null;
  for (const id of picks) {
    if (id === career.id) continue;
    const similarity = careerSimilarity(career, CAREERS[id]);
    if (similarity >= NEAR_PICK_MIN && (!best || similarity > best.similarity)) best = { careerId: id, similarity };
  }
  return best;
}

/** I: picked → 1, in a chosen world → 0.6, otherwise 0.5 × similarity to the closest pick. */
export function interestScore(career: Career, worlds: readonly WorldId[], picks: readonly CareerId[]): { interest: number; source: MatchSource } {
  if (picks.includes(career.id)) return { interest: INTEREST.picked, source: 'picked' };
  if (career.worlds.some((w) => worlds.includes(w))) return { interest: INTEREST.inWorld, source: 'world' };
  const near = nearestPick(career, picks);
  if (near) return { interest: INTEREST.nearPickFactor * near.similarity, source: 'near_pick' };
  return { interest: 0, source: 'other' };
}

/** A = Σ weight × min(current / required, 1). */
export function attributeFit(career: Career, stats: Stats): number {
  return career.requirements.reduce((sum, r) => sum + r.weight * Math.min(stats[r.attribute] / r.required, 1), 0);
}

export function strengthAlignment(career: Career, stats: Stats): number {
  return career.requirements.reduce((sum, r) => sum + (r.weight * stats[r.attribute]) / 100, 0);
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

function interestReason(career: Career, input: MatchInput, source: MatchSource): string | null {
  switch (source) {
    case 'picked':
      return 'You picked this';
    case 'world': {
      const world = career.worlds.find((w) => input.worlds.includes(w))!;
      return `In a world you chose: ${WORLDS[world].name}`;
    }
    case 'near_pick': {
      const near = nearestPick(career, input.picks);
      return near ? `Close to ${CAREERS[near.careerId].name}` : null;
    }
    case 'other':
      return null;
  }
}

/** 2–3 reasons: interest, strength, then growth area or work-style fit. */
export function reasonsFor(career: Career, input: MatchInput, difficulty: Difficulty, source: MatchSource): string[] {
  const reasons: string[] = [];
  const interest = interestReason(career, input, source);
  if (interest) reasons.push(interest);

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
    // Keeps a card at 2 reasons when it has no interest or strength reason.
    if (reasons.length < 2 && workFits) reasons.push(workReason);
  } else if (workFits) {
    reasons.push(workReason);
  }

  return reasons;
}

export function matchCareer(career: Career, input: MatchInput): CareerMatch {
  const { interest, source } = interestScore(career, input.worlds, input.picks);
  const fit = attributeFit(career, input.stats);
  const work = workStyleScore(career, input.workStyle);
  const score = 100 * (WEIGHTS.interest * interest + WEIGHTS.attributes * fit + WEIGHTS.workStyle * work);
  const difficulty = difficultyFor(career, input.stats);
  return {
    careerId: career.id,
    score,
    adjustedScore: score + feedbackAdjustment(input.feedback?.[career.id]),
    interest,
    source,
    attributeFit: fit,
    alignment: strengthAlignment(career, input.stats),
    workStyle: work,
    difficulty,
    reasons: reasonsFor(career, input, difficulty, source),
  };
}

const EPSILON = 1e-9;

/** Sort by score, then interest, then attribute fit, then how much it uses your strongest traits, then name. */
export function compareMatches(a: CareerMatch, b: CareerMatch): number {
  if (Math.abs(a.adjustedScore - b.adjustedScore) > EPSILON) return b.adjustedScore - a.adjustedScore;
  if (Math.abs(a.interest - b.interest) > EPSILON) return b.interest - a.interest;
  if (Math.abs(a.attributeFit - b.attributeFit) > EPSILON) return b.attributeFit - a.attributeFit;
  if (Math.abs(a.alignment - b.alignment) > EPSILON) return b.alignment - a.alignment;
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

export interface MatchGroups {
  /** Jobs the user picked, by score. */
  picks: CareerMatch[];
  /** Other careers in the user's chosen worlds, by score. */
  inWorlds: CareerMatch[];
  /** Up to two careers outside the user's worlds where their traits fit very well. */
  wildcards: CareerMatch[];
}

/** The user's strongest traits right now, strongest first (ties keep trait order). */
export function topTraits(stats: Stats, count: number): AttributeId[] {
  return [...ATTRIBUTE_IDS].sort((a, b) => stats[b] - stats[a]).slice(0, count);
}

/** The career's most important key trait. */
function mainTrait(career: Career): AttributeId {
  return [...career.requirements].sort((a, b) => b.weight - a.weight)[0]!.attribute;
}

/**
 * Career reveal and Explore show these three groups (Pilot Content §4.5b). Wildcards are outside the
 * user's worlds, fit their traits well, and run on one of their strongest traits; that trait is the reason shown.
 */
export function groupMatches(ranking: Ranking, stats: Stats): MatchGroups {
  const { ranked } = ranking;
  const strongest = topTraits(stats, WILDCARD_TOP_TRAITS);
  const wildcards = ranked
    .filter((m) => (m.source === 'near_pick' || m.source === 'other') && m.attributeFit >= WILDCARD_MIN_FIT)
    .filter((m) => strongest.includes(mainTrait(CAREERS[m.careerId])))
    .sort((a, b) => b.alignment - a.alignment || compareMatches(a, b))
    .slice(0, MAX_WILDCARDS)
    .map((m) => {
      const trait = mainTrait(CAREERS[m.careerId]);
      const rest = m.reasons.filter((r) => !r.startsWith('Close to') && !r.startsWith(`Your ${ATTRIBUTE_LABELS[trait]} is`));
      return { ...m, reasons: [`Runs on your ${ATTRIBUTE_LABELS[trait]}, one of your strongest traits`, ...rest].slice(0, 3) };
    });
  return {
    picks: ranked.filter((m) => m.source === 'picked'),
    inWorlds: ranked.filter((m) => m.source === 'world'),
    wildcards,
  };
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
