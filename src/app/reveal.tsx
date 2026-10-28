// Character reveal: stars connect into the sign's constellation, then the card flips (Spec §6 Motion).

import { Redirect, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { SIGNS } from '@/content/signs';
import { ELEMENT_COLORS } from '@/content/theme';
import { ZODIAC_CONSTELLATIONS } from '@/content/zodiacConstellations';
import { topAttributes } from '@/logic/poll';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Card, Label, Pill, Screen, Step, Title } from '@/ui/components';
import { Constellation } from '@/ui/Constellation';
import { StatList } from '@/ui/stats';
import { C, F, glyph, S } from '@/ui/theme';

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
  const element = ELEMENT_COLORS[sign.element];

  if (phase === 'stars') {
    return (
      <Screen scroll={false}>
        <Pressable accessibilityLabel="Skip animation" onPress={showCard} style={styles.stars}>
          <Constellation shape={ZODIAC_CONSTELLATIONS[state.sign]} size={280} onDone={showCard} />
          <Text style={styles.starsCaption}>{sign.name.toUpperCase()}</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen footer={<Button title="Confirm my stats" onPress={() => router.push('/poll')} />}>
      <Step index={2} total={8} />
      <Animated.View
        style={{
          opacity: flip,
          transform: [{ perspective: 1000 }, { rotateY: flip.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }],
        }}
      >
        <Card style={[styles.characterCard, { borderColor: C.goldBorder }]}>
          <View style={styles.cardTop}>
            <Text style={styles.glyph}>{glyph(state.sign)}</Text>
            <Pill text={sign.element.toUpperCase()} color={element} />
          </View>
          <Label style={{ textAlign: 'center' }}>{sign.name}</Label>
          <Title>{sign.archetype}</Title>
          <Body muted>{sign.revealLine}</Body>
          <View style={[styles.divider, { backgroundColor: element }]} />
          <Label>Your sign suggests</Label>
          <StatList stats={sign.stats} element={sign.element} highlights={topAttributes(state.sign)} />
          <Text style={styles.footnote}>★ Strongest probable attributes. Next, you’ll tell us if your sign got you right.</Text>
        </Card>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stars: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: S.xl },
  starsCaption: { fontFamily: F.displayRegular, fontSize: 16, letterSpacing: 8, color: C.gold },
  characterCard: { backgroundColor: C.night, paddingVertical: S.xl },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  glyph: { fontSize: 40, color: C.gold },
  divider: { height: 1, opacity: 0.4, marginVertical: S.sm },
  footnote: { fontFamily: F.body, fontSize: 13, lineHeight: 18, color: C.textMuted },
});
