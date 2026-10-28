// End of onboarding: the career reveal (paid) or the free-tier teaser with one Taste quest
// (Blueprint §3 step 10, §4.1).

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import type { IntentId } from '@/content/preferences';
import { SIGNS } from '@/content/signs';
import { rankingFor } from '@/logic/character';
import type { CareerMatch } from '@/logic/ranking';
import { QUEST_XP, REFLECTION_XP } from '@/logic/xp';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { DifficultyPill } from '@/ui/stats';
import { C, F, glyph, S } from '@/ui/theme';

const TOP = 3;

function PathCard({ match, rank }: { match: CareerMatch; rank?: number }) {
  const career = CAREERS[match.careerId];
  return (
    <Card>
      <View style={{ gap: 2 }}>
        {rank ? <Label>Path {rank}</Label> : null}
        <Text style={styles.careerName}>{career.name}</Text>
        <Text style={styles.constellation}>{career.constellation.name}</Text>
      </View>
      <DifficultyPill difficulty={match.difficulty} />
      <Text style={styles.oneLiner}>{career.oneLiner}</Text>
      <View style={{ gap: 4 }}>
        {match.reasons.map((r) => (
          <Text key={r} style={styles.reason}>
            ✦ {r}
          </Text>
        ))}
      </View>
    </Card>
  );
}

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
  const { state, character } = useOnboarding();
  const [showAll, setShowAll] = useState(false);
  if (!character) return <Redirect href="/" />;

  const { ranked, notForMe } = rankingFor(character);
  const top = ranked[0]!;
  const sign = SIGNS[character.sign];

  if (free === '1') {
    const quest = CAREERS[top.careerId].quests[0]!;
    return (
      <Screen
        footer={
          <>
            <Button title="Start my free quest" disabled onPress={() => {}} />
            <Text style={styles.next}>Quests arrive in the next build.</Text>
            <Button title="Unlock your paths" variant="secondary" onPress={() => router.replace('/paywall')} />
          </>
        }
      >
        <View style={{ alignItems: 'center', gap: S.xs }}>
          <Text style={styles.glyph}>{glyph(character.sign)}</Text>
          <Title>{sign.archetype}</Title>
          <Body muted>Your character is ready. Here’s one free quest on your top path.</Body>
        </View>
        <Card style={{ borderColor: C.goldBorder }}>
          <Label>Your top path</Label>
          <Text style={[styles.careerName, { color: C.textMuted }]}>{CAREERS[top.careerId].name.replace(/\S/g, '•')}</Text>
          <DifficultyPill difficulty={top.difficulty} />
          {top.reasons[0] ? <Text style={styles.reason}>✦ {top.reasons[0]}</Text> : null}
        </Card>
        <Card>
          <View style={styles.cardHead}>
            <Label>Free Taste quest · {quest.time}</Label>
            <Text style={styles.xp}>+{QUEST_XP.taste + REFLECTION_XP} XP</Text>
          </View>
          <Text style={styles.careerName}>{quest.name}</Text>
          <Text style={styles.oneLiner}>{quest.instructions}</Text>
        </Card>
      </Screen>
    );
  }

  const rest = ranked.slice(TOP);
  return (
    <Screen
      footer={
        <>
          <Button title="Choose a path" disabled onPress={() => {}} />
          <Text style={styles.next}>Choosing paths and quests arrives in the next build.</Text>
        </>
      }
    >
      <Title>{TITLES[state.intent ?? 'career']}</Title>
      <Body muted>Every path stays open. Harder ones just take more training.</Body>
      {ranked.slice(0, TOP).map((m, i) => (
        <Staggered key={m.careerId} index={i}>
          <PathCard match={m} rank={i + 1} />
        </Staggered>
      ))}
      {rest.length > 0 && !showAll ? <Button title={`See all paths (${ranked.length + notForMe.length})`} variant="ghost" onPress={() => setShowAll(true)} /> : null}
      {showAll ? rest.map((m) => <PathCard key={m.careerId} match={m} />) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  glyph: { fontSize: 36, color: C.gold },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: S.sm },
  careerName: { fontFamily: F.display, fontSize: 19, color: C.text },
  constellation: { fontFamily: F.body, fontSize: 13, color: C.gold },
  oneLiner: { fontFamily: F.body, fontSize: 15, lineHeight: 22, color: C.text },
  reason: { fontFamily: F.body, fontSize: 14, lineHeight: 20, color: C.textMuted },
  xp: { fontFamily: F.bodyBold, fontSize: 13, color: C.gold },
  next: { fontFamily: F.body, fontSize: 12, color: C.textMuted, textAlign: 'center' },
});
