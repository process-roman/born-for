import { Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { GameProvider } from '@/state/game';
import { OnboardingProvider } from '@/state/onboarding';
import { configureNotifications } from '@/storage/notifications';
import { C } from '@/ui/theme';

SplashScreen.preventAutoHideAsync();
configureNotifications();

export default function RootLayout() {
  const [loaded, error] = useFonts({ Cinzel_400Regular, Cinzel_700Bold, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GameProvider>
      <OnboardingProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.nightDeep }, animation: 'fade' }} />
      </OnboardingProvider>
    </GameProvider>
  );
}
