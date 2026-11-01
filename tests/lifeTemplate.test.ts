import { describe, expect, it } from 'vitest';
import { CAREER_IDS, CAREERS } from '../src/content/careers';
import { HAND_WRITTEN_LIVES, LIFE_CAREER_IDS, LIVES, SHARED_EVENTS, type LifeEvent } from '../src/content/life';
import { SIGN_IDS, SIGNS } from '../src/content/signs';
import { createRng, LIFE_SLOTS, playLife } from '../src/logic/life';
import { validateLife } from '../src/logic/lifeValidate';
import { FAMILIES, familyOf } from '../src/content/lifeFamilies';

describe('template lives', () => {
  it('every career has a life; hand-written ones win', () => {
    expect(LIFE_CAREER_IDS).toHaveLength(CAREER_IDS.length);
    expect(LIVES.ux_design).toBe(HAND_WRITTEN_LIVES.ux_design);
    expect(LIVES.electrician!.lifeName).toBe('Electrician');
  });

  it('every life is valid content', () => {
    for (const id of LIFE_CAREER_IDS) {
      const report = validateLife(LIVES[id]!, SHARED_EVENTS);
      expect(report.errors, id).toEqual([]);
    }
  });

  it('is built from the career’s own content', () => {
    const life = LIVES.accountant!;
    const text = JSON.stringify(life);
    expect(text).toContain(CAREERS.accountant.downsides[0]!.slice(1)); // the real downside, mid-sentence
    expect(text).toContain('bookkeeper'); // an entry role to search for
    expect(life.class).toBe('Ledgerkeeper');
    expect(life.roles.byMastery.map((r) => r.role)).toEqual(['Finance manager', 'Senior accountant', 'Accountant', 'Bookkeeper']);
    // Checks lean on the career's key traits, so "What this life asked of you" points somewhere useful.
    const checked = new Set(life.events.flatMap((e) => e.choices.flatMap((c) => (c.check ? [c.check.attribute] : []))));
    expect(checked.has(CAREERS.accountant.requirements[0]!.attribute)).toBe(true);
  });

  it('routes in follow the training: apprenticeships, long study, short routes', () => {
    const labels = (id: keyof typeof LIVES) => LIVES[id]!.events.find((e) => e.id === `${id}_opener`)!.choices.map((c) => c.label);
    expect(labels('electrician')).toContain('Sign up for an apprenticeship');
    expect(labels('doctor')).toContain('Study it properly');
    expect(labels('barista')).toContain('Teach yourself');
  });

  it('family careers get their family’s scenes, filled with their own details', () => {
    const titles = (id: keyof typeof LIVES) => new Set(LIVES[id]!.events.map((e) => e.title));
    expect(titles('youtuber')).toContain('The Algorithm Changes');
    expect(titles('electrician')).toContain('The Licence Exam');
    expect(titles('nursing')).toContain('Night Shifts');
    expect(titles('software_dev')).toContain('The Outage');
    expect(titles('illustrator')).toContain('Revision Twelve');
    expect(titles('actor')).toContain('Audition Season');
    expect(titles('actor')).not.toContain('The Job Hunt'); // performers audition instead
    expect(titles('athlete')).toContain('The Injury');
    expect(titles('athlete')).toContain('Getting Your First Spot');
    expect(JSON.stringify(LIVES.athlete)).not.toContain('near me'); // search terms stay out of the story
    expect(titles('teaching')).toContain('The One Who Comes Back');
    expect(JSON.stringify(LIVES.animator)).toContain('Open your own animation studio');
    expect(titles('accountant')).not.toContain('The Algorithm Changes'); // no family yet: generic scenes only
    expect(JSON.stringify(LIVES.streamer)).toContain('Stream Number One');
    expect(JSON.stringify(LIVES.plumber)).toContain('Started your own plumbing business');
    for (const family of Object.keys(FAMILIES) as (keyof typeof FAMILIES)[]) for (const id of FAMILIES[family]) expect(familyOf(id)).toBe(family);
  });

  it('family scenes show up in most lives of that family', () => {
    const rng = createRng(3);
    const pick = (_e: LifeEvent, choices: LifeEvent['choices']) => choices[Math.floor(rng() * choices.length)]!;
    const familyIds = new Set(LIVES.youtuber!.events.filter((e) => e.id.startsWith('youtuber_c_')).map((e) => e.id));
    const counts: number[] = [];
    for (let i = 0; i < 200; i++) {
      const sign = SIGN_IDS[i % SIGN_IDS.length]!;
      const { run } = playLife(LIVES.youtuber!, SHARED_EVENTS, { id: 'r', career: 'youtuber', seed: Math.floor(rng() * 4294967296), startedAt: '2026-11-01T00:00:00Z', stats: SIGNS[sign].stats, element: SIGNS[sign].element }, pick);
      counts.push(run.log.filter((l) => familyIds.has(l.eventId)).length);
    }
    expect(counts.reduce((a, b) => a + b, 0) / counts.length).toBeGreaterThan(2.4); // of ten slots, next to shared and sign scenes
    expect(counts.filter((c) => c >= 2).length / counts.length).toBeGreaterThan(0.8);
  });

  it('plays all ten slots on both tracks for every career, and reaches every ending', () => {
    const rng = createRng(7);
    const pick = (_e: LifeEvent, choices: LifeEvent['choices']) => choices[Math.floor(rng() * choices.length)]!;
    for (const id of LIFE_CAREER_IDS) {
      const life = LIVES[id]!;
      const endings = new Set<string>();
      for (const age of [null, 34]) {
        for (let i = 0; i < 120; i++) {
          const sign = SIGN_IDS[i % SIGN_IDS.length]!;
          const { run, skipped } = playLife(life, SHARED_EVENTS, { id: 'r', career: id, seed: Math.floor(rng() * 4294967296), startedAt: '2026-10-31T00:00:00Z', stats: SIGNS[sign].stats, element: SIGNS[sign].element, age }, pick);
          expect(skipped, id).toEqual([]);
          expect(run.log.filter((l) => !l.eventId.startsWith('shared_burnout') && !l.eventId.startsWith('shared_broke'))).toHaveLength(LIFE_SLOTS.length);
          endings.add(run.completed!.endingId);
        }
      }
      expect(endings.size, id).toBe(life.endings.length);
    }
  }, 30_000); // plays about 24,000 lives
});
