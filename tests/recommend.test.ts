import { describe, expect, it } from 'vitest';
import { CAREER_IDS, CAREERS, type CareerId, type StarNumber } from '../src/content/careers';
import { completeQuest, createCharacter, setPathInterest, type Character, type Reflection } from '../src/logic/character';
import {
  careerSimilarity,
  nextRecommendation,
  reactionTo,
  relatedCareers,
  suggestDifferentPath,
  suggestRelatedPath,
} from '../src/logic/recommend';
import { LIAM, MAYA, NOAH } from './personas';

const NOW = '2026-10-28T12:00:00Z';
const reflection = (r: Partial<Reflection> = {}): Reflection => ({
  enjoyment: 3,
  wouldDoMore: 'maybe',
  feltNatural: [],
  feltHard: [],
  ...r,
});

function light(c: Character, careerId: CareerId, stars: StarNumber[], r: Reflection | null = null): Character {
  for (const star of stars) c = completeQuest(c, careerId, star, r, NOW).character;
  return c;
}

describe('career similarity', () => {
  it('is symmetric and between 0 and 1', () => {
    for (const a of CAREER_IDS) {
      for (const b of CAREER_IDS) {
        const s = careerSimilarity(CAREERS[a], CAREERS[b]);
        expect(s).toBeCloseTo(careerSimilarity(CAREERS[b], CAREERS[a]), 10);
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(1);
      }
    }
    expect(careerSimilarity(CAREERS.teaching, CAREERS.teaching)).toBeCloseTo(1, 10);
  });

  it('pairs careers sensibly, by shared worlds and traits', () => {
    expect(relatedCareers('ux_design')[0]).toMatchObject({ careerId: 'graphic_designer' });
    expect(relatedCareers('software_dev')[0]).toMatchObject({ careerId: 'app_developer' });
    expect(relatedCareers('lab_scientist')[0]).toMatchObject({ careerId: 'chemist' });
    expect(relatedCareers('teaching')[0]).toMatchObject({ careerId: 'youth_worker' });
    expect(relatedCareers('carpenter')[0]).toMatchObject({ careerId: 'welder' });
    expect(relatedCareers('florist')[0]).toMatchObject({ careerId: 'fashion_designer' });
    expect(relatedCareers('youtuber').slice(0, 2).map((r) => r.careerId)).toEqual(expect.arrayContaining(['influencer']));
    expect(careerSimilarity(CAREERS.software_dev, CAREERS.app_developer)).toBeCloseTo(0.85, 3);
  });
});

describe('reaction to a reflection', () => {
  it.each([
    [5, 'yes', 'enjoyed'],
    [4, 'maybe', 'enjoyed'],
    [4, 'no', 'mixed'],
    [3, 'yes', 'mixed'],
    [2, 'yes', 'mixed'],
    [2, 'maybe', 'disliked'],
    [1, 'no', 'disliked'],
  ] as const)('enjoyment %i, would do more %s → %s', (enjoyment, wouldDoMore, expected) => {
    expect(reactionTo({ enjoyment, wouldDoMore })).toBe(expected);
  });
});

describe('related path', () => {
  const noah = light(createCharacter(NOAH), 'ux_design', [1]);

  it('defaults to the closest path, with a reason naming what they share', () => {
    const s = suggestRelatedPath(noah, 'ux_design')!;
    expect(s.careerId).toBe('graphic_designer');
    expect(s.quest.tier).toBe('taste');
    expect(s.reason).toBe('Uses the same Creativity and Communication as UX/product design');
  });

  it('"felt natural" pulls toward paths that use it', () => {
    const aesthetic = suggestRelatedPath(noah, 'ux_design', reflection({ feltNatural: ['aesthetic'] }))!;
    expect(aesthetic.careerId).toBe('graphic_designer');
    expect(aesthetic.reason).toBe('Aesthetic eye felt natural, and Graphic designer runs on it');
    const analytical = suggestRelatedPath(noah, 'ux_design', reflection({ feltNatural: ['analytical'] }))!;
    expect(analytical.careerId).toBe('game_designer');
  });

  it('"felt hard" pushes away from paths that need it', () => {
    const s = suggestRelatedPath(noah, 'ux_design', reflection({ feltHard: ['aesthetic'] }))!;
    expect(CAREERS[s.careerId].requirements.map((r) => r.attribute)).not.toContain('aesthetic');
  });

  it('skips Not for me and finished paths', () => {
    let c = setPathInterest(noah, 'graphic_designer', 'not_for_me');
    expect(suggestRelatedPath(c, 'ux_design')!.careerId).not.toBe('graphic_designer');
    c = light(createCharacter(NOAH), 'graphic_designer', [1, 2, 3, 4, 5]);
    expect(suggestRelatedPath(c, 'ux_design')!.careerId).not.toBe('graphic_designer');
  });

  it('offers the next star on a path that is already started', () => {
    const c = light(noah, 'graphic_designer', [1, 2]);
    expect(suggestRelatedPath(c, 'ux_design')).toMatchObject({ careerId: 'graphic_designer', quest: { star: 3 } });
  });
});

describe('different path', () => {
  it("picks the user's best-ranked path that isn't a close neighbor", () => {
    // Maya didn't enjoy Teaching; its close neighbors (youth work, social work) are passed over.
    const c = light(createCharacter(MAYA), 'teaching', [1], reflection({ enjoyment: 1, wouldDoMore: 'no' }));
    const s = suggestDifferentPath(c, 'teaching')!;
    expect(['youth_worker', 'social_work', 'early_childhood']).not.toContain(s.careerId);
    expect(s.careerId).toBe('event_planner');
    expect(s.reason).toBe('In a world you chose: Business & Entrepreneurship');
  });

  it('stays inside the user’s worlds when it can', () => {
    const c = light(createCharacter(LIAM), 'software_dev', [1]);
    expect(suggestDifferentPath(c, 'software_dev')!.careerId).toBe('chemist');
  });
});

describe('next recommendation', () => {
  const maya = createCharacter(MAYA);

  it('enjoyed → next star on the same path', () => {
    const r = reflection({ enjoyment: 5, wouldDoMore: 'yes' });
    const c = light(maya, 'teaching', [1], r);
    expect(nextRecommendation(c, 'teaching', r)).toMatchObject({ kind: 'same_path', careerId: 'teaching', quest: { star: 2 } });
  });

  it('no reflection counts as enjoyed', () => {
    const c = light(maya, 'teaching', [1]);
    expect(nextRecommendation(c, 'teaching', null)).toMatchObject({ kind: 'same_path', quest: { star: 2 } });
  });

  it('mixed → a Taste quest on a related path', () => {
    const r = reflection({ feltNatural: ['organization'] });
    const c = light(maya, 'teaching', [1], r);
    const next = nextRecommendation(c, 'teaching', r);
    expect(next).toMatchObject({ kind: 'related_path', careerId: 'youth_worker', quest: { tier: 'taste' } });
  });

  it('disliked → a different path', () => {
    const r = reflection({ enjoyment: 1, wouldDoMore: 'no' });
    const c = light(maya, 'teaching', [1], r);
    expect(nextRecommendation(c, 'teaching', r)).toMatchObject({ kind: 'different_path', careerId: 'event_planner' });
  });

  it('finished constellation → path complete with a related path', () => {
    const r = reflection({ enjoyment: 5, wouldDoMore: 'yes' });
    const c = light(createCharacter(NOAH), 'ux_design', [1, 2, 3, 4, 5], r);
    expect(nextRecommendation(c, 'ux_design', r)).toMatchObject({
      kind: 'path_complete',
      careerId: 'ux_design',
      related: { careerId: 'graphic_designer' },
    });
  });

  it('stays on the same path when nothing else is left', () => {
    let c = maya;
    for (const id of CAREER_IDS) if (id !== 'teaching') c = setPathInterest(c, id, 'not_for_me');
    const r = reflection();
    c = light(c, 'teaching', [1], r);
    expect(nextRecommendation(c, 'teaching', r)).toMatchObject({ kind: 'same_path', quest: { star: 2 } });
  });
});
