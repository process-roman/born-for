// Paywall stub with the free-tier teaser (Blueprint §4.1, §10). No real purchase yet.
// Shown at the end of onboarding, after the free quest ("second moment") and from locked screens.

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import type { IntentId } from '@/content/preferences';
import { rankingFor } from '@/logic/character';
import { useGame } from '@/state/game';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Card, Label, Screen, Step, Title } from '@/ui/components';
import { DifficultyPill } from '@/ui/stats';
import { C, F, S } from '@/ui/theme';

const HEADLINES: Record<IntentId, { title: string; body: string }> = {
  career: { title: 'Your career paths are ready.', body: 'Ranked for the worlds and jobs you picked, and the stats you confirmed.' },
  change: { title: 'Your career paths are ready.', body: 'Ranked for the worlds and jobs you picked, so you can test a switch before you make it.' },
  discover: { title: 'Paths that match your character are ready.', body: 'See where your character could grow, one real-world quest at a time.' },
  curious: { title: 'Your character has somewhere to go.', body: 'Your sign is just the beginning. See the paths your character is built for.' },
};

const UNLOCKS = [
  'All your career paths, with why each one fits',
  'Every constellation and its five quests',
  'Hybrid titles and an evolving character',
  'Real next steps: courses, communities and entry roles',
];

const SECOND_MOMENT = { title: 'Your first star is lit.', body: 'Unlock the full constellation, and every other path waiting in your sky.' };

export default function Paywall() {
  const { second } = useLocalSearchParams<{ second?: string }>();
  const onboarding = useOnboarding();
  const { game, begin, unlock } = useGame();
  const character = game?.character ?? onboarding.character;
  if (!character) return <Redirect href="/" />;
  const top = rankingFor(character).ranked[0]!;
  const copy = second === '1' ? SECOND_MOMENT : HEADLINES[character.intent ?? 'career'];

  const finish = (paid: boolean) => {
    if (game) {
      if (paid) unlock();
    } else {
      begin(character, paid);
    }
    if (router.canDismiss()) router.dismissAll();
    if (paid) router.replace('/paths');
    else router.replace(game ? '/home' : { pathname: '/paths', params: { free: '1' } });
  };

  return (
    <Screen
      footer={
        <>
          <Button title="Unlock your paths" onPress={() => finish(true)} />
          <Text style={styles.stub}>Test build: no payment is taken.</Text>
          <Button title="Not now" variant="ghost" onPress={() => finish(false)} />
        </>
      }
    >
      {game ? null : <Step index={8} total={9} />}
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
