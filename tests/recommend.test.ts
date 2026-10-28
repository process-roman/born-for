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

  it('pairs careers sensibly, across worlds too', () => {
    // Blueprint's own example, "Designers often explore Marketing", is still a top-2 neighbor.
    expect(relatedCareers('ux_design').slice(0, 2).map((r) => r.careerId)).toEqual(['writer', 'marketing']);
    expect(relatedCareers('software_dev')[0]).toMatchObject({ careerId: 'data_analysis' });
    expect(relatedCareers('lab_scientist')[0]).toMatchObject({ careerId: 'data_analysis' });
    expect(relatedCareers('project_coord')[0]).toMatchObject({ careerId: 'event_planner' });
    expect(relatedCareers('teaching')[0]).toMatchObject({ careerId: 'social_work' });
    expect(relatedCareers('carpenter')[0]).toMatchObject({ careerId: 'landscape_gardener' });
    expect(relatedCareers('florist')[0]).toMatchObject({ careerId: 'landscape_gardener' });
    expect(relatedCareers('personal_trainer')[0]).toMatchObject({ careerId: 'firefighter' });
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
    expect(s.careerId).toBe('writer');
    expect(s.quest.tier).toBe('taste');
    expect(s.reason).toBe('Uses the same Creativity and Communication as UX/product design');
  });

  it('"felt natural" pulls toward paths that use it, even in other worlds', () => {
    const hands = suggestRelatedPath(noah, 'ux_design', reflection({ feltNatural: ['hands_on'] }))!;
    expect(hands.careerId).toBe('chef');
    expect(hands.reason).toBe('Hands-on skill felt natural, and Chef runs on it');
    const aesthetic = suggestRelatedPath(noah, 'ux_design', reflection({ feltNatural: ['aesthetic'] }))!;
    expect(aesthetic.careerId).toBe('musician');
  });

  it('"felt hard" pushes away from paths that need it', () => {
    const s = suggestRelatedPath(noah, 'ux_design', reflection({ feltHard: ['communication'] }))!;
    expect(s.careerId).toBe('musician');
  });

  it('skips Not for me and finished paths', () => {
    let c = setPathInterest(noah, 'writer', 'not_for_me');
    expect(suggestRelatedPath(c, 'ux_design')!.careerId).not.toBe('writer');
    c = light(createCharacter(NOAH), 'writer', [1, 2, 3, 4, 5]);
    expect(suggestRelatedPath(c, 'ux_design')!.careerId).not.toBe('writer');
  });

  it('offers the next star on a path that is already started', () => {
    const c = light(noah, 'writer', [1, 2]);
    const s = suggestRelatedPath(c, 'ux_design')!;
    expect(s).toMatchObject({ careerId: 'writer', quest: { star: 3 } });
  });
});

describe('different path', () => {
  it("picks the user's best-ranked path that isn't a close neighbor", () => {
    // Maya: Project coordination ranks first; Event planning is its closest neighbor, so it's passed over.
    const c = light(createCharacter(MAYA), 'project_coord', [1], reflection({ enjoyment: 1, wouldDoMore: 'no' }));
    const s = suggestDifferentPath(c, 'project_coord')!;
    expect(s.careerId).not.toBe('event_planner');
    expect(s.careerId).toBe('nursing');
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
    expect(next).toMatchObject({ kind: 'related_path', careerId: 'social_work', quest: { tier: 'taste' } });
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
      related: { careerId: 'writer' },
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
