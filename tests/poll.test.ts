import { describe, expect, it } from 'vitest';
import { pollCards, signCalled, topAttributes } from '../src/logic/poll';
import { confirmStats, confirmValue } from '../src/logic/stats';
import { AVA, LIAM, MAYA, NOAH } from './personas';

describe('top attributes', () => {
  it('Cancer: Empathy, Persistence, Organization', () => {
    expect(topAttributes('cancer')).toEqual(['empathy', 'persistence', 'organization']);
  });

  it("Leo's tie for 3rd goes to Independence", () => {
    expect(topAttributes('leo')).toEqual(['creativity', 'communication', 'independence']);
  });

  it('match the bold top 3 in the spec', () => {
    expect(new Set(topAttributes('aries'))).toEqual(new Set(['independence', 'communication', 'curiosity']));
    expect(new Set(topAttributes('libra'))).toEqual(new Set(['communication', 'empathy', 'creativity']));
    expect(new Set(topAttributes('scorpio'))).toEqual(new Set(['persistence', 'analytical', 'independence']));
    expect(new Set(topAttributes('aquarius'))).toEqual(new Set(['creativity', 'independence', 'curiosity']));
  });
});

describe('poll cards', () => {
  it('show the top 3 first, then the rest, 8 cards in all', () => {
    const cards = pollCards('cancer');
    expect(cards.map((c) => c.attribute)).toEqual([
      'empathy',
      'persistence',
      'organization',
      'creativity',
      'analytical',
      'communication',
      'independence',
      'curiosity',
    ]);
    expect(cards[0]).toEqual({
      attribute: 'empathy',
      statement: 'You can tell how someone feels before they say it.',
      signBand: 'Strong',
    });
  });
});

describe('spec scoring examples (Cancer)', () => {
  it.each([
    [85, 'yes', 85],
    [40, 'yes', 72],
    [85, 'no', 43],
  ] as const)('%i + %s → %i', (sign, answer, expected) => {
    expect(confirmValue(sign, answer)).toBe(expected);
  });
});

describe('your sign called X of 8', () => {
  it('all Skip is 8 of 8', () => {
    expect(signCalled('cancer', confirmStats(MAYA.sign, MAYA.answers)).count).toBe(8);
  });

  it('Liam: Empathy, Analytical, Curiosity, Independence change band → 4 of 8', () => {
    const r = signCalled('cancer', confirmStats(LIAM.sign, LIAM.answers));
    expect(r.count).toBe(4);
    expect(r.unique).toEqual(['analytical', 'empathy', 'independence', 'curiosity']);
  });

  it('a "Sometimes" that stays in band still counts as a match (Noah: Creativity 45 → 52)', () => {
    expect(signCalled('virgo', confirmStats(NOAH.sign, NOAH.answers)).count).toBe(8);
  });

  it('Ava: Organization stays Untrained, Communication drops a band → 7 of 8', () => {
    // Organization 35 → 28 stays Untrained; Communication 60 → 56 is Solid → Developing.
    const r = signCalled('pisces', confirmStats(AVA.sign, AVA.answers));
    expect(r.unique).toEqual(['communication']);
    expect(r.count).toBe(7);
  });
});
