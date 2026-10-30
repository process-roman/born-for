// Character reveal, a night scene: stars connect into the sign's constellation, then the card flips (Spec §6 Motion).

import { Redirect, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_LABELS } from '@/content/attributes';
import { SIGNS } from '@/content/signs';
import { ZODIAC_CONSTELLATIONS } from '@/content/zodiacConstellations';
import { signatureTraits, topAttributes } from '@/logic/poll';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Card, Label, Pill, Screen, Step, Title } from '@/ui/components';
import { Constellation } from '@/ui/Constellation';
import { StatList } from '@/ui/stats';
import { fonts, glyph, night, S, type } from '@/ui/theme';

export default function Reveal() {
  const { state } = useOnboarding();
  const [phase, setPhase] = useState<'stars' | 'card'>('stars');
  const [flip] = useState(() => new Animated.Value(0));
  const showCard = useCallback(() => setPhase('card'), []);

  useEffect(() => {
    if (phase === 'card') {
      Animated.timing(flip, { toValue: 1, duration: 650, useNativeDriver: Platform.OS !== 'web' }).start();
    }
  }, [phase, flip]);

  if (!state.sign) return <Redirect href="/" />;
  const sign = SIGNS[state.sign];

  if (phase === 'stars') {
    return (
      <Screen scroll={false} tone="night">
        <Pressable accessibilityLabel="Skip animation" onPress={showCard} style={styles.stars}>
          <Constellation shape={ZODIAC_CONSTELLATIONS[state.sign]} size={280} onDone={showCard} />
          <Text style={styles.starsCaption}>{sign.name.toUpperCase()}</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen tone="night" footer={<Button title="Confirm my stats" onPress={() => router.push('/poll')} />}>
      <Step index={2} total={9} />
      <Animated.View
        style={{
          opacity: flip,
          transform: [{ perspective: 1000 }, { rotateY: flip.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }],
        }}
      >
        <Card style={styles.characterCard}>
          <View style={styles.cardTop}>
            <Text style={styles.glyph}>{glyph(state.sign)}</Text>
            <View>
              <Pill text={sign.element.toUpperCase()} />
            </View>
          </View>
          <Label style={{ textAlign: 'center' }}>{sign.name}</Label>
          <Title>{sign.archetype}</Title>
          <Body muted>{sign.revealLine}</Body>
          <View style={styles.divider} />
          <Label>Your superpowers</Label>
          <Text style={styles.superpowers}>{topAttributes(state.sign).map((a) => ATTRIBUTE_LABELS[a]).join(' · ')}</Text>
          <Label>Your sign’s strengths</Label>
          <StatList stats={sign.stats} element={sign.element} attributes={signatureTraits(state.sign)} highlights={topAttributes(state.sign)} />
          <Text style={styles.footnote}>
            ★ Your superpowers. Plus 8 background traits you can unlock. Next, tell us if your sign got you right; quests will let you prove it.
          </Text>
        </Card>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stars: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: S.xl },
  starsCaption: { fontFamily: fonts.serifMedium, fontSize: 18, letterSpacing: 8, color: night.gold },
  // Arch-topped card, the recurring window motif.
  characterCard: { paddingTop: S.xxl, paddingBottom: S.xl, borderTopLeftRadius: 180, borderTopRightRadius: 180 },
  cardTop: { alignItems: 'center', gap: S.sm },
  glyph: { fontSize: 44, color: night.gold },
  divider: { height: 1, backgroundColor: night.line, marginVertical: S.sm },
  superpowers: { ...type.h2, color: night.gold, textAlign: 'center' },
  footnote: { ...type.small, fontSize: 13, lineHeight: 18, color: night.textMuted },
});
