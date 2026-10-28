// Quest XP, character levels and attribute XP (Pilot Content §4.9–4.10).

import type { AttributeId, Stats } from '../content/attributes';
import type { Quest, QuestTier } from '../content/careers';
import { mapStats } from './stats';

export const QUEST_XP: Record<QuestTier, number> = { taste: 50, try: 120, test: 200 };
export const REFLECTION_XP = 30;

/** Total XP needed for each level; index 0 is level 1. */
export const LEVEL_THRESHOLDS = [0, 150, 450, 900, 1500] as const;
export const MAX_LEVEL = LEVEL_THRESHOLDS.length;

export const ATTRIBUTE_XP_PER_TIER: Record<QuestTier, number> = { taste: 2, try: 4, test: 6 };
export const FELT_NATURAL_XP = 1;
export const MAX_FELT_NATURAL = 2;

export function questXp(tier: QuestTier, reflected: boolean): number {
  return QUEST_XP[tier] + (reflected ? REFLECTION_XP : 0);
}

export function levelForXp(totalXp: number): number {
  let level = 1;
  LEVEL_THRESHOLDS.forEach((min, i) => {
    if (totalXp >= min) level = i + 1;
  });
  return level;
}

/** XP still needed for the next level, or null at max level. */
export function xpToNextLevel(totalXp: number): number | null {
  const next = LEVEL_THRESHOLDS[levelForXp(totalXp)];
  return next === undefined ? null : next - totalXp;
}

/**
 * Attribute XP for a completed and reflected quest: the quest's two attributes get the tier amount,
 * each "felt natural" chip (max 2) gets +1. "Felt hard" chips give nothing.
 */
export function attributeXpForQuest(quest: Quest, feltNatural: readonly AttributeId[]): Stats {
  const chips = feltNatural.slice(0, MAX_FELT_NATURAL);
  return mapStats(
    (a) =>
      (quest.attributes.includes(a) ? ATTRIBUTE_XP_PER_TIER[quest.tier] : 0) +
      (chips.includes(a) ? FELT_NATURAL_XP : 0),
  );
}
