// Sign from birthday, with cusp detection (Blueprint §4.7).
//
// Instead of bundling a table of sign-change dates, the Sun's position is computed directly
// (Meeus, Astronomical Algorithms ch. 25, accurate to ~0.01°, about 15 minutes of time).
// That gives year-accurate boundaries for any year with no table to maintain.
//
// We only know the calendar date, not the birth time or place. A local date covers UTC from
// 14 hours before to 12 hours after that UTC day (time zones run UTC−12 to UTC+14). If the Sun
// changes sign anywhere in that window the birthday is on the cusp, and the user chooses.

import { SIGN_IDS, type SignId } from '../content/signs';

export interface BirthDate {
  year: number;
  /** 1–12. */
  month: number;
  day: number;
}

export type SignFromBirthday =
  | { kind: 'sign'; sign: SignId }
  /** Earlier sign first. */
  | { kind: 'cusp'; signs: [SignId, SignId] };

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
/** Earliest local midnight is UTC+14, latest local end of day is UTC−12. */
const MAX_AHEAD_OF_UTC_MS = 14 * HOUR_MS;
const MAX_BEHIND_UTC_MS = 12 * HOUR_MS;

/** SIGN_IDS starts at Aries, which begins at 0° ecliptic longitude. */
const ZODIAC_ORDER: readonly SignId[] = SIGN_IDS;

const toRad = (deg: number) => (deg * Math.PI) / 180;

function julianDay(utcMs: number): number {
  return utcMs / DAY_MS + 2440587.5;
}

/** The Sun's apparent ecliptic longitude in degrees, 0 ≤ λ < 360. */
export function sunLongitude(utcMs: number): number {
  const t = (julianDay(utcMs) - 2451545.0) / 36525;
  const l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const m = toRad(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(m) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * m) +
    0.000289 * Math.sin(3 * m);
  const omega = toRad(125.04 - 1934.136 * t);
  const apparent = l0 + c - 0.00569 - 0.00478 * Math.sin(omega);
  return ((apparent % 360) + 360) % 360;
}

export function signAt(utcMs: number): SignId {
  return ZODIAC_ORDER[Math.floor(sunLongitude(utcMs) / 30)]!;
}

export function isValidBirthDate({ year, month, day }: BirthDate): boolean {
  if (![year, month, day].every(Number.isInteger)) return false;
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

/** Derive the sign from a birth date. The caller stores the sign, not the date. */
export function signFromBirthday(date: BirthDate): SignFromBirthday {
  if (!isValidBirthDate(date)) throw new RangeError(`Invalid date ${date.year}-${date.month}-${date.day}`);
  const dayStart = Date.UTC(date.year, date.month - 1, date.day);
  const first = signAt(dayStart - MAX_AHEAD_OF_UTC_MS);
  const last = signAt(dayStart + DAY_MS + MAX_BEHIND_UTC_MS);
  // The window is about two days and the Sun spends ~30 days per sign, so it crosses at most one boundary.
  return first === last ? { kind: 'sign', sign: first } : { kind: 'cusp', signs: [first, last] };
}
