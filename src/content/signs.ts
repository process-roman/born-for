import type { Stats } from './attributes';

export const SIGN_IDS = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const;

export type SignId = (typeof SIGN_IDS)[number];

export type Element = 'fire' | 'earth' | 'air' | 'water';

export interface SignInfo {
  name: string;
  /** Hybrid-title adjective (Blueprint §6). */
  adjective: string;
  /** Drives the level-3 element glow (Blueprint §7). */
  element: Element;
}

export const SIGNS: Record<SignId, SignInfo> = {
  aries: { name: 'Aries', adjective: 'Bold', element: 'fire' },
  taurus: { name: 'Taurus', adjective: 'Steady', element: 'earth' },
  gemini: { name: 'Gemini', adjective: 'Quick', element: 'air' },
  cancer: { name: 'Cancer', adjective: 'Gentle', element: 'water' },
  leo: { name: 'Leo', adjective: 'Radiant', element: 'fire' },
  virgo: { name: 'Virgo', adjective: 'Precise', element: 'earth' },
  libra: { name: 'Libra', adjective: 'Graceful', element: 'air' },
  scorpio: { name: 'Scorpio', adjective: 'Relentless', element: 'water' },
  sagittarius: { name: 'Sagittarius', adjective: 'Wandering', element: 'fire' },
  capricorn: { name: 'Capricorn', adjective: 'Unshakable', element: 'earth' },
  aquarius: { name: 'Aquarius', adjective: 'Visionary', element: 'air' },
  pisces: { name: 'Pisces', adjective: 'Dreaming', element: 'water' },
};

/**
 * Starting stat profiles. The full set of 12 lives in SIGNS_AND_ONBOARDING_SPEC.md;
 * these five come from the pilot check (Cancer is the pilot sign, the others back the test personas).
 */
export const SIGN_STATS: Partial<Record<SignId, Stats>> = {
  cancer: { creativity: 60, analytical: 50, empathy: 85, communication: 60, organization: 65, independence: 40, curiosity: 50, persistence: 70 },
  leo: { creativity: 80, analytical: 40, empathy: 55, communication: 80, organization: 40, independence: 65, curiosity: 55, persistence: 65 },
  virgo: { creativity: 45, analytical: 85, empathy: 50, communication: 45, organization: 85, independence: 50, curiosity: 50, persistence: 70 },
  pisces: { creativity: 85, analytical: 45, empathy: 85, communication: 60, organization: 35, independence: 55, curiosity: 65, persistence: 50 },
  sagittarius: { creativity: 60, analytical: 55, empathy: 50, communication: 65, organization: 35, independence: 80, curiosity: 85, persistence: 50 },
};

export function getSignStats(sign: SignId): Stats {
  const stats = SIGN_STATS[sign];
  if (!stats) throw new Error(`No stat profile yet for sign "${sign}"`);
  return stats;
}
