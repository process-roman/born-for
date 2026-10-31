// Dev tools for the life sim (Life Sim Spec §15 step 3): preview the Life at 30 card for any
// ending with a real, consistent life rather than faked meters.

import type { CareerLife, LifeEvent } from '../content/life';
import { createRng, playLife, type LifeRun, type NewLife } from './life';

/** Plays random lives with the user's stats until one reaches the ending. Null if none do. */
export function lifeWithEnding(life: CareerLife, shared: readonly LifeEvent[], params: Omit<NewLife, 'seed'>, endingId: string, maxTries = 3000): LifeRun | null {
  const rng = createRng(endingId.length * 7919 + 1);
  for (let i = 0; i < maxTries; i++) {
    const seed = Math.floor(rng() * 4294967296);
    const { run } = playLife(life, shared, { ...params, seed }, (_e, choices) => choices[Math.floor(rng() * choices.length)]!);
    if (run.completed?.endingId === endingId) return run;
  }
  return null;
}
