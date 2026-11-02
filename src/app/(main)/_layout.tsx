// After onboarding: Home | Character | Explore (Blueprint §12).

import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { View, type ColorValue } from 'react-native';
import { HouseIcon } from 'phosphor-react-native/src/icons/House';
import { UserCircleIcon } from 'phosphor-react-native/src/icons/UserCircle';
import { CompassIcon } from 'phosphor-react-native/src/icons/Compass';
import type { Icon } from 'phosphor-react-native';

import { useGame } from '@/state/game';
import { day, fonts, palette } from '@/ui/theme';

const icon = (Glyph: Icon) =>
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    const iconColor = typeof color === 'string' ? color : day.primary;
    return (
      <View accessible={false} style={{ width: 24, height: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Glyph color={iconColor} size={20} weight={focused ? 'duotone' : 'light'} />
      </View>
    );
  };

export default function MainLayout() {
  const { game } = useGame();
  if (!game) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: day.bg },
        tabBarStyle: { backgroundColor: palette.white, borderTopColor: day.line },
        tabBarActiveTintColor: day.primary,
        tabBarInactiveTintColor: day.textMuted,
        tabBarItemStyle: { paddingVertical: 3 },
        tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 12, lineHeight: 14, flexShrink: 0, transform: [{ translateY: -3 }] },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon(HouseIcon) }} />
      <Tabs.Screen name="character" options={{ title: 'Character', tabBarIcon: icon(UserCircleIcon) }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: icon(CompassIcon) }} />
    </Tabs>
  );
}
