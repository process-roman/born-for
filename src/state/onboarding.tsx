// Onboarding answers, held in memory until the character is created. Only the sign is kept,
// never the birth date (Blueprint §13, privacy).

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import type { AttributeId } from '@/content/attributes';
import { MAX_PREFERENCES, type IntentId, type PreferenceId, type WorkStyleId } from '@/content/preferences';
import type { SignId } from '@/content/signs';
import { createCharacter, type Character } from '@/logic/character';
import { confirmStats, type PollAnswer, type PollAnswers } from '@/logic/stats';

export interface OnboardingState {
  intent: IntentId | null;
  sign: SignId | null;
  cuspSigns: [SignId, SignId] | null;
  answers: PollAnswers;
  enjoy: PreferenceId[];
  workStyle: WorkStyleId | null;
}

type Action =
  | { type: 'intent'; intent: IntentId }
  | { type: 'sign'; sign: SignId; cuspSigns: [SignId, SignId] | null }
  | { type: 'answer'; attribute: AttributeId; answer: PollAnswer }
  | { type: 'resetAnswers' }
  | { type: 'toggleEnjoy'; preference: PreferenceId }
  | { type: 'workStyle'; workStyle: WorkStyleId };

const initial: OnboardingState = { intent: null, sign: null, cuspSigns: null, answers: {}, enjoy: [], workStyle: null };

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
    case 'toggleEnjoy': {
      const has = state.enjoy.includes(action.preference);
      if (!has && state.enjoy.length >= MAX_PREFERENCES) return state;
      return { ...state, enjoy: has ? state.enjoy.filter((p) => p !== action.preference) : [...state.enjoy, action.preference] };
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
    character: (state.sign && state.workStyle && state.enjoy.length > 0
      ? createCharacter({
          intent: state.intent ?? undefined,
          sign: state.sign,
          cuspSigns: state.cuspSigns ?? undefined,
          answers: state.answers,
          enjoy: state.enjoy,
          workStyle: state.workStyle,
        })
      : null) as Character | null,
  };
}
