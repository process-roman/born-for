// The math behind LifeSky (Life Sim Spec §11), kept free of React Native so it can be tested.

import type { Meters } from '@/content/life';
import { lifeSky } from './theme';

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mixes two #rrggbb colors; t = 0 gives `a`, 1 gives `b`. */
export function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const k = Math.max(0, Math.min(1, t));
  const c = (x: number, y: number) => Math.round(x + (y - x) * k).toString(16).padStart(2, '0');
  return `#${c(ar, br)}${c(ag, bg)}${c(ab, bb)}`;
}

/** Sky gradient for an age, interpolated between the keyframes. */
export function skyColors(age: number): { top: string; bottom: string } {
  const frames = lifeSky.keyframes;
  if (age <= frames[0].age) return { top: frames[0].top, bottom: frames[0].bottom };
  for (let i = 1; i < frames.length; i++) {
    const a = frames[i - 1]!;
    const b = frames[i]!;
    if (age === b.age) return { top: b.top, bottom: b.bottom };
    if (age < b.age) {
      const t = (age - a.age) / (b.age - a.age);
      return { top: mixHex(a.top, b.top, t), bottom: mixHex(a.bottom, b.bottom, t) };
    }
  }
  const last = frames[frames.length - 1]!;
  return { top: last.top, bottom: last.bottom };
}

/** 0 at 18, 1 at 30: drives the sun's arc from left to right. */
export function dayProgress(age: number): number {
  return Math.max(0, Math.min(1, (age - 18) / 12));
}

/** Stars shown for a Mastery value: one per 5 points. */
export function starCount(mastery: number): number {
  return Math.round(mastery / 5);
}

/** Star i's opacity while Mastery animates, so new stars fade in. */
export function starOpacity(mastery: number, i: number): number {
  return Math.max(0, Math.min(1, mastery / 5 - i + 0.5));
}

/** Mist thickens as Energy falls below 40. */
export function mistOpacity(energy: number): number {
  return energy >= 40 ? 0 : ((40 - energy) / 40) * 0.75;
}

/** The horizon glows warmer as Joy rises. */
export function glowOpacity(joy: number): number {
  return 0.1 + (Math.max(0, Math.min(100, joy)) / 100) * 0.55;
}

export interface SkyState extends Meters {
  age: number;
}
