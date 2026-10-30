// Phosphor icons used by life events (Life Sim Spec §11), imported one by one so only these are bundled.
// A new icon name in the content needs one line here; tests/lifeIcons.test.ts checks the content against this list.

import type { Icon } from 'phosphor-react-native';
import { AirplaneIcon } from 'phosphor-react-native/src/icons/Airplane';
import { BatteryLowIcon } from 'phosphor-react-native/src/icons/BatteryLow';
import { BooksIcon } from 'phosphor-react-native/src/icons/Books';
import { BriefcaseIcon } from 'phosphor-react-native/src/icons/Briefcase';
import { ChatCircleIcon } from 'phosphor-react-native/src/icons/ChatCircle';
import { ChatsIcon } from 'phosphor-react-native/src/icons/Chats';
import { ChatsCircleIcon } from 'phosphor-react-native/src/icons/ChatsCircle';
import { CoffeeIcon } from 'phosphor-react-native/src/icons/Coffee';
import { CompassIcon } from 'phosphor-react-native/src/icons/Compass';
import { DoorOpenIcon } from 'phosphor-react-native/src/icons/DoorOpen';
import { EyeIcon } from 'phosphor-react-native/src/icons/Eye';
import { FireIcon } from 'phosphor-react-native/src/icons/Fire';
import { GraduationCapIcon } from 'phosphor-react-native/src/icons/GraduationCap';
import { HandshakeIcon } from 'phosphor-react-native/src/icons/Handshake';
import { HeartIcon } from 'phosphor-react-native/src/icons/Heart';
import { LaptopIcon } from 'phosphor-react-native/src/icons/Laptop';
import { LightningIcon } from 'phosphor-react-native/src/icons/Lightning';
import { MagnifyingGlassIcon } from 'phosphor-react-native/src/icons/MagnifyingGlass';
import { PaletteIcon } from 'phosphor-react-native/src/icons/Palette';
import { PathIcon } from 'phosphor-react-native/src/icons/Path';
import { PlantIcon } from 'phosphor-react-native/src/icons/Plant';
import { RocketIcon } from 'phosphor-react-native/src/icons/Rocket';
import { SparkleIcon } from 'phosphor-react-native/src/icons/Sparkle';
import { SquaresFourIcon } from 'phosphor-react-native/src/icons/SquaresFour';
import { StarIcon } from 'phosphor-react-native/src/icons/Star';
import { StorefrontIcon } from 'phosphor-react-native/src/icons/Storefront';
import { SuitcaseIcon } from 'phosphor-react-native/src/icons/Suitcase';
import { UsersIcon } from 'phosphor-react-native/src/icons/Users';
import { UsersThreeIcon } from 'phosphor-react-native/src/icons/UsersThree';
import { WalletIcon } from 'phosphor-react-native/src/icons/Wallet';
import { WarningIcon } from 'phosphor-react-native/src/icons/Warning';

export const LIFE_ICONS: Record<string, Icon> = {
  'airplane': AirplaneIcon,
  'battery-low': BatteryLowIcon,
  'books': BooksIcon,
  'briefcase': BriefcaseIcon,
  'chat-circle': ChatCircleIcon,
  'chats': ChatsIcon,
  'chats-circle': ChatsCircleIcon,
  'coffee': CoffeeIcon,
  'compass': CompassIcon,
  'door-open': DoorOpenIcon,
  'eye': EyeIcon,
  'fire': FireIcon,
  'graduation-cap': GraduationCapIcon,
  'handshake': HandshakeIcon,
  'heart': HeartIcon,
  'laptop': LaptopIcon,
  'lightning': LightningIcon,
  'magnifying-glass': MagnifyingGlassIcon,
  'palette': PaletteIcon,
  'path': PathIcon,
  'plant': PlantIcon,
  'rocket': RocketIcon,
  'sparkle': SparkleIcon,
  'squares-four': SquaresFourIcon,
  'star': StarIcon,
  'storefront': StorefrontIcon,
  'suitcase': SuitcaseIcon,
  'users': UsersIcon,
  'users-three': UsersThreeIcon,
  'wallet': WalletIcon,
  'warning': WarningIcon,
};

/** Light weight, gold by default; unknown names fall back to a sparkle. */
export function LifeIcon({ name, size = 28, color }: { name: string; size?: number; color: string }) {
  const Glyph = LIFE_ICONS[name] ?? SparkleIcon;
  return <Glyph size={size} color={color} weight="light" />;
}
