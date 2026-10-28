// "Celestial RPG" design tokens (Signs & Onboarding Spec §6).

import type { Band } from './attributes';
import type { Element } from './signs';

export const COLORS = {
  nightDeep: '#0E1030',
  night: '#1A1C4A',
  gold: '#E8C26A',
  text: '#F4F1EA',
} as const;

export const ELEMENT_COLORS: Record<Element, string> = {
  fire: '#F2784B',
  earth: '#7DB46C',
  air: '#7EC8E3',
  water: '#3FA7A0',
};

/** Stat bar color per band: Untrained grey → Developing lavender → Solid element color → Strong gold. */
export type BandColor = 'grey' | 'lavender' | 'element' | 'gold';

export const BAND_COLORS: Record<Band, BandColor> = {
  Untrained: 'grey',
  Developing: 'lavender',
  Solid: 'element',
  Strong: 'gold',
};

export const FONTS = {
  /** Serif for the magic: archetype names, titles. */
  display: 'Cinzel',
  /** Sans for the facts: UI and body. */
  body: 'DM Sans',
} as const;
