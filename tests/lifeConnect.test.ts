import { describe, expect, it } from 'vitest';
import { LIVES, SHARED_EVENTS } from '../src/content/life';
import { createCharacter, rankingFor } from '../src/logic/character';
import { finishLife, newGame, powerUpQuest, setLifeWant, startQuest, finishQuest } from '../src/logic/game';
import { LIFE_XP, startLife, type LifeRun } from '../src/logic/life';
import { canPlayLife, freeLifeCareer, unplayedLife } from '../src/logic/lifeAccess';
import { FEEDBACK_EFFECTS } from '../src/logic/ranking';
import { SIGNS } from '../src/content/signs';
import { MAYA } from './personas';

const designer = LIVES.ux_design!;
const run = (completed: boolean): LifeRun => {
  const base = startLife(designer, SHARED_EVENTS, { id: 'r', career: 'ux_design', seed: 1, startedAt: '2026-10-31T00:00:00Z', stats: SIGNS.cancer.stats, element: 'water' }).run;
  return completed ? { ...base, pendingEventId: undefined, completed: { endingId: 'ux_end_steady', role: 'Junior designer', finishedAt: '2026-10-31T00:10:00Z' } } : base;
};

describe('life XP', () => {
  it('gives 25 quest XP the first time a career’s life is finished, never again', () => {
    const game = newGame(createCharacter(MAYA), true);
    const first = finishLife(game, 'ux_design');
    expect(first.xp).toBe(LIFE_XP);
    expect(first.game.character.totalXp).toBe(game.character.totalXp + 25);
    const again = finishLife(first.game, 'ux_design');
    expect(again.xp).toBe(0);
    expect(again.game.character.totalXp).toBe(first.game.character.totalXp);
  });

  it('changes no stats', () => {
    const game = newGame(createCharacter(MAYA), true);
    const { game: after } = finishLife(game, 'ux_design');
    expect(after.character.earned).toEqual(game.character.earned);
    expect(after.character.confirmed).toEqual(game.character.confirmed);
  });
});

describe('"Would you want this life?" in matching', () => {
  const game = newGame(createCharacter(MAYA), true);
  const match = (g: typeof game) => {
    const { ranked, notForMe } = rankingFor(g.character);
    return { inRanked: ranked.find((m) => m.careerId === 'ux_design'), inNotForMe: notForMe.some((m) => m.careerId === 'ux_design') };
  };

  it('Yes adds 10 to the match score', () => {
    const before = match(game).inRanked!;
    const after = match(setLifeWant(game, 'ux_design', 'yes')).inRanked!;
    expect(after.adjustedScore - before.adjustedScore).toBeCloseTo(FEEDBACK_EFFECTS.wantedLife);
    expect(FEEDBACK_EFFECTS.wantedLife).toBe(10);
  });

  it('Maybe changes nothing; No works like Not for me', () => {
    expect(match(setLifeWant(game, 'ux_design', 'maybe')).inRanked!.adjustedScore).toBeCloseTo(match(game).inRanked!.adjustedScore);
    const no = match(setLifeWant(game, 'ux_design', 'no'));
    expect(no.inRanked).toBeUndefined();
    expect(no.inNotForMe).toBe(true);
  });
});

describe('free life access', () => {
  it('the free life is the best-ranked career that has a life', () => {
    expect(freeLifeCareer(createCharacter(MAYA))).toBe('ux_design'); // the only life so far
  });

  it('free users play it once; a run in progress can resume; paid users play anything', () => {
    const free = newGame(createCharacter(MAYA), false);
    expect(canPlayLife(free, [], 'ux_design')).toBe(true);
    expect(canPlayLife(free, [run(false)], 'ux_design')).toBe(true);
    expect(canPlayLife(free, [run(true)], 'ux_design')).toBe(false);
    expect(canPlayLife(free, [], 'teaching')).toBe(false); // no life content
    expect(canPlayLife({ ...free, paid: true }, [run(true)], 'ux_design')).toBe(true);
  });

  it('Home shows a life until it’s been lived', () => {
    const free = newGame(createCharacter(MAYA), false);
    expect(unplayedLife(free, [])).toBe('ux_design');
    expect(unplayedLife(free, [run(false)])).toBe('ux_design');
    expect(unplayedLife(free, [run(true)])).toBeNull();
  });
});

describe('Power up', () => {
  it('opens the next available quest that trains the attribute, else the first unlit Taste quest', () => {
    const game = newGame(createCharacter(MAYA), true);
    expect(powerUpQuest(game, 'ux_design', 'empathy')).toBe(1); // star 1 trains Empathy
    expect(powerUpQuest(game, 'ux_design', 'hands_on')).toBe(1); // no quest trains it: first Taste quest
  });

  it('skips lit stars', () => {
    let game = newGame(createCharacter(MAYA), true);
    game = startQuest(game, 'ux_design', 1, new Date(), new Date(), null);
    game = finishQuest(game, null, new Date()).game;
    expect(powerUpQuest(game, 'ux_design', 'hands_on')).toBe(2);
    expect(powerUpQuest(game, 'ux_design', 'detail')).toBe(3); // star 3 trains Attention to detail
  });
});
