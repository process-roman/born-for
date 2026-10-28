// "Your sign called X of 8" + share card (Spec §4 Result screen).

import { Redirect, router } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { SIGNS } from '@/content/signs';
import { signCalled, topAttributes } from '@/logic/poll';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Card, Label, Screen, Step, Title } from '@/ui/components';
import { StatList } from '@/ui/stats';
import { C, F, glyph, S } from '@/ui/theme';

export default function Called() {
  const { state, confirmed } = useOnboarding();
  if (!state.sign || !confirmed) return <Redirect href="/" />;
  const sign = SIGNS[state.sign];
  const result = signCalled(state.sign, confirmed);
  const notes = Object.fromEntries(result.unique.map((a) => [a, 'Unique to you']));

  const share = async () => {
    try {
      await Share.share({
        message: `I'm ${sign.name}, ${sign.archetype}. My sign called ${result.count} of ${result.total} of my stats. #BornFor`,
      });
    } catch {
      // Sharing isn't available everywhere (e.g. some desktop browsers); nothing to do.
    }
  };

  return (
    <Screen
      footer={
        <>
          <Button title="Continue" onPress={() => router.push('/enjoy')} />
          <Button title="Share my character" variant="secondary" onPress={share} />
        </>
      }
    >
      <Step index={4} total={8} />
      <View style={{ alignItems: 'center', gap: S.xs }}>
        <Text style={styles.glyph}>{glyph(state.sign)}</Text>
        <Title>
          Your sign called {result.count} of {result.total}.
        </Title>
        <Body muted>
          {result.count === result.total
            ? `You’re ${sign.archetype} through and through.`
            : result.count >= 5
              ? `Mostly ${sign.archetype}, with a few twists of your own.`
              : 'Your sign set the stage, but you’ve written your own character.'}
        </Body>
      </View>
      <Card>
        <Label>Your confirmed stats</Label>
        <StatList stats={confirmed} ghost={sign.stats} element={sign.element} highlights={topAttributes(state.sign)} notes={notes} />
        <View style={styles.legend}>
          <View style={styles.legendGhost} />
          <Text style={styles.legendText}>Dashed outline: what your sign predicted</Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  glyph: { fontSize: 36, color: C.gold },
  legend: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  legendGhost: { width: 22, height: 10, borderRadius: 3, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(244, 241, 234, 0.55)' },
  legendText: { fontFamily: F.body, fontSize: 12, color: C.textMuted },
});
