// Who can play which life (Life Sim Spec §2). Free: one full life, played once, for the user's
// top-matched career that has life content. Paid: every life, unlimited replays.

import type { CareerId } from '../content/careers';
import { LIVES } from '../content/life';
import { rankingFor, type Character } from './character';
import type { Game } from './game';
import type { LifeRun } from './life';

/** The best-ranked career with a life ("Not for me" careers last). Null when no life exists. */
export function freeLifeCareer(character: Character): CareerId | null {
  const { ranked, notForMe } = rankingFor(character);
  return [...ranked, ...notForMe].find((m) => LIVES[m.careerId])?.careerId ?? null;
}

export function hasFinishedLife(runs: readonly LifeRun[], careerId: CareerId): boolean {
  return runs.some((r) => r.career === careerId && r.completed);
}

/** Free users can start their free life until they finish it; a run in progress can always resume. */
export function canPlayLife(game: Game, runs: readonly LifeRun[], careerId: CareerId): boolean {
  if (!LIVES[careerId]) return false;
  if (game.paid) return true;
  if (runs.some((r) => r.career === careerId && !r.completed)) return true;
  return careerId === freeLifeCareer(game.character) && !hasFinishedLife(runs, careerId);
}

/** How many of the user's top matches Home suggests living (paid users). */
export const HOME_LIVES = 3;

/**
 * A life to suggest on Home: the free life until it's lived, or for paid users the first of their
 * top matches not lived yet. A life in progress always comes first.
 */
export function unplayedLife(game: Game, runs: readonly LifeRun[]): CareerId | null {
  const inProgress = runs.find((r) => !r.completed && canPlayLife(game, runs, r.career));
  if (inProgress) return inProgress.career;
  const free = freeLifeCareer(game.character);
  const order = game.paid
    ? rankingFor(game.character)
        .ranked.slice(0, HOME_LIVES)
        .map((m) => m.careerId)
    : free
      ? [free]
      : [];
  return order.find((c) => canPlayLife(game, runs, c) && !hasFinishedLife(runs, c)) ?? null;
}
