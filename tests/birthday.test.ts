import { describe, expect, it } from 'vitest';
import { isValidBirthDate, signAt, signFromBirthday } from '../src/logic/birthday';
import { changeCuspSign, completeQuest, createCharacter, titlesOf } from '../src/logic/character';
import { getSignStats } from '../src/content/signs';

const MIN = 60_000;
const utc = (iso: string) => Date.parse(iso);

describe('Sun position against published equinox and solstice times (UTC)', () => {
  // Each moment is when the Sun enters the second sign; check ±30 minutes around it.
  it.each([
    ['2000-03-20T07:35Z', 'pisces', 'aries'],
    ['2000-06-21T01:48Z', 'gemini', 'cancer'],
    ['2000-09-22T17:28Z', 'virgo', 'libra'],
    ['2000-12-21T13:37Z', 'sagittarius', 'capricorn'],
    ['1990-03-20T21:19Z', 'pisces', 'aries'],
    ['2024-03-20T03:06Z', 'pisces', 'aries'],
    ['2024-06-20T20:51Z', 'gemini', 'cancer'],
  ] as const)('%s: %s → %s', (iso, before, after) => {
    expect(signAt(utc(iso) - 30 * MIN)).toBe(before);
    expect(signAt(utc(iso) + 30 * MIN)).toBe(after);
  });
});

describe('sign from birthday', () => {
  const sign = (year: number, month: number, day: number) => signFromBirthday({ year, month, day });

  it('mid-sign dates give one sign', () => {
    expect(sign(1995, 7, 4)).toEqual({ kind: 'sign', sign: 'cancer' });
    expect(sign(2003, 11, 10)).toEqual({ kind: 'sign', sign: 'scorpio' });
    expect(sign(2000, 2, 29)).toEqual({ kind: 'sign', sign: 'pisces' });
  });

  it('crosses the new year inside Capricorn', () => {
    expect(sign(2004, 12, 31)).toEqual({ kind: 'sign', sign: 'capricorn' });
    expect(sign(2005, 1, 1)).toEqual({ kind: 'sign', sign: 'capricorn' });
  });

  it('flags the cusp days around a boundary (Aries 2000 starts Mar 20 07:35 UTC)', () => {
    expect(sign(2000, 3, 18)).toEqual({ kind: 'sign', sign: 'pisces' });
    expect(sign(2000, 3, 19)).toEqual({ kind: 'cusp', signs: ['pisces', 'aries'] });
    expect(sign(2000, 3, 20)).toEqual({ kind: 'cusp', signs: ['pisces', 'aries'] });
    // Even at UTC+14, Mar 21 begins after the ingress.
    expect(sign(2000, 3, 21)).toEqual({ kind: 'sign', sign: 'aries' });
  });

  it('is year-accurate: the same date can differ between years', () => {
    // Cancer began Jun 21 01:48 UTC in 2000 but Jun 20 20:51 UTC in 2024.
    expect(sign(2000, 6, 19)).toEqual({ kind: 'sign', sign: 'gemini' });
    expect(sign(2024, 6, 19)).toEqual({ kind: 'sign', sign: 'gemini' });
    expect(sign(2000, 6, 22)).toEqual({ kind: 'sign', sign: 'cancer' });
    expect(sign(2024, 6, 21)).toEqual({ kind: 'cusp', signs: ['gemini', 'cancer'] });
    expect(sign(2000, 6, 21)).toEqual({ kind: 'cusp', signs: ['gemini', 'cancer'] });
    expect(sign(2024, 6, 22)).toEqual({ kind: 'sign', sign: 'cancer' });
  });

  it('every year has 12 boundaries with 1–3 cusp days each', () => {
    for (const year of [1945, 1980, 2001, 2008, 2015]) {
      let cuspDays = 0;
      const signs = new Set<string>();
      for (let d = Date.UTC(year, 0, 1); d < Date.UTC(year + 1, 0, 1); d += 86_400_000) {
        const date = new Date(d);
        const r = signFromBirthday({ year, month: date.getUTCMonth() + 1, day: date.getUTCDate() });
        if (r.kind === 'cusp') cuspDays++;
        else signs.add(r.sign);
      }
      expect(signs.size).toBe(12);
      expect(cuspDays).toBeGreaterThanOrEqual(12);
      expect(cuspDays).toBeLessThanOrEqual(36);
    }
  });

  it('rejects invalid dates', () => {
    expect(isValidBirthDate({ year: 2001, month: 2, day: 29 })).toBe(false);
    expect(isValidBirthDate({ year: 2000, month: 13, day: 1 })).toBe(false);
    expect(() => signFromBirthday({ year: 2001, month: 2, day: 29 })).toThrow(RangeError);
  });
});

describe('cusp choice on the character', () => {
  const base = {
    cuspSigns: ['gemini', 'cancer'] as ['gemini', 'cancer'],
    answers: { empathy: 'yes' as const },
    enjoy: ['making' as const],
    workStyle: 'small_team' as const,
  };

  it('the chosen sign must be one of the cusp signs', () => {
    expect(() => createCharacter({ ...base, sign: 'leo' })).toThrow();
  });

  it('switching recomputes stats from the same answers and keeps progress', () => {
    let c = createCharacter({ ...base, sign: 'gemini' });
    c = completeQuest(c, 'ux_design', 1, null, '2026-10-28T12:00:00Z').character;
    c = completeQuest(c, 'ux_design', 3, null, '2026-10-28T12:00:00Z').character;
    expect(titlesOf(c)[0]!.text).toBe('The Quick Shaper');

    const switched = changeCuspSign(c, 'cancer');
    expect(switched.sign).toBe('cancer');
    expect(switched.confirmed.creativity).toBe(getSignStats('cancer').creativity);
    expect(switched.confirmed.empathy).toBe(85);
    expect(switched.totalXp).toBe(c.totalXp);
    expect(titlesOf(switched)[0]!.text).toBe('The Gentle Shaper');
    expect(() => changeCuspSign(switched, 'leo')).toThrow();
  });
});
