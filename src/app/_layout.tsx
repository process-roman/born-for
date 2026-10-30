import { Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { CormorantGaramond_500Medium, CormorantGaramond_500Medium_Italic, CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';

import { GameProvider, useGame } from '@/state/game';
import { OnboardingProvider } from '@/state/onboarding';
import { configureNotifications, useCheckInTap } from '@/storage/notifications';
import { C } from '@/ui/theme';

SplashScreen.preventAutoHideAsync();
configureNotifications();

/** A tapped check-in reminder opens the reflection for the active quest (Blueprint §4.3). */
function CheckInTapHandler() {
  const { game } = useGame();
  const hasActiveQuest = Boolean(game?.activeQuest);
  const open = useCallback(() => router.push(hasActiveQuest ? '/quest/reflect' : '/home'), [hasActiveQuest]);
  useCheckInTap(open);
  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
    CormorantGaramond_500Medium,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GameProvider>
      <OnboardingProvider>
        <CheckInTapHandler />
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.nightDeep }, animation: 'fade' }} />
      </OnboardingProvider>
    </GameProvider>
  );
}
