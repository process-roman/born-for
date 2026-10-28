// The five test personas from Pilot Content §5.

import type { OnboardingInput } from '../src/logic/character';

export const MAYA: OnboardingInput = {
  sign: 'cancer',
  answers: {},
  enjoy: ['helping', 'organizing'],
  workStyle: 'many',
};

export const LIAM: OnboardingInput = {
  sign: 'cancer',
  answers: { empathy: 'no', analytical: 'yes', curiosity: 'yes', independence: 'yes' },
  enjoy: ['puzzles', 'tech'],
  workStyle: 'solo',
};

export const ZOE: OnboardingInput = {
  sign: 'leo',
  answers: {},
  enjoy: ['leading', 'performing', 'making'],
  workStyle: 'many',
};

export const NOAH: OnboardingInput = {
  sign: 'virgo',
  answers: { creativity: 'sometimes' },
  enjoy: ['making'],
  workStyle: 'small_team',
};

export const AVA: OnboardingInput = {
  sign: 'pisces',
  answers: { organization: 'no', communication: 'sometimes' },
  enjoy: ['helping', 'making', 'learning'],
  workStyle: 'unsure',
};
