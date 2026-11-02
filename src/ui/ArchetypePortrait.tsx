import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

import type { SignId } from '@/content/signs';
import { ZodiacMark } from './ZodiacMark';
import { night } from './theme';

const PORTRAITS = require('../../assets/avatars/archetypes.webp');

/** Explicit positions keep the artwork independent of the order of the sign picker. */
const CELLS: Record<SignId, readonly [number, number]> = {
  aries: [0, 0], taurus: [1, 0], gemini: [2, 0], cancer: [3, 0],
  leo: [0, 1], virgo: [1, 1], libra: [2, 1], scorpio: [3, 1],
  sagittarius: [0, 2], capricorn: [1, 2], aquarius: [2, 2], pisces: [3, 2],
};

/** Decorative portrait inside the existing accessible avatar and its medallion. */
export function ArchetypePortrait({ sign, size }: { sign: SignId; size: number }) {
  const [failed, setFailed] = useState(false);
  // The zodiac mark fills the medallion until the portrait has loaded, so it never shows empty.
  const [loaded, setLoaded] = useState(false);
  const [column, row] = CELLS[sign];
  return (
    <View pointerEvents="none" accessible={false} style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
      {failed || !loaded ? <ZodiacMark sign={sign} size={size * .7} color={night.gold} /> : null}
      {failed ? null : (
        <Image
          source={PORTRAITS}
          contentFit="fill"
          accessible={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{ position: 'absolute', width: size * 4, height: size * 3, left: -column * size, top: -row * size }}
        />
      )}
    </View>
  );
}
