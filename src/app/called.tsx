// "Your sign called X of 8" + share card (Spec §4 Result screen).

import { Redirect, router } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { SIGNS } from '@/content/signs';
import { backgroundTraits, signCalled, signatureTraits, topAttributes } from '@/logic/poll';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Card, Label, Screen, Step, Title } from '@/ui/components';
import { StatList, TickLegend } from '@/ui/stats';
import { C, F, glyph, S } from '@/ui/theme';

export default function Called() {
  const { state, confirmed } = useOnboarding();
  if (!state.sign || !confirmed) return <Redirect href="/" />;
  const sign = SIGNS[state.sign];
  const result = signCalled(state.sign, confirmed);
  const notes = Object.fromEntries(result.unique.map((a) => [a, 'Unique to you']));
  const added = backgroundTraits(state.sign).filter((a) => state.answers[a] === 'yes');

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
          <Button title="Continue" onPress={() => router.push('/worlds')} />
          <Button title="Share my character" variant="secondary" onPress={share} />
        </>
      }
    >
      <Step index={4} total={9} />
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
        <StatList
          stats={confirmed}
          ghost={sign.stats}
          element={sign.element}
          attributes={signatureTraits(state.sign)}
          highlights={topAttributes(state.sign)}
          notes={notes}
        />
        <TickLegend>Tick: what your sign predicted</TickLegend>
      </Card>
      {added.length > 0 ? (
        <Card>
          <Label>Also you</Label>
          <StatList stats={confirmed} ghost={sign.stats} element={sign.element} attributes={added} />
          <Text style={styles.legendText}>Background traits you added. Your sign didn’t predict them, but you know yourself.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  glyph: { fontSize: 36, color: C.gold },
  legendText: { fontFamily: F.body, fontSize: 12, color: C.textMuted },
});
