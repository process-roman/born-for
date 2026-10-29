import { describe, expect, it } from 'vitest';
import type { CareerId, StarNumber } from '../src/content/careers';
import { avatarLayers, mostProgressedPath, nextLayerName } from '../src/logic/avatar';
import { earnedBadges, newBadges } from '../src/logic/badges';
import { completeQuest, createCharacter, type Character, type Reflection } from '../src/logic/character';
import { finishQuest, newGame, recalibrateGame, remindersOn, startQuest, switchCuspSign } from '../src/logic/game';
import { MAYA, NOAH } from './personas';

const NOW = '2026-10-28T12:00:00Z';
const loved: Reflection = { enjoyment: 5, wouldDoMore: 'yes', feltNatural: [], feltHard: [] };

function light(c: Character, id: CareerId, stars: StarNumber[], r: Reflection | null = loved): Character {
  for (const s of stars) c = completeQuest(c, id, s, r, NOW).character;
  return c;
}

describe('badges', () => {
  it('a new character has none (unless they unlocked a background trait)', () => {
    expect(earnedBadges(createCharacter(MAYA))).toEqual([]);
    expect(earnedBadges(createCharacter({ ...MAYA, answers: { leadership: 'yes' } }))).toEqual(['hidden_talent']);
  });

  it('First Star, Named, Reflective and First Constellation follow progress', () => {
    let c = light(createCharacter(MAYA), 'teaching', [1]);
    expect(earnedBadges(c)).toEqual(['first_star']);
    c = light(c, 'teaching', [3]);
    expect(earnedBadges(c)).toContain('first_title');
    c = light(c, 'teaching', [2, 4, 5]);
    expect(earnedBadges(c)).toEqual(expect.arrayContaining(['reflective', 'first_constellation', 'level_3']));
  });

  it('skipped reflections do not count toward Reflective', () => {
    const c = light(createCharacter(MAYA), 'teaching', [1, 2, 3, 4, 5], null);
    expect(earnedBadges(c)).not.toContain('reflective');
  });

  it('Three Paths and World Traveller', () => {
    let c = light(createCharacter(MAYA), 'teaching', [1]); // People & Education
    c = light(c, 'pastry_chef', [1]); // Food, Art
    expect(earnedBadges(c)).toContain('world_traveller');
    expect(earnedBadges(c)).not.toContain('three_paths');
    c = light(c, 'nursing', [1]);
    expect(earnedBadges(c)).toContain('three_paths');
  });

  it('newBadges lists only what was just earned', () => {
    const before = light(createCharacter(MAYA), 'teaching', [1]);
    const after = light(before, 'teaching', [3]);
    expect(newBadges(before, after)).toEqual(['first_title']);
  });
});

describe('game: badges, recalibration and settings', () => {
  it('finishing a quest reports newly earned badges', () => {
    const g = startQuest(newGame(createCharacter(MAYA), true), 'teaching', 1, new Date(), new Date(), null);
    expect(finishQuest(g, loved, new Date()).newBadges).toEqual(['first_star']);
  });

  it('recalibrating updates stats, keeps XP and earns Recalibrated', () => {
    const g = newGame(light(createCharacter(MAYA), 'teaching', [1]), true);
    const r = recalibrateGame(g, { leadership: 'yes' });
    expect(r.game.character.confirmed.leadership).toBe(73);
    expect(r.game.character.totalXp).toBe(g.character.totalXp);
    expect(r.newBadges).toEqual(expect.arrayContaining(['recalibrated', 'hidden_talent']));
  });

  it('switching cusp sign keeps progress', () => {
    const c = createCharacter({ ...MAYA, sign: 'gemini', cuspSigns: ['gemini', 'cancer'] });
    const g = switchCuspSign(newGame(light(c, 'teaching', [1]), true), 'cancer');
    expect(g.character.sign).toBe('cancer');
    expect(g.character.totalXp).toBe(80);
  });

  it('reminders are on unless turned off', () => {
    const g = newGame(createCharacter(MAYA), true);
    expect(remindersOn(g)).toBe(true);
    expect(remindersOn({ ...g, remindersEnabled: false })).toBe(false);
  });
});

describe('evolving character', () => {
  it('adds one layer per level', () => {
    const base = createCharacter(NOAH);
    expect(avatarLayers(base)).toMatchObject({ level: 1, aura: false, glow: false, item: null, frame: false });
    const two = light(base, 'carpenter', [1, 2]); // 160 XP
    expect(avatarLayers(two)).toMatchObject({ level: 2, aura: true, glow: false });
    const four = light(light(base, 'carpenter', [1, 2, 3, 4, 5]), 'chef', [1, 2, 3]); // 690 + 310
    expect(avatarLayers(four)).toMatchObject({ level: 4, aura: true, glow: true, item: { careerId: 'carpenter', name: 'chisel' }, frame: false });
  });

  it('the item comes from the most-progressed path', () => {
    const c = light(light(createCharacter(NOAH), 'chef', [1]), 'carpenter', [1, 2, 3]);
    expect(mostProgressedPath(c)).toBe('carpenter');
    expect(mostProgressedPath(createCharacter(NOAH))).toBeNull();
  });

  it('names the next layer', () => {
    expect(nextLayerName(1)).toBe('Constellation aura');
    expect(nextLayerName(5)).toBeNull();
  });
});
