import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CUE_HAPTICS, CUE_SOUNDS, DEFAULT_FEEL, parseFeel } from '../src/logic/feel';

describe('music, sounds and haptics', () => {
  it('everything is on until the user turns it off', () => {
    expect(parseFeel(null)).toEqual(DEFAULT_FEEL);
    expect(parseFeel('not json')).toEqual(DEFAULT_FEEL);
    expect(parseFeel('{}')).toEqual({ music: true, sounds: true, haptics: true });
    expect(parseFeel(JSON.stringify({ music: false }))).toEqual({ music: false, sounds: true, haptics: true });
  });

  it('a setback is a soft tap, never an error buzz', () => {
    expect(CUE_HAPTICS.setback).toBe('soft');
    expect(CUE_SOUNDS).not.toContain('select'); // choices get a tap, not a sound
  });

  it('every sound and both loops have a file', () => {
    for (const cue of CUE_SOUNDS) expect(fs.existsSync(`assets/audio/sfx-${cue}.wav`), cue).toBe(true);
    for (const track of ['reveal', 'life']) expect(fs.existsSync(`assets/audio/music-${track}.wav`), track).toBe(true);
  });
});
