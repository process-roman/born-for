// Q1: Welcome + intent, under the arch window.

import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { INTENTS } from '@/content/preferences';
import { useGame } from '@/state/game';
import { useOnboarding } from '@/state/onboarding';
import { Body, Label, OptionCard, Screen, Title } from '@/ui/components';
import { ArchWindow } from '@/ui/kit';
import { day, fonts, S, type } from '@/ui/theme';

export default function Welcome() {
  const { state, dispatch } = useOnboarding();
  const { game } = useGame();
  if (game) return <Redirect href="/home" />;
  return (
    <Screen>
      <View style={styles.hero}>
        <ArchWindow width={150} height={200} />
        <Text style={styles.brand}>BORN FOR</Text>
        <Title style={type.hero}>
          Your sign is just the <Text style={styles.accent}>beginning.</Text>
        </Title>
        <Body muted>Meet your character, confirm your strengths and find paths you can grow into.</Body>
      </View>
      <Label style={{ textAlign: 'center' }}>What brings you here?</Label>
      <View style={{ gap: S.sm }}>
        {INTENTS.map((o) => (
          <OptionCard
            key={o.id}
            emoji={o.emoji}
            label={o.label}
            selected={state.intent === o.id}
            onPress={() => {
              dispatch({ type: 'intent', intent: o.id });
              router.push('/birthday');
            }}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: S.md, marginTop: S.lg, marginBottom: S.md },
  brand: { ...type.label, fontSize: 12, letterSpacing: 6, color: day.primary, marginTop: S.sm },
  accent: { fontFamily: fonts.serifItalic, color: day.accent },
});
