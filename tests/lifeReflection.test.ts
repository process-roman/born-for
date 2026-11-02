import { describe, expect, it } from 'vitest';
import { LIVES, SHARED_EVENTS } from '../src/content/life';
import { SIGNS } from '../src/content/signs';
import { createCharacter } from '../src/logic/character';
import { canStartQuest, newGame, setLifeWant, type Game } from '../src/logic/game';
import { startLife, type LifeRun } from '../src/logic/life';
import { lifeNextStep } from '../src/logic/lifeReflection';
import { NOAH } from './personas';

const game = newGame(createCharacter(NOAH), false);
function completed(): LifeRun {
  const run = startLife(LIVES.ux_design!, SHARED_EVENTS, {
    id: 'ux-reflection', career: 'ux_design', seed: 42, startedAt: '2026-11-01T00:00:00Z',
    stats: SIGNS.virgo.stats, element: 'earth',
  }).run;
  return { ...run, pendingEventId: undefined, log: [{ eventId: 'ux_startup_offer', choiceId: 'leap', check: { attribute: 'independence', odds: 20, success: false } }], completed: { endingId: 'steady', role: 'Designer', finishedAt: '2026-11-01T00:05:00Z', wouldWant: 'maybe' } };
}

describe('a useful next step after a simulated life', () => {
  it('offers an eligible free quest and explains when it does not train the story’s suggested trait', () => {
    const next = lifeNextStep(game, completed());
    expect(next.quest?.star).toBe(1);
    expect(canStartQuest(game, 'ux_design', next.quest!.star)).toBe(true);
    expect(next.quest!.attributes).not.toContain('independence');
    expect(next.connection).toContain('does not train Independence');
    expect(next.connection).toContain('Curiosity');
  });

  it('explains a direct connection when the available quest trains the suggested trait', () => {
    const run = completed();
    run.log[0]!.check!.attribute = 'empathy';
    expect(lifeNextStep({ ...game, paid: true }, run).connection).toContain('practices Empathy');
  });

  it('responds to a saved hesitation after a reload without changing access or ranking', () => {
    const run = completed();
    run.completed!.concern = 'pace';
    const reloaded = JSON.parse(JSON.stringify(run)) as LifeRun;
    expect(lifeNextStep(game, reloaded).prompt).toContain('at your own pace');
    reloaded.completed!.concern = 'uncertainty';
    expect(lifeNextStep(game, reloaded).prompt).toContain('company funding depend on circumstances');
    expect(game.character.feedback).toEqual({});
  });

  it('does not offer an inaccessible quest after No moves this career out of the top spot', () => {
    const run = completed();
    run.completed!.wouldWant = 'no';
    const after = setLifeWant(game, 'ux_design', 'no');
    expect(lifeNextStep(after, run).quest).toBeNull();
    expect(lifeNextStep(after, run).prompt).toContain('Explore another career');
  });

  it('handles old saves without an answer or concern, and exhausted quests', () => {
    const run = completed();
    delete run.completed!.wouldWant;
    const exhausted: Game = { ...game, character: { ...game.character, stars: { ux_design: [{ star: 1, completedAt: '2026-11-01', reflection: null }] } } };
    expect(lifeNextStep(exhausted, run).quest).toBeNull();
    expect(lifeNextStep(exhausted, run).connection).toContain('No new quest');
  });
});
