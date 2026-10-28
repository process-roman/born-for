// The eight attributes, each scored 0–100 (Blueprint §8).

export const ATTRIBUTE_IDS = [
  'creativity',
  'analytical',
  'empathy',
  'communication',
  'organization',
  'independence',
  'curiosity',
  'persistence',
] as const;

export type AttributeId = (typeof ATTRIBUTE_IDS)[number];

export type Stats = Record<AttributeId, number>;

export const ATTRIBUTE_LABELS: Record<AttributeId, string> = {
  creativity: 'Creativity',
  analytical: 'Analytical thinking',
  empathy: 'Empathy',
  communication: 'Communication',
  organization: 'Organization',
  independence: 'Independence',
  curiosity: 'Curiosity',
  persistence: 'Persistence',
};

export type Band = 'Strong' | 'Solid' | 'Developing' | 'Untrained';

/** Lower bound of each band, highest first. */
export const BANDS: readonly { band: Band; min: number }[] = [
  { band: 'Strong', min: 80 },
  { band: 'Solid', min: 60 },
  { band: 'Developing', min: 40 },
  { band: 'Untrained', min: 0 },
];

export const STAT_MAX = 100;

/** Every sign's starting profile totals this many points (Blueprint §2). */
export const SIGN_STAT_BUDGET = 480;

export function zeroStats(): Stats {
  return Object.fromEntries(ATTRIBUTE_IDS.map((a) => [a, 0])) as Stats;
}
