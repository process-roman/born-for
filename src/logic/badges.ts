// Which badges a character has earned. Pure, so the same function serves the Character screen
// and the "badge unlocked" moment after a quest.

import { BADGE_IDS, type BadgeId } from '../content/badges';
import { CAREERS, type CareerId } from '../content/careers';
import { SIGNS } from '../content/signs';
import { levelOf, litStarNumbers, titlesOf, type Character } from './character';
import { isConstellationComplete } from './constellation';

export const REFLECTIVE_COUNT = 5;
export const PATHS_FOR_BADGE = 3;
export const WORLDS_FOR_BADGE = 3;

export function earnedBadges(character: Character): BadgeId[] {
  const started = (Object.keys(character.stars) as CareerId[]).filter((id) => litStarNumbers(character, id).length > 0);
  const reflections = started.reduce((n, id) => n + (character.stars[id] ?? []).filter((s) => s.reflection).length, 0);
  const worlds = new Set(started.flatMap((id) => CAREERS[id].worlds));
  const background = SIGNS[character.sign].background;

  const has: Record<BadgeId, boolean> = {
    first_star: started.length > 0,
    reflective: reflections >= REFLECTIVE_COUNT,
    first_title: titlesOf(character).length > 0,
    first_constellation: started.some((id) => isConstellationComplete(litStarNumbers(character, id))),
    three_paths: started.length >= PATHS_FOR_BADGE,
    world_traveller: worlds.size >= WORLDS_FOR_BADGE,
    level_3: levelOf(character) >= 3,
    hidden_talent: background.some((a) => character.answers[a] === 'yes' || character.dayOneAnswers[a] === 'yes'),
    recalibrated: (character.recalibrations ?? 0) > 0,
  };
  return BADGE_IDS.filter((id) => has[id]);
}

export function newBadges(before: Character, after: Character): BadgeId[] {
  const had = new Set(earnedBadges(before));
  return earnedBadges(after).filter((id) => !had.has(id));
}
