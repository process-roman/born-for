// Onboarding Q2 ("What do you enjoy?") and Q3 ("How do you like to work?").

export const PREFERENCE_IDS = [
  'making',
  'puzzles',
  'helping',
  'organizing',
  'leading',
  'learning',
  'tech',
  'performing',
] as const;

export type PreferenceId = (typeof PREFERENCE_IDS)[number];

export const PREFERENCE_LABELS: Record<PreferenceId, string> = {
  making: 'Making and designing things',
  puzzles: 'Solving puzzles and problems',
  helping: 'Helping and supporting people',
  organizing: 'Planning and organizing',
  leading: 'Leading and persuading',
  learning: 'Learning and exploring ideas',
  tech: 'Working with tech',
  performing: 'Performing and presenting',
};

export const MAX_PREFERENCES = 3;

export const WORK_STYLE_IDS = ['solo', 'small_team', 'many', 'unsure'] as const;

export type WorkStyleId = (typeof WORK_STYLE_IDS)[number];

export const WORK_STYLE_LABELS: Record<WorkStyleId, string> = {
  solo: 'On my own',
  small_team: 'Small team',
  many: 'Lots of people',
  unsure: 'Not sure',
};
