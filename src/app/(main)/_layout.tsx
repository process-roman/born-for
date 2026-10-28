// After onboarding: Home | Character | Explore (Blueprint §12).

import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Text, type ColorValue } from 'react-native';

import { useGame } from '@/state/game';
import { C, F } from '@/ui/theme';

const icon = (symbol: string) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Text style={{ fontSize: 18, color }}>{symbol}</Text>;
  };

export default function MainLayout() {
  const { game } = useGame();
  if (!game) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: C.nightDeep },
        tabBarStyle: { backgroundColor: C.night, borderTopColor: C.border },
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.textMuted,
        tabBarLabelStyle: { fontFamily: F.bodyMedium, fontSize: 12 },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon('✦') }} />
      <Tabs.Screen name="character" options={{ title: 'Character', tabBarIcon: icon('☾') }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: icon('✧') }} />
    </Tabs>
  );
}
