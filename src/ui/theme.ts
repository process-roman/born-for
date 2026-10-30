// The design system in one place: colors, fonts, type scale, spacing, radii and shadows.
//
// Day/night rule: everyday screens (home, careers, journal) use the cream `day` palette. Magic
// moments (sign reveal, level up, star lighting up, path complete) are full-screen `night` scenes.
// Accessibility: every text color below meets WCAG AA (4.5:1) on its own background, except the
// ones marked "large text only" (3:1 for 24px+ or 19px+ bold). tests/theme.test.ts checks this.

import type { Band } from '@/content/attributes';
import type { Element } from '@/content/signs';

// ---------------------------------------------------------------------------------------------
// Raw palette. Tweak colors here; everything else refers to these.

export const palette = {
  cream: '#F8F4EF',
  creamDeep: '#F1EAE2',
  white: '#FFFFFF',
  plum: '#3B2A4E',
  plumDeep: '#2A1E3A',
  plumMid: '#5B4573',
  plumSoft: '#EDE7F2',
  ink: '#2E2240',
  inkMuted: '#665A74',
  peach: '#E9A889',
  peachSoft: '#F7E4D9',
  terracotta: '#B86E4E',
  gold: '#C9A15E',
  goldBright: '#E6C27E',
  goldSoft: '#F4EBDB',
  line: '#E6DDD3',
  starlight: '#F8F1E7',
  lilac: '#CFC2DD',
} as const;

/** Cream "daytime" screens. */
export const day = {
  bg: palette.cream,
  surface: palette.white,
  surfaceMuted: palette.creamDeep,
  text: palette.ink,
  textMuted: palette.inkMuted,
  primary: palette.plum,
  onPrimary: palette.starlight,
  /** Large text and accents only. */
  accent: palette.terracotta,
  accentSoft: palette.peachSoft,
  lavenderSoft: palette.plumSoft,
  goldSoft: palette.goldSoft,
  gold: palette.gold,
  line: palette.line,
  track: palette.plumSoft,
  fill: palette.peach,
} as const;

/** Deep plum "night" scenes and plum cards. */
export const night = {
  bg: palette.plumDeep,
  surface: palette.plum,
  text: palette.starlight,
  textMuted: palette.lilac,
  /** Large text and accents only. */
  accent: palette.peach,
  gold: palette.goldBright,
  line: 'rgba(230, 194, 126, 0.45)',
  track: 'rgba(248, 241, 231, 0.16)',
  fill: palette.peach,
} as const;

/** The glow around the character's core once it reaches the element-glow level. */
export const elementGlow: Record<Element, string> = {
  fire: '#F2784B',
  earth: '#7DB46C',
  air: '#7EC8E3',
  water: '#3FA7A0',
};

/**
 * The life sim's living sky (Life Sim Spec §11): sky colors by age, top to bottom. Colors between
 * keyframes are interpolated.
 */
export const lifeSky = {
  keyframes: [
    { age: 18, top: '#B8A6D9', bottom: '#F6C9B0' }, // dawn: lavender → soft peach
    { age: 22, top: '#AEBDE4', bottom: '#E8E1F2' }, // morning: pale blue-lavender
    { age: 25, top: '#A9D0EC', bottom: '#F8F1E7' }, // midday: soft light blue → cream
    { age: 28, top: '#F0B08E', bottom: '#F2D38E' }, // golden hour: peach → warm gold
    { age: 30, top: '#3B2A4E', bottom: '#E9A889' }, // dusk: deep plum → peach glow
  ],
  sun: '#FFF6E6',
  star: '#E6C27E',
  farMountains: '#8C76A6',
  nearMountains: '#3B2A4E',
  path: '#F8F1E7',
  mist: '#FFFFFF',
  glow: '#F0A57E',
  outline: '#C9A15E',
} as const;

/** One shape for both, so components can switch with the screen's tone. */
export interface ToneColors {
  bg: string;
  surface: string;
  /** Selected options, soft fills. */
  surfaceSoft: string;
  text: string;
  textMuted: string;
  /** Primary button background. */
  primary: string;
  onPrimary: string;
  /** Large text and accents only. */
  accent: string;
  /** Icons, stars, checks and small highlights. */
  highlight: string;
  line: string;
  selectedBorder: string;
  track: string;
  fill: string;
}

export const tones: Record<'day' | 'night', ToneColors> = {
  day: {
    bg: day.bg,
    surface: day.surface,
    surfaceSoft: day.lavenderSoft,
    text: day.text,
    textMuted: day.textMuted,
    primary: day.primary,
    onPrimary: day.onPrimary,
    accent: day.accent,
    highlight: day.primary,
    line: day.line,
    selectedBorder: day.primary,
    track: day.track,
    fill: day.fill,
  },
  night: {
    bg: night.bg,
    surface: night.surface,
    surfaceSoft: 'rgba(230, 194, 126, 0.14)',
    text: night.text,
    textMuted: night.textMuted,
    primary: palette.peach,
    onPrimary: palette.plumDeep,
    accent: night.accent,
    highlight: night.gold,
    line: night.line,
    selectedBorder: night.gold,
    track: night.track,
    fill: night.fill,
  },
};

export type Tone = keyof typeof tones;

/** Arch window placeholders until the illustrations exist: dusk sky, top to bottom. */
export const archGradient = ['#3B2A4E', '#6E5788', '#B89AB8', '#F0C7A8'] as const;

// ---------------------------------------------------------------------------------------------
// Fonts and type. Serif for headings, archetype names and titles; sans for body and career details;
// small tracked caps for labels. Keys must match the fonts loaded in src/app/_layout.tsx.

export const fonts = {
  serif: 'CormorantGaramond_600SemiBold',
  serifMedium: 'CormorantGaramond_500Medium',
  serifItalic: 'CormorantGaramond_500Medium_Italic',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansBold: 'DMSans_700Bold',
} as const;

export const type = {
  hero: { fontFamily: fonts.serifMedium, fontSize: 40, lineHeight: 44 },
  heroItalic: { fontFamily: fonts.serifItalic, fontSize: 40, lineHeight: 44 },
  h1: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 36 },
  h2: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 28 },
  h3: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 24 },
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fonts.sansMedium, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.sansMedium, fontSize: 11, lineHeight: 16, letterSpacing: 2.4, textTransform: 'uppercase' as const },
  button: { fontFamily: fonts.sansMedium, fontSize: 13, lineHeight: 18, letterSpacing: 2.6, textTransform: 'uppercase' as const },
} as const;

// ---------------------------------------------------------------------------------------------
// Spacing, radii and shadows.

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;

export const shadow = {
  soft: { shadowColor: palette.plum, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  lifted: { shadowColor: palette.plum, shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 6 },
} as const;

export const MAX_WIDTH = 480;

// ---------------------------------------------------------------------------------------------
// WCAG contrast, used by tests to keep the palette accessible.

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------------------------
// Short names used across screen stylesheets. They map to the cream daytime palette, since most
// screens are daytime; night scenes (reveal, rewards) use `night` / `tones.night` directly.

export const C = {
  text: day.text,
  textMuted: day.textMuted,
  /** Small accents on cream: plum, so it stays readable. */
  gold: day.primary,
  night: day.surface,
  nightDeep: day.bg,
  border: day.line,
  goldBorder: 'rgba(59, 42, 78, 0.28)',
  goldSoft: day.lavenderSoft,
  track: day.track,
  lavender: palette.plumMid,
  grey: day.textMuted,
} as const;

export const F = {
  display: fonts.serif,
  displayRegular: fonts.serifMedium,
  body: fonts.sans,
  bodyMedium: fonts.sansMedium,
  bodyBold: fonts.sansBold,
} as const;

export const S = { xs: space.xs, sm: space.sm, md: space.md, lg: space.lg, xl: space.xl, xxl: space.xxl } as const;

/** Stat bar fill: peach for every band; the band itself is shown as a small-caps label. */
export function bandColor(_band: Band, _element: Element): string {
  return palette.peach;
}

export const SIGN_GLYPHS = {
  aries: '♈',
  taurus: '♉',
  gemini: '♊',
  cancer: '♋',
  leo: '♌',
  virgo: '♍',
  libra: '♎',
  scorpio: '♏',
  sagittarius: '♐',
  capricorn: '♑',
  aquarius: '♒',
  pisces: '♓',
} as const;

/** Text presentation selector so glyphs render as symbols, not emoji, where supported. */
export const glyph = (sign: keyof typeof SIGN_GLYPHS) => `${SIGN_GLYPHS[sign]}︎`;
