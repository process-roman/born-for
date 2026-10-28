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

  it('pairs the pilot careers sensibly', () => {
    // Blueprint's own example: "Designers often explore Marketing".
    expect(relatedCareers('ux_design')[0]).toMatchObject({ careerId: 'marketing' });
    expect(relatedCareers('software_dev')[0]).toMatchObject({ careerId: 'data_analysis' });
    expect(relatedCareers('data_analysis')[0]).toMatchObject({ careerId: 'software_dev' });
    expect(relatedCareers('teaching')[0]).toMatchObject({ careerId: 'project_coord' });
    expect(relatedCareers('project_coord')[0]).toMatchObject({ careerId: 'teaching' });
    expect(careerSimilarity(CAREERS.ux_design, CAREERS.marketing)).toBeCloseTo(0.4, 2);
    expect(careerSimilarity(CAREERS.software_dev, CAREERS.data_analysis)).toBeCloseTo(0.575, 3);
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
    expect(s.careerId).toBe('marketing');
    expect(s.quest.tier).toBe('taste');
    expect(s.reason).toBe('Uses the same Communication and Creativity as UX/product design');
  });

  it('"felt natural" pulls toward paths that use it', () => {
    const empathy = suggestRelatedPath(noah, 'ux_design', reflection({ feltNatural: ['empathy'] }))!;
    expect(empathy.careerId).toBe('teaching');
    expect(empathy.reason).toBe('Empathy felt natural, and Teaching runs on it');
    const creativity = suggestRelatedPath(noah, 'ux_design', reflection({ feltNatural: ['creativity'] }))!;
    expect(creativity.careerId).toBe('marketing');
  });

  it('"felt hard" pushes away from paths that need it', () => {
    const s = suggestRelatedPath(noah, 'ux_design', reflection({ feltHard: ['communication'] }))!;
    expect(s.careerId).toBe('software_dev');
  });

  it('skips Not for me and finished paths', () => {
    let c = setPathInterest(noah, 'marketing', 'not_for_me');
    expect(suggestRelatedPath(c, 'ux_design')!.careerId).not.toBe('marketing');
    c = light(createCharacter(NOAH), 'marketing', [1, 2, 3, 4, 5]);
    expect(suggestRelatedPath(c, 'ux_design')!.careerId).not.toBe('marketing');
  });

  it('offers the next star on a path that is already started', () => {
    const c = light(noah, 'marketing', [1, 2]);
    const s = suggestRelatedPath(c, 'ux_design')!;
    expect(s).toMatchObject({ careerId: 'marketing', quest: { star: 3 } });
  });
});

describe('different path', () => {
  it("picks the user's best-ranked path that isn't a close neighbor", () => {
    // Maya: Project coordination ranks first, Teaching second.
    const c = light(createCharacter(MAYA), 'project_coord', [1], reflection({ enjoyment: 1, wouldDoMore: 'no' }));
    const s = suggestDifferentPath(c, 'project_coord')!;
    expect(s.careerId).toBe('teaching');
    expect(s.reason).toBe('You enjoy helping and supporting people');
  });

  it('strong preferences can still win over similarity', () => {
    const c = light(createCharacter(LIAM), 'software_dev', [1]);
    expect(suggestDifferentPath(c, 'software_dev')!.careerId).toBe('data_analysis');
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
    expect(next).toMatchObject({ kind: 'related_path', careerId: 'project_coord', quest: { tier: 'taste' } });
  });

  it('disliked → a different path', () => {
    const r = reflection({ enjoyment: 1, wouldDoMore: 'no' });
    const c = light(maya, 'teaching', [1], r);
    expect(nextRecommendation(c, 'teaching', r)).toMatchObject({ kind: 'different_path', careerId: 'project_coord' });
  });

  it('finished constellation → path complete with a related path', () => {
    const r = reflection({ enjoyment: 5, wouldDoMore: 'yes' });
    const c = light(createCharacter(NOAH), 'ux_design', [1, 2, 3, 4, 5], r);
    expect(nextRecommendation(c, 'ux_design', r)).toMatchObject({
      kind: 'path_complete',
      careerId: 'ux_design',
      related: { careerId: 'marketing' },
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
