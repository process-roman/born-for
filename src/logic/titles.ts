// Hybrid titles: "The {Archetype adjective} {Class}" (Blueprint §6, Pilot Content §4.11).

import { CAREERS, type CareerId, type StarNumber } from '../content/careers';
import { SIGNS, type SignId } from '../content/signs';
import { isConstellationComplete } from './constellation';

export const STARRED_PREFIX = '★ ';

export interface Title {
  careerId: CareerId;
  text: string;
  starred: boolean;
}

/** "The Gentle Shaper": archetype adjective + career class, before any stars. */
export function hybridTitle(sign: SignId, careerId: CareerId): string {
  return `The ${SIGNS[sign].adjective} ${CAREERS[careerId].className}`;
}

/** Unlocks once a Try star (3 or 4) is lit; starred once all five are lit. */
export function titleFor(sign: SignId, careerId: CareerId, lit: readonly StarNumber[]): Title | null {
  const tryLit = CAREERS[careerId].quests.some((q) => q.tier === 'try' && lit.includes(q.star));
  if (!tryLit) return null;
  const starred = isConstellationComplete(lit);
  const base = hybridTitle(sign, careerId);
  return { careerId, text: starred ? STARRED_PREFIX + base : base, starred };
}
