// The saved game, kept on device and written on every change (offline-first, Blueprint §4.2, §13).

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { BadgeId } from '@/content/badges';
import { CAREERS, type CareerId, type StarNumber } from '@/content/careers';
import type { SignId } from '@/content/signs';
import type { Character, Reflection } from '@/logic/character';
import { setPathInterest } from '@/logic/character';
import * as G from '@/logic/game';
import type { PathInterest } from '@/logic/ranking';
import type { PollAnswers } from '@/logic/stats';
import { getItem, removeItem, setItem } from '@/storage/kv';
import { cancelCheckIn, requestReminderPermission, scheduleCheckIn } from '@/storage/notifications';

const KEY = 'bornfor.game';

function load(): G.Game | null {
  const raw = getItem(KEY);
  if (!raw) return null;
  try {
    const game = JSON.parse(raw) as G.Game;
    return game.version === G.GAME_VERSION ? game : null;
  } catch {
    return null;
  }
}

interface GameContextValue {
  game: G.Game | null;
  /** The last finished quest, for the rewards screen. Not saved. */
  lastResult: G.FinishResult | null;
  begin: (character: Character, paid: boolean) => void;
  startQuest: (careerId: CareerId, star: StarNumber, when: G.WhenChoice, remind: boolean) => Promise<{ reminded: boolean }>;
  snooze: () => void;
  resume: () => void;
  tooHard: () => void;
  notForMe: () => void;
  finish: (reflection: Reflection | null) => void;
  setInterest: (careerId: CareerId, interest: PathInterest) => void;
  equipTitle: (careerId: CareerId) => void;
  unlock: () => void;
  recalibrate: (answers: PollAnswers) => BadgeId[];
  switchCuspSign: (sign: SignId) => void;
  setReminders: (on: boolean) => void;
  /** First-time life XP; returns the XP given (0 on later completions). */
  finishLife: (careerId: CareerId) => number;
  setLifeWant: (careerId: CareerId, answer: 'yes' | 'maybe' | 'no') => void;
  reset: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState<G.Game | null>(load);
  const [lastResult, setLastResult] = useState<G.FinishResult | null>(null);

  const commit = useCallback((next: G.Game | null) => {
    if (next) setItem(KEY, JSON.stringify(next));
    else removeItem(KEY);
    setGame(next);
  }, []);

  const value = useMemo<GameContextValue>(() => {
    const update = (fn: (g: G.Game) => G.Game) => {
      if (game) commit(fn(game));
    };
    return {
      game,
      lastResult,
      begin: (character, paid) => commit(G.newGame(character, paid)),
      startQuest: async (careerId, star, when, remind) => {
        if (!game) return { reminded: false };
        const now = new Date();
        const dueAt = G.checkInTime(when, now);
        let notificationId: string | null = null;
        if (remind && (await requestReminderPermission())) {
          const quest = CAREERS[careerId].quests.find((q) => q.star === star)!;
          const tier = quest.tier === 'taste' ? 'Taste' : quest.tier === 'try' ? 'Try' : 'Test';
          notificationId = await scheduleCheckIn(dueAt, `How did your ${tier} quest go?`, `“${quest.name}”: your star is waiting.`);
        }
        await cancelCheckIn(game.activeQuest?.notificationId ?? null);
        commit(G.startQuest(game, careerId, star, now, dueAt, notificationId));
        return { reminded: notificationId !== null };
      },
      snooze: () => update(G.snoozeQuest),
      resume: () => update(G.resumeQuest),
      tooHard: () => {
        void cancelCheckIn(game?.activeQuest?.notificationId ?? null);
        update(G.tooHard);
      },
      notForMe: () => {
        void cancelCheckIn(game?.activeQuest?.notificationId ?? null);
        update(G.notForMe);
      },
      finish: (reflection) => {
        if (!game?.activeQuest) return;
        void cancelCheckIn(game.activeQuest.notificationId);
        const result = G.finishQuest(game, reflection, new Date());
        setLastResult(result);
        commit(result.game);
      },
      setInterest: (careerId, interest) => update((g) => ({ ...g, character: setPathInterest(g.character, careerId, interest) })),
      equipTitle: (careerId) => update((g) => ({ ...g, equippedTitle: careerId })),
      unlock: () => update(G.unlock),
      recalibrate: (answers) => {
        if (!game) return [];
        const result = G.recalibrateGame(game, answers);
        commit(result.game);
        return result.newBadges;
      },
      switchCuspSign: (sign) => update((g) => G.switchCuspSign(g, sign)),
      setReminders: (on) => {
        if (!on) void cancelCheckIn(game?.activeQuest?.notificationId ?? null);
        update((g) => ({
          ...g,
          remindersEnabled: on,
          activeQuest: !on && g.activeQuest ? { ...g.activeQuest, notificationId: null } : g.activeQuest,
        }));
      },
      finishLife: (careerId) => {
        if (!game) return 0;
        const result = G.finishLife(game, careerId);
        if (result.xp) commit(result.game);
        return result.xp;
      },
      setLifeWant: (careerId, answer) => update((g) => G.setLifeWant(g, careerId, answer)),
      reset: () => {
        void cancelCheckIn(game?.activeQuest?.notificationId ?? null);
        setLastResult(null);
        commit(null);
      },
    };
  }, [game, lastResult, commit]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
