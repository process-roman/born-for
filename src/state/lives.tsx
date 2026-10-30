// Life sim runs, kept on device next to the game and saved after every choice (Life Sim Spec §14).
// Completed runs are all kept; at most one unfinished run per career, which resumes where it stopped.

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { CareerId } from '@/content/careers';
import type { LifeRun } from '@/logic/life';
import { getItem, removeItem, setItem } from '@/storage/kv';

const KEY = 'bornfor.lives';
const VERSION = 1;

interface Saved {
  version: number;
  runs: LifeRun[];
}

function load(): LifeRun[] {
  const raw = getItem(KEY);
  if (!raw) return [];
  try {
    const saved = JSON.parse(raw) as Saved;
    return saved.version === VERSION ? saved.runs : [];
  } catch {
    return [];
  }
}

/** The unfinished run for a career, if any. */
export function activeRun(runs: readonly LifeRun[], career: CareerId): LifeRun | null {
  return runs.find((r) => r.career === career && !r.completed) ?? null;
}

/** The most recently finished run for a career, if any. */
export function latestCompleted(runs: readonly LifeRun[], career: CareerId): LifeRun | null {
  return runs.filter((r) => r.career === career && r.completed).sort((a, b) => b.completed!.finishedAt.localeCompare(a.completed!.finishedAt))[0] ?? null;
}

interface LivesContextValue {
  runs: LifeRun[];
  /** Adds or replaces a run (matched by id). Starting a new run for a career drops its unfinished one. */
  save: (run: LifeRun) => void;
  /** Discards the career's unfinished run ("Restart life"). */
  discard: (career: CareerId) => void;
  reset: () => void;
}

const LivesContext = createContext<LivesContextValue | null>(null);

export function LivesProvider({ children }: { children: ReactNode }) {
  const [runs, setRuns] = useState<LifeRun[]>(load);

  const commit = useCallback((next: LifeRun[]) => {
    if (next.length) setItem(KEY, JSON.stringify({ version: VERSION, runs: next } satisfies Saved));
    else removeItem(KEY);
    setRuns(next);
  }, []);

  const value = useMemo<LivesContextValue>(
    () => ({
      runs,
      save: (run) => {
        const exists = runs.some((r) => r.id === run.id);
        const others = exists ? runs.map((r) => (r.id === run.id ? run : r)) : [...runs.filter((r) => r.career !== run.career || r.completed), run];
        commit(others);
      },
      discard: (career) => commit(runs.filter((r) => r.career !== career || r.completed)),
      reset: () => commit([]),
    }),
    [runs, commit],
  );

  return <LivesContext.Provider value={value}>{children}</LivesContext.Provider>;
}

export function useLives(): LivesContextValue {
  const value = useContext(LivesContext);
  if (!value) throw new Error('useLives must be inside LivesProvider');
  return value;
}
