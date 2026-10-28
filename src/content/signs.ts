// The 12 signs (Signs & Onboarding Spec §2, Blueprint §6).
//
// Each sign ranks all 16 traits: 8 signature traits (predicted strongest, confirmed in the poll)
// and 8 background traits (still valued, optional to confirm). Values come from one shared
// ladder, so every sign has the same total and none is "better" than another.

import { ATTRIBUTE_IDS, type AttributeId, type Stats } from './attributes';

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

export const SIGNATURE_LADDER = [85, 80, 75, 70, 70, 65, 65, 60] as const;
export const BACKGROUND_LADDER = [55, 50, 50, 45, 45, 40, 40, 35] as const;
export const SIGN_STAT_MIN = 35;
export const SIGN_STAT_MAX = 85;
export const SIGN_STAT_BUDGET = [...SIGNATURE_LADDER, ...BACKGROUND_LADDER].reduce((a, b) => a + b, 0);

export interface SignInfo {
  name: string;
  archetype: string;
  /** One-line reveal copy. */
  revealLine: string;
  /** Hybrid-title adjective. */
  adjective: string;
  /** Tints character screens and drives the level-3 element glow. */
  element: Element;
  /** Strongest first. The first three are starred at the reveal. */
  signature: readonly AttributeId[];
  /** Strongest first. */
  background: readonly AttributeId[];
  /** Starting stats, from the ladders. */
  stats: Stats;
}

type SignDef = Omit<SignInfo, 'stats'>;

function withStats(def: SignDef): SignInfo {
  const values = new Map<AttributeId, number>();
  def.signature.forEach((a, i) => values.set(a, SIGNATURE_LADDER[i]!));
  def.background.forEach((a, i) => values.set(a, BACKGROUND_LADDER[i]!));
  const stats = Object.fromEntries(ATTRIBUTE_IDS.map((a) => [a, values.get(a) ?? 0])) as Stats;
  return { ...def, stats };
}

const DEFS: Record<SignId, SignDef> = {
  aries: {
    name: 'Aries',
    archetype: 'The Trailblazer',
    revealLine: 'You go first, act fast and figure it out on the way.',
    adjective: 'Bold',
    element: 'fire',
    signature: ['courage', 'leadership', 'independence', 'physical', 'communication', 'curiosity', 'creativity', 'hands_on'],
    background: ['persistence', 'teamwork', 'calm', 'analytical', 'aesthetic', 'empathy', 'organization', 'detail'],
  },
  taurus: {
    name: 'Taurus',
    archetype: 'The Builder',
    revealLine: 'You make things that last, one steady step at a time.',
    adjective: 'Steady',
    element: 'earth',
    signature: ['persistence', 'hands_on', 'aesthetic', 'calm', 'organization', 'creativity', 'detail', 'physical'],
    background: ['empathy', 'teamwork', 'analytical', 'independence', 'communication', 'leadership', 'courage', 'curiosity'],
  },
  gemini: {
    name: 'Gemini',
    archetype: 'The Messenger',
    revealLine: 'Ideas move through you, and you love passing them on.',
    adjective: 'Quick',
    element: 'air',
    signature: ['communication', 'curiosity', 'creativity', 'analytical', 'teamwork', 'courage', 'independence', 'aesthetic'],
    background: ['empathy', 'leadership', 'hands_on', 'physical', 'calm', 'organization', 'detail', 'persistence'],
  },
  cancer: {
    name: 'Cancer',
    archetype: 'The Guardian',
    revealLine: 'You look after people and the things that matter to them.',
    adjective: 'Gentle',
    element: 'water',
    signature: ['empathy', 'persistence', 'organization', 'teamwork', 'communication', 'creativity', 'detail', 'hands_on'],
    background: ['calm', 'aesthetic', 'analytical', 'leadership', 'curiosity', 'courage', 'physical', 'independence'],
  },
  leo: {
    name: 'Leo',
    archetype: 'The Champion',
    revealLine: 'You create, you lead, and people notice when you walk in.',
    adjective: 'Radiant',
    element: 'fire',
    signature: ['leadership', 'creativity', 'communication', 'courage', 'aesthetic', 'independence', 'persistence', 'teamwork'],
    background: ['physical', 'empathy', 'calm', 'curiosity', 'hands_on', 'analytical', 'organization', 'detail'],
  },
  virgo: {
    name: 'Virgo',
    archetype: 'The Analyst',
    revealLine: 'You see the details others miss and make things work better.',
    adjective: 'Precise',
    element: 'earth',
    signature: ['analytical', 'detail', 'organization', 'persistence', 'hands_on', 'calm', 'empathy', 'curiosity'],
    background: ['teamwork', 'communication', 'independence', 'aesthetic', 'creativity', 'leadership', 'physical', 'courage'],
  },
  libra: {
    name: 'Libra',
    archetype: 'The Diplomat',
    revealLine: 'You bring people together and find the balance in any room.',
    adjective: 'Graceful',
    element: 'air',
    signature: ['communication', 'empathy', 'aesthetic', 'teamwork', 'creativity', 'analytical', 'calm', 'curiosity'],
    background: ['organization', 'leadership', 'detail', 'persistence', 'hands_on', 'physical', 'courage', 'independence'],
  },
  scorpio: {
    name: 'Scorpio',
    archetype: 'The Investigator',
    revealLine: "You dig deep and don't stop until you find the truth.",
    adjective: 'Relentless',
    element: 'water',
    signature: ['persistence', 'analytical', 'independence', 'courage', 'calm', 'empathy', 'detail', 'leadership'],
    background: ['curiosity', 'creativity', 'organization', 'physical', 'aesthetic', 'hands_on', 'teamwork', 'communication'],
  },
  sagittarius: {
    name: 'Sagittarius',
    archetype: 'The Explorer',
    revealLine: 'You chase new places, new ideas and the big picture.',
    adjective: 'Wandering',
    element: 'fire',
    signature: ['curiosity', 'independence', 'courage', 'communication', 'physical', 'creativity', 'analytical', 'leadership'],
    background: ['teamwork', 'empathy', 'hands_on', 'aesthetic', 'calm', 'persistence', 'organization', 'detail'],
  },
  capricorn: {
    name: 'Capricorn',
    archetype: 'The Architect',
    revealLine: 'You plan the climb and you finish what you start.',
    adjective: 'Unshakable',
    element: 'earth',
    signature: ['organization', 'persistence', 'leadership', 'analytical', 'calm', 'detail', 'independence', 'hands_on'],
    background: ['physical', 'teamwork', 'communication', 'curiosity', 'empathy', 'courage', 'creativity', 'aesthetic'],
  },
  aquarius: {
    name: 'Aquarius',
    archetype: 'The Inventor',
    revealLine: "You imagine what doesn't exist yet and go build it.",
    adjective: 'Visionary',
    element: 'air',
    signature: ['creativity', 'independence', 'curiosity', 'analytical', 'courage', 'teamwork', 'communication', 'hands_on'],
    background: ['empathy', 'leadership', 'aesthetic', 'detail', 'physical', 'calm', 'persistence', 'organization'],
  },
  pisces: {
    name: 'Pisces',
    archetype: 'The Dreamer',
    revealLine: 'You feel deeply and turn imagination into something real.',
    adjective: 'Dreaming',
    element: 'water',
    signature: ['creativity', 'empathy', 'aesthetic', 'curiosity', 'teamwork', 'communication', 'hands_on', 'independence'],
    background: ['calm', 'analytical', 'persistence', 'physical', 'courage', 'detail', 'leadership', 'organization'],
  },
};

export const SIGNS: Record<SignId, SignInfo> = Object.fromEntries(
  SIGN_IDS.map((id) => [id, withStats(DEFS[id])]),
) as Record<SignId, SignInfo>;

export function getSignStats(sign: SignId): Stats {
  return SIGNS[sign].stats;
}
