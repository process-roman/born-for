import Svg, { Path } from 'react-native-svg';
import type { SignId } from '@/content/signs';

/** One consistent engraved stroke for all twelve signs, independent of system fonts. */
const MARKS: Record<SignId, string> = {
  aries: 'M32 51V24C32 6 9 8 12 23C13 29 18 31 21 29M32 24C32 6 55 8 52 23C51 29 46 31 43 29',
  taurus: 'M16 10C16 30 48 30 48 10M46 37A14 14 0 1 1 18 37A14 14 0 1 1 46 37',
  gemini: 'M17 12Q32 18 47 12M17 52Q32 46 47 52M23 15V49M41 15V49',
  cancer: 'M51 20C37 8 15 13 13 27C11 40 28 39 28 29C28 19 16 20 14 26M13 44C27 56 49 51 51 37C53 24 36 25 36 35C36 45 48 44 50 38',
  leo: 'M24 39A9 9 0 1 1 6 39A9 9 0 1 1 24 39M23 35C17 22 20 10 31 10C48 10 46 28 37 40C28 53 47 59 53 43',
  virgo: 'M10 23V49M10 30C10 16 23 16 23 29V49M23 30C23 16 36 16 36 29V43M36 30C36 16 49 17 48 31C47 44 37 50 31 54M36 42C40 51 48 52 54 47',
  libra: 'M10 49H54M10 39H25C9 22 26 10 32 13C46 13 50 29 39 39H54',
  scorpio: 'M9 22V48M9 29C9 15 22 15 22 28V48M22 29C22 15 35 15 35 28V42C35 52 47 52 53 42M45 42H53V50',
  sagittarius: 'M14 50L51 13M30 13H51V34M15 28L36 49',
  capricorn: 'M8 21L17 44L28 17C35 11 36 23 36 32V43C36 60 57 53 54 41C52 30 37 31 35 45',
  aquarius: 'M8 26L18 18L28 26L38 18L48 26L57 18M8 46L18 38L28 46L38 38L48 46L57 38',
  pisces: 'M16 11C34 24 34 40 16 53M48 11C30 24 30 40 48 53M10 32H54',
};

export function ZodiacMark({ sign, size, color }: { sign: SignId; size: number; color: string }) {
  return <Svg width={size} height={size} viewBox="0 0 64 64" aria-hidden><Path d={MARKS[sign]} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>;
}
