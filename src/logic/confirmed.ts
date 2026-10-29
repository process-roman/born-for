// Earned confidence (Signs & Onboarding Spec §6 "Voice and promise"): traits a user has proven
// themselves through reflections, and the "That's you" moment on a path they keep enjoying.

import { ATTRIBUTE_IDS, ATTRIBUTE_LABELS, type AttributeId } from '../content/attributes';
import { CAREERS, type CareerId } from '../content/careers';
import { SIGNS } from '../content/signs';
import type { Character } from './character';
import { topAttributes } from './poll';

/** Stars needed, all enjoyed, before the "That's you" moment. */
export const THATS_YOU_STARS = 3;

/** Traits the user has marked "felt natural" on at least one quest, in trait order. */
export function confirmedTraits(character: Character): AttributeId[] {
  const marked = new Set<AttributeId>();
  for (const stars of Object.values(character.stars)) {
    for (const s of stars ?? []) for (const a of s.reflection?.feltNatural ?? []) marked.add(a);
  }
  return ATTRIBUTE_IDS.filter((a) => marked.has(a));
}

export function newlyConfirmed(before: Character, after: Character): AttributeId[] {
  const had = new Set(confirmedTraits(before));
  return confirmedTraits(after).filter((a) => !had.has(a));
}

/** The line shown when a trait is confirmed for the first time. */
export function confirmedLine(character: Character, attribute: AttributeId): string {
  const label = ATTRIBUTE_LABELS[attribute];
  if (topAttributes(character.sign).includes(attribute)) return `Your sign called ${label}. You just proved it.`;
  if (SIGNS[character.sign].signature.includes(attribute)) return `Your sign suggested ${label}. Now you know it’s real.`;
  return `Your sign didn’t predict ${label}. You found it yourself.`;
}

/** True when a path has exactly reached the star count with every reflection on it enjoyed (4–5). */
export function isThatsYouMoment(character: Character, careerId: CareerId): boolean {
  const stars = character.stars[careerId] ?? [];
  if (stars.length !== THATS_YOU_STARS) return false;
  return stars.every((s) => s.reflection !== null && s.reflection.enjoyment >= 4);
}

export function thatsYouLine(careerId: CareerId): string {
  return `${THATS_YOU_STARS} stars in ${CAREERS[careerId].name}, and you loved every one. That’s not your sign talking. That’s you.`;
}
