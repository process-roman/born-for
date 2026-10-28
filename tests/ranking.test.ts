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
  it('Maya: helping and organizing lead to coordination, social work and teaching', () => {
    expectTop3(rank(MAYA).ranked, [
      ['project_coord', 89.4, 1],
      ['social_work', 89.3, 1],
      ['teaching', 81.7, 1],
    ]);
  });

  it('Liam: same sign as Maya, completely different results', () => {
    const { ranked } = rank(LIAM);
    expectTop3(ranked, [
      ['software_dev', 99.8, 1],
      ['data_analysis', 91.1, 1],
      ['lab_scientist', 80.5, 1],
    ]);
    const last = ranked[ranked.length - 1]!;
    expect(last.careerId).toBe('firefighter');
    expect(last.difficulty.level).toBe(3);
  });

  it('Zoe: Leo performer lands on stage and in marketing', () => {
    expectTop3(rank(ZOE).ranked, [
      ['musician', 93.0, 1],
      ['marketing', 89.4, 1],
      ['writer', 77.7, 1],
    ]);
  });

  it('Noah: "making" now reaches hands-on careers, not just screens', () => {
    expectTop3(rank(NOAH).ranked, [
      ['chef', 79.9, 1],
      ['carpenter', 77.2, 2],
      ['ux_design', 76.1, 2],
    ]);
  });

  it('Ava: unsure work style is neutral; Event planning drops near the bottom', () => {
    const { ranked } = rank(AVA);
    expectTop3(ranked, [
      ['writer', 94.9, 2],
      ['florist', 88.8, 1],
      ['physio', 84.5, 2],
    ]);
    expect(ranked.slice(-2).map((m) => m.careerId)).toContain('event_planner');
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
    expect(ranked).toHaveLength(24);
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
    expect(ranked[0]!.careerId).toBe('social_work');
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
  it('Zoe / Teaching: preference, strength, growth area', () => {
    const t = rank(ZOE).ranked.find((m) => m.careerId === 'teaching')!;
    expect(t.reasons).toEqual([
      'You enjoy performing and presenting',
      'Your Communication is Solid',
      'Empathy needs some training',
    ]);
  });

  it('falls back to work style when there is no key gap', () => {
    const p = rank(MAYA).ranked.find((m) => m.careerId === 'project_coord')!;
    expect(p.reasons).toEqual([
      'You enjoy planning and organizing',
      'Your Organization is Solid',
      'Fits how you like to work: with lots of different people',
    ]);
  });

  it('skips reasons that do not apply', () => {
    const sw = rank(MAYA).ranked.find((m) => m.careerId === 'software_dev')!;
    // No preference match, so the card starts with the strength.
    expect(sw.reasons).toEqual(['Your Persistence is Strong', 'Analytical thinking needs some training']);
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
