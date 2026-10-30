import { describe, expect, it } from 'vitest';
import { dayProgress, glowOpacity, mistOpacity, mixHex, skyColors, starCount, starOpacity } from '../src/ui/lifeSkyModel';
import { lifeSky } from '../src/ui/theme';

describe('LifeSky drivers', () => {
  it('sky colors hit the keyframes and blend between them', () => {
    for (const k of lifeSky.keyframes) expect(skyColors(k.age)).toEqual({ top: k.top, bottom: k.bottom });
    expect(skyColors(17)).toEqual(skyColors(18));
    expect(skyColors(31)).toEqual(skyColors(30));
    expect(skyColors(20).top).toBe(mixHex(lifeSky.keyframes[0].top, lifeSky.keyframes[1].top, 0.5));
  });

  it('mixHex', () => {
    expect(mixHex('#000000', '#FFFFFF', 0.5)).toBe('#808080');
    expect(mixHex('#102030', '#405060', 0)).toBe('#102030');
    expect(mixHex('#102030', '#405060', 1)).toBe('#405060');
  });

  it('the sun moves left to right from 18 to 30', () => {
    expect(dayProgress(18)).toBe(0);
    expect(dayProgress(24)).toBe(0.5);
    expect(dayProgress(30)).toBe(1);
  });

  it('one star per 5 Mastery, fading in as it grows', () => {
    expect(starCount(0)).toBe(0);
    expect(starCount(76)).toBe(15);
    expect(starOpacity(15, 2)).toBe(1);
    expect(starOpacity(15, 3)).toBe(0.5);
    expect(starOpacity(15, 4)).toBe(0);
  });

  it('mist only below 40 Energy; glow warms with Joy', () => {
    expect(mistOpacity(40)).toBe(0);
    expect(mistOpacity(20)).toBeGreaterThan(mistOpacity(30));
    expect(glowOpacity(90)).toBeGreaterThan(glowOpacity(30));
  });
});
