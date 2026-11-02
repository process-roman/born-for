import { ATTRIBUTE_LABELS } from '../content/attributes';
import { CAREERS } from '../content/careers';
import { powerUpQuest, type Game } from './game';
import { lifeAsks, type LifeRun } from './life';

export type LifeConcern = NonNullable<LifeRun['completed']>['concern'];

/** Describe the actual eligible quest, including when the free Taste quest trains other traits. */
export function lifeNextStep(game: Game, run: LifeRun) {
  const { powerUp } = lifeAsks(run);
  const star = powerUpQuest(game, run.career, powerUp);
  const quest = star ? CAREERS[run.career].quests.find((q) => q.star === star)! : null;
  const answer = run.completed?.wouldWant;
  const concern = answer === 'maybe' || answer === 'no' ? run.completed?.concern : undefined;
  const prompt = concern === 'work'
    ? 'Try a small piece of the everyday work before deciding whether this career interests you.'
    : concern === 'pace'
      ? 'The story’s pace is only one version of this career. Try a short task at your own pace, then reflect on your energy.'
      : concern === 'uncertainty'
        ? 'Hiring and company funding depend on circumstances too. Explore the career’s downsides and training before deciding.'
        : answer === 'no'
          ? 'It’s useful to learn what you don’t want. Explore another career, or try one real task to check whether it was the story or the work.'
          : answer === 'maybe'
            ? 'You don’t need to decide yet. Try a small real task or compare another career.'
            : 'Bring the story into the real world with one small task, then see how it feels.';
  const connection = quest
    ? powerUp && quest.attributes.includes(powerUp)
      ? `This quest practices ${ATTRIBUTE_LABELS[powerUp]}, a trait used in your story. Reflect on the task to grow your character stats.`
      : `This introductory quest practices ${quest.attributes.map((a) => ATTRIBUTE_LABELS[a]).join(' and ')}.${powerUp ? ` It does not train ${ATTRIBUTE_LABELS[powerUp]}, the story’s suggested growth area.` : ''} Use it to test whether you enjoy the work.`
    : 'No new quest on this path is available in your current plan. You can still explore its day-to-day work, downsides and training.';
  return { quest, prompt, connection };
}
