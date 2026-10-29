// Q3: How do you like to work?

import { Redirect, router } from 'expo-router';
import { View } from 'react-native';

import { WORK_STYLES } from '@/content/preferences';
import { useOnboarding } from '@/state/onboarding';
import { Body, OptionCard, Screen, Step, Title } from '@/ui/components';
import { S } from '@/ui/theme';

export default function Work() {
  const { state, dispatch } = useOnboarding();
  if (!state.sign || state.worlds.length === 0) return <Redirect href="/" />;

  return (
    <Screen>
      <Step index={7} total={9} />
      <Title>How do you like to work?</Title>
      <Body muted>There’s no wrong answer, and “Not sure yet” won’t count against any path.</Body>
      <View style={{ gap: S.sm }}>
        {WORK_STYLES.map((o) => (
          <OptionCard
            key={o.id}
            emoji={o.emoji}
            label={o.label}
            selected={state.workStyle === o.id}
            onPress={() => {
              dispatch({ type: 'workStyle', workStyle: o.id });
              router.push('/paywall');
            }}
          />
        ))}
      </View>
    </Screen>
  );
}
