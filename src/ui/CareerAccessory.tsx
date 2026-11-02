import { useId } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { CAREERS, type CareerId } from '@/content/careers';
import { accessoryArtFor } from './careerAccessoryArt';
import { WorldIcon } from './WorldIcon';

/** A miniature of the career's actual earned item, within the original accessory footprint. */
export function CareerAccessory({ careerId, size }: { careerId: CareerId; size: number }) {
  const id = `metal${useId().replace(/\W/g, '')}`;
  const career = CAREERS[careerId];
  const art = accessoryArtFor(career.item);
  if (!art) return <WorldIcon world={career.worlds[0]!} size={size} />;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop stopColor="#FFF0CF" /><Stop offset=".5" stopColor="#E9C28C" /><Stop offset="1" stopColor="#BF9568" />
        </LinearGradient>
      </Defs>
      <Path d={art.body} fill={`url(#${id})`} stroke="#D7B583" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d={art.detail} fill="none" stroke="#60445D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
