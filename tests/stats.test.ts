import { describe, expect, it } from 'vitest';
import { getSignStats } from '../src/content/signs';
import { bandFor, confirmStats, confirmValue } from '../src/logic/stats';
import { difficultyFor } from '../src/logic/difficulty';
import { CAREERS } from '../src/content/careers';
import { AVA, LIAM, MAYA, NOAH } from './personas';

describe('confirm poll', () => {
  it('Skip keeps the sign value', () => {
    expect(confirmStats(MAYA.sign, MAYA.answers)).toEqual(getSignStats('cancer'));
  });

  it('blends 30% sign + 70% answer target (Liam)', () => {
    const s = confirmStats(LIAM.sign, LIAM.answers);
    expect(s).toMatchObject({ analytical: 74, curiosity: 73, independence: 70, empathy: 43 });
    expect(s.creativity).toBe(65);
  });

  it('Noah and Ava match the documented values', () => {
    expect(confirmStats(NOAH.sign, NOAH.answers).creativity).toBe(52);
    expect(confirmStats(AVA.sign, AVA.answers)).toMatchObject({ organization: 28, communication: 58 });
  });

  it('rounds exact halves to even', () => {
    expect(confirmValue(50, 'yes')).toBe(74); // 74.5
    expect(confirmValue(40, 'yes')).toBe(72); // 71.5
    expect(confirmValue(60, 'sometimes')).toBe(56); // 56.5
    expect(confirmValue(70, 'no')).toBe(38); // 38.5
  });
});

describe('bands', () => {
  it.each([
    [100, 'Strong'],
    [80, 'Strong'],
    [79, 'Solid'],
    [60, 'Solid'],
    [59, 'Developing'],
    [40, 'Developing'],
    [39, 'Untrained'],
    [0, 'Untrained'],
  ] as const)('%i is %s', (value, band) => {
    expect(bandFor(value)).toBe(band);
  });
});

describe('difficulty', () => {
  const ux = CAREERS.ux_design; // creativity 70, empathy 60, communication 60
  const stats = (creativity: number, empathy: number, communication: number) => ({
    ...getSignStats('cancer'),
    creativity,
    empathy,
    communication,
  });

  it('a gap of exactly 10 is not a key gap', () => {
    expect(difficultyFor(ux, stats(60, 50, 50)).level).toBe(1);
  });
  it('one key gap is Some training', () => {
    expect(difficultyFor(ux, stats(59, 60, 60)).level).toBe(2);
  });
  it('two key gaps is Challenging', () => {
    expect(difficultyFor(ux, stats(59, 49, 60)).level).toBe(3);
  });
  it('a single gap over 30 is Challenging', () => {
    const d = difficultyFor(ux, stats(39, 60, 60));
    expect(d.level).toBe(3);
    expect(d.label).toBe('Challenging but achievable');
  });
});
