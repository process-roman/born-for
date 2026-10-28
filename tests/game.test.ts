import { describe, expect, it } from 'vitest';
import { createCharacter, litStarNumbers, type Reflection } from '../src/logic/character';
import {
  canStartQuest,
  checkInTime,
  finishQuest,
  homeSuggestion,
  isStale,
  newGame,
  notForMe,
  snoozeQuest,
  startQuest,
  tooHard,
  topCareer,
  unlock,
  type Game,
} from '../src/logic/game';
import { MAYA, NOAH } from './personas';

const NOW = new Date(2026, 9, 28, 12, 0); // Wed 28 Oct 2026, noon local
const DUE = new Date(2026, 9, 28, 20, 0);
const loved: Reflection = { enjoyment: 5, wouldDoMore: 'yes', feltNatural: ['creativity'], feltHard: [] };

function play(game: Game, careerId: Parameters<typeof startQuest>[1], star: Parameters<typeof startQuest>[2], r: Reflection | null = loved) {
  return finishQuest(startQuest(game, careerId, star, NOW, DUE, null), r, NOW);
}

describe('free tier', () => {
  const free = newGame(createCharacter(MAYA), false);

  it('only the first Taste quest on the top path can be started', () => {
    expect(topCareer(free)).toBe('project_coord');
    expect(canStartQuest(free, 'project_coord', 1)).toBe(true);
    expect(canStartQuest(free, 'teaching', 1)).toBe(false);
    expect(homeSuggestion(free)).toMatchObject({ careerId: 'project_coord', star: 1, kind: 'start' });
  });

  it('after the free star is lit, nothing else opens until unlock', () => {
    const { game } = play(free, 'project_coord', 1);
    expect(litStarNumbers(game.character, 'project_coord')).toEqual([1]);
    expect(canStartQuest(game, 'project_coord', 2)).toBe(false);
    expect(homeSuggestion(game)).toBeNull();
    const paid = unlock(game);
    expect(canStartQuest(paid, 'project_coord', 2)).toBe(true);
    expect(homeSuggestion(paid)).toMatchObject({ careerId: 'project_coord', star: 2 });
  });
});

describe('quest loop (paid)', () => {
  const paid = newGame(createCharacter(NOAH), true);

  it('starting sets the active quest and clears the old suggestion', () => {
    const g = startQuest({ ...paid, suggestion: { careerId: 'marketing', star: 1, kind: 'start', reason: null } }, 'ux_design', 1, NOW, DUE, 'n1');
    expect(g.activeQuest).toMatchObject({ careerId: 'ux_design', star: 1, snoozed: false, notificationId: 'n1', dueAt: DUE.toISOString() });
    expect(g.suggestion).toBeNull();
  });

  it('locked stars cannot be started', () => {
    expect(() => startQuest(paid, 'ux_design', 3, NOW, DUE, null)).toThrow();
  });

  it('done + enjoyed lights the star and suggests the next one', () => {
    const r = play(paid, 'ux_design', 1);
    expect(r.rewards.xp).toBe(80);
    expect(r.game.activeQuest).toBeNull();
    expect(r.game.suggestion).toMatchObject({ careerId: 'ux_design', star: 2, kind: 'same_path' });
  });

  it('a new title is equipped when it unlocks', () => {
    const r = play(play(paid, 'ux_design', 1).game, 'ux_design', 3);
    expect(r.rewards.newTitle?.text).toBe('The Precise Shaper');
    expect(r.game.equippedTitle).toBe('ux_design');
  });

  it('mixed feelings suggest a related path', () => {
    const r = play(paid, 'ux_design', 1, { enjoyment: 3, wouldDoMore: 'maybe', feltNatural: ['hands_on'], feltHard: [] });
    expect(r.game.suggestion).toMatchObject({ careerId: 'chef', kind: 'related_path' });
  });

  it('Not now keeps the quest but snoozes it', () => {
    const g = snoozeQuest(startQuest(paid, 'ux_design', 1, NOW, DUE, null));
    expect(g.activeQuest?.snoozed).toBe(true);
  });

  it('Too hard drops the quest and offers an easier one on the same path', () => {
    let g = play(paid, 'ux_design', 1).game;
    g = tooHard(startQuest(g, 'ux_design', 3, NOW, DUE, null));
    expect(g.activeQuest).toBeNull();
    expect(g.suggestion).toMatchObject({ careerId: 'ux_design', star: 2, kind: 'easier' });
  });

  it('Not for me marks the path and offers a different one', () => {
    const g = notForMe(startQuest(paid, 'ux_design', 1, NOW, DUE, null));
    expect(g.character.feedback.ux_design?.interest).toBe('not_for_me');
    expect(g.suggestion?.kind).toBe('different_path');
    expect(g.suggestion?.careerId).not.toBe('ux_design');
  });

  it('flags a quest untouched for 14 days', () => {
    const g = startQuest(paid, 'ux_design', 1, NOW, DUE, null);
    expect(isStale(g.activeQuest!, new Date(2026, 10, 10, 12, 0))).toBe(false);
    expect(isStale(g.activeQuest!, new Date(2026, 10, 11, 12, 0))).toBe(true);
  });
});

describe('check-in time', () => {
  it('today means this evening, or two hours from now if it is already late', () => {
    expect(checkInTime({ kind: 'today' }, NOW)).toEqual(new Date(2026, 9, 28, 20, 0));
    const late = new Date(2026, 9, 28, 21, 30);
    expect(checkInTime({ kind: 'today' }, late)).toEqual(new Date(2026, 9, 28, 23, 30));
  });

  it('this weekend means Saturday evening, or later today on a weekend', () => {
    expect(checkInTime({ kind: 'weekend' }, NOW)).toEqual(new Date(2026, 9, 31, 18, 0));
    expect(checkInTime({ kind: 'weekend' }, new Date(2026, 10, 1, 9, 0))).toEqual(new Date(2026, 10, 1, 18, 0));
  });

  it('a picked day means that evening', () => {
    expect(checkInTime({ kind: 'day', date: new Date(2026, 10, 3) }, NOW)).toEqual(new Date(2026, 10, 3, 19, 0));
  });
});
