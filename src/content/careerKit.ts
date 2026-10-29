// Shared career types, the full career id list, the quest template and a compact builder for
// careers written in the per-area content files (Pilot Content §2–3).

import type { AttributeId } from './attributes';
import type { WorkStyleId } from './preferences';
import type { WorldId } from './worlds';

export const CAREER_IDS = [
  // Original 24 (careers/core.ts)
  'ux_design', 'florist', 'software_dev', 'data_analysis', 'marketing', 'project_coord', 'teaching', 'social_work',
  'nursing', 'physio', 'athlete', 'personal_trainer', 'vet_nurse', 'landscape_gardener', 'electrician', 'carpenter',
  'chef', 'event_planner', 'musician', 'writer', 'lab_scientist', 'env_scientist', 'firefighter', 'law',
  // Business (careers/business.ts)
  'entrepreneur', 'ecommerce_owner', 'sales', 'recruiter', 'accountant', 'real_estate',
  // Fashion & Beauty, Creators, Gaming (careers/creative.ts)
  'fashion_designer', 'stylist', 'makeup_artist', 'hairdresser', 'fashion_buyer', 'nail_artist', 'model',
  'youtuber', 'streamer', 'influencer', 'podcaster', 'social_media_manager', 'video_editor', 'photographer',
  'game_developer', 'game_designer', 'game_artist', 'esports_player', 'esports_caster', 'qa_tester',
  // Art, Music, Writing (careers/arts.ts)
  'graphic_designer', 'illustrator', 'animator', 'tattoo_artist', 'interior_designer', 'architect',
  'music_producer', 'actor', 'dancer', 'sound_engineer', 'journalist', 'copywriter', 'screenwriter',
  // Tech, Sport, Health, People (careers/people.ts)
  'ai_engineer', 'cybersecurity', 'app_developer', 'it_support', 'sports_coach', 'sports_analyst', 'yoga_instructor',
  'doctor', 'paramedic', 'psychologist', 'pharmacist', 'nutritionist', 'early_childhood', 'counsellor', 'youth_worker',
  // Nature, Food, Build, Travel, Science, Public (careers/practical.ts)
  'veterinarian', 'marine_biologist', 'park_ranger', 'farmer', 'pastry_chef', 'barista', 'bartender', 'hotel_manager',
  'mechanic', 'plumber', 'welder', 'drone_pilot', 'pilot', 'flight_attendant', 'tour_guide', 'travel_creator',
  'astronomer', 'chemist', 'police_officer', 'diplomat', 'policy_advisor',
] as const;

export type CareerId = (typeof CAREER_IDS)[number];

export type QuestTier = 'taste' | 'try' | 'test';

export type QuestStep = 'discover' | 'day' | 'beginner' | 'own' | 'real';

/** Star number within a constellation; matches the quest number. Star 5 is the Test "boss" star. */
export type StarNumber = 1 | 2 | 3 | 4 | 5;

export interface Quest {
  star: StarNumber;
  tier: QuestTier;
  step: QuestStep;
  name: string;
  instructions: string;
  /** "What you'll learn", one line. */
  learn: string;
  time: string;
  attributes: readonly [AttributeId, AttributeId];
}

export interface AttributeRequirement {
  attribute: AttributeId;
  required: number;
  weight: number;
}

export interface Constellation {
  name: string;
  /** x, y on a 0–100 grid from top-left, indexed by star number − 1. */
  stars: readonly [number, number][];
  lines: readonly [StarNumber, StarNumber][];
}

export interface RealNextSteps {
  learn: string[];
  community: string[];
  entryRoles: string[];
  searchFor: string[];
}

export interface Career {
  id: CareerId;
  name: string;
  worlds: readonly WorldId[];
  /** Hybrid-title class (Blueprint §6). */
  className: string;
  /** Item overlay for character level 4 (Blueprint §7). Placeholders until the art exists. */
  item: string;
  oneLiner: string;
  /** Shown on long-shot careers: honest about how narrow the path is, and what's around it. */
  realityCheck?: string;
  dayToDay: string[];
  downsides: string[];
  education: string;
  requirements: readonly AttributeRequirement[];
  workStyles: readonly WorkStyleId[];
  quests: readonly Quest[];
  constellation: Constellation;
  nextSteps: RealNextSteps;
}

// ---------------------------------------------------------------------------------------------
// Quest template: Discover → Day in the life → Beginner version → Make it yours → Real world.

export interface QuestDraft {
  name: string;
  instructions: string;
  learn: string;
  attributes: readonly [AttributeId, AttributeId];
}

const TEMPLATE: readonly { step: QuestStep; tier: QuestTier; time: string }[] = [
  { step: 'discover', tier: 'taste', time: '20 min' },
  { step: 'day', tier: 'taste', time: '20 min' },
  { step: 'beginner', tier: 'try', time: '1–2 h' },
  { step: 'own', tier: 'try', time: '1–2 h' },
  { step: 'real', tier: 'test', time: 'Real world' },
];

/** `role` includes its article: "a florist", "an electrician". */
function dayInTheLife(role: string, attribute: AttributeId): QuestDraft {
  return {
    name: `A day as ${role}`,
    instructions: `Watch a 10-minute "day in the life of ${role}" video or read an interview with one. Write three tasks you'd enjoy and one you wouldn't.`,
    learn: 'What the job really looks like day to day.',
    attributes: ['curiosity', attribute],
  };
}

export function questsFor(
  role: string,
  dayAttribute: AttributeId,
  s: { discover: QuestDraft; beginner: QuestDraft; own: QuestDraft; real: QuestDraft },
): Quest[] {
  const drafts = [s.discover, dayInTheLife(role, dayAttribute), s.beginner, s.own, s.real];
  return drafts.map((d, i) => ({ ...d, ...TEMPLATE[i]!, star: (i + 1) as StarNumber }));
}

// ---------------------------------------------------------------------------------------------
// Generated constellations for careers without a hand-drawn shape.

function seeded(id: string): () => number {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let seed = (h >>> 0) % 2147483646 || 1;
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

/** Five stars spread around the grid, joined in order with one cross-link, so every shape differs. */
export function generatedConstellation(id: string, name: string): Constellation {
  const rand = seeded(id);
  const stars = Array.from({ length: 5 }, (_, i): [number, number] => {
    const angle = (i / 5) * Math.PI * 2 + rand() * 0.9;
    const r = 24 + rand() * 18;
    return [Math.round(50 + Math.cos(angle) * r), Math.round(50 + Math.sin(angle) * r)];
  });
  const cross: [StarNumber, StarNumber] = rand() < 0.5 ? [2, 5] : [1, 4];
  return { name, stars, lines: [[1, 2], [2, 3], [3, 4], [4, 5], cross] };
}

// ---------------------------------------------------------------------------------------------
// Compact builder for the per-area content files.

/** [name, instructions, what you'll learn, trait, trait] */
export type Q = [string, string, string, AttributeId, AttributeId];

export interface JobDef {
  id: CareerId;
  name: string;
  worlds: WorldId[];
  className: string;
  item: string;
  /** Constellation name without "The". */
  sigil: string;
  oneLiner: string;
  realityCheck?: string;
  day: string[];
  downsides: string[];
  education: string;
  /** [trait, required, weight] ×3; weights sum to 1. */
  req: [AttributeId, number, number][];
  work: WorkStyleId[];
  /** With article: "a stylist". */
  role: string;
  dayAttr: AttributeId;
  discover: Q;
  beginner: Q;
  own: Q;
  real: Q;
  /** [learn, community, entry roles, search for] */
  next: [string[], string[], string[], string[]];
}

const draft = ([name, instructions, learn, a, b]: Q): QuestDraft => ({ name, instructions, learn, attributes: [a, b] });

export function job(d: JobDef): Career {
  return {
    id: d.id,
    name: d.name,
    worlds: d.worlds,
    className: d.className,
    item: d.item,
    oneLiner: d.oneLiner,
    realityCheck: d.realityCheck,
    dayToDay: d.day,
    downsides: d.downsides,
    education: d.education,
    requirements: d.req.map(([attribute, required, weight]) => ({ attribute, required, weight })),
    workStyles: d.work,
    quests: questsFor(d.role, d.dayAttr, {
      discover: draft(d.discover),
      beginner: draft(d.beginner),
      own: draft(d.own),
      real: draft(d.real),
    }),
    constellation: generatedConstellation(d.id, `The ${d.sigil}`),
    nextSteps: { learn: d.next[0], community: d.next[1], entryRoles: d.next[2], searchFor: d.next[3] },
  };
}
