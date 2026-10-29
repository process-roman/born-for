// After the paywall: the career reveal (paid) or the free-tier teaser with one Taste quest
// (Blueprint §3 step 10, §4.1).

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import type { IntentId } from '@/content/preferences';
import { SIGNS } from '@/content/signs';
import { rankingFor } from '@/logic/character';
import { useGame } from '@/state/game';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { ResultGroups } from '@/ui/ResultGroups';
import { QuestCard } from '@/ui/quest';
import { DifficultyPill } from '@/ui/stats';
import { C, F, glyph, S } from '@/ui/theme';

function Staggered({ children, index }: { children: React.ReactNode; index: number }) {
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 450, delay: 250 + index * 350, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [v, index]);
  return (
    <Animated.View style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] }}>
      {children}
    </Animated.View>
  );
}

const TITLES: Record<IntentId, string> = {
  career: 'Your top paths',
  change: 'Paths worth testing',
  discover: 'Paths that match your character',
  curious: 'Where your character could go',
};

export default function Paths() {
  const { free } = useLocalSearchParams<{ free?: string }>();
  const { game } = useGame();
  if (!game) return <Redirect href="/" />;
  const { character } = game;
  const { ranked } = rankingFor(character);
  const top = ranked[0]!;
  const sign = SIGNS[character.sign];

  if (free === '1' && !game.paid) {
    const quest = CAREERS[top.careerId].quests[0]!;
    return (
      <Screen
        footer={
          <>
            <Button title="Start my free quest" onPress={() => router.push({ pathname: '/quest/start', params: { career: top.careerId, star: '1' } })} />
            <Button title="Go to home" variant="ghost" onPress={() => router.replace('/home')} />
          </>
        }
      >
        <View style={{ alignItems: 'center', gap: S.xs }}>
          <Text style={styles.glyph}>{glyph(character.sign)}</Text>
          <Title>{sign.archetype}</Title>
          <Body muted>Your character is saved on this device. Here’s one free quest on your top path.</Body>
        </View>
        <Card style={{ borderColor: C.goldBorder }}>
          <Label>Your top path</Label>
          <Text style={styles.hidden}>{CAREERS[top.careerId].name.replace(/\S/g, '•')}</Text>
          <DifficultyPill difficulty={top.difficulty} />
          {top.reasons[0] ? <Text style={styles.reason}>✦ {top.reasons[0]}</Text> : null}
        </Card>
        <QuestCard careerId={top.careerId} quest={quest} kicker="Free Taste quest" hideCareer />
      </Screen>
    );
  }

  return (
    <Screen footer={<Button title="Go to home" onPress={() => router.replace('/home')} />}>
      <Title>{TITLES[character.intent ?? 'career']}</Title>
      <Body muted>Every path stays open. Harder ones just take more training. Tap one to see its constellation.</Body>
      <Staggered index={0}>
        <ResultGroups ranking={rankingFor(character)} character={character} />
      </Staggered>
      <Button title="Browse every world" variant="ghost" onPress={() => router.replace('/explore')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  glyph: { fontSize: 36, color: C.gold },
  hidden: { fontFamily: F.display, fontSize: 19, color: C.textMuted },
  reason: { fontFamily: F.body, fontSize: 14, lineHeight: 20, color: C.textMuted },
});
