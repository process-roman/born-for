import { View } from 'react-native';
import { LockIcon } from 'phosphor-react-native/src/icons/Lock';
import { MedalIcon } from 'phosphor-react-native/src/icons/Medal';
import { ArrowClockwiseIcon } from 'phosphor-react-native/src/icons/ArrowClockwise';
import { GlobeHemisphereWestIcon } from 'phosphor-react-native/src/icons/GlobeHemisphereWest';
import { EyeIcon } from 'phosphor-react-native/src/icons/Eye';
import { TagIcon } from 'phosphor-react-native/src/icons/Tag';
import { CheckCircleIcon } from 'phosphor-react-native/src/icons/CheckCircle';
import { LockOpenIcon } from 'phosphor-react-native/src/icons/LockOpen';
import { SparkleIcon } from 'phosphor-react-native/src/icons/Sparkle';
import { CompassIcon } from 'phosphor-react-native/src/icons/Compass';
import type { Icon } from 'phosphor-react-native';
import type { BadgeId } from '@/content/badges';
import { day } from './theme';

const MARKS: Record<BadgeId, Icon> = {
  first_star: SparkleIcon, reflective: EyeIcon, first_title: TagIcon, first_constellation: MedalIcon,
  three_paths: CompassIcon, world_traveller: GlobeHemisphereWestIcon, level_3: SparkleIcon,
  hidden_talent: LockOpenIcon, proven: CheckCircleIcon, recalibrated: ArrowClockwiseIcon,
};

export function BadgeMark({ id, locked = false, size = 26, color = day.primary }: { id: BadgeId; locked?: boolean; size?: number; color?: string }) {
  const Glyph = locked ? LockIcon : MARKS[id];
  return <View accessible={false} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: day.goldSoft, alignItems: 'center', justifyContent: 'center' }}><Glyph size={size * .72} color={color} weight="light" /></View>;
}
