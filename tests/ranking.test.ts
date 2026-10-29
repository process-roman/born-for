import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_IDS } from '../src/content/attributes';
import { CAREERS, type CareerId } from '../src/content/careers';
import { createCharacter, rankingFor, setPathInterest, statsOf, type OnboardingInput } from '../src/logic/character';
import {
  compareMatches,
  groupMatches,
  interestScore,
  MAX_WILDCARDS,
  rankCareers,
  topTraits,
  WILDCARD_MIN_FIT,
  type CareerMatch,
} from '../src/logic/ranking';
import { AVA, LIAM, MAYA, NOAH, ZOE } from './personas';

function rank(persona: OnboardingInput) {
  return rankingFor(createCharacter(persona));
}

function groups(persona: OnboardingInput) {
  const c = createCharacter(persona);
  return groupMatches(rankingFor(c), statsOf(c));
}

const ids = (ms: CareerMatch[]) => ms.map((m) => m.careerId);

describe('persona rankings (Pilot Content §5)', () => {
  it('Maya: her pick leads, then her worlds', () => {
    const { ranked } = rank(MAYA);
    expect(ranked[0]).toMatchObject({ careerId: 'teaching', source: 'picked' });
    expect(ranked[0]!.score).toBeCloseTo(99.1, 1);
    expect(ranked.slice(1, 5).every((m) => m.source === 'world')).toBe(true);
  });

  it('Liam: both picks on top, same sign as Maya, completely different results', () => {
    const { ranked } = rank(LIAM);
    expect(ids(ranked.slice(0, 2))).toEqual(['software_dev', 'ai_engineer']);
    expect(ranked[0]!.score).toBeCloseTo(99.8, 1);
    expect(ranked.slice(-1)[0]!.careerId).toBe('paramedic');
  });

  it('Zoe: a harder pick still ranks above easier jobs she did not choose', () => {
    const { ranked } = rank(ZOE);
    expect(ids(ranked.slice(0, 2))).toEqual(['actor', 'youtuber']);
    expect(ranked[0]!.difficulty.level).toBe(2);
  });

  it('Noah: his pick first, then hands-on careers from Build & Fix', () => {
    const { ranked } = rank(NOAH);
    expect(ranked[0]).toMatchObject({ careerId: 'ux_design', source: 'picked' });
    expect(ranked.slice(1, 5).every((m) => CAREERS[m.careerId].worlds.includes('build'))).toBe(true);
  });

  it('Ava: no picks, so her three worlds lead; "Not sure" work style is neutral', () => {
    const { ranked } = rank(AVA);
    expect(ranked.slice(0, 10).every((m) => m.source === 'world')).toBe(true);
    expect(ranked.every((m) => m.workStyle === 0.5)).toBe(true);
    expect(ids(ranked.slice(-2))).toContain('accountant');
  });
});

describe('interest score', () => {
  it('picked → 1, in a chosen world → 0.6, otherwise only when close to a pick', () => {
    expect(interestScore(CAREERS.teaching, ['people'], ['teaching'])).toEqual({ interest: 1, source: 'picked' });
    expect(interestScore(CAREERS.social_work, ['people'], [])).toEqual({ interest: 0.6, source: 'world' });
    expect(interestScore(CAREERS.software_dev, ['people'], ['teaching'])).toEqual({ interest: 0, source: 'other' });
    const near = interestScore(CAREERS.app_developer, ['business'], ['software_dev']);
    expect(near.source).toBe('near_pick');
    expect(near.interest).toBeCloseTo(0.425, 3);
  });

  it('a weak resemblance does not count as "close"', () => {
    // YouTuber shares two traits with Teaching but no world.
    expect(interestScore(CAREERS.youtuber, ['people'], ['teaching']).source).toBe('other');
  });
});

describe('result groups', () => {
  it('picks, then more in your worlds, then up to two wildcards from elsewhere', () => {
    const g = groups(LIAM);
    expect(ids(g.picks)).toEqual(['software_dev', 'ai_engineer']);
    expect(g.inWorlds.length).toBeGreaterThan(5);
    expect(g.inWorlds.every((m) => CAREERS[m.careerId].worlds.some((w) => LIAM.worlds.includes(w)))).toBe(true);
    expect(g.wildcards.length).toBeLessThanOrEqual(MAX_WILDCARDS);
  });

  it('wildcards fit well and run on one of the user’s strongest traits', () => {
    for (const persona of [MAYA, LIAM, ZOE, NOAH, AVA]) {
      const c = createCharacter(persona);
      const strongest = topTraits(statsOf(c), 4);
      for (const m of groupMatches(rankingFor(c), statsOf(c)).wildcards) {
        const career = CAREERS[m.careerId];
        expect(career.worlds.some((w) => persona.worlds.includes(w))).toBe(false);
        expect(m.attributeFit).toBeGreaterThanOrEqual(WILDCARD_MIN_FIT);
        expect(m.reasons[0]).toMatch(/^Runs on your .+, one of your superpowers$/);
        const main = [...career.requirements].sort((a, b) => b.weight - a.weight)[0]!.attribute;
        expect(strongest).toContain(main);
      }
    }
  });

  it('Zoe’s wildcards include a creative career outside her worlds', () => {
    expect(ids(groups(ZOE).wildcards)).toContain('writer');
  });
});

describe('ranking edge cases', () => {
  it('score never exceeds 100', () => {
    for (const persona of [MAYA, LIAM, ZOE, NOAH, AVA]) {
      for (const m of rank(persona).ranked) expect(m.score).toBeLessThanOrEqual(100);
    }
  });

  it('every career is listed, even with no interest at all', () => {
    const { ranked } = rank(MAYA);
    expect(ranked.find((m) => m.careerId === 'software_dev')!.interest).toBe(0);
    expect(ranked).toHaveLength(99);
  });

  it('ties sort by interest, then fit, then strongest-trait alignment, then name', () => {
    const stats = createCharacter(MAYA).confirmed;
    const base = { ...CAREERS.marketing };
    const ux = { ...base, id: 'ux_design' as const };
    const teaching = { ...base, id: 'teaching' as const };
    const { ranked } = rankCareers({ stats, worlds: ['business'], picks: [], workStyle: 'many' }, [ux, teaching]);
    expect(ids(ranked)).toEqual(['teaching', 'ux_design']);

    const m = ranked[0]!;
    const a = { ...m, careerId: 'teaching' as CareerId, interest: 0.8, attributeFit: 0.5, alignment: 0.5 };
    const b = { ...m, careerId: 'marketing' as CareerId, interest: 0.6, attributeFit: 0.9, alignment: 0.9 };
    expect([b, a].sort(compareMatches)[0]!.careerId).toBe('teaching');
    expect([a, { ...b, interest: 0.8 }].sort(compareMatches)[0]!.careerId).toBe('marketing');
    expect([a, { ...a, careerId: 'nursing' as CareerId, alignment: 0.7 }].sort(compareMatches)[0]!.careerId).toBe('nursing');
  });

  it('topTraits returns the highest current stats', () => {
    const stats = createCharacter(MAYA).confirmed;
    expect(topTraits(stats, 3)).toEqual(['empathy', 'persistence', 'organization']);
    expect(ATTRIBUTE_IDS.filter((a) => stats[a] > stats.organization)).toEqual(['empathy', 'persistence']);
  });
});

describe('feedback adjustments', () => {
  it('Interested adds 10 to the ranking score', () => {
    const c = setPathInterest(createCharacter(MAYA), 'marketing', 'interested');
    const m = rankingFor(c).ranked.find((x) => x.careerId === 'marketing')!;
    expect(m.adjustedScore - m.score).toBe(10);
  });

  it('Not for me moves a career out of the ranked list, even a pick', () => {
    const c = setPathInterest(createCharacter(MAYA), 'teaching', 'not_for_me');
    const { ranked, notForMe } = rankingFor(c);
    expect(ids(ranked)).not.toContain('teaching');
    expect(ids(notForMe)).toEqual(['teaching']);
    expect(ranked[0]!.careerId).toBe('recruiter');
  });

  it('quest enjoyment: 4–5 adds 5, 1–2 subtracts 10, 3 does nothing', () => {
    const c = createCharacter(MAYA);
    const { ranked } = rankCareers({
      stats: c.confirmed,
      worlds: c.worlds,
      picks: c.picks,
      workStyle: c.workStyle,
      feedback: { teaching: { questEnjoyment: [5, 4, 3, 1] } },
    });
    const t = ranked.find((m) => m.careerId === 'teaching')!;
    expect(t.adjustedScore - t.score).toBe(0);
  });
});

describe('reasons', () => {
  it('a pick says so, then strength and work style', () => {
    expect(rank(MAYA).ranked[0]!.reasons).toEqual([
      'You picked this',
      'Your Empathy is Strong',
      'Fits how you like to work: with lots of different people',
    ]);
  });

  it('a career in a chosen world names the world, then the growth area', () => {
    const nursing = rank(AVA).ranked.find((m) => m.careerId === 'nursing')!;
    expect(nursing.reasons).toEqual(['In a world you chose: Health & Mind', 'Your Empathy is Strong', 'Attention to detail needs some training']);
  });

  it('a career close to a pick says which', () => {
    const c = createCharacter({ ...LIAM, worlds: ['business'] });
    const near = rankingFor(c).ranked.find((m) => m.careerId === 'app_developer')!;
    expect(near.reasons[0]).toBe('Close to Software development');
  });

  it('skips reasons that do not apply', () => {
    expect(rank(MAYA).ranked.find((m) => m.careerId === 'software_dev')!.reasons).toEqual([
      'Your Persistence is Strong',
      'Analytical thinking needs some training',
    ]);
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
