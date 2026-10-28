// Related paths and the next recommendation after a reflection (Blueprint §3 step 16, §4.4, §4.5).
//
// Two careers are related when they share interests and key attributes, computed from the career
// content itself so new careers need no hand-written relationship lists. When choosing a related path,
// the reflection steers: attributes that felt natural pull toward paths that use them, attributes
// that felt hard push away. The user's own ranking breaks close calls.

import { ATTRIBUTE_LABELS, type AttributeId } from '../content/attributes';
import { CAREER_IDS, CAREERS, type Career, type CareerId, type Quest } from '../content/careers';
import { PREFERENCE_LABELS, type PreferenceId } from '../content/preferences';
import { litStarNumbers, rankingFor, type Character, type Reflection } from './character';
import { isConstellationComplete, nextQuest } from './constellation';

export const SIMILARITY_WEIGHTS = { interests: 0.5, attributes: 0.5 } as const;

/** How much one "felt natural" / "felt hard" attribute moves a candidate, times its requirement weight. */
export const NATURAL_PULL = 0.5;
export const HARD_PUSH = 0.5;
/** How much the user's ranking (0–1) counts when choosing a related path. */
export const RANK_PULL = 0.2;
/** How much similarity counts against a path when the user wants something different. */
export const DIFFERENT_PUSH = 0.5;

/** Weighted Jaccard over interest tags: Σ min / Σ max. */
function interestOverlap(a: Career, b: Career): number {
  const tags = new Set([...Object.keys(a.interestTags), ...Object.keys(b.interestTags)]) as Set<PreferenceId>;
  let shared = 0;
  let total = 0;
  for (const t of tags) {
    const wa = a.interestTags[t] ?? 0;
    const wb = b.interestTags[t] ?? 0;
    shared += Math.min(wa, wb);
    total += Math.max(wa, wb);
  }
  return total === 0 ? 0 : shared / total;
}

/** Σ min(weight) over primary attributes both careers share. */
function attributeOverlap(a: Career, b: Career): number {
  return a.requirements.reduce((sum, r) => {
    const other = b.requirements.find((o) => o.attribute === r.attribute);
    return sum + (other ? Math.min(r.weight, other.weight) : 0);
  }, 0);
}

/** 0–1, symmetric. */
export function careerSimilarity(a: Career, b: Career): number {
  return SIMILARITY_WEIGHTS.interests * interestOverlap(a, b) + SIMILARITY_WEIGHTS.attributes * attributeOverlap(a, b);
}

/** Other careers, closest first. */
export function relatedCareers(careerId: CareerId): { careerId: CareerId; similarity: number }[] {
  const from = CAREERS[careerId];
  return CAREER_IDS.filter((id) => id !== careerId)
    .map((id) => ({ careerId: id, similarity: careerSimilarity(from, CAREERS[id]) }))
    .sort((a, b) => b.similarity - a.similarity || a.careerId.localeCompare(b.careerId));
}

export interface PathSuggestion {
  careerId: CareerId;
  quest: Quest;
  reason: string;
}

/** Paths that can be suggested: not the current one, not Not for me, not finished. */
function candidates(character: Character, fromCareerId: CareerId): CareerId[] {
  return CAREER_IDS.filter(
    (id) =>
      id !== fromCareerId &&
      character.feedback[id]?.interest !== 'not_for_me' &&
      !isConstellationComplete(litStarNumbers(character, id)),
  );
}

function rankScores(character: Character): Map<CareerId, number> {
  const { ranked, notForMe } = rankingFor(character);
  return new Map([...ranked, ...notForMe].map((m) => [m.careerId, m.adjustedScore / 100]));
}

function requirementWeight(career: Career, attribute: AttributeId): number {
  return career.requirements.find((r) => r.attribute === attribute)?.weight ?? 0;
}

function relatedReason(from: Career, to: Career, natural: AttributeId | undefined): string {
  if (natural) return `${ATTRIBUTE_LABELS[natural]} felt natural, and ${to.name} runs on it`;
  const shared = to.requirements.filter((r) => from.requirements.some((o) => o.attribute === r.attribute));
  if (shared.length > 0) {
    const names = shared.map((r) => ATTRIBUTE_LABELS[r.attribute]).join(' and ');
    return `Uses the same ${names} as ${from.name}`;
  }
  const tag = (Object.keys(to.interestTags) as PreferenceId[]).find((t) => (from.interestTags[t] ?? 0) > 0);
  return tag ? `Also about ${PREFERENCE_LABELS[tag].toLowerCase()}` : `Close to ${from.name}`;
}

/** A nearby path, steered by what felt natural or hard in the reflection. */
export function suggestRelatedPath(
  character: Character,
  fromCareerId: CareerId,
  reflection: Pick<Reflection, 'feltNatural' | 'feltHard'> | null = null,
): PathSuggestion | null {
  const from = CAREERS[fromCareerId];
  const rank = rankScores(character);
  const natural = reflection?.feltNatural ?? [];
  const hard = reflection?.feltHard ?? [];

  const scored = candidates(character, fromCareerId).map((id) => {
    const to = CAREERS[id];
    const pulls = natural.filter((a) => requirementWeight(to, a) > 0);
    const score =
      careerSimilarity(from, to) +
      NATURAL_PULL * pulls.reduce((s, a) => s + requirementWeight(to, a), 0) -
      HARD_PUSH * hard.reduce((s, a) => s + requirementWeight(to, a), 0) +
      RANK_PULL * (rank.get(id) ?? 0);
    const strongestPull = [...pulls].sort((a, b) => requirementWeight(to, b) - requirementWeight(to, a))[0];
    return { id, score, strongestPull };
  });

  const best = scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))[0];
  if (!best) return null;
  const to = CAREERS[best.id];
  return {
    careerId: best.id,
    quest: nextQuest(to, litStarNumbers(character, best.id))!,
    reason: relatedReason(from, to, best.strongestPull),
  };
}

/** The user's best-ranked path that isn't a close neighbor of the one that didn't land. */
export function suggestDifferentPath(character: Character, fromCareerId: CareerId): PathSuggestion | null {
  const from = CAREERS[fromCareerId];
  const rank = rankScores(character);
  const best = candidates(character, fromCareerId)
    .map((id) => ({ id, score: (rank.get(id) ?? 0) - DIFFERENT_PUSH * careerSimilarity(from, CAREERS[id]) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))[0];
  if (!best) return null;
  const to = CAREERS[best.id];
  const reason = rankingFor(character).ranked.find((m) => m.careerId === best.id)?.reasons[0] ?? `Something different from ${from.name}`;
  return { careerId: best.id, quest: nextQuest(to, litStarNumbers(character, best.id))!, reason };
}

export type Reaction = 'enjoyed' | 'mixed' | 'disliked';

/** Enjoyment 4–5 (and not "No" to more) is enjoyed, 1–2 (and not "Yes" to more) is disliked, the rest is mixed. */
export function reactionTo(reflection: Pick<Reflection, 'enjoyment' | 'wouldDoMore'>): Reaction {
  if (reflection.enjoyment >= 4 && reflection.wouldDoMore !== 'no') return 'enjoyed';
  if (reflection.enjoyment <= 2 && reflection.wouldDoMore !== 'yes') return 'disliked';
  return 'mixed';
}

export type NextStep =
  | { kind: 'same_path'; careerId: CareerId; quest: Quest }
  | ({ kind: 'related_path' } & PathSuggestion)
  | ({ kind: 'different_path' } & PathSuggestion)
  | { kind: 'path_complete'; careerId: CareerId; related: PathSuggestion | null };

/**
 * What to offer after a quest on `careerId` (call with the character returned by completeQuest).
 * Enjoyed → next star on the same path. Mixed → a related path. Didn't enjoy → a different path.
 * A finished constellation always gets the path-complete moment plus a related path.
 * No reflection counts as enjoyed, and with no other path left to offer the user stays on this one.
 */
export function nextRecommendation(character: Character, careerId: CareerId, reflection: Reflection | null): NextStep {
  const lit = litStarNumbers(character, careerId);
  if (isConstellationComplete(lit)) {
    return { kind: 'path_complete', careerId, related: suggestRelatedPath(character, careerId, reflection) };
  }

  const samePath: NextStep = { kind: 'same_path', careerId, quest: nextQuest(CAREERS[careerId], lit)! };
  const reaction = reflection ? reactionTo(reflection) : 'enjoyed';
  if (reaction === 'enjoyed') return samePath;
  const suggestion =
    reaction === 'mixed' ? suggestRelatedPath(character, careerId, reflection) : suggestDifferentPath(character, careerId);
  if (!suggestion) return samePath;
  return { kind: reaction === 'mixed' ? 'related_path' : 'different_path', ...suggestion };
}
