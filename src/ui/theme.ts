import type { Band } from '@/content/attributes';
import type { Element } from '@/content/signs';
import { COLORS, ELEMENT_COLORS } from '@/content/theme';

export const C = {
  ...COLORS,
  textMuted: '#A9A6C9',
  lavender: '#B39DDB',
  grey: '#6E6B8F',
  card: '#22255A',
  cardRaised: '#2B2E6B',
  border: 'rgba(244, 241, 234, 0.12)',
  goldBorder: 'rgba(232, 194, 106, 0.45)',
  goldSoft: 'rgba(232, 194, 106, 0.14)',
  track: 'rgba(244, 241, 234, 0.08)',
} as const;

/** Font keys registered with useFonts in the root layout. Serif for the magic, sans for the facts. */
export const F = {
  display: 'Cinzel_700Bold',
  displayRegular: 'Cinzel_400Regular',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

export const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const MAX_WIDTH = 480;

export function bandColor(band: Band, element: Element): string {
  switch (band) {
    case 'Strong':
      return C.gold;
    case 'Solid':
      return ELEMENT_COLORS[element];
    case 'Developing':
      return C.lavender;
    case 'Untrained':
      return C.grey;
  }
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
