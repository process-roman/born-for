import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_IDS, type Stats } from '../src/content/attributes';
import { LIFE_CAREER_IDS, LIVES, SHARED_EVENTS, type CareerLife, type Check, type LifeEvent } from '../src/content/life';
import { SIGN_IDS, SIGNS } from '../src/content/signs';
import {
  ageFor,
  choose,
  endingFor,
  eventById,
  endingsFound,
  fillTokens,
  mostCheckedAttributes,
  typicalOdds,
  LIFE_SLOTS,
  lifeAsks,
  meets,
  oddsFor,
  playLife,
  roleFor,
  startLife,
  type LifeRun,
  type LifeState,
  type NewLife,
} from '../src/logic/life';
import { validateLife } from '../src/logic/lifeValidate';

const designer = LIVES.ux_design!;
const statsAll = (v: number): Stats => Object.fromEntries(ATTRIBUTE_IDS.map((a) => [a, v])) as Stats;
const check = (difficulty: number, bonus?: Record<string, number>): Check => ({ attribute: 'persistence', difficulty, bonus });
const odds = (stat: number, c: Check, flags: string[] = []) => oddsFor({ ...statsAll(50), persistence: stat }, c, flags);
const state = (over: Partial<LifeState> = {}): LifeState => ({ flags: [], meters: { joy: 50, energy: 65, money: 30, mastery: 0 }, element: 'water', ...over });
const params = (seed: number, over: Partial<NewLife> = {}): NewLife => ({
  id: `run-${seed}`,
  career: 'ux_design',
  seed,
  startedAt: '2026-10-30T12:00:00Z',
  stats: SIGNS.cancer.stats,
  element: 'water',
  ...over,
});
const first = (_e: LifeEvent, choices: LifeEvent['choices']) => choices[0]!;

describe('odds', () => {
  it('matches the spec examples at difficulty 60', () => {
    expect(odds(85, check(60))).toBe(88);
    expect(odds(70, check(60))).toBe(65);
    expect(odds(60, check(60))).toBe(50);
    expect(odds(50, check(60))).toBe(35);
  });

  it('never goes below 15% or above 90%', () => {
    expect(odds(35, check(60))).toBe(15);
    expect(odds(0, check(70))).toBe(15);
    expect(odds(100, check(40))).toBe(90);
  });

  it('adds bonuses only for flags the player has, before clamping', () => {
    const c = check(65, { has_portfolio: 10, had_internship: 10 });
    expect(odds(60, c)).toBe(42); // 42.5 rounds to even
    expect(odds(60, c, ['has_portfolio'])).toBe(52); // 52.5 → 52
    expect(odds(60, c, ['has_portfolio', 'had_internship'])).toBe(62); // 62.5 → 62
    expect(odds(85, c, ['has_portfolio', 'had_internship'])).toBe(90);
  });

  it('rounds halves to even, like the Python reference', () => {
    expect(odds(61, check(60))).toBe(52); // 51.5
    expect(odds(63, check(60))).toBe(54); // 54.5
  });
});

describe('conditions', () => {
  it('flagsAll and flagsNone', () => {
    expect(meets({ flagsAll: ['a', 'b'] }, state({ flags: ['a', 'b'] }))).toBe(true);
    expect(meets({ flagsAll: ['a', 'b'] }, state({ flags: ['a'] }))).toBe(false);
    expect(meets({ flagsNone: ['a'] }, state({ flags: ['b'] }))).toBe(true);
    expect(meets({ flagsNone: ['a'] }, state({ flags: ['a'] }))).toBe(false);
  });

  it('meter bounds are inclusive', () => {
    expect(meets({ meterMin: { mastery: 35 } }, state({ meters: { joy: 50, energy: 65, money: 30, mastery: 35 } }))).toBe(true);
    expect(meets({ meterMin: { mastery: 35 } }, state())).toBe(false);
    expect(meets({ meterMax: { energy: 20 } }, state({ meters: { joy: 50, energy: 20, money: 30, mastery: 0 } }))).toBe(true);
    expect(meets({ meterMax: { energy: 20 } }, state())).toBe(false);
  });

  it('elements', () => {
    expect(meets({ elements: ['water', 'earth'] }, state())).toBe(true);
    expect(meets({ elements: ['fire'] }, state())).toBe(false);
  });

  it('anyOf needs one passing sub-condition, and everything else still applies', () => {
    const cond = { anyOf: [{ flagsNone: ['employed'] }, { flagsAll: ['pivoted'] }] }; // ux_new_path
    expect(meets(cond, state())).toBe(true);
    expect(meets(cond, state({ flags: ['employed'] }))).toBe(false);
    expect(meets(cond, state({ flags: ['employed', 'pivoted'] }))).toBe(true);
    expect(meets({ ...cond, elements: ['fire'] }, state())).toBe(false);
    expect(meets({}, state())).toBe(true);
    expect(meets(undefined, state())).toBe(true);
  });
});

describe('endings and roles', () => {
  const meters = (joy: number, mastery: number) => ({ joy, energy: 50, money: 50, mastery });
  const end = (s: LifeState) => endingFor(designer, s).id;

  it('the first matching ending wins, in file order', () => {
    expect(end(state({ flags: ['pivoted', 'studio', 'burned_out'], meters: meters(90, 90) }))).toBe('ux_end_pivot');
    expect(end(state({ flags: ['studio', 'burned_out'], meters: meters(40, 90) }))).toBe('ux_end_studio');
    expect(end(state({ flags: ['studio', 'burned_out'], meters: meters(39, 90) }))).toBe('ux_end_rebuilt');
    expect(end(state({ flags: ['studio'], meters: meters(39, 90) }))).toBe('ux_end_steady');
    expect(end(state({ meters: meters(65, 55) }))).toBe('ux_end_thriving');
    expect(end(state({ meters: meters(64, 55) }))).toBe('ux_end_steady');
  });

  it('role: override, then flags, then mastery', () => {
    const pivot = designer.endings.find((e) => e.id === 'ux_end_pivot')!;
    const steady = designer.endings.find((e) => e.id === 'ux_end_steady')!;
    expect(roleFor(designer, pivot, state({ flags: ['pivoted', 'studio'] }))).toBe('Took design somewhere new');
    expect(roleFor(designer, steady, state({ flags: ['manager', 'studio'] }))).toBe('Studio founder');
    expect(roleFor(designer, steady, state({ flags: ['manager'] }))).toBe('Design manager');
    expect(roleFor(designer, steady, state({ meters: meters(50, 55) }))).toBe('Senior designer');
    expect(roleFor(designer, steady, state({ meters: meters(50, 34) }))).toBe('Junior designer');
  });
});

describe('playing a life', () => {
  it('fills all 10 slots in order, for every sign, with no skipped slots', () => {
    for (const sign of SIGN_IDS) {
      for (let seed = 1; seed <= 40; seed++) {
        const { run, skipped } = playLife(designer, SHARED_EVENTS, params(seed, { stats: SIGNS[sign].stats, element: SIGNS[sign].element }), first);
        expect(skipped).toEqual([]);
        const slotEvents = run.log.map((l) => eventById(designer, SHARED_EVENTS, l.eventId)).filter((e) => e.kind !== 'forced');
        expect(slotEvents.map((e) => e.kind)).toEqual(LIFE_SLOTS.map((s) => s.kind));
        expect(run.completed).toBeDefined();
        expect(run.slotIndex).toBe(LIFE_SLOTS.length);
      }
    }
  });

  it('sign events match the element', () => {
    const { run } = playLife(designer, SHARED_EVENTS, params(3, { element: 'fire' }), first);
    const sign = run.log.map((l) => eventById(designer, SHARED_EVENTS, l.eventId)).find((e) => e.kind === 'sign')!;
    expect(sign.id).toBe('sign_fire');
  });

  it('the same seed and choices give the same life', () => {
    const a = playLife(designer, SHARED_EVENTS, params(42), first).run;
    const b = playLife(designer, SHARED_EVENTS, params(42), first).run;
    expect(b).toEqual(a);
    const lives = new Set(Array.from({ length: 30 }, (_, i) => JSON.stringify(playLife(designer, SHARED_EVENTS, params(i + 1), first).run.log)));
    expect(lives.size).toBeGreaterThan(1);
  });

  it('resumes exactly from a saved run', () => {
    const full = playLife(designer, SHARED_EVENTS, params(7), first).run;
    let run: LifeRun = startLife(designer, SHARED_EVENTS, params(7)).run;
    for (let i = 0; i < 5; i++) {
      const event = eventById(designer, SHARED_EVENTS, run.pendingEventId!);
      run = choose(designer, SHARED_EVENTS, run, event.choices[0]!.id, '2026-10-30T12:00:00Z').run;
      run = JSON.parse(JSON.stringify(run)) as LifeRun; // saved and reloaded after every choice
    }
    while (run.pendingEventId) {
      const event = eventById(designer, SHARED_EVENTS, run.pendingEventId);
      run = choose(designer, SHARED_EVENTS, run, event.choices[0]!.id, '2026-10-30T12:00:00Z').run;
    }
    expect(run).toEqual(full);
  });

  it('checks use the snapshotted stats, and meters stay within 0–100', () => {
    const { run } = playLife(designer, SHARED_EVENTS, params(11, { stats: statsAll(100) }), (_e, choices) => choices.find((c) => c.check) ?? choices[0]!);
    expect(run.log.filter((l) => l.check).every((l) => l.check!.odds >= 15 && l.check!.odds <= 90)).toBe(true);
    for (const v of Object.values(run.meters)) expect(v).toBeGreaterThanOrEqual(0);
    for (const v of Object.values(run.meters)) expect(v).toBeLessThanOrEqual(100);
  });
});

describe('forced events', () => {
  // A tiny life whose forced events always trigger, to test the limit and placement.
  const slotEvents: LifeEvent[] = LIFE_SLOTS.map((s, i) => ({
    id: `e${i}`,
    kind: s.kind,
    stages: [s.stage],
    icon: 'compass',
    title: 'Event',
    text: 'Text',
    choices: [{ id: 'go', label: 'Go', result: { text: 'Done', effects: { energy: -30 } } }],
  }));
  const forced = (id: string): LifeEvent => ({
    id,
    kind: 'forced',
    trigger: { meterMax: { energy: 20 } },
    icon: 'battery-low',
    title: 'Forced',
    text: 'Text',
    choices: [{ id: 'rest', label: 'Rest', result: { text: 'Rested', effects: { energy: 5 } } }],
  });
  const tiny: CareerLife = { ...designer, events: slotEvents.filter((e) => e.kind !== 'life' && e.kind !== 'sign') };
  const shared = [...slotEvents.filter((e) => e.kind === 'life' || e.kind === 'sign'), forced('f1'), forced('f2'), forced('f3')];

  it('at most 2 per life, right after the slot that triggered them, at that slot’s age', () => {
    let { run } = startLife(tiny, shared, params(1));
    const ages: [string, number][] = [];
    while (run.pendingEventId) {
      const event = eventById(tiny, shared, run.pendingEventId);
      ages.push([event.id, ageFor(run, event)]);
      run = choose(tiny, shared, run, event.choices[0]!.id).run;
    }
    expect(run.forcedCount).toBe(2);
    // Energy 65 → 35 → 5 after slot 2 (age 19): f1 and f2 play there, f3 never does.
    expect(ages.slice(0, 4)).toEqual([
      ['e0', 18],
      ['e1', 19],
      ['f1', 19],
      ['f2', 19],
    ]);
    expect(ages.map(([id]) => id)).not.toContain('f3');
    expect(ages).toHaveLength(12);
  });
});

describe('Life at 30 details', () => {
  const run = (log: LifeRun['log'], highlights: string[] = []): LifeRun => ({ ...startLife(designer, SHARED_EVENTS, params(1)).run, log, highlights });
  const c = (attribute: 'communication' | 'empathy' | 'persistence', odds: number) => ({ eventId: 'x', choiceId: 'y', check: { attribute, odds, success: true } });

  it('what this life asked of you: the two most-checked attributes; the lower odds is the power-up', () => {
    const result = lifeAsks(run([c('communication', 50), c('communication', 60), c('communication', 70), c('empathy', 80), c('empathy', 70), c('persistence', 30)]));
    expect(result.asks).toEqual([
      { attribute: 'communication', count: 3, odds: 60 },
      { attribute: 'empathy', count: 2, odds: 75 },
    ]);
    expect(result.powerUp).toBe('communication');
    expect(lifeAsks(run([])).powerUp).toBeNull();
  });

  it('intro odds use the career’s most-checked attributes at their average difficulty', () => {
    const top = mostCheckedAttributes(designer);
    expect(top).toHaveLength(3);
    expect(top).toContain('communication');
    expect(typicalOdds(designer, 'communication', statsAll(60))).toBeGreaterThan(typicalOdds(designer, 'communication', statsAll(50))!);
    expect(typicalOdds(designer, 'hands_on', statsAll(60))).toBeNull();
  });

  it('endings collection: found endings with the first date, in file order', () => {
    const done = (endingId: string, finishedAt: string, career = 'ux_design'): LifeRun =>
      ({ ...startLife(designer, SHARED_EVENTS, params(1)).run, career, completed: { endingId, role: 'x', finishedAt } }) as LifeRun;
    const found = endingsFound(designer, [
      done('ux_end_steady', '2026-10-30T10:00:00Z'),
      done('ux_end_steady', '2026-10-29T10:00:00Z'),
      done('ux_end_studio', '2026-10-31T10:00:00Z'),
      done('ux_end_pivot', '2026-10-28T10:00:00Z', 'teaching'),
      startLife(designer, SHARED_EVENTS, params(2)).run,
    ]);
    expect(found.map((f) => [f.ending.id, f.firstFoundAt])).toEqual([
      ['ux_end_pivot', null],
      ['ux_end_studio', '2026-10-31T10:00:00Z'],
      ['ux_end_rebuilt', null],
      ['ux_end_thriving', null],
      ['ux_end_steady', '2026-10-29T10:00:00Z'],
    ]);
  });

  it('tokens', () => {
    expect(fillTokens('{archetype}s notice what others miss. {sign}, {title}.', { archetype: 'Guardian', sign: 'Cancer', title: 'The Gentle Shaper' })).toBe(
      'Guardians notice what others miss. Cancer, The Gentle Shaper.',
    );
  });
});

describe('content validation', () => {
  it('every life is valid; only unverified reality notes are flagged', () => {
    for (const id of LIFE_CAREER_IDS) {
      const report = validateLife(LIVES[id]!, SHARED_EVENTS);
      expect(report.errors).toEqual([]);
      expect(report.warnings.every((w) => w.includes('reality note'))).toBe(true);
    }
  });

  it('catches broken content', () => {
    const broken: CareerLife = {
      ...designer,
      endings: designer.endings.slice(0, -1),
      events: [
        ...designer.events,
        { ...designer.events[0]!, choices: [{ id: 'a', label: 'A', check: { attribute: 'empathy', difficulty: 50 }, success: { text: 'Yes', effects: {} } }] },
        { ...designer.events[1]!, id: 'other', choices: [{ id: 'b', label: 'B' }, { id: 'b', label: 'B', result: { text: 'Ok', effects: { set: [] }, }, requires: { flagsAll: ['nobody_sets_this'] } }] },
      ],
    };
    const report = validateLife(broken, SHARED_EVENTS, new Set(['compass']));
    const text = report.errors.join('\n');
    expect(text).toContain('ux_opener: duplicate event id');
    expect(text).toContain('a check needs both success and fail');
    expect(text).toContain('other/b: needs either a check');
    expect(text).toContain('other/b: duplicate choice id');
    expect(text).toContain('the last ending must have when: {}');
    expect(text).toContain("isn't in the icon library");
    expect(report.warnings.join('\n')).toContain('"nobody_sets_this" is never set');
  });
});
