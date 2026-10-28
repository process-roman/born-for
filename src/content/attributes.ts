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

/** What each attribute means in the app. */
export const ATTRIBUTE_DESCRIPTIONS: Record<AttributeId, string> = {
  creativity: 'Coming up with your own ideas and new ways of doing things',
  analytical: 'Figuring out how and why things work',
  empathy: 'Understanding and caring about how others feel',
  communication: 'Expressing ideas and connecting with people',
  organization: 'Planning, structure and follow-through on details',
  independence: 'Working and deciding on your own',
  curiosity: 'Wanting to learn and explore new things',
  persistence: 'Sticking with things when they get hard',
};

/** Behavioral statement on each confirm-poll card. */
export const POLL_STATEMENTS: Record<AttributeId, string> = {
  creativity: 'You often come up with your own ideas instead of doing it the usual way.',
  analytical: "You enjoy figuring out why something works, or why it doesn't.",
  empathy: 'You can tell how someone feels before they say it.',
  communication: 'Explaining things to other people comes easily to you.',
  organization: 'You like having a plan and keeping things in order.',
  independence: "You'd rather figure things out yourself than wait for directions.",
  curiosity: 'You often go down rabbit holes learning about something new.',
  persistence: 'When something gets hard, you usually keep going.',
};

export type Band ='Strong' | 'Solid' | 'Developing' | 'Untrained';

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
