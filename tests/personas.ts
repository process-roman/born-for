// The five test personas (Pilot Content §5), now with direction-first answers: worlds, then job picks.

import type { OnboardingInput } from '../src/logic/character';

export const MAYA: OnboardingInput = {
  sign: 'cancer',
  answers: {},
  worlds: ['people', 'business'],
  picks: ['teaching'],
  workStyle: 'many',
};

export const LIAM: OnboardingInput = {
  sign: 'cancer',
  answers: { empathy: 'no', analytical: 'yes', curiosity: 'yes', independence: 'yes' },
  worlds: ['tech', 'science'],
  picks: ['software_dev', 'ai_engineer'],
  workStyle: 'solo',
};

export const ZOE: OnboardingInput = {
  sign: 'leo',
  answers: {},
  worlds: ['creators', 'music', 'business'],
  picks: ['youtuber', 'actor'],
  workStyle: 'many',
};

export const NOAH: OnboardingInput = {
  sign: 'virgo',
  answers: { creativity: 'sometimes' },
  worlds: ['art', 'build'],
  picks: ['ux_design'],
  workStyle: 'small_team',
};

export const AVA: OnboardingInput = {
  sign: 'pisces',
  answers: { organization: 'no', communication: 'sometimes' },
  worlds: ['health', 'art', 'nature'],
  picks: [],
  workStyle: 'unsure',
};
