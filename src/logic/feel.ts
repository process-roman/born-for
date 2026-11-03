// Music, sounds and haptics: the settings and which feel goes with which moment. Pure, so it can be
// tested; the audio engine (storage/audio.ts) and the provider (state/feel.tsx) do the playing.

/** Calm loops: one for the reveal (through the poll), one inside a life. */
export type MusicTrack = 'reveal' | 'life';

/** Short moments. `select` is a haptic only. */
export type Cue = 'reveal' | 'star' | 'success' | 'setback' | 'badge' | 'ending' | 'select';

export type HapticKind = 'success' | 'light' | 'medium' | 'soft' | 'selection';

/** A setback gets a soft tap, never the error buzz: it's part of the story, not a mistake. */
export const CUE_HAPTICS: Record<Cue, HapticKind> = {
  reveal: 'medium',
  star: 'success',
  success: 'light',
  setback: 'soft',
  badge: 'success',
  ending: 'medium',
  select: 'selection',
};

/** Cues with a sound; the rest are haptic only. */
export const CUE_SOUNDS: readonly Cue[] = ['reveal', 'star', 'success', 'setback', 'badge', 'ending'];

export interface FeelPrefs {
  music: boolean;
  sounds: boolean;
  haptics: boolean;
}

export const DEFAULT_FEEL: FeelPrefs = { music: true, sounds: true, haptics: true };

/** Saved prefs, with anything missing or unreadable falling back to on. */
export function parseFeel(raw: string | null): FeelPrefs {
  if (!raw) return DEFAULT_FEEL;
  try {
    const saved = JSON.parse(raw) as Partial<FeelPrefs>;
    return {
      music: saved.music !== false,
      sounds: saved.sounds !== false,
      haptics: saved.haptics !== false,
    };
  } catch {
    return DEFAULT_FEEL;
  }
}
