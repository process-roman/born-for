// Life simulator engine (Life Sim Spec §3–§8, §14). A port of balance_check.py, which stays the reference.
// Pure functions over a LifeRun, so a run can be saved after every choice and resumed exactly.
// The sim never changes real stats: they're snapshotted when the life starts.

import { ATTRIBUTE_IDS, type AttributeId, type Stats } from '../content/attributes';
import type { CareerId } from '../content/careers';
import type { CareerLife, Check, Choice, Condition, Effects, Ending, EventKind, LifeEvent, Meter, Meters, Outcome, Stage } from '../content/life';
import { METERS } from '../content/life';
import type { Element } from '../content/signs';

export interface Slot {
  stage: Stage;
  kind: EventKind;
  age: number;
}

/** The fixed shape of every life: 10 slots (§3). */
export const LIFE_SLOTS: readonly Slot[] = [
  { stage: 'start', kind: 'opener', age: 18 },
  { stage: 'training', kind: 'career', age: 19 },
  { stage: 'training', kind: 'life', age: 21 },
  { stage: 'breaking_in', kind: 'job_hunt', age: 22 },
  { stage: 'breaking_in', kind: 'career', age: 23 },
  { stage: 'first_job', kind: 'career', age: 24 },
  { stage: 'first_job', kind: 'sign', age: 25 },
  { stage: 'crossroads', kind: 'crossroads', age: 26 },
  { stage: 'crossroads', kind: 'life', age: 28 },
  { stage: 'thirty', kind: 'finale', age: 29 },
];

export const START_METERS: Meters = { joy: 50, energy: 65, money: 30, mastery: 0 };
export const MAX_FORCED_PER_LIFE = 2;
export const ODDS_FLOOR = 15;
export const ODDS_CEILING = 90;
export const AGE_AT_END = 30;
export const MAX_HIGHLIGHTS = 3;
export const NO_HIGHLIGHTS_LINE = 'Made it to 30 your own way.';
/** Quest XP for finishing a career's life the first time (§13). */
export const LIFE_XP = 25;

export interface CheckLog {
  attribute: AttributeId;
  odds: number;
  success: boolean;
}

export interface LifeRun {
  id: string;
  career: CareerId;
  seed: number;
  startedAt: string;
  statsSnapshot: Stats;
  element: Element;
  /** Slots finished (played or skipped); the index of the next slot. */
  slotIndex: number;
  meters: Meters;
  flags: string[];
  usedEventIds: string[];
  forcedCount: number;
  log: { eventId: string; choiceId: string; check?: CheckLog }[];
  highlights: string[];
  /** Event currently on screen. */
  pendingEventId?: string;
  completed?: {
    endingId: string;
    role: string;
    finishedAt: string;
    wouldWant?: 'yes' | 'maybe' | 'no';
  };
}

/** What conditions look at. A LifeRun is one. */
export interface LifeState {
  flags: readonly string[];
  meters: Meters;
  element: Element;
}

// ---------------------------------------------------------------------------------------------
// Seeded randomness. Every random decision draws from (seed, purpose, step), so a run needs no
// extra RNG state to resume, and the same seed + choices always give the same life.

function mulberry32(state: number): () => number {
  let a = state | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A seeded stream of numbers in [0, 1), for simulations (e.g. the balance script). */
export function createRng(seed: number): () => number {
  return mulberry32(seed);
}

const PICK = 1;
const ROLL = 2;

function draw(seed: number, purpose: number, step: number): number {
  let h = Math.imul((seed >>> 0) ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ purpose, 0xc2b2ae35);
  h = Math.imul(h ^ (step + 0x632be5ab), 0x27d4eb2f);
  return mulberry32(h ^ (h >>> 15))();
}

// ---------------------------------------------------------------------------------------------
// Odds and conditions (§5, §7).

/** Python's round(): halves go to the even neighbor. The reference engine uses it, so odds match. */
function roundHalfEven(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;
  if (Math.abs(diff - 0.5) > 1e-9) return Math.round(x);
  return floor % 2 === 0 ? floor : floor + 1;
}

/** Bonuses from flags the player has, for the odds pill ("+10 from your portfolio"). */
export function activeBonuses(check: Check, flags: readonly string[]): { flag: string; value: number }[] {
  return Object.entries(check.bonus ?? {})
    .filter(([flag]) => flags.includes(flag))
    .map(([flag, value]) => ({ flag, value }));
}

/** raw = 50 + 1.5 × (stat − difficulty) + bonuses, clamped to 15–90 and rounded. */
export function oddsFor(stats: Stats, check: Check, flags: readonly string[]): number {
  const bonus = activeBonuses(check, flags).reduce((sum, b) => sum + b.value, 0);
  const raw = 50 + 1.5 * (stats[check.attribute] - check.difficulty) + bonus;
  return roundHalfEven(Math.max(ODDS_FLOOR, Math.min(ODDS_CEILING, raw)));
}

/** All parts of a condition must pass; `anyOf` needs at least one sub-condition. */
export function meets(cond: Condition | undefined, state: LifeState): boolean {
  if (!cond) return true;
  if (cond.anyOf && !cond.anyOf.some((c) => meets(c, state))) return false;
  if (cond.flagsAll?.some((f) => !state.flags.includes(f))) return false;
  if (cond.flagsNone?.some((f) => state.flags.includes(f))) return false;
  for (const [m, v] of Object.entries(cond.meterMin ?? {})) if (state.meters[m as Meter] < v) return false;
  for (const [m, v] of Object.entries(cond.meterMax ?? {})) if (state.meters[m as Meter] > v) return false;
  if (cond.elements && !cond.elements.includes(state.element)) return false;
  return true;
}

/** Choices whose `requires` condition passes; the rest are hidden. */
export function visibleChoices(event: LifeEvent, state: LifeState): Choice[] {
  return event.choices.filter((c) => meets(c.requires, state));
}

// ---------------------------------------------------------------------------------------------
// Running a life.

export function eventById(life: CareerLife, shared: readonly LifeEvent[], id: string): LifeEvent {
  const event = life.events.find((e) => e.id === id) ?? shared.find((e) => e.id === id);
  if (!event) throw new Error(`Unknown life event: ${id}`);
  return event;
}

/** Eligible events for the slot, keep the highest priority, then a weighted pick (§7). */
function pickEvent(pool: readonly LifeEvent[], slot: Slot, run: LifeRun, r: number): LifeEvent | null {
  let eligible = pool.filter(
    (e) => e.kind === slot.kind && e.stages?.includes(slot.stage) && !run.usedEventIds.includes(e.id) && meets(e.conditions, run),
  );
  if (eligible.length === 0) return null;
  const top = Math.max(...eligible.map((e) => e.priority ?? 0));
  eligible = eligible.filter((e) => (e.priority ?? 0) === top);
  const total = eligible.reduce((sum, e) => sum + (e.weight ?? 1), 0);
  let x = r * total;
  for (const e of eligible) {
    x -= e.weight ?? 1;
    if (x < 0) return e;
  }
  return eligible.at(-1)!;
}

export interface NewLife {
  id: string;
  career: CareerId;
  seed: number;
  startedAt: string;
  stats: Stats;
  element: Element;
}

export interface Advance {
  run: LifeRun;
  /** Slots with no eligible event, as "stage/kind". Never expected with current content. */
  skipped: string[];
}

export function startLife(life: CareerLife, shared: readonly LifeEvent[], params: NewLife): Advance {
  const run: LifeRun = {
    id: params.id,
    career: params.career,
    seed: params.seed >>> 0,
    startedAt: params.startedAt,
    statsSnapshot: { ...params.stats },
    element: params.element,
    slotIndex: 0,
    meters: { ...START_METERS },
    flags: [],
    usedEventIds: [],
    forcedCount: 0,
    log: [],
    highlights: [],
  };
  return advance(life, shared, run, params.startedAt);
}

/**
 * Moves to the next event: forced events whose trigger is met come right after a slot (at most 2
 * per life, in file order), then the next slot's event. After the last slot, the life completes.
 */
export function advance(life: CareerLife, shared: readonly LifeEvent[], current: LifeRun, now: string = new Date().toISOString()): Advance {
  if (current.completed || current.pendingEventId) return { run: current, skipped: [] };
  const run: LifeRun = { ...current, meters: { ...current.meters }, flags: [...current.flags], usedEventIds: [...current.usedEventIds] };
  const pool = [...life.events, ...shared];
  const forced = shared.filter((e) => e.kind === 'forced');
  const skipped: string[] = [];

  // Where the forced-event pass resumes: none before the first slot, after the last forced event
  // played, or from the top after a slot event.
  const last = run.log.at(-1);
  let cursor: number | null = run.log.length === 0 && run.slotIndex === 0 ? null : 0;
  if (last) {
    const i = forced.findIndex((f) => f.id === last.eventId);
    if (i >= 0) cursor = i + 1;
  }

  for (;;) {
    if (cursor !== null) {
      if (run.forcedCount < MAX_FORCED_PER_LIFE) {
        const next = forced.slice(cursor).find((f) => !run.usedEventIds.includes(f.id) && meets(f.trigger, run));
        if (next) {
          run.usedEventIds.push(next.id);
          run.forcedCount += 1;
          run.pendingEventId = next.id;
          return { run, skipped };
        }
      }
      cursor = null;
    }
    const slot = LIFE_SLOTS[run.slotIndex];
    if (!slot) {
      const ending = endingFor(life, run);
      run.completed = { endingId: ending.id, role: roleFor(life, ending, run), finishedAt: now };
      return { run, skipped };
    }
    const event = pickEvent(pool, slot, run, draw(run.seed, PICK, run.slotIndex));
    if (event) {
      run.usedEventIds.push(event.id);
      run.pendingEventId = event.id;
      return { run, skipped };
    }
    skipped.push(`${slot.stage}/${slot.kind}`);
    run.slotIndex += 1;
    cursor = 0;
  }
}

function applyEffects(run: LifeRun, effects: Effects): void {
  for (const m of METERS) {
    const delta = effects[m];
    if (delta !== undefined) run.meters[m] = Math.max(0, Math.min(100, run.meters[m] + delta));
  }
  for (const f of effects.set ?? []) if (!run.flags.includes(f)) run.flags.push(f);
  if (effects.clear) run.flags = run.flags.filter((f) => !effects.clear!.includes(f));
  if (effects.highlight) run.highlights.push(effects.highlight);
}

export interface Resolution {
  /** The run after the outcome, before moving on (no pending event). */
  run: LifeRun;
  event: LifeEvent;
  choice: Choice;
  outcome: Outcome;
  check?: CheckLog;
  /** Actual meter changes after clamping, for the "+10 Mastery" animation. */
  deltas: Partial<Meters>;
}

/** Plays a choice on the event on screen: rolls a check if it has one, then applies the outcome. */
export function resolveChoice(life: CareerLife, shared: readonly LifeEvent[], current: LifeRun, choiceId: string): Resolution {
  if (!current.pendingEventId) throw new Error('No event on screen');
  const event = eventById(life, shared, current.pendingEventId);
  const choice = visibleChoices(event, current).find((c) => c.id === choiceId);
  if (!choice) throw new Error(`Choice ${choiceId} isn't available on ${event.id}`);
  const run: LifeRun = {
    ...current,
    meters: { ...current.meters },
    flags: [...current.flags],
    highlights: [...current.highlights],
    log: [...current.log],
    pendingEventId: undefined,
  };

  let outcome: Outcome;
  let check: CheckLog | undefined;
  if (choice.check) {
    const odds = oddsFor(run.statsSnapshot, choice.check, run.flags);
    const success = draw(run.seed, ROLL, run.log.length) * 100 < odds;
    check = { attribute: choice.check.attribute, odds, success };
    outcome = success ? choice.success! : choice.fail!;
  } else {
    outcome = choice.result!;
  }

  const before = { ...run.meters };
  applyEffects(run, outcome.effects);
  const deltas: Partial<Meters> = {};
  for (const m of METERS) if (run.meters[m] !== before[m]) deltas[m] = run.meters[m] - before[m];

  run.log.push(check ? { eventId: event.id, choiceId, check } : { eventId: event.id, choiceId });
  if (event.kind !== 'forced') run.slotIndex += 1;
  return { run, event, choice, outcome, check, deltas };
}

/** resolveChoice, then on to the next event. `run` is ready to save; `outcome` is what to show now. */
export function choose(
  life: CareerLife,
  shared: readonly LifeEvent[],
  current: LifeRun,
  choiceId: string,
  now?: string,
): Resolution & { skipped: string[] } {
  const resolution = resolveChoice(life, shared, current, choiceId);
  const next = advance(life, shared, resolution.run, now);
  return { ...resolution, run: next.run, skipped: next.skipped };
}

/** Plays a whole life with a chooser, e.g. for tests and the balance script. */
export function playLife(
  life: CareerLife,
  shared: readonly LifeEvent[],
  params: NewLife,
  chooser: (event: LifeEvent, choices: Choice[], run: LifeRun) => Choice,
): { run: LifeRun; skipped: string[] } {
  let { run, skipped } = startLife(life, shared, params);
  while (run.pendingEventId) {
    const event = eventById(life, shared, run.pendingEventId);
    const choice = chooser(event, visibleChoices(event, run), run);
    const next = choose(life, shared, run, choice.id, params.startedAt);
    run = next.run;
    skipped = [...skipped, ...next.skipped];
  }
  return { run, skipped };
}

// ---------------------------------------------------------------------------------------------
// Life at 30 (§8).

/** The first ending whose condition passes; the last one always does. */
export function endingFor(life: CareerLife, state: LifeState): Ending {
  return life.endings.find((e) => meets(e.when, state)) ?? life.endings.at(-1)!;
}

export function roleFor(life: CareerLife, ending: Ending, state: LifeState): string {
  if (ending.roleOverride) return ending.roleOverride;
  const byFlag = life.roles.byFlag.find((r) => state.flags.includes(r.flag));
  if (byFlag) return byFlag.role;
  return life.roles.byMastery.find((r) => state.meters.mastery >= r.min)?.role ?? life.roles.byMastery.at(-1)!.role;
}

/** Up to 3 highlights, most recent first. Empty means show NO_HIGHLIGHTS_LINE. */
export function highlightsFor(run: LifeRun): string[] {
  return run.highlights.slice(-MAX_HIGHLIGHTS).reverse();
}

export interface AttributeAsk {
  attribute: AttributeId;
  count: number;
  /** The user's average odds on this attribute's checks, rounded. */
  odds: number;
}

/**
 * "What this life asked of you": the two most-checked attributes with the average odds. The one
 * with the lower odds is the power-up suggestion.
 */
export function lifeAsks(run: LifeRun): { asks: AttributeAsk[]; powerUp: AttributeId | null } {
  const byAttribute = new Map<AttributeId, number[]>();
  for (const entry of run.log) if (entry.check) byAttribute.set(entry.check.attribute, [...(byAttribute.get(entry.check.attribute) ?? []), entry.check.odds]);
  const asks = [...byAttribute.entries()]
    .map(([attribute, odds]) => ({ attribute, count: odds.length, odds: Math.round(odds.reduce((a, b) => a + b, 0) / odds.length) }))
    .sort((a, b) => b.count - a.count || a.odds - b.odds || ATTRIBUTE_IDS.indexOf(a.attribute) - ATTRIBUTE_IDS.indexOf(b.attribute))
    .slice(0, 2);
  const weakest = [...asks].sort((a, b) => a.odds - b.odds)[0];
  return { asks, powerUp: weakest?.attribute ?? null };
}

// ---------------------------------------------------------------------------------------------
// Helpers for screens.

/** Age shown for the event on screen; forced events use the previous slot's age (§6). */
export function ageFor(run: LifeRun, event: LifeEvent): number {
  if (run.completed) return AGE_AT_END;
  const index = event.kind === 'forced' ? run.slotIndex - 1 : run.slotIndex;
  return LIFE_SLOTS[Math.max(0, Math.min(LIFE_SLOTS.length - 1, index))]!.age;
}

export function stageFor(run: LifeRun, event: LifeEvent): Stage {
  const index = event.kind === 'forced' ? run.slotIndex - 1 : run.slotIndex;
  return LIFE_SLOTS[Math.max(0, Math.min(LIFE_SLOTS.length - 1, index))]!.stage;
}

/** The attributes this career's checks lean on most, for the life intro ("your odds" preview). */
export function mostCheckedAttributes(life: CareerLife, count = 3): AttributeId[] {
  const tally = new Map<AttributeId, number>();
  for (const e of life.events) for (const c of e.choices) if (c.check) tally.set(c.check.attribute, (tally.get(c.check.attribute) ?? 0) + 1);
  return [...tally.entries()]
    .sort((a, b) => b[1] - a[1] || ATTRIBUTE_IDS.indexOf(a[0]) - ATTRIBUTE_IDS.indexOf(b[0]))
    .slice(0, count)
    .map(([a]) => a);
}

/**
 * The user's odds on a typical check of this attribute in this career (its average difficulty),
 * for the life intro. Null when the career never checks it.
 */
export function typicalOdds(life: CareerLife, attribute: AttributeId, stats: Stats): number | null {
  const difficulties = life.events.flatMap((e) => e.choices.flatMap((c) => (c.check?.attribute === attribute ? [c.check.difficulty] : [])));
  if (difficulties.length === 0) return null;
  const difficulty = difficulties.reduce((a, b) => a + b, 0) / difficulties.length;
  return oddsFor(stats, { attribute, difficulty }, []);
}

export interface LifeTokens {
  archetype: string;
  sign: string;
  title: string;
}

/** Replaces {archetype}, {sign} and {title} in event text, sign lines and endings (§10). */
export function fillTokens(text: string, tokens: LifeTokens): string {
  return text.replace(/\{(archetype|sign|title)\}/g, (_, key: keyof LifeTokens) => tokens[key]);
}
