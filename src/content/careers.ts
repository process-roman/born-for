// All careers, collected from the per-area content files (Pilot Content §2). CAREERS.md is generated from here.

import { CAREER_IDS, type Career, type CareerId, type Quest, type StarNumber } from './careerKit';
import { ARTS_CAREERS } from './careers/arts';
import { BUSINESS_CAREERS } from './careers/business';
import { CORE_CAREERS } from './careers/core';
import { CREATIVE_CAREERS } from './careers/creative';
import { PEOPLE_CAREERS } from './careers/people';
import { PRACTICAL_CAREERS } from './careers/practical';
import type { WorldId } from './worlds';

export * from './careerKit';

const ALL: Career[] = [...CORE_CAREERS, ...BUSINESS_CAREERS, ...CREATIVE_CAREERS, ...ARTS_CAREERS, ...PEOPLE_CAREERS, ...PRACTICAL_CAREERS];

export const CAREERS = Object.fromEntries(ALL.map((c) => [c.id, c])) as Record<CareerId, Career>;

/** How many careers the content files define; tests check it matches CAREER_IDS with no duplicates. */
export const DEFINED_CAREER_IDS: readonly CareerId[] = ALL.map((c) => c.id);

export function getQuest(careerId: CareerId, star: StarNumber): Quest {
  const quest = CAREERS[careerId].quests.find((q) => q.star === star);
  if (!quest) throw new Error(`No quest ${star} on ${careerId}`);
  return quest;
}

export function careersInWorld(world: WorldId): Career[] {
  return CAREER_IDS.map((id) => CAREERS[id]).filter((c) => c.worlds.includes(world));
}
