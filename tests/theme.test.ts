import { describe, expect, it } from 'vitest';
import { contrastRatio, day, night, palette } from '../src/ui/theme';

const AA = 4.5;
const AA_LARGE = 3;

describe('WCAG AA contrast', () => {
  it('known reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  it.each([
    ['day text on cream', day.text, day.bg],
    ['day muted text on cream', day.textMuted, day.bg],
    ['day text on white cards', day.text, day.surface],
    ['day muted text on white cards', day.textMuted, day.surface],
    ['day muted text on soft cream', day.textMuted, day.surfaceMuted],
    ['button text on plum', day.onPrimary, day.primary],
    ['night text on deep plum', night.text, night.bg],
    ['night muted text on deep plum', night.textMuted, night.bg],
    ['night text on plum cards', night.text, night.surface],
    ['night muted text on plum cards', night.textMuted, night.surface],
  ])('%s is at least 4.5:1', (_, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA);
  });

  it.each([
    ['terracotta headings on cream', day.accent, day.bg],
    ['peach headings on deep plum', night.accent, night.bg],
    ['gold on deep plum', night.gold, night.bg],
  ])('%s (large text only) is at least 3:1', (_, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA_LARGE);
  });

  it('peach on cream is too light for any text, so it is used only as a fill', () => {
    expect(contrastRatio(palette.peach, day.bg)).toBeLessThan(AA_LARGE);
  });
});
