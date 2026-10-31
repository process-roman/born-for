import { describe, expect, it } from 'vitest';
import { LIVES, SHARED_EVENTS, type LifeEvent } from '../src/content/life';
import { SIGNS } from '../src/content/signs';
import {
  ageFor,
  endAge,
  eventById,
  fillTokens,
  lifeStart,
  noHighlightsLine,
  playLife,
  realAge,
  stageName,
  startLife,
  type NewLife,
} from '../src/logic/life';

const designer = LIVES.ux_design!;
const params = (seed: number, age: number | null): NewLife => ({
  id: `r${seed}`,
  career: 'ux_design',
  seed,
  startedAt: '2026-10-31T00:00:00Z',
  stats: SIGNS.cancer.stats,
  element: 'water',
  age,
});
const first = (_e: LifeEvent, choices: LifeEvent['choices']) => choices[0]!;
const played = (seed: number, age: number | null) => {
  const { run } = playLife(designer, SHARED_EVENTS, params(seed, age), first);
  return { run, ids: run.log.map((l) => l.eventId) };
};

describe('lives start at the user’s age', () => {
  it('18–22 is a first career from your age; 23+ is a career change; unknown starts at 18', () => {
    expect(lifeStart(null)).toEqual({ startAge: 18, track: 'first' });
    expect(lifeStart(16)).toEqual({ startAge: 18, track: 'first' });
    expect(lifeStart(20)).toEqual({ startAge: 20, track: 'first' });
    expect(lifeStart(22)).toEqual({ startAge: 22, track: 'first' });
    expect(lifeStart(23)).toEqual({ startAge: 23, track: 'change' });
    expect(lifeStart(41)).toEqual({ startAge: 41, track: 'change' });
  });

  it('a 34-year-old gets the career-change scenes, never the first-career ones', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const { run, ids } = played(seed, 34);
      expect(run.flags).toContain('track_changer');
      expect(ids[0]).toBe('ux_change_opener');
      expect(ids).toContain('ux_change_job_hunt');
      for (const id of ['ux_opener', 'ux_internship', 'ux_job_hunt', 'ux_grad_show']) expect(ids).not.toContain(id);
    }
  });

  it('an 18- or 20-year-old never sees career-change scenes', () => {
    for (const age of [null, 20]) {
      for (let seed = 1; seed <= 30; seed++) {
        const { ids } = played(seed, age);
        expect(ids[0]).toBe('ux_opener');
        expect(ids.some((id) => id.startsWith('ux_change_'))).toBe(false);
      }
    }
  });

  it('real ages run twelve years from the start; the sky keeps its 18–30 scale', () => {
    const { run } = startLife(designer, SHARED_EVENTS, params(1, 34));
    const event = eventById(designer, SHARED_EVENTS, run.pendingEventId!);
    expect(ageFor(run, event)).toBe(18);
    expect(realAge(run, ageFor(run, event))).toBe(34);
    expect(endAge(run)).toBe(46);
    expect(stageName('thirty', run)).toBe('Turning 46');
    expect(stageName('first_job', run)).toBe('First Job');
    expect(noHighlightsLine(run)).toBe('Made it to 46 your own way.');
  });

  it('runs saved before this change still read as starting at 18', () => {
    const { run } = startLife(designer, SHARED_EVENTS, params(1, null));
    const { startAge: _drop, ...old } = run;
    expect(endAge(old)).toBe(30);
    expect(stageName('thirty', old)).toBe('Turning 30');
  });

  it('{age} fills in, and is left alone when no age is given', () => {
    expect(fillTokens("You're {age}.", { archetype: 'Guardian', sign: 'Cancer', title: 'The Gentle Shaper', age: 34 })).toBe("You're 34.");
    expect(fillTokens("You're {age}.", { archetype: 'Guardian', sign: 'Cancer', title: 'The Gentle Shaper' })).toBe("You're {age}.");
  });
});
