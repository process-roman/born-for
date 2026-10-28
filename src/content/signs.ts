// The 12 signs (Signs & Onboarding Spec §2, Blueprint §6).

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
  archetype: string;
  /** One-line reveal copy. */
  revealLine: string;
  /** Hybrid-title adjective. */
  adjective: string;
  /** Tints character screens and drives the level-3 element glow. */
  element: Element;
  /** Starting stats: 480 points, each between 35 and 85. */
  stats: Stats;
}

export const SIGN_STAT_MIN = 35;
export const SIGN_STAT_MAX = 85;

export const SIGNS: Record<SignId, SignInfo> = {
  aries: {
    name: 'Aries',
    archetype: 'The Trailblazer',
    revealLine: 'You go first, act fast and figure it out on the way.',
    adjective: 'Bold',
    element: 'fire',
    stats: { creativity: 60, analytical: 50, empathy: 50, communication: 70, organization: 40, independence: 85, curiosity: 70, persistence: 55 },
  },
  taurus: {
    name: 'Taurus',
    archetype: 'The Builder',
    revealLine: 'You make things that last, one steady step at a time.',
    adjective: 'Steady',
    element: 'earth',
    stats: { creativity: 65, analytical: 55, empathy: 55, communication: 50, organization: 70, independence: 60, curiosity: 40, persistence: 85 },
  },
  gemini: {
    name: 'Gemini',
    archetype: 'The Messenger',
    revealLine: 'Ideas move through you, and you love passing them on.',
    adjective: 'Quick',
    element: 'air',
    stats: { creativity: 65, analytical: 60, empathy: 50, communication: 85, organization: 40, independence: 55, curiosity: 85, persistence: 40 },
  },
  cancer: {
    name: 'Cancer',
    archetype: 'The Guardian',
    revealLine: 'You look after people and the things that matter to them.',
    adjective: 'Gentle',
    element: 'water',
    stats: { creativity: 60, analytical: 50, empathy: 85, communication: 60, organization: 65, independence: 40, curiosity: 50, persistence: 70 },
  },
  leo: {
    name: 'Leo',
    archetype: 'The Champion',
    revealLine: 'You create, you lead, and people notice when you walk in.',
    adjective: 'Radiant',
    element: 'fire',
    stats: { creativity: 80, analytical: 40, empathy: 55, communication: 80, organization: 40, independence: 65, curiosity: 55, persistence: 65 },
  },
  virgo: {
    name: 'Virgo',
    archetype: 'The Analyst',
    revealLine: 'You see the details others miss and make things work better.',
    adjective: 'Precise',
    element: 'earth',
    stats: { creativity: 45, analytical: 85, empathy: 50, communication: 45, organization: 85, independence: 50, curiosity: 50, persistence: 70 },
  },
  libra: {
    name: 'Libra',
    archetype: 'The Diplomat',
    revealLine: 'You bring people together and find the balance in any room.',
    adjective: 'Graceful',
    element: 'air',
    stats: { creativity: 70, analytical: 60, empathy: 75, communication: 80, organization: 55, independence: 35, curiosity: 55, persistence: 50 },
  },
  scorpio: {
    name: 'Scorpio',
    archetype: 'The Investigator',
    revealLine: "You dig deep and don't stop until you find the truth.",
    adjective: 'Relentless',
    element: 'water',
    // Empathy raised from the spec's 55 to 65 (Scorpio is consistently described as perceptive and
    // intuitive about people), funded by Creativity and Organization. Top 3 unchanged.
    stats: { creativity: 45, analytical: 75, empathy: 65, communication: 40, organization: 45, independence: 70, curiosity: 55, persistence: 85 },
  },
  sagittarius: {
    name: 'Sagittarius',
    archetype: 'The Explorer',
    revealLine: 'You chase new places, new ideas and the big picture.',
    adjective: 'Wandering',
    element: 'fire',
    stats: { creativity: 60, analytical: 55, empathy: 50, communication: 65, organization: 35, independence: 80, curiosity: 85, persistence: 50 },
  },
  capricorn: {
    name: 'Capricorn',
    archetype: 'The Architect',
    revealLine: 'You plan the climb and you finish what you start.',
    adjective: 'Unshakable',
    element: 'earth',
    stats: { creativity: 45, analytical: 70, empathy: 45, communication: 45, organization: 85, independence: 60, curiosity: 45, persistence: 85 },
  },
  aquarius: {
    name: 'Aquarius',
    archetype: 'The Inventor',
    revealLine: "You imagine what doesn't exist yet and go build it.",
    adjective: 'Visionary',
    element: 'air',
    stats: { creativity: 80, analytical: 65, empathy: 45, communication: 50, organization: 35, independence: 80, curiosity: 80, persistence: 45 },
  },
  pisces: {
    name: 'Pisces',
    archetype: 'The Dreamer',
    revealLine: 'You feel deeply and turn imagination into something real.',
    adjective: 'Dreaming',
    element: 'water',
    stats: { creativity: 85, analytical: 45, empathy: 85, communication: 60, organization: 35, independence: 55, curiosity: 65, persistence: 50 },
  },
};

export function getSignStats(sign: SignId): Stats {
  return SIGNS[sign].stats;
}
