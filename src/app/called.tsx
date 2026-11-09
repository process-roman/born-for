// "Your sign called X of 8" + share card (Spec §4 Result screen).

import { Redirect, router } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { SIGNS } from '@/content/signs';
import { backgroundTraits, signCalled, signatureTraits, topAttributes } from '@/logic/poll';
import { useMusic } from '@/state/feel';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Card, Label, Screen, Step, Title } from '@/ui/components';
import { StatList, TickLegend } from '@/ui/stats';
import { C, F, glyph, S } from '@/ui/theme';

export default function Called() {
  const { state, confirmed } = useOnboarding();
  useMusic('reveal');
  if (!state.sign || !confirmed) return <Redirect href="/" />;
  const sign = SIGNS[state.sign];
  const result = signCalled(state.sign, confirmed);
  const notes = Object.fromEntries(result.unique.map((a) => [a, 'Tuned by you']));
  const added = backgroundTraits(state.sign).filter((a) => state.answers[a] === 'yes');

  const share = async () => {
    try {
      await Share.share({
        message: `My Born For character: ${sign.archetype} (${sign.name}). Exploring career lives before choosing my path. #BornFor`,
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
          Your character is ready.
        </Title>
        <Body muted>
          {result.count === result.total
            ? `You kept all ${result.total} starting stats from ${sign.archetype}.`
            : `You kept ${result.count} of ${result.total} starting stats from ${sign.archetype} and tuned the rest.`}
        </Body>
      </View>
      <Card>
        <Label>Your character’s stats</Label>
        <StatList
          stats={confirmed}
          ghost={sign.stats}
          element={sign.element}
          attributes={signatureTraits(state.sign)}
          highlights={topAttributes(state.sign)}
          notes={notes}
        />
        <TickLegend>Tick: the starting value from your birthday</TickLegend>
      </Card>
      {added.length > 0 ? (
        <Card>
          <Label>Added by you</Label>
          <StatList stats={confirmed} ghost={sign.stats} element={sign.element} attributes={added} />
          <Text style={styles.legendText}>Traits you added to your character on top of its starting stats.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  glyph: { fontSize: 36, color: C.gold },
  legendText: { fontFamily: F.body, fontSize: 12, color: C.textMuted },
});
