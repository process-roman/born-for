// Confirm poll: one swipe card per attribute (Spec §4).

import { Redirect, router } from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import { Animated, PanResponder, Platform, StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_LABELS } from '@/content/attributes';
import { SIGNS } from '@/content/signs';
import { pollCards } from '@/logic/poll';
import { bandFor, type PollAnswer } from '@/logic/stats';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Label, Screen, Step } from '@/ui/components';
import { bandColor, C, F, S } from '@/ui/theme';

const SWIPE = 110;
const useNativeDriver = Platform.OS !== 'web';

export default function Poll() {
  const { state, dispatch, confirmed } = useOnboarding();
  const cards = useMemo(() => (state.sign ? pollCards(state.sign) : []), [state.sign]);
  const [index, setIndex] = useState(0);
  const [pan] = useState(() => new Animated.ValueXY());
  const [busy, setBusy] = useState(false);

  const answer = (value: PollAnswer, direction: -1 | 0 | 1 = 0) => {
    const card = cards[index];
    if (!card || busy) return;
    setBusy(true);
    dispatch({ type: 'answer', attribute: card.attribute, answer: value });
    Animated.timing(pan, {
      toValue: { x: direction * 500, y: direction === 0 ? -40 : 0 },
      duration: 220,
      useNativeDriver,
    }).start(() => {
      setBusy(false);
      if (index + 1 >= cards.length) router.push('/background');
      else setIndex(index + 1);
    });
  };
  // Center the next card before it paints, so the old one never flashes back.
  useLayoutEffect(() => pan.setValue({ x: 0, y: 0 }), [index, pan]);

  // Rebuilt each render so the handlers see the current card; the drag itself runs on the Animated value.
  const responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6,
    onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dx > SWIPE) answer('yes', 1);
      else if (g.dx < -SWIPE) answer('no', -1);
      else Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver }).start();
    },
  });

  if (!state.sign || !confirmed) return <Redirect href="/" />;
  const sign = SIGNS[state.sign];
  const card = cards[index];
  if (!card) return <Redirect href="/background" />;

  const rotate = pan.x.interpolate({ inputRange: [-300, 0, 300], outputRange: ['-12deg', '0deg', '12deg'] });
  const yesOpacity = pan.x.interpolate({ inputRange: [0, SWIPE], outputRange: [0, 1], extrapolate: 'clamp' });
  const noOpacity = pan.x.interpolate({ inputRange: [-SWIPE, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <Screen
      scroll={false}
      footer={
        <>
          <View style={styles.answers}>
            <Button title="Not really" variant="secondary" onPress={() => answer('no', -1)} style={styles.answer} />
            <Button title="Sometimes" variant="secondary" onPress={() => answer('sometimes')} style={styles.answer} />
            <Button title="That’s me" onPress={() => answer('yes', 1)} style={styles.answer} />
          </View>
          <Button title="Skip, keep my sign’s value" variant="ghost" onPress={() => answer('skip')} />
        </>
      }
    >
      <Step index={3} total={9} />
      <Label style={{ textAlign: 'center' }}>
        Is this you? · {index + 1} of {cards.length}
      </Label>

      <View style={styles.deck}>
        <Animated.View
          key={card.attribute}
          {...responder.panHandlers}
          style={[styles.card, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }] }]}
        >
          <Animated.Text style={[styles.stamp, styles.stampYes, { opacity: yesOpacity }]}>THAT’S ME</Animated.Text>
          <Animated.Text style={[styles.stamp, styles.stampNo, { opacity: noOpacity }]}>NOT REALLY</Animated.Text>
          <Text style={styles.attribute}>{ATTRIBUTE_LABELS[card.attribute].toUpperCase()}</Text>
          <Text style={styles.prediction}>
            Your sign says: <Text style={{ color: bandColor(card.signBand, sign.element), fontFamily: F.bodyBold }}>{card.signBand}</Text>
          </Text>
          <Text style={styles.statement}>“{card.statement}”</Text>
        </Animated.View>
      </View>

      <Body muted style={{ fontSize: 13 }}>
        Swipe right for That’s me, left for Not really.
      </Body>

      <View style={styles.bars} accessibilityLabel="Your stats so far">
        {cards.map((c) => {
          const answered = state.answers[c.attribute] !== undefined;
          const value = confirmed[c.attribute];
          return (
            <View key={c.attribute} style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { height: `${answered ? value : sign.stats[c.attribute]}%` },
                  answered ? { backgroundColor: bandColor(bandFor(value), sign.element) } : styles.barGhost,
                ]}
              />
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  deck: { flex: 1, minHeight: 260, justifyContent: 'center' },
  card: {
    minHeight: 260,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.goldBorder,
    backgroundColor: C.night,
    padding: S.xl,
    justifyContent: 'center',
    gap: S.md,
    userSelect: 'none',
  },
  attribute: { fontFamily: F.display, fontSize: 22, letterSpacing: 2, color: C.text, textAlign: 'center' },
  prediction: { fontFamily: F.body, fontSize: 14, color: C.textMuted, textAlign: 'center' },
  statement: { fontFamily: F.body, fontStyle: 'italic', fontSize: 20, lineHeight: 28, color: C.text, textAlign: 'center', marginTop: S.sm },
  stamp: { position: 'absolute', top: S.lg, fontFamily: F.bodyBold, fontSize: 13, letterSpacing: 1.5, borderWidth: 1.5, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  stampYes: { left: S.lg, color: C.gold, borderColor: C.gold },
  stampNo: { right: S.lg, color: C.lavender, borderColor: C.lavender },
  answers: { flexDirection: 'row', gap: S.sm },
  answer: { flex: 1, paddingHorizontal: S.xs },
  bars: { flexDirection: 'row', justifyContent: 'center', gap: 6, height: 44 },
  barTrack: { width: 14, height: '100%', borderRadius: 3, backgroundColor: C.track, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 3 },
  barGhost: { borderWidth: 1, borderColor: 'rgba(244, 241, 234, 0.35)', borderStyle: 'dashed' },
});
