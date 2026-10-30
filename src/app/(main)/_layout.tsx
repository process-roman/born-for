// After onboarding: Home | Character | Explore (Blueprint §12).

import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Text, type ColorValue } from 'react-native';

import { useGame } from '@/state/game';
import { C, day, F, fonts, palette } from '@/ui/theme';

/** Restyled screens get the cream tab bar; the rest keep the dark one until they're restyled. */
const DAY_TABS = new Set(['home']);

const icon = (symbol: string) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Text style={{ fontSize: 18, color }}>{symbol}</Text>;
  };

export default function MainLayout() {
  const { game } = useGame();
  if (!game) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={({ route }) =>
        DAY_TABS.has(route.name)
          ? {
              headerShown: false,
              sceneStyle: { backgroundColor: day.bg },
              tabBarStyle: { backgroundColor: palette.white, borderTopColor: day.line },
              tabBarActiveTintColor: day.primary,
              tabBarInactiveTintColor: day.textMuted,
              tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 12 },
            }
          : {
              headerShown: false,
              sceneStyle: { backgroundColor: C.nightDeep },
              tabBarStyle: { backgroundColor: C.night, borderTopColor: C.border },
              tabBarActiveTintColor: C.gold,
              tabBarInactiveTintColor: C.textMuted,
              tabBarLabelStyle: { fontFamily: F.bodyMedium, fontSize: 12 },
            }
      }
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon('✦') }} />
      <Tabs.Screen name="character" options={{ title: 'Character', tabBarIcon: icon('☾') }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: icon('✧') }} />
    </Tabs>
  );
}
