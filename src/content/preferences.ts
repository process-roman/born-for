// Onboarding questions (Signs & Onboarding Spec §3). All tap-only.

export interface Option<Id extends string> {
  id: Id;
  emoji: string;
  label: string;
}

// Q1: "What brings you here?" (single choice, before the birthday)

export const INTENT_IDS = ['discover', 'career', 'change', 'curious'] as const;

export type IntentId = (typeof INTENT_IDS)[number];

export const INTENTS: readonly Option<IntentId>[] = [
  { id: 'discover', emoji: '🔮', label: 'Discover who I am' },
  { id: 'career', emoji: '🧭', label: 'Find a career direction' },
  { id: 'change', emoji: '🔄', label: "I'm thinking about changing careers" },
  { id: 'curious', emoji: '✨', label: 'Just curious about my sign' },
];

// Q2: "What do you enjoy most?" (pick up to 3, after confirming stats)

export const PREFERENCE_IDS = [
  'making',
  'puzzles',
  'helping',
  'organizing',
  'leading',
  'learning',
  'tech',
  'performing',
  'active',
  'nature',
  'building',
  'food',
] as const;

export type PreferenceId = (typeof PREFERENCE_IDS)[number];

export const PREFERENCES: readonly Option<PreferenceId>[] = [
  { id: 'making', emoji: '🎨', label: 'Making and designing things' },
  { id: 'puzzles', emoji: '🧩', label: 'Solving puzzles and problems' },
  { id: 'helping', emoji: '🤝', label: 'Helping and supporting people' },
  { id: 'organizing', emoji: '📋', label: 'Planning and organizing' },
  { id: 'leading', emoji: '📣', label: 'Leading and persuading' },
  { id: 'learning', emoji: '🔭', label: 'Learning and exploring ideas' },
  { id: 'tech', emoji: '💻', label: 'Working with tech' },
  { id: 'performing', emoji: '🎤', label: 'Performing and presenting' },
  { id: 'active', emoji: '🏃', label: 'Being active and playing sport' },
  { id: 'nature', emoji: '🌿', label: 'Nature, plants and animals' },
  { id: 'building', emoji: '🔧', label: 'Building and fixing things' },
  { id: 'food', emoji: '🍳', label: 'Food and cooking' },
];

export const PREFERENCE_LABELS = labelsOf(PREFERENCES);

export const MAX_PREFERENCES = 3;

// Q3: "How do you like to work?" (single choice)

export const WORK_STYLE_IDS = ['solo', 'small_team', 'many', 'unsure'] as const;

export type WorkStyleId = (typeof WORK_STYLE_IDS)[number];

export const WORK_STYLES: readonly Option<WorkStyleId>[] = [
  { id: 'solo', emoji: '🧍', label: 'Mostly on my own' },
  { id: 'small_team', emoji: '👥', label: 'In a small team' },
  { id: 'many', emoji: '🌐', label: 'With lots of different people' },
  { id: 'unsure', emoji: '🤷', label: 'Not sure yet' },
];

export const WORK_STYLE_LABELS = labelsOf(WORK_STYLES);

function labelsOf<Id extends string>(options: readonly Option<Id>[]): Record<Id, string> {
  return Object.fromEntries(options.map((o) => [o.id, o.label])) as Record<Id, string>;
}
