import { View } from 'react-native';
import { DressIcon } from 'phosphor-react-native/src/icons/Dress';
import { GameControllerIcon } from 'phosphor-react-native/src/icons/GameController';
import { MusicNotesIcon } from 'phosphor-react-native/src/icons/MusicNotes';
import { PenNibIcon } from 'phosphor-react-native/src/icons/PenNib';
import { AtomIcon } from 'phosphor-react-native/src/icons/Atom';
import { BarbellIcon } from 'phosphor-react-native/src/icons/Barbell';
import { CookingPotIcon } from 'phosphor-react-native/src/icons/CookingPot';
import { DeviceMobileIcon } from 'phosphor-react-native/src/icons/DeviceMobile';
import type { Icon } from 'phosphor-react-native';
import type { WorldId } from '@/content/worlds';
import { LifeIcon } from './lifeIcons';
import { day } from './theme';

const ICONS: Record<WorldId, string> = {
  business: 'briefcase', fashion: 'sparkle', creators: 'chats', gaming: 'rocket', art: 'palette', music: 'star',
  writing: 'books', tech: 'laptop', sport: 'lightning', health: 'heart', people: 'users', nature: 'plant',
  food: 'coffee', build: 'squares-four', travel: 'compass', science: 'magnifying-glass', public: 'handshake',
};

const WORLD_GLYPHS: Partial<Record<WorldId, Icon>> = {
  fashion: DressIcon, gaming: GameControllerIcon, music: MusicNotesIcon, writing: PenNibIcon,
  science: AtomIcon, sport: BarbellIcon, food: CookingPotIcon, creators: DeviceMobileIcon,
};

/** Matches the existing emoji footprint; content, grid size and hit targets stay unchanged. */
export function WorldIcon({ world, size = 28, color = day.primary }: { world: WorldId; size?: number; color?: string }) {
  const Glyph = WORLD_GLYPHS[world];
  const tint = ['fashion', 'health', 'food', 'art'].includes(world) ? day.accentSoft : ['business', 'travel', 'science', 'sport'].includes(world) ? day.goldSoft : day.lavenderSoft;
  return <View accessible={false} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: tint, alignItems: 'center', justifyContent: 'center' }}>{Glyph ? <Glyph size={size * .74} color={color} weight="light" /> : <LifeIcon name={ICONS[world]} size={size * .74} color={color} />}</View>;
}
