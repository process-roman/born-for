// Badges (Blueprint §11). Earned from progress, never lost; no streaks.

export const BADGE_IDS = [
  'first_star',
  'reflective',
  'first_title',
  'first_constellation',
  'three_paths',
  'world_traveller',
  'level_3',
  'hidden_talent',
  'recalibrated',
] as const;

export type BadgeId = (typeof BADGE_IDS)[number];

export interface Badge {
  id: BadgeId;
  emoji: string;
  name: string;
  description: string;
}

export const BADGES: Record<BadgeId, Badge> = {
  first_star: { id: 'first_star', emoji: '⭐', name: 'First Star', description: 'Lit your first star.' },
  reflective: { id: 'reflective', emoji: '🪞', name: 'Reflective', description: 'Reflected on five quests.' },
  first_title: { id: 'first_title', emoji: '🏷️', name: 'Named', description: 'Earned your first title.' },
  first_constellation: { id: 'first_constellation', emoji: '🌌', name: 'First Constellation', description: 'Lit every star on a path.' },
  three_paths: { id: 'three_paths', emoji: '🧭', name: 'Three Paths Explored', description: 'Lit a star on three different paths.' },
  world_traveller: { id: 'world_traveller', emoji: '🌍', name: 'World Traveller', description: 'Explored paths in three different worlds.' },
  level_3: { id: 'level_3', emoji: '✨', name: 'Rising', description: 'Reached level 3.' },
  hidden_talent: { id: 'hidden_talent', emoji: '🔓', name: 'Hidden Talent', description: 'Unlocked a background trait your sign didn’t predict.' },
  recalibrated: { id: 'recalibrated', emoji: '🔄', name: 'Recalibrated', description: 'Rechecked your stats.' },
};
