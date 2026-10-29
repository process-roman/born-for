import { describe, expect, it } from 'vitest';
import type { CareerId, StarNumber } from '../src/content/careers';
import { earnedBadges } from '../src/logic/badges';
import { completeQuest, createCharacter, type Character, type Reflection } from '../src/logic/character';
import { confirmedLine, confirmedTraits, isThatsYouMoment, newlyConfirmed, thatsYouLine } from '../src/logic/confirmed';
import { finishQuest, newGame, startQuest } from '../src/logic/game';
import { MAYA } from './personas';

const NOW = '2026-10-28T12:00:00Z';
const loved = (feltNatural: Reflection['feltNatural'] = []): Reflection => ({ enjoyment: 5, wouldDoMore: 'yes', feltNatural, feltHard: [] });

function light(c: Character, id: CareerId, stars: StarNumber[], r: Reflection | null): Character {
  for (const s of stars) c = completeQuest(c, id, s, r, NOW).character;
  return c;
}

describe('confirmed by you', () => {
  it('a trait is confirmed once a reflection marks it as felt natural', () => {
    const c = light(createCharacter(MAYA), 'teaching', [1], loved(['empathy', 'leadership']));
    expect(confirmedTraits(c)).toEqual(['empathy', 'leadership']);
  });

  it('only first-time confirmations are new', () => {
    const before = light(createCharacter(MAYA), 'teaching', [1], loved(['empathy']));
    const after = light(before, 'teaching', [2], loved(['empathy', 'communication']));
    expect(newlyConfirmed(before, after)).toEqual(['communication']);
  });

  it('skipped reflections confirm nothing', () => {
    expect(confirmedTraits(light(createCharacter(MAYA), 'teaching', [1], null))).toEqual([]);
  });

  it('the line depends on what the sign predicted', () => {
    const c = createCharacter(MAYA); // Cancer: superpowers Empathy, Persistence, Organization
    expect(confirmedLine(c, 'empathy')).toBe('Your sign called Empathy. You just proved it.');
    expect(confirmedLine(c, 'teamwork')).toBe('Your sign suggested Teamwork. Now you know it’s real.');
    expect(confirmedLine(c, 'leadership')).toBe('Your sign didn’t predict Leadership. You found it yourself.');
  });

  it('three confirmed traits earn the Proven badge', () => {
    const c = light(createCharacter(MAYA), 'teaching', [1, 2], loved(['empathy', 'communication']));
    expect(earnedBadges(c)).not.toContain('proven');
    expect(earnedBadges(light(c, 'teaching', [3], loved(['leadership'])))).toContain('proven');
  });

  it('finishing a quest reports new confirmations', () => {
    const g = startQuest(newGame(createCharacter(MAYA), true), 'teaching', 1, new Date(), new Date(), null);
    expect(finishQuest(g, loved(['leadership']), new Date()).newlyConfirmed).toEqual(['leadership']);
  });
});

describe('"That\'s you"', () => {
  it('fires at exactly three stars, all enjoyed', () => {
    const two = light(createCharacter(MAYA), 'teaching', [1, 2], loved());
    expect(isThatsYouMoment(two, 'teaching')).toBe(false);
    const three = light(two, 'teaching', [3], loved());
    expect(isThatsYouMoment(three, 'teaching')).toBe(true);
    expect(isThatsYouMoment(light(three, 'teaching', [4], loved()), 'teaching')).toBe(false);
    expect(thatsYouLine('teaching')).toBe('3 stars in Teaching, and you loved every one. That’s not your sign talking. That’s you.');
  });

  it('not when a reflection was skipped or only so-so', () => {
    const meh: Reflection = { enjoyment: 3, wouldDoMore: 'maybe', feltNatural: [], feltHard: [] };
    expect(isThatsYouMoment(light(light(createCharacter(MAYA), 'teaching', [1, 2], loved()), 'teaching', [3], meh), 'teaching')).toBe(false);
    expect(isThatsYouMoment(light(light(createCharacter(MAYA), 'teaching', [1, 2], loved()), 'teaching', [3], null), 'teaching')).toBe(false);
  });

  it('finishing the third enjoyed quest reports it', () => {
    let g = newGame(light(createCharacter(MAYA), 'teaching', [1, 2], loved()), true);
    g = startQuest(g, 'teaching', 3, new Date(), new Date(), null);
    expect(finishQuest(g, loved(), new Date()).thatsYou).toBe(true);
  });
});
