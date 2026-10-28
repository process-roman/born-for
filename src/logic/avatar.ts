// The evolving character (Blueprint §7): each level adds one visual layer.
//   1 base archetype · 2 constellation aura · 3 element glow · 4 item from the most-progressed path · 5 celestial frame

import { CAREERS, type CareerId } from '../content/careers';
import { levelOf, litStarNumbers, type Character } from './character';

export interface AvatarLayers {
  level: number;
  aura: boolean;
  glow: boolean;
  /** Level 4: the item of the path with the most lit stars. */
  item: { careerId: CareerId; name: string } | null;
  frame: boolean;
}

export const LAYER_NAMES = ['Base form', 'Constellation aura', 'Element glow', 'Path item', 'Celestial form'] as const;

/** Most stars lit; ties go to the path that was started first. */
export function mostProgressedPath(character: Character): CareerId | null {
  let best: CareerId | null = null;
  for (const id of Object.keys(character.stars) as CareerId[]) {
    if (litStarNumbers(character, id).length > (best ? litStarNumbers(character, best).length : 0)) best = id;
  }
  return best;
}

export function avatarLayers(character: Character): AvatarLayers {
  const level = levelOf(character);
  const path = mostProgressedPath(character);
  return {
    level,
    aura: level >= 2,
    glow: level >= 3,
    item: level >= 4 && path ? { careerId: path, name: CAREERS[path].item } : null,
    frame: level >= 5,
  };
}

/** What the next level adds, or null at max level. */
export function nextLayerName(level: number): string | null {
  return LAYER_NAMES[level] ?? null;
}
