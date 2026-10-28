// Character state and the Choose → Try → Reflect → Level up loop. All functions are pure.

import { ATTRIBUTE_IDS, zeroStats, type AttributeId, type Stats } from '../content/attributes';
import { getQuest, type CareerId, type StarNumber } from '../content/careers';
import type { IntentId, PreferenceId, WorkStyleId } from '../content/preferences';
import type { SignId } from '../content/signs';
import { isConstellationComplete, isStarAvailable } from './constellation';
import { rankCareers, type FeedbackMap, type PathInterest, type Ranking } from './ranking';
import { confirmStats, currentStats, mapStats, type PollAnswers } from './stats';
import { titleFor, type Title } from './titles';
import { attributeXpForQuest, levelForXp, questXp } from './xp';

export type WouldDoMore = 'yes' | 'maybe' | 'no';

export interface Reflection {
  /** 5-emoji scale, 1–5. */
  enjoyment: 1 | 2 | 3 | 4 | 5;
  wouldDoMore: WouldDoMore;
  feltNatural: AttributeId[];
  feltHard: AttributeId[];
}

export interface LitStar {
  star: StarNumber;
  completedAt: string;
  reflection: Reflection | null;
}

export interface Character {
  sign: SignId;
  intent: IntentId | null;
  enjoy: PreferenceId[];
  workStyle: WorkStyleId;
  /** Confirmed stats from the first poll, kept for "Then vs now". */
  dayOne: Stats;
  /** Confirmed base; recalibration replaces this only. */
  confirmed: Stats;
  /** Earned attribute XP; never reset. */
  earned: Stats;
  totalXp: number;
  stars: Partial<Record<CareerId, LitStar[]>>;
  feedback: FeedbackMap;
}

export interface OnboardingInput {
  intent?: IntentId;
  sign: SignId;
  answers: PollAnswers;
  enjoy: PreferenceId[];
  workStyle: WorkStyleId;
}

export function createCharacter({ intent, sign, answers, enjoy, workStyle }: OnboardingInput): Character {
  const confirmed = confirmStats(sign, answers);
  return { sign, intent: intent ?? null, enjoy, workStyle, dayOne: confirmed, confirmed, earned: zeroStats(), totalXp: 0, stars: {}, feedback: {} };
}

/** Reruns the poll: updates the confirmed base, keeps earned XP. */
export function recalibrate(character: Character, answers: PollAnswers): Character {
  return { ...character, confirmed: confirmStats(character.sign, answers) };
}

export function statsOf(character: Character): Stats {
  return currentStats(character.confirmed, character.earned);
}

export function levelOf(character: Character): number {
  return levelForXp(character.totalXp);
}

export function litStarNumbers(character: Character, careerId: CareerId): StarNumber[] {
  return (character.stars[careerId] ?? []).map((s) => s.star);
}

export function titlesOf(character: Character): Title[] {
  return (Object.keys(character.stars) as CareerId[])
    .map((id) => titleFor(character.sign, id, litStarNumbers(character, id)))
    .filter((t): t is Title => t !== null);
}

export function rankingFor(character: Character): Ranking {
  return rankCareers({
    stats: statsOf(character),
    enjoy: character.enjoy,
    workStyle: character.workStyle,
    feedback: character.feedback,
  });
}

export function setPathInterest(character: Character, careerId: CareerId, interest: PathInterest): Character {
  return {
    ...character,
    feedback: { ...character.feedback, [careerId]: { ...character.feedback[careerId], interest } },
  };
}

export interface QuestRewards {
  xp: number;
  attributeXp: Stats;
  levelBefore: number;
  levelAfter: number;
  /** Set when this quest unlocked a title or upgraded it to the starred form. */
  newTitle: Title | null;
  constellationComplete: boolean;
}

/**
 * Lights a star. Quest XP is always granted; reflection XP, attribute XP and the enjoyment
 * feedback signal only when a reflection is given.
 */
export function completeQuest(
  character: Character,
  careerId: CareerId,
  star: StarNumber,
  reflection: Reflection | null,
  completedAt: string,
): { character: Character; rewards: QuestRewards } {
  const litBefore = litStarNumbers(character, careerId);
  if (!isStarAvailable(star, litBefore)) {
    throw new Error(`Star ${star} on ${careerId} is not available`);
  }

  const quest = getQuest(careerId, star);
  const xp = questXp(quest.tier, reflection !== null);
  const attributeXp = reflection ? attributeXpForQuest(quest, reflection.feltNatural) : zeroStats();
  const litAfter = [...litBefore, star];

  const prevFeedback = character.feedback[careerId];
  const feedback: FeedbackMap = reflection
    ? {
        ...character.feedback,
        [careerId]: { ...prevFeedback, questEnjoyment: [...(prevFeedback?.questEnjoyment ?? []), reflection.enjoyment] },
      }
    : character.feedback;

  const next: Character = {
    ...character,
    earned: mapStats((a) => character.earned[a] + attributeXp[a]),
    totalXp: character.totalXp + xp,
    stars: { ...character.stars, [careerId]: [...(character.stars[careerId] ?? []), { star, completedAt, reflection }] },
    feedback,
  };

  const titleBefore = titleFor(character.sign, careerId, litBefore);
  const titleAfter = titleFor(character.sign, careerId, litAfter);
  const newTitle = titleAfter && titleAfter.text !== titleBefore?.text ? titleAfter : null;

  return {
    character: next,
    rewards: {
      xp,
      attributeXp,
      levelBefore: levelOf(character),
      levelAfter: levelOf(next),
      newTitle,
      constellationComplete: isConstellationComplete(litAfter),
    },
  };
}

/** Stat changes since day one, for "Then vs now". */
export function thenVsNow(character: Character): { attribute: AttributeId; then: number; now: number }[] {
  const now = statsOf(character);
  return ATTRIBUTE_IDS.map((a) => ({ attribute: a, then: character.dayOne[a], now: now[a] }));
}

