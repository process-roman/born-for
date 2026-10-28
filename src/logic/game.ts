// The saved game: character plus quest state, purchase flag and what to suggest next.
// Pure functions so they can be unit-tested; the app store persists the result.

import { CAREERS, type CareerId, type StarNumber } from '../content/careers';
import { completeQuest, litStarNumbers, rankingFor, setPathInterest, type Character, type Reflection, type QuestRewards } from './character';
import { easierQuest, isStarAvailable, nextQuest } from './constellation';
import { nextRecommendation, suggestDifferentPath, type NextStep } from './recommend';

/** Bumped when the saved shape changes; older saves are dropped (v2: 16 traits, 24 careers). */
export const GAME_VERSION = 2;
/** An active quest with no action for this long gets a gentle "Still on it?" (Blueprint §4.5). */
export const STALE_AFTER_DAYS = 14;

export interface ActiveQuest {
  careerId: CareerId;
  star: StarNumber;
  startedAt: string;
  /** When to check in. */
  dueAt: string;
  /** "Not now": kept, but no longer at the top of home. */
  snoozed: boolean;
  notificationId: string | null;
}

export type SuggestionKind = 'start' | 'same_path' | 'related_path' | 'different_path' | 'easier' | 'after_path';

export interface Suggestion {
  careerId: CareerId;
  star: StarNumber;
  kind: SuggestionKind;
  reason: string | null;
}

export interface Game {
  version: number;
  character: Character;
  paid: boolean;
  activeQuest: ActiveQuest | null;
  suggestion: Suggestion | null;
  equippedTitle: CareerId | null;
}

export function newGame(character: Character, paid: boolean): Game {
  return { version: GAME_VERSION, character, paid, activeQuest: null, suggestion: null, equippedTitle: null };
}

export function topCareer(game: Game): CareerId {
  return rankingFor(game.character).ranked[0]?.careerId ?? 'ux_design';
}

function totalStars(character: Character): number {
  return Object.values(character.stars).reduce((n, stars) => n + (stars?.length ?? 0), 0);
}

/** Free users get one Taste quest on their top path; paid users can start any available star. */
export function canStartQuest(game: Game, careerId: CareerId, star: StarNumber): boolean {
  if (!isStarAvailable(star, litStarNumbers(game.character, careerId))) return false;
  if (game.paid) return true;
  return careerId === topCareer(game) && star === 1 && totalStars(game.character) === 0;
}

export function startQuest(game: Game, careerId: CareerId, star: StarNumber, now: Date, dueAt: Date, notificationId: string | null): Game {
  if (!canStartQuest(game, careerId, star)) throw new Error(`Can't start star ${star} on ${careerId}`);
  return {
    ...game,
    activeQuest: { careerId, star, startedAt: now.toISOString(), dueAt: dueAt.toISOString(), snoozed: false, notificationId },
    suggestion: null,
  };
}

export function snoozeQuest(game: Game): Game {
  return game.activeQuest ? { ...game, activeQuest: { ...game.activeQuest, snoozed: true } } : game;
}

export function resumeQuest(game: Game): Game {
  return game.activeQuest ? { ...game, activeQuest: { ...game.activeQuest, snoozed: false } } : game;
}

/** "Too hard": drop the quest and offer an easier one on the same path, if there is one. */
export function tooHard(game: Game): Game {
  const active = game.activeQuest;
  if (!active) return game;
  const career = CAREERS[active.careerId];
  const current = career.quests.find((q) => q.star === active.star)!;
  const easier = easierQuest(career, litStarNumbers(game.character, active.careerId), current);
  return {
    ...game,
    activeQuest: null,
    suggestion: easier ? { careerId: active.careerId, star: easier.star, kind: 'easier', reason: 'A smaller step on the same path' } : null,
  };
}

/** "Not for me" on a quest counts as Not for me on its path, and offers a different path. */
export function notForMe(game: Game): Game {
  const active = game.activeQuest;
  if (!active) return game;
  const character = setPathInterest(game.character, active.careerId, 'not_for_me');
  const different = game.paid ? suggestDifferentPath(character, active.careerId) : null;
  return {
    ...game,
    character,
    activeQuest: null,
    suggestion: different ? { careerId: different.careerId, star: different.quest.star, kind: 'different_path', reason: different.reason } : null,
  };
}

function suggestionFrom(next: NextStep): Suggestion | null {
  switch (next.kind) {
    case 'same_path':
      return { careerId: next.careerId, star: next.quest.star, kind: 'same_path', reason: null };
    case 'related_path':
    case 'different_path':
      return { careerId: next.careerId, star: next.quest.star, kind: next.kind, reason: next.reason };
    case 'path_complete':
      return next.related
        ? { careerId: next.related.careerId, star: next.related.quest.star, kind: 'after_path', reason: next.related.reason }
        : null;
  }
}

export interface FinishResult {
  game: Game;
  careerId: CareerId;
  star: StarNumber;
  rewards: QuestRewards;
  next: NextStep;
}

/** "Done": light the star, grant rewards, pick what to suggest next. A new title is equipped right away. */
export function finishQuest(game: Game, reflection: Reflection | null, now: Date): FinishResult {
  const active = game.activeQuest;
  if (!active) throw new Error('No active quest');
  const { character, rewards } = completeQuest(game.character, active.careerId, active.star, reflection, now.toISOString());
  const next = nextRecommendation(character, active.careerId, reflection);
  return {
    game: {
      ...game,
      character,
      activeQuest: null,
      suggestion: suggestionFrom(next),
      equippedTitle: rewards.newTitle ? rewards.newTitle.careerId : game.equippedTitle,
    },
    careerId: active.careerId,
    star: active.star,
    rewards,
    next,
  };
}

export function unlock(game: Game): Game {
  return { ...game, paid: true };
}

export function isStale(active: ActiveQuest, now: Date): boolean {
  return now.getTime() - Date.parse(active.startedAt) >= STALE_AFTER_DAYS * 86_400_000;
}

/** What home recommends when there's no active quest. */
export function homeSuggestion(game: Game): Suggestion | null {
  const s = game.suggestion;
  if (s && canStartQuest(game, s.careerId, s.star) && game.character.feedback[s.careerId]?.interest !== 'not_for_me') return s;
  const top = topCareer(game);
  const quest = nextQuest(CAREERS[top], litStarNumbers(game.character, top));
  if (quest && canStartQuest(game, top, quest.star)) return { careerId: top, star: quest.star, kind: 'start', reason: null };
  return null;
}

// Reminder times (Blueprint §4.3: Today / This weekend / Pick a day).

export type WhenChoice = { kind: 'today' } | { kind: 'weekend' } | { kind: 'day'; date: Date };

const at = (d: Date, hour: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, 0, 0, 0);
const addDays = (d: Date, days: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);

/** Check-in time for a choice, in local time: evening for days, late morning for weekends. */
export function checkInTime(choice: WhenChoice, now: Date): Date {
  switch (choice.kind) {
    case 'today': {
      const evening = at(now, 20);
      return evening > now ? evening : new Date(now.getTime() + 2 * 3_600_000);
    }
    case 'weekend': {
      const day = now.getDay(); // 0 Sunday … 6 Saturday
      if (day === 6 || day === 0) {
        const later = at(now, 18);
        return later > now ? later : new Date(now.getTime() + 2 * 3_600_000);
      }
      return at(addDays(now, 6 - day), 18);
    }
    case 'day':
      return at(choice.date, 19);
  }
}
