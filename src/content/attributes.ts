// The 16 traits, each scored 0–100, in four families (Signs & Onboarding Spec §1).

export const ATTRIBUTE_IDS = [
  // Mind
  'analytical',
  'curiosity',
  'detail',
  'organization',
  // Spark
  'creativity',
  'aesthetic',
  'courage',
  'independence',
  // Heart
  'empathy',
  'communication',
  'teamwork',
  'leadership',
  // Body
  'hands_on',
  'physical',
  'persistence',
  'calm',
] as const;

export type AttributeId = (typeof ATTRIBUTE_IDS)[number];

export type Stats = Record<AttributeId, number>;

export type FamilyId = 'mind' | 'spark' | 'heart' | 'body';

export const FAMILIES: readonly { id: FamilyId; name: string; blurb: string; traits: readonly AttributeId[] }[] = [
  { id: 'mind', name: 'Mind', blurb: 'Thinking', traits: ['analytical', 'curiosity', 'detail', 'organization'] },
  { id: 'spark', name: 'Spark', blurb: 'Creating', traits: ['creativity', 'aesthetic', 'courage', 'independence'] },
  { id: 'heart', name: 'Heart', blurb: 'People', traits: ['empathy', 'communication', 'teamwork', 'leadership'] },
  { id: 'body', name: 'Body', blurb: 'Doing', traits: ['hands_on', 'physical', 'persistence', 'calm'] },
];

export const ATTRIBUTE_LABELS: Record<AttributeId, string> = {
  analytical: 'Analytical thinking',
  curiosity: 'Curiosity',
  detail: 'Attention to detail',
  organization: 'Organization',
  creativity: 'Creativity',
  aesthetic: 'Aesthetic eye',
  courage: 'Courage',
  independence: 'Independence',
  empathy: 'Empathy',
  communication: 'Communication',
  teamwork: 'Teamwork',
  leadership: 'Leadership',
  hands_on: 'Hands-on skill',
  physical: 'Physical energy',
  persistence: 'Persistence',
  calm: 'Calm under pressure',
};

/** What each trait means in the app. */
export const ATTRIBUTE_DESCRIPTIONS: Record<AttributeId, string> = {
  analytical: 'Figuring out how and why things work',
  curiosity: 'Wanting to learn and explore new things',
  detail: 'Noticing the small things others miss',
  organization: 'Planning, structure and follow-through',
  creativity: 'Coming up with your own ideas and new ways of doing things',
  aesthetic: 'Sensing what looks, sounds or feels beautiful',
  courage: 'Trying new things and taking chances',
  independence: 'Working and deciding on your own',
  empathy: 'Understanding and caring about how others feel',
  communication: 'Expressing ideas and connecting with people',
  teamwork: 'Working well with others toward a shared goal',
  leadership: 'Taking charge and getting people moving',
  hands_on: 'Making, fixing and building with your hands',
  physical: 'Energy, stamina and being in your body',
  persistence: 'Sticking with things when they get hard',
  calm: 'Staying steady when things get tense',
};

/** Behavioral statement on each confirm-poll card. */
export const POLL_STATEMENTS: Record<AttributeId, string> = {
  analytical: "You enjoy figuring out why something works, or why it doesn't.",
  curiosity: 'You often go down rabbit holes learning about something new.',
  detail: "You spot small mistakes or details other people don't notice.",
  organization: 'You like having a plan and keeping things in order.',
  creativity: 'You often come up with your own ideas instead of doing it the usual way.',
  aesthetic: 'You can tell when colors, shapes or sounds go together, and it matters to you.',
  courage: "You'll try something new even when you might fail at it.",
  independence: "You'd rather figure things out yourself than wait for directions.",
  empathy: 'You can tell how someone feels before they say it.',
  communication: 'Explaining things to other people comes easily to you.',
  teamwork: "You do your best work when you're part of a team.",
  leadership: 'In a group, people often end up looking to you to decide.',
  hands_on: "You'd rather build or fix something with your hands than read about it.",
  physical: "You feel best when you're moving: sport, training, being active.",
  persistence: 'When something gets hard, you usually keep going.',
  calm: 'When things go wrong, you stay calm and figure out what to do.',
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

export function zeroStats(): Stats {
  return Object.fromEntries(ATTRIBUTE_IDS.map((a) => [a, 0])) as Stats;
}
