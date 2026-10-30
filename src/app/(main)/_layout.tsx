// After onboarding: Home | Character | Explore (Blueprint §12).

import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Text, type ColorValue } from 'react-native';

import { useGame } from '@/state/game';
import { day, fonts, palette } from '@/ui/theme';

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
        sceneStyle: { backgroundColor: day.bg },
        tabBarStyle: { backgroundColor: palette.white, borderTopColor: day.line },
        tabBarActiveTintColor: day.primary,
        tabBarInactiveTintColor: day.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 12 },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon('✦') }} />
      <Tabs.Screen name="character" options={{ title: 'Character', tabBarIcon: icon('☾') }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: icon('✧') }} />
    </Tabs>
  );
}
