import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_IDS } from '../src/content/attributes';
import { CAREER_IDS, CAREERS, careersInWorld } from '../src/content/careers';
import { WORLD_IDS } from '../src/content/worlds';
import { PREFERENCE_IDS } from '../src/content/preferences';
import { SIGN_IDS, SIGN_STAT_BUDGET, SIGN_STAT_MAX, SIGN_STAT_MIN, SIGNS } from '../src/content/signs';
import { ZODIAC_CONSTELLATIONS } from '../src/content/zodiacConstellations';

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

describe('zodiac constellations', () => {
  it.each(SIGN_IDS)('%s has stars on the grid and lines between real stars', (id) => {
    const { stars, lines } = ZODIAC_CONSTELLATIONS[id];
    expect(stars.length).toBeGreaterThanOrEqual(4);
    for (const [x, y] of stars) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(100);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(100);
    }
    for (const [a, b] of lines) {
      expect(stars[a]).toBeDefined();
      expect(stars[b]).toBeDefined();
      expect(a).not.toBe(b);
    }
  });
});

describe('signature and background traits', () => {
  it.each(SIGN_IDS)('%s ranks all 16 traits exactly once', (id) => {
    const { signature, background } = SIGNS[id];
    expect(signature).toHaveLength(8);
    expect(background).toHaveLength(8);
    expect(new Set([...signature, ...background]).size).toBe(16);
  });

  it('every trait is a signature trait for at least one sign', () => {
    for (const a of ATTRIBUTE_IDS) expect(SIGN_IDS.some((id) => SIGNS[id].signature.includes(a)), a).toBe(true);
  });
});

describe('career worlds', () => {
  it('every world has at least two careers', () => {
    for (const w of WORLD_IDS) expect(careersInWorld(w).length, w).toBeGreaterThanOrEqual(2);
  });

  it('every career belongs to a known world', () => {
    for (const id of CAREER_IDS) {
      expect(CAREERS[id].worlds.length).toBeGreaterThan(0);
      for (const w of CAREERS[id].worlds) expect(WORLD_IDS).toContain(w);
    }
  });

  it('long shots carry a reality check', () => {
    expect(CAREERS.athlete.realityCheck).toBeTruthy();
    expect(CAREERS.musician.realityCheck).toBeTruthy();
  });
});

describe('quest template', () => {
  it.each(CAREER_IDS)('%s follows Discover → Day in the life → Beginner → Make it yours → Real world', (id) => {
    const quests = CAREERS[id].quests;
    expect(quests.map((q) => q.step)).toEqual(['discover', 'day', 'beginner', 'own', 'real']);
    for (const q of quests) {
      expect(q.learn.length).toBeGreaterThan(0);
      expect(q.instructions.length).toBeGreaterThan(0);
    }
  });

  it('electrician build quests stay on battery power', () => {
    for (const q of CAREERS.electrician.quests.filter((q) => q.step === 'beginner' || q.step === 'own')) {
      expect(q.instructions).toMatch(/battery/i);
    }
  });
});
