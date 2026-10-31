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

/** A life the user could play now and hasn't finished yet, for the Home card. */
export function unplayedLife(game: Game, runs: readonly LifeRun[]): CareerId | null {
  const order = game.paid ? Object.keys(LIVES) as CareerId[] : [freeLifeCareer(game.character)].filter((c): c is CareerId => c !== null);
  const preferred = freeLifeCareer(game.character);
  const sorted = preferred ? [preferred, ...order.filter((c) => c !== preferred)] : order;
  return sorted.find((c) => canPlayLife(game, runs, c) && !hasFinishedLife(runs, c)) ?? null;
}
