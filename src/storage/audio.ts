// Plays the calm loops and short cues (expo-audio). The phone's silent switch wins, and our audio
// mixes with whatever the user already has playing instead of pausing it. Music fades in and out.

import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import type { Cue, MusicTrack } from '@/logic/feel';

const MUSIC = {
  reveal: require('../../assets/audio/music-reveal.wav'),
  life: require('../../assets/audio/music-life.wav'),
} as const;

const CUES: Partial<Record<Cue, number>> = {
  reveal: require('../../assets/audio/sfx-reveal.wav'),
  star: require('../../assets/audio/sfx-star.wav'),
  success: require('../../assets/audio/sfx-success.wav'),
  setback: require('../../assets/audio/sfx-setback.wav'),
  badge: require('../../assets/audio/sfx-badge.wav'),
  ending: require('../../assets/audio/sfx-ending.wav'),
};

/** Quiet enough to read over. */
const MUSIC_VOLUME = 0.35;
const CUE_VOLUME = 0.6;
const FADE_MS = 1500;
const FADE_STEP_MS = 50;

let configured = false;
function configure() {
  if (configured) return;
  configured = true;
  setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false }).catch(() => {});
}

const musicPlayers: Partial<Record<MusicTrack, AudioPlayer>> = {};
const cuePlayers: Partial<Record<Cue, AudioPlayer>> = {};
const fades = new Map<AudioPlayer, ReturnType<typeof setInterval>>();
let current: MusicTrack | null = null;

function fade(player: AudioPlayer, to: number, done?: () => void) {
  clearInterval(fades.get(player));
  const from = player.volume;
  const steps = Math.max(1, Math.round(FADE_MS / FADE_STEP_MS));
  let i = 0;
  const timer = setInterval(() => {
    i += 1;
    player.volume = from + ((to - from) * i) / steps;
    if (i >= steps) {
      clearInterval(timer);
      fades.delete(player);
      done?.();
    }
  }, FADE_STEP_MS);
  fades.set(player, timer);
}

/** Starts a loop with a fade-in; a different loop fades out first. */
export function playMusic(track: MusicTrack) {
  if (current === track) return;
  configure();
  stopMusic();
  const player = (musicPlayers[track] ??= createAudioPlayer(MUSIC[track]));
  player.loop = true;
  player.volume = 0;
  player.play();
  fade(player, MUSIC_VOLUME);
  current = track;
}

/** Fades the current loop out and rewinds it for next time. */
export function stopMusic() {
  if (!current) return;
  const player = musicPlayers[current]!;
  current = null;
  fade(player, 0, () => {
    player.pause();
    player.seekTo(0).catch(() => {});
  });
}

/** Plays a short cue from the start. Cues without a sound do nothing here. */
export function playCue(cue: Cue) {
  const source = CUES[cue];
  if (source === undefined) return;
  configure();
  const player = (cuePlayers[cue] ??= createAudioPlayer(source));
  player.volume = CUE_VOLUME;
  player.seekTo(0).catch(() => {});
  player.play();
}
