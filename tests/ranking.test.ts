import { describe, expect, it } from 'vitest';
import { CAREERS, type CareerId } from '../src/content/careers';
import { createCharacter, rankingFor, setPathInterest, type OnboardingInput } from '../src/logic/character';
import { compareMatches, preferenceScore, rankCareers, type CareerMatch } from '../src/logic/ranking';
import { AVA, LIAM, MAYA, NOAH, ZOE } from './personas';

type Expected = [CareerId, number, 1 | 2 | 3];

function rank(persona: OnboardingInput) {
  return rankingFor(createCharacter(persona));
}

function expectTop3(ranked: CareerMatch[], expected: Expected[]) {
  expect(ranked.slice(0, 3).map((m) => m.careerId)).toEqual(expected.map(([id]) => id));
  expected.forEach(([, score, level], i) => {
    expect(ranked[i]!.score).toBeCloseTo(score, 1);
    expect(ranked[i]!.difficulty.level).toBe(level);
  });
}

describe('persona rankings (Pilot Content §5)', () => {
  it('Maya: preferences decide the top 2; Teaching flags Communication', () => {
    const { ranked } = rank(MAYA);
    expectTop3(ranked, [
      ['project_coord', 87.8, 1],
      ['teaching', 79.7, 2],
      ['marketing', 42.4, 2],
    ]);
    expect(ranked[1]!.difficulty.keyGaps.map((g) => g.attribute)).toEqual(['communication']);
  });

  it('Liam: same sign as Maya, completely different results', () => {
    const { ranked } = rank(LIAM);
    expectTop3(ranked, [
      ['software_dev', 99.8, 1],
      ['data_analysis', 91.1, 1],
      ['ux_design', 62.9, 2],
    ]);
    const last = ranked[ranked.length - 1]!;
    expect(last.careerId).toBe('teaching');
    expect(last.difficulty.level).toBe(3);
  });

  it('Zoe: Leo performer lands on Marketing', () => {
    expectTop3(rank(ZOE).ranked, [
      ['marketing', 91.3, 1],
      ['teaching', 78.7, 2],
      ['ux_design', 76.6, 1],
    ]);
  });

  it('Noah: what he enjoys ranks first even though it is hard', () => {
    expectTop3(rank(NOAH).ranked, [
      ['ux_design', 72.9, 3],
      ['software_dev', 63.5, 1],
      ['marketing', 54.5, 3],
    ]);
  });

  it('Ava: unsure work style is neutral; Project coordination drops to last', () => {
    const { ranked } = rank(AVA);
    expectTop3(ranked, [
      ['teaching', 82.9, 2],
      ['ux_design', 79.3, 1],
      ['marketing', 58.5, 2],
    ]);
    expect(ranked[ranked.length - 1]!.careerId).toBe('project_coord');
    expect(ranked.every((m) => m.workStyle === 0.5)).toBe(true);
  });
});

describe('preference score', () => {
  const ux = CAREERS.ux_design;
  const sw = CAREERS.software_dev;
  it.each([
    ['one primary match', ux, ['making'], 2 / 3],
    ['primary + secondary', ux, ['making', 'tech'], 5 / 6],
    ['two primary', sw, ['tech', 'puzzles'], 1],
    ['one secondary only', ux, ['tech'], 1 / 3],
    ['no match', ux, ['helping'], 0],
  ] as const)('%s', (_, career, enjoy, expected) => {
    expect(preferenceScore(career, enjoy)).toBeCloseTo(expected, 10);
  });
});

describe('ranking edge cases', () => {
  it('score never exceeds 100', () => {
    for (const persona of [MAYA, LIAM, ZOE, NOAH, AVA]) {
      for (const m of rank(persona).ranked) expect(m.score).toBeLessThanOrEqual(100);
    }
  });

  it('a career with no preference match is still listed', () => {
    const { ranked } = rank(MAYA);
    const sw = ranked.find((m) => m.careerId === 'software_dev')!;
    expect(sw.preference).toBe(0);
    expect(ranked).toHaveLength(6);
  });

  it('ties sort by preference, then attribute fit, then name', () => {
    const base = { ...CAREERS.marketing };
    const stats = createCharacter(MAYA).confirmed;
    // Identical careers under different ids: everything ties except the name ("Teaching" < "UX/product design").
    const ux = { ...base, id: 'ux_design' as const };
    const teaching = { ...base, id: 'teaching' as const };
    const { ranked } = rankCareers({ stats, enjoy: ['leading'], workStyle: 'many' }, [ux, teaching]);
    expect(ranked.map((m) => m.careerId)).toEqual(['teaching', 'ux_design']);

    // Same score: more preference wins, then more attribute fit.
    const m = ranked[0]!;
    const prefHeavy = { ...m, careerId: 'teaching' as const, preference: 0.8, attributeFit: 0.5 };
    const fitHeavy = { ...m, careerId: 'marketing' as const, preference: 0.6, attributeFit: 0.9 };
    expect([fitHeavy, prefHeavy].sort(compareMatches)[0]!.careerId).toBe('teaching');
    const fitter = { ...fitHeavy, preference: 0.8 };
    expect([prefHeavy, fitter].sort(compareMatches)[0]!.careerId).toBe('marketing');
  });
});

describe('feedback adjustments', () => {
  it('Interested adds 10 to the ranking score', () => {
    const c = setPathInterest(createCharacter(MAYA), 'marketing', 'interested');
    const m = rankingFor(c).ranked.find((x) => x.careerId === 'marketing')!;
    expect(m.adjustedScore - m.score).toBe(10);
  });

  it('Not for me moves a career out of the ranked list, even the top one', () => {
    const c = setPathInterest(createCharacter(MAYA), 'project_coord', 'not_for_me');
    const { ranked, notForMe } = rankingFor(c);
    expect(ranked.map((m) => m.careerId)).not.toContain('project_coord');
    expect(notForMe.map((m) => m.careerId)).toEqual(['project_coord']);
    expect(ranked[0]!.careerId).toBe('teaching');
  });

  it('quest enjoyment: 4–5 adds 5, 1–2 subtracts 10, 3 does nothing', () => {
    const stats = createCharacter(MAYA).confirmed;
    const { ranked } = rankCareers({
      stats,
      enjoy: MAYA.enjoy,
      workStyle: MAYA.workStyle,
      feedback: { teaching: { questEnjoyment: [5, 4, 3, 1] } },
    });
    const t = ranked.find((m) => m.careerId === 'teaching')!;
    expect(t.adjustedScore - t.score).toBe(0);
  });
});

describe('reasons', () => {
  it('Maya / Teaching: preference, strength, growth area', () => {
    const t = rank(MAYA).ranked.find((m) => m.careerId === 'teaching')!;
    expect(t.reasons).toEqual([
      'You enjoy helping and supporting people',
      'Your Empathy is Strong',
      'Communication needs some training',
    ]);
  });

  it('falls back to work style when there is no key gap', () => {
    const p = rank(MAYA).ranked.find((m) => m.careerId === 'project_coord')!;
    expect(p.reasons).toEqual([
      'You enjoy planning and organizing',
      'Your Persistence is Solid',
      'Fits how you like to work: lots of people',
    ]);
  });

  it('skips reasons that do not apply', () => {
    const sw = rank(MAYA).ranked.find((m) => m.careerId === 'software_dev')!;
    // No preference match, so the card starts with the strength.
    expect(sw.reasons).toEqual(['Your Persistence is Solid', 'Analytical thinking needs some training']);
  });

  it('every top-3 card has 2–3 reasons', () => {
    for (const persona of [MAYA, LIAM, ZOE, NOAH, AVA]) {
      for (const m of rank(persona).ranked.slice(0, 3)) {
        expect(m.reasons.length).toBeGreaterThanOrEqual(2);
        expect(m.reasons.length).toBeLessThanOrEqual(3);
      }
    }
  });
});
