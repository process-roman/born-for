// Q2: What do you enjoy most? (pick up to 3)

import { Redirect, router } from 'expo-router';
import { View } from 'react-native';

import { MAX_PREFERENCES, PREFERENCES } from '@/content/preferences';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, OptionCard, Screen, Step, Title } from '@/ui/components';
import { S } from '@/ui/theme';

export default function Enjoy() {
  const { state, dispatch } = useOnboarding();
  if (!state.sign) return <Redirect href="/" />;
  const full = state.enjoy.length >= MAX_PREFERENCES;

  return (
    <Screen footer={<Button title="Continue" disabled={state.enjoy.length === 0} onPress={() => router.push('/work')} />}>
      <Step index={5} total={8} />
      <Title>What do you enjoy most?</Title>
      <Body muted>
        Pick up to {MAX_PREFERENCES}. This matters more than your stats when we match paths. ({state.enjoy.length}/{MAX_PREFERENCES})
      </Body>
      <View style={{ gap: S.sm }}>
        {PREFERENCES.map((o) => {
          const selected = state.enjoy.includes(o.id);
          return (
            <OptionCard
              key={o.id}
              emoji={o.emoji}
              label={o.label}
              selected={selected}
              onPress={() => dispatch({ type: 'toggleEnjoy', preference: o.id })}
              style={!selected && full ? { opacity: 0.45 } : undefined}
            />
          );
        })}
      </View>
    </Screen>
  );
}
