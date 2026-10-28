// Paywall stub with the free-tier teaser (Blueprint §4.1, §10). No real purchase yet.

import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import type { IntentId } from '@/content/preferences';
import { rankingFor } from '@/logic/character';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Card, Label, Screen, Step, Title } from '@/ui/components';
import { DifficultyPill } from '@/ui/stats';
import { C, F, S } from '@/ui/theme';

const HEADLINES: Record<IntentId, { title: string; body: string }> = {
  career: { title: 'Your career paths are ready.', body: 'Ranked for what you enjoy and the stats you confirmed.' },
  change: { title: 'Your career paths are ready.', body: 'Ranked for what you enjoy and the stats you confirmed, so you can test a switch before you make it.' },
  discover: { title: 'Paths that match your character are ready.', body: 'See where your character could grow, one real-world quest at a time.' },
  curious: { title: 'Your character has somewhere to go.', body: 'Your sign is just the beginning. See the paths your character is built for.' },
};

const UNLOCKS = [
  'All your career paths, with why each one fits',
  'Every constellation and its five quests',
  'Hybrid titles and an evolving character',
  'Real next steps: courses, communities and entry roles',
];

export default function Paywall() {
  const { state, character } = useOnboarding();
  if (!character) return <Redirect href="/" />;
  const top = rankingFor(character).ranked[0]!;
  const copy = HEADLINES[state.intent ?? 'career'];

  return (
    <Screen
      footer={
        <>
          <Button title="Unlock your paths" onPress={() => router.push('/paths')} />
          <Text style={styles.stub}>Test build: no payment is taken.</Text>
          <Button title="Not now" variant="ghost" onPress={() => router.push({ pathname: '/paths', params: { free: '1' } })} />
        </>
      }
    >
      <Step index={7} total={8} />
      <Title>{copy.title}</Title>
      <Body muted>{copy.body}</Body>

      <Card style={{ borderColor: C.goldBorder }}>
        <Label>Your top path</Label>
        <View style={styles.blurred} accessibilityLabel="Hidden career name">
          <Text style={styles.blurredText}>{CAREERS[top.careerId].name.replace(/\S/g, '•')}</Text>
        </View>
        <DifficultyPill difficulty={top.difficulty} />
        {top.reasons[0] ? <Text style={styles.reason}>✦ {top.reasons[0]}</Text> : null}
      </Card>

      <View style={{ gap: S.sm }}>
        {UNLOCKS.map((u) => (
          <Text key={u} style={styles.unlock}>
            <Text style={{ color: C.gold }}>★ </Text>
            {u}
          </Text>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  blurred: { paddingVertical: S.xs },
  blurredText: { fontFamily: F.display, fontSize: 22, letterSpacing: 2, color: C.textMuted, opacity: 0.6 },
  reason: { fontFamily: F.body, fontSize: 15, color: C.text },
  unlock: { fontFamily: F.body, fontSize: 15, lineHeight: 22, color: C.text },
  stub: { fontFamily: F.body, fontSize: 12, color: C.textMuted, textAlign: 'center' },
});
