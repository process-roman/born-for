// Onboarding answers, held in memory until the character is created. Only the sign is kept,
// never the birth date (Blueprint §13, privacy).

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import type { AttributeId } from '@/content/attributes';
import { CAREERS, type CareerId } from '@/content/careers';
import type { IntentId, WorkStyleId } from '@/content/preferences';
import type { SignId } from '@/content/signs';
import { MAX_WORLDS, type WorldId } from '@/content/worlds';
import { createCharacter, type Character } from '@/logic/character';
import { confirmStats, type PollAnswer, type PollAnswers } from '@/logic/stats';

export interface OnboardingState {
  intent: IntentId | null;
  sign: SignId | null;
  cuspSigns: [SignId, SignId] | null;
  answers: PollAnswers;
  worlds: WorldId[];
  picks: CareerId[];
  workStyle: WorkStyleId | null;
}

type Action =
  | { type: 'intent'; intent: IntentId }
  | { type: 'sign'; sign: SignId; cuspSigns: [SignId, SignId] | null }
  | { type: 'answer'; attribute: AttributeId; answer: PollAnswer }
  | { type: 'resetAnswers' }
  | { type: 'toggleWorld'; world: WorldId }
  | { type: 'togglePick'; careerId: CareerId }
  | { type: 'workStyle'; workStyle: WorkStyleId };

const initial: OnboardingState = { intent: null, sign: null, cuspSigns: null, answers: {}, worlds: [], picks: [], workStyle: null };

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case 'intent':
      return { ...state, intent: action.intent };
    case 'sign':
      // A new sign means the poll is about a different prediction, so start it over.
      return { ...state, sign: action.sign, cuspSigns: action.cuspSigns, answers: action.sign === state.sign ? state.answers : {} };
    case 'answer':
      return { ...state, answers: { ...state.answers, [action.attribute]: action.answer } };
    case 'resetAnswers':
      return { ...state, answers: {} };
    case 'toggleWorld': {
      const has = state.worlds.includes(action.world);
      if (!has && state.worlds.length >= MAX_WORLDS) return state;
      const worlds = has ? state.worlds.filter((w) => w !== action.world) : [...state.worlds, action.world];
      // Keep only picks that still belong to a chosen world.
      const picks = state.picks.filter((id) => CAREERS[id].worlds.some((w) => worlds.includes(w)));
      return { ...state, worlds, picks };
    }
    case 'togglePick': {
      const has = state.picks.includes(action.careerId);
      return { ...state, picks: has ? state.picks.filter((id) => id !== action.careerId) : [...state.picks, action.careerId] };
    }
    case 'workStyle':
      return { ...state, workStyle: action.workStyle };
  }
}

interface OnboardingContextValue {
  state: OnboardingState;
  dispatch: (action: Action) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  const { state } = ctx;
  return {
    ...ctx,
    confirmed: state.sign ? confirmStats(state.sign, state.answers) : null,
    /** The finished character, once every onboarding answer is in. */
    character: (state.sign && state.workStyle && state.worlds.length > 0
      ? createCharacter({
          intent: state.intent ?? undefined,
          sign: state.sign,
          cuspSigns: state.cuspSigns ?? undefined,
          answers: state.answers,
          worlds: state.worlds,
          picks: state.picks,
          workStyle: state.workStyle,
        })
      : null) as Character | null,
  };
}
