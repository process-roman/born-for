import { describe, expect, it } from 'vitest';
import { CAREER_TRAINING } from '../src/content/careerTraining';
import { CAREER_IDS, CAREERS } from '../src/content/careers';
import { SIGNS } from '../src/content/signs';
import { ageOf, createCharacter, rankingFor, setBirthYear } from '../src/logic/character';
import { difficultyFor } from '../src/logic/difficulty';
import { MAYA } from './personas';

const cancer = SIGNS.cancer.stats;
const strong = Object.fromEntries(Object.keys(cancer).map((a) => [a, 95])) as typeof cancer;

describe('age-aware difficulty', () => {
  it('a Cancer accountant: Some training at 18, Challenging at 30 because of the study route', () => {
    expect(difficultyFor(CAREERS.accountant, cancer).level).toBe(2); // analytical gap, no age known
    const young = difficultyFor(CAREERS.accountant, cancer, 18);
    expect(young.level).toBe(2);
    expect(young.ageNote).toBeNull();
    const thirty = difficultyFor(CAREERS.accountant, cancer, 30);
    expect(thirty.level).toBe(3);
    expect(thirty.label).toBe('Challenging but achievable');
    expect(thirty.ageNote).toBe('About 3–5 years of study to qualify from scratch, less with a related degree. Harder to fit in at 30, still possible.');
  });

  it('long routes add one level from 25, very long routes two; never past Challenging', () => {
    expect(difficultyFor(CAREERS.accountant, strong, 24).level).toBe(1);
    expect(difficultyFor(CAREERS.accountant, strong, 25).level).toBe(2);
    expect(difficultyFor(CAREERS.doctor, strong, 25).level).toBe(3);
    expect(difficultyFor(CAREERS.doctor, cancer, 40).level).toBe(3);
  });

  it('short routes and paid apprenticeships stay age-friendly', () => {
    expect(difficultyFor(CAREERS.real_estate, strong, 45)).toMatchObject({ level: 1, ageNote: null });
    expect(difficultyFor(CAREERS.electrician, strong, 40)).toMatchObject({ level: 1, ageNote: null });
    expect(difficultyFor(CAREERS.ux_design, strong, 35)).toMatchObject({ level: 1, ageNote: null });
  });

  it('careers people usually start young become a long shot later, never closed', () => {
    expect(difficultyFor(CAREERS.athlete, strong, 17)).toMatchObject({ level: 1, ageNote: null });
    const later = difficultyFor(CAREERS.athlete, strong, 26);
    expect(later.level).toBe(3);
    expect(later.ageNote).toContain('long shot');
    expect(later.ageNote).toContain('stay open');
  });

  it('every career has a sensible training range', () => {
    for (const id of CAREER_IDS) {
      const [min, max] = CAREER_TRAINING[id].years;
      expect(min, id).toBeGreaterThanOrEqual(0);
      expect(max, id).toBeGreaterThanOrEqual(min);
    }
  });
});

describe('birth year', () => {
  it('is kept on the character and gives an age', () => {
    const c = createCharacter({ ...MAYA, birthYear: 1996 });
    expect(c.birthYear).toBe(1996);
    expect(ageOf(c, new Date('2026-10-31'))).toBe(30);
    expect(ageOf(createCharacter(MAYA))).toBeNull();
    expect('birthYear' in createCharacter(MAYA)).toBe(false);
  });

  it('can be added, changed or removed in settings', () => {
    const added = setBirthYear(createCharacter(MAYA), 1990);
    expect(added.birthYear).toBe(1990);
    expect('birthYear' in setBirthYear(added, null)).toBe(false);
  });

  it('age changes difficulty labels, never the ranking order', () => {
    const withAge = rankingFor(createCharacter({ ...MAYA, birthYear: new Date().getFullYear() - 35 }));
    const without = rankingFor(createCharacter(MAYA));
    expect(withAge.ranked.map((m) => m.careerId)).toEqual(without.ranked.map((m) => m.careerId));
    expect(withAge.ranked.find((m) => m.careerId === 'doctor')?.difficulty.ageNote).toContain('of study');
  });
});
