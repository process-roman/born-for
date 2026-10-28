// Q1: Welcome + intent.

import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { INTENTS } from '@/content/preferences';
import { useOnboarding } from '@/state/onboarding';
import { Body, Label, OptionCard, Screen, Title } from '@/ui/components';
import { C, F, S } from '@/ui/theme';

export default function Welcome() {
  const { state, dispatch } = useOnboarding();
  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: S.md, marginTop: S.xxl, marginBottom: S.lg }}>
        <Text style={{ fontFamily: F.displayRegular, fontSize: 14, letterSpacing: 6, color: C.gold }}>BORN FOR</Text>
        <Title style={{ fontSize: 30, lineHeight: 38 }}>Your sign is just the beginning.</Title>
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
