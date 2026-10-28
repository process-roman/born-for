import { describe, expect, it } from 'vitest';
import { SIGNS } from '../src/content/signs';
import { backgroundTraits, pollCards, signCalled, signatureTraits, topAttributes } from '../src/logic/poll';
import { confirmStats, confirmValue } from '../src/logic/stats';
import { AVA, LIAM, MAYA, NOAH } from './personas';

describe('top attributes', () => {
  it('Cancer: Empathy, Persistence, Organization', () => {
    expect(topAttributes('cancer')).toEqual(['empathy', 'persistence', 'organization']);
  });

  it('match the bold top 3 in the spec', () => {
    expect(topAttributes('aries')).toEqual(['courage', 'leadership', 'independence']);
    expect(topAttributes('leo')).toEqual(['leadership', 'creativity', 'communication']);
    expect(topAttributes('scorpio')).toEqual(['persistence', 'analytical', 'independence']);
    expect(topAttributes('aquarius')).toEqual(['creativity', 'independence', 'curiosity']);
  });

  it('are the three highest values', () => {
    const stats = SIGNS.cancer.stats;
    expect(topAttributes('cancer').map((a) => stats[a])).toEqual([85, 80, 75]);
  });
});

describe('poll cards', () => {
  it('one card per signature trait, strongest first', () => {
    const cards = pollCards('cancer');
    expect(cards.map((c) => c.attribute)).toEqual(signatureTraits('cancer'));
    expect(cards).toHaveLength(8);
    expect(cards[0]).toEqual({
      attribute: 'empathy',
      statement: 'You can tell how someone feels before they say it.',
      signBand: 'Strong',
    });
  });

  it('background traits are the other eight', () => {
    const all = new Set([...signatureTraits('leo'), ...backgroundTraits('leo')]);
    expect(all.size).toBe(16);
    expect(backgroundTraits('leo')).not.toContain('leadership');
  });
});

describe('spec scoring examples (Cancer)', () => {
  it.each([
    [85, 'yes', 85],
    [45, 'yes', 73], // Leadership, a background trait, tapped on "Anything else that's you?"
    [85, 'no', 43],
  ] as const)('%i + %s → %i', (sign, answer, expected) => {
    expect(confirmValue(sign, answer)).toBe(expected);
  });

  it("a Cancer who leads can say so", () => {
    expect(SIGNS.cancer.stats.leadership).toBe(45);
    expect(confirmStats('cancer', { leadership: 'yes' }).leadership).toBe(73);
  });
});

describe('your sign called X of 8', () => {
  it('all Skip is 8 of 8', () => {
    expect(signCalled('cancer', confirmStats(MAYA.sign, MAYA.answers)).count).toBe(8);
  });

  it('only signature traits count (Liam: only Empathy is a Cancer signature trait he changed)', () => {
    const r = signCalled('cancer', confirmStats(LIAM.sign, LIAM.answers));
    expect(r.count).toBe(7);
    expect(r.unique).toEqual(['empathy']);
    expect(r.total).toBe(8);
  });

  it('background answers never lower the score', () => {
    expect(signCalled('virgo', confirmStats(NOAH.sign, NOAH.answers)).count).toBe(8);
  });

  it('Ava: Communication drops a band → 7 of 8', () => {
    const r = signCalled('pisces', confirmStats(AVA.sign, AVA.answers));
    expect(r.unique).toEqual(['communication']);
    expect(r.count).toBe(7);
  });
});
