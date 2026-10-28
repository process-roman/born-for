import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_IDS, SIGN_STAT_BUDGET } from '../src/content/attributes';
import { CAREER_IDS, CAREERS } from '../src/content/careers';
import { PREFERENCE_IDS } from '../src/content/preferences';
import { SIGN_IDS, SIGN_STAT_MAX, SIGN_STAT_MIN, SIGNS } from '../src/content/signs';

describe('sign profiles', () => {
  it.each(SIGN_IDS)('%s totals 480 points, each between 35 and 85', (id) => {
    const { stats } = SIGNS[id];
    expect(ATTRIBUTE_IDS.reduce((sum, a) => sum + stats[a], 0)).toBe(SIGN_STAT_BUDGET);
    for (const a of ATTRIBUTE_IDS) {
      expect(stats[a]).toBeGreaterThanOrEqual(SIGN_STAT_MIN);
      expect(stats[a]).toBeLessThanOrEqual(SIGN_STAT_MAX);
    }
  });

  it('archetypes and adjectives are unique', () => {
    expect(new Set(SIGN_IDS.map((id) => SIGNS[id].archetype)).size).toBe(12);
    expect(new Set(SIGN_IDS.map((id) => SIGNS[id].adjective)).size).toBe(12);
  });
});

describe('careers', () => {
  it.each(CAREER_IDS)('%s is well formed', (id) => {
    const c = CAREERS[id];
    expect(c.id).toBe(id);
    expect(c.requirements.reduce((s, r) => s + r.weight, 0)).toBeCloseTo(1, 10);
    expect(c.quests.map((q) => q.star)).toEqual([1, 2, 3, 4, 5]);
    expect(c.quests.map((q) => q.tier)).toEqual(['taste', 'taste', 'try', 'try', 'test']);
    expect(c.constellation.stars).toHaveLength(5);
    for (const [x, y] of c.constellation.stars) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(100);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(100);
    }
    expect(c.workStyles.length).toBeGreaterThan(0);
  });

  it('every preference leads to at least one career', () => {
    for (const p of PREFERENCE_IDS) {
      expect(CAREER_IDS.some((id) => (CAREERS[id].interestTags[p] ?? 0) > 0), p).toBe(true);
    }
  });

  it('every attribute matters to at least one career', () => {
    const used = new Set(
      CAREER_IDS.flatMap((id) => [
        ...CAREERS[id].requirements.map((r) => r.attribute),
        ...CAREERS[id].quests.flatMap((q) => q.attributes),
      ]),
    );
    for (const a of ATTRIBUTE_IDS) expect(used.has(a), a).toBe(true);
  });

  it('class names are unique', () => {
    const names = CAREER_IDS.map((id) => CAREERS[id].className);
    expect(new Set(names).size).toBe(names.length);
  });
});
