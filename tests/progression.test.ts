import { describe, expect, it } from 'vitest';
import { CAREERS, type CareerId, type StarNumber } from '../src/content/careers';
import {
  completeQuest,
  createCharacter,
  levelOf,
  recalibrate,
  statsOf,
  thenVsNow,
  titlesOf,
  type Character,
  type Reflection,
} from '../src/logic/character';
import { easierQuest, isStarAvailable, litLines, nextQuest } from '../src/logic/constellation';
import { difficultyFor } from '../src/logic/difficulty';
import { attributeXpForQuest, levelForXp, questXp, xpToNextLevel } from '../src/logic/xp';
import { MAYA, NOAH } from './personas';

const NOW = '2026-10-28T12:00:00Z';
const reflection = (r: Partial<Reflection> = {}): Reflection => ({
  enjoyment: 4,
  wouldDoMore: 'yes',
  feltNatural: [],
  feltHard: [],
  ...r,
});

function completeAll(c: Character, careerId: CareerId, r: Reflection | null = reflection()): Character {
  for (const star of [1, 2, 3, 4, 5] as StarNumber[]) c = completeQuest(c, careerId, star, r, NOW).character;
  return c;
}

describe('quest XP and levels', () => {
  it('awards tier XP plus 30 for reflecting', () => {
    expect(questXp('taste', false)).toBe(50);
    expect(questXp('try', true)).toBe(150);
    expect(questXp('test', true)).toBe(230);
  });

  it('a full reflected path is 690 XP', () => {
    expect(completeAll(createCharacter(MAYA), 'ux_design').totalXp).toBe(690);
  });

  it.each([
    [0, 1],
    [149, 1],
    [150, 2],
    [449, 2],
    [450, 3],
    [900, 4],
    [1499, 4],
    [1500, 5],
    [99999, 5],
  ])('%i XP is level %i', (xp, level) => {
    expect(levelForXp(xp)).toBe(level);
  });

  it('XP to next level', () => {
    expect(xpToNextLevel(100)).toBe(50);
    expect(xpToNextLevel(1500)).toBeNull();
  });

  it('two reflected Taste quests reach level 2; one path reaches level 3', () => {
    let c = createCharacter(MAYA);
    c = completeQuest(c, 'teaching', 1, reflection(), NOW).character;
    const second = completeQuest(c, 'teaching', 2, reflection(), NOW);
    expect(second.rewards).toMatchObject({ levelBefore: 1, levelAfter: 2 });
    expect(levelOf(completeAll(createCharacter(MAYA), 'teaching'))).toBe(3);
  });
});

describe('attribute XP', () => {
  it('quest attributes get the tier amount, felt-natural chips +1 (max 2)', () => {
    const quest = CAREERS.ux_design.quests[2]!; // Try: creativity, detail
    const xp = attributeXpForQuest(quest, ['creativity', 'empathy', 'curiosity']);
    expect(xp).toMatchObject({ creativity: 5, detail: 4, empathy: 1, curiosity: 0 });
  });

  it('is granted only when the quest is reflected on', () => {
    const c = completeQuest(createCharacter(MAYA), 'ux_design', 1, null, NOW);
    expect(c.rewards.xp).toBe(50);
    expect(Object.values(c.character.earned).every((v) => v === 0)).toBe(true);
    expect(c.character.feedback.ux_design).toBeUndefined();
  });

  it('finishing UX adds +8 Creativity, +10 Empathy, +6 Communication', () => {
    const c = completeAll(createCharacter(NOAH), 'ux_design');
    expect(c.earned).toMatchObject({ creativity: 8, empathy: 10, communication: 6, curiosity: 4, detail: 4, persistence: 4 });
  });

  it('Noah: finishing UX moves it from Some training to Natural fit', () => {
    const before = createCharacter(NOAH);
    expect(difficultyFor(CAREERS.ux_design, statsOf(before)).level).toBe(2);
    const after = completeAll(before, 'ux_design');
    expect(difficultyFor(CAREERS.ux_design, statsOf(after)).level).toBe(1);
  });

  it('current stats cap at 100', () => {
    let c = createCharacter(MAYA); // Empathy 85
    for (const id of ['ux_design', 'teaching', 'marketing'] as CareerId[]) {
      c = completeAll(c, id, reflection({ feltNatural: ['empathy'] }));
    }
    expect(c.confirmed.empathy + c.earned.empathy).toBeGreaterThan(100);
    expect(statsOf(c).empathy).toBe(100);
  });
});

describe('recalibration', () => {
  it('changes the confirmed base but keeps earned XP', () => {
    let c = completeAll(createCharacter(MAYA), 'ux_design');
    const earned = c.earned;
    c = recalibrate(c, { creativity: 'yes' });
    expect(c.confirmed.creativity).toBe(79);
    expect(c.earned).toEqual(earned);
    expect(statsOf(c).creativity).toBe(87);
  });

  it('then vs now compares day-one stats to current', () => {
    let c = completeAll(createCharacter(MAYA), 'ux_design');
    c = recalibrate(c, { creativity: 'yes' });
    expect(thenVsNow(c).find((r) => r.attribute === 'creativity')).toEqual({
      attribute: 'creativity',
      then: 65,
      now: 87,
    });
  });
});

describe('constellations', () => {
  it('stars light in order within a tier; Test needs a Try star', () => {
    expect(isStarAvailable(1, [])).toBe(true);
    expect(isStarAvailable(2, [])).toBe(false);
    expect(isStarAvailable(3, [])).toBe(false);
    expect(isStarAvailable(3, [1])).toBe(true);
    expect(isStarAvailable(4, [1])).toBe(false);
    expect(isStarAvailable(5, [1, 2])).toBe(false);
    expect(isStarAvailable(5, [1, 3])).toBe(true);
    expect(isStarAvailable(1, [1])).toBe(false);
  });

  it('refuses to light a locked star', () => {
    expect(() => completeQuest(createCharacter(MAYA), 'ux_design', 5, null, NOW)).toThrow();
  });

  it('first quest is always Taste; next quest follows the order', () => {
    expect(nextQuest(CAREERS.teaching, [])!.tier).toBe('taste');
    expect(nextQuest(CAREERS.teaching, [1])!.star).toBe(2);
    expect(nextQuest(CAREERS.teaching, [1, 2, 3, 4, 5])).toBeNull();
  });

  it('Too hard offers an easier available quest on the same path', () => {
    const tryQuest = CAREERS.ux_design.quests[2]!;
    expect(easierQuest(CAREERS.ux_design, [1], tryQuest)!.star).toBe(2);
    expect(easierQuest(CAREERS.ux_design, [1, 2], tryQuest)).toBeNull();
  });

  it('a line draws only when both stars are lit', () => {
    expect(litLines(CAREERS.ux_design, [1, 2, 3])).toEqual([
      [1, 2],
      [2, 3],
    ]);
    // The Eye's pupil (star 5) is never connected.
    expect(litLines(CAREERS.data_analysis, [1, 2, 3, 4, 5])).toHaveLength(4);
  });
});

describe('titles', () => {
  it('unlock on the first Try star and star on completion', () => {
    let c = createCharacter(MAYA);
    c = completeQuest(c, 'ux_design', 1, reflection(), NOW).character;
    expect(titlesOf(c)).toEqual([]);

    const tryStar = completeQuest(c, 'ux_design', 3, reflection(), NOW);
    expect(tryStar.rewards.newTitle?.text).toBe('The Gentle Shaper');
    c = tryStar.character;

    c = completeQuest(c, 'ux_design', 2, reflection(), NOW).character;
    const four = completeQuest(c, 'ux_design', 4, reflection(), NOW);
    expect(four.rewards.newTitle).toBeNull();

    const last = completeQuest(four.character, 'ux_design', 5, reflection(), NOW);
    expect(last.rewards.constellationComplete).toBe(true);
    expect(last.rewards.newTitle).toMatchObject({ text: '★ The Gentle Shaper', starred: true });
  });

  it('uses the sign adjective', () => {
    const c = completeAll(createCharacter(NOAH), 'data_analysis');
    expect(titlesOf(c).map((t) => t.text)).toEqual(['★ The Precise Oracle']);
  });
});

describe('reflection feeds ranking', () => {
  it('enjoyment is recorded as path feedback', () => {
    let c = createCharacter(MAYA);
    c = completeQuest(c, 'marketing', 1, reflection({ enjoyment: 1 }), NOW).character;
    expect(c.feedback.marketing?.questEnjoyment).toEqual([1]);
  });
});
