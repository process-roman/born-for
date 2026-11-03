// Music, sounds and haptics for the whole app: the user's settings (kept on this device), the loop
// screens ask for with useMusic, and cue() for short moments. Music stops when the app goes to the
// background and picks up again when it comes back.

import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { CUE_HAPTICS, parseFeel, type Cue, type FeelPrefs, type HapticKind, type MusicTrack } from '@/logic/feel';
import { playCue, playMusic, stopMusic } from '@/storage/audio';
import { getItem, setItem } from '@/storage/kv';

const KEY = 'bornfor.feel';
/** A screen leaving waits this long before the music stops, so the next screen can keep it going. */
const RELEASE_MS = 400;

function haptic(kind: HapticKind) {
  const run =
    kind === 'success'
      ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      : kind === 'selection'
        ? Haptics.selectionAsync()
        : Haptics.impactAsync(kind === 'light' ? Haptics.ImpactFeedbackStyle.Light : kind === 'soft' ? Haptics.ImpactFeedbackStyle.Soft : Haptics.ImpactFeedbackStyle.Medium);
  run.catch(() => {});
}

interface FeelValue {
  prefs: FeelPrefs;
  setPref: (key: keyof FeelPrefs, on: boolean) => void;
  /** A short moment: its sound and haptic, each if the user has it on. */
  cue: (cue: Cue) => void;
  claimMusic: (track: MusicTrack) => () => void;
}

const FeelContext = createContext<FeelValue | null>(null);

export function FeelProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<FeelPrefs>(() => parseFeel(getItem(KEY)));
  const [claims, setClaims] = useState<Partial<Record<MusicTrack, number>>>({});
  const [foreground, setForeground] = useState(AppState.currentState !== 'background');

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => setForeground(state === 'active'));
    return () => sub.remove();
  }, []);

  const wanted = (Object.keys(claims) as MusicTrack[]).find((t) => (claims[t] ?? 0) > 0) ?? null;
  useEffect(() => {
    if (wanted && prefs.music && foreground) playMusic(wanted);
    else stopMusic();
  }, [wanted, prefs.music, foreground]);

  const setPref = useCallback((key: keyof FeelPrefs, on: boolean) => {
    setPrefs((p) => {
      const next = { ...p, [key]: on };
      setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const cue = useCallback(
    (c: Cue) => {
      if (prefs.sounds) playCue(c);
      if (prefs.haptics) haptic(CUE_HAPTICS[c]);
    },
    [prefs.sounds, prefs.haptics],
  );

  const claimMusic = useCallback((track: MusicTrack) => {
    setClaims((c) => ({ ...c, [track]: (c[track] ?? 0) + 1 }));
    return () => {
      setTimeout(() => setClaims((c) => ({ ...c, [track]: Math.max(0, (c[track] ?? 0) - 1) })), RELEASE_MS);
    };
  }, []);

  const value = useMemo(() => ({ prefs, setPref, cue, claimMusic }), [prefs, setPref, cue, claimMusic]);
  return <FeelContext.Provider value={value}>{children}</FeelContext.Provider>;
}

export function useFeel(): FeelValue {
  const value = useContext(FeelContext);
  if (!value) throw new Error('useFeel outside FeelProvider');
  return value;
}

/** Plays a calm loop while this screen is open (and the user has music on). */
export function useMusic(track: MusicTrack) {
  const { claimMusic } = useFeel();
  useEffect(() => claimMusic(track), [claimMusic, track]);
}
