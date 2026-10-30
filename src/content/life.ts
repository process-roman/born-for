// Life simulator content: types for the JSON files and the loaded lives (Life Sim Spec §9, §10).
// Event text lives in the JSON files only; never hard-code it in components.

import type { AttributeId } from './attributes';
import type { CareerId } from './careers';
import type { Element } from './signs';
import uxDesign from './lives/ux_design.json';
import shared from './shared_events.json';

export const METERS = ['joy', 'energy', 'money', 'mastery'] as const;
export type Meter = (typeof METERS)[number];
export type Meters = Record<Meter, number>;

export const STAGES = ['start', 'training', 'breaking_in', 'first_job', 'crossroads', 'thirty'] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_NAMES: Record<Stage, string> = {
  start: 'Start',
  training: 'Training',
  breaking_in: 'Breaking In',
  first_job: 'First Job',
  crossroads: 'Crossroads',
  thirty: 'Thirty',
};

export const EVENT_KINDS = ['opener', 'career', 'job_hunt', 'crossroads', 'finale', 'life', 'sign', 'forced'] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

export interface Condition {
  flagsAll?: string[];
  flagsNone?: string[];
  meterMin?: Partial<Meters>;
  meterMax?: Partial<Meters>;
  elements?: Element[];
  anyOf?: Condition[];
}

export interface Effects extends Partial<Meters> {
  /** Flags to add. */
  set?: string[];
  /** Flags to remove. */
  clear?: string[];
  /** Shown on the Life at 30 card. */
  highlight?: string;
}

export interface Outcome {
  text: string;
  effects: Effects;
}

export interface Check {
  attribute: AttributeId;
  difficulty: number;
  /** Flag → bonus percentage points. */
  bonus?: Record<string, number>;
}

export interface Choice {
  id: string;
  label: string;
  /** Short trade-off line under the label. */
  hint?: string;
  requires?: Condition;
  /** With a check, `success` and `fail` are required; without one, `result` is. */
  check?: Check;
  success?: Outcome;
  fail?: Outcome;
  result?: Outcome;
}

export interface LifeEvent {
  id: string;
  kind: EventKind;
  /** Not used by forced events. */
  stages?: Stage[];
  /** Forced events only. */
  trigger?: Condition;
  conditions?: Condition;
  /** Default 0. */
  priority?: number;
  /** Default 1. */
  weight?: number;
  /** Phosphor icon name, kebab-case. */
  icon: string;
  title: string;
  text: string;
  signLines?: Partial<Record<Element, string>>;
  realityNote?: { text: string; verified: boolean; source?: string };
  choices: Choice[];
}

export interface Ending {
  id: string;
  name: string;
  /** `{}` = always. */
  when: Condition;
  roleOverride?: string;
  text: string;
}

export interface CareerLife {
  career: CareerId;
  /** "Designer". */
  lifeName: string;
  /** "Shaper", matches the title system. */
  class: string;
  roles: {
    byFlag: { flag: string; role: string }[];
    /** Ordered high to low. */
    byMastery: { min: number; role: string }[];
  };
  endings: Ending[];
  events: LifeEvent[];
}

// The JSON is checked by validateLife (tests and the balance script), so a cast is enough here.
export const SHARED_EVENTS = (shared as unknown as { events: LifeEvent[] }).events;

export const LIVES: Partial<Record<CareerId, CareerLife>> = {
  ux_design: uxDesign as unknown as CareerLife,
};

export const LIFE_CAREER_IDS = Object.keys(LIVES) as CareerId[];

export function lifeFor(careerId: CareerId): CareerLife | null {
  return LIVES[careerId] ?? null;
}

/** Human-readable labels for check bonuses, e.g. "+10 from your portfolio" (§10). */
export const BONUS_LABELS: Record<string, string> = {
  has_portfolio: 'your portfolio',
  had_internship: 'your internship',
  design_friend: 'your design friends',
  has_mentor: 'your mentor',
  freelance: 'your freelance experience',
  manager: 'your management experience',
};
