// Paywall stub (Blueprint §4.1, §10). No real purchase yet. Shown after the free life ("You've
// lived one life", Life Sim Spec §2), after the free quest ("second moment"), from the end of
// onboarding and from locked screens.

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { CAREERS } from '@/content/careers';
import type { IntentId } from '@/content/preferences';
import { rankingFor } from '@/logic/character';
import { useGame } from '@/state/game';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Card, Label, Screen, Step, Title } from '@/ui/components';
import { DifficultyPill } from '@/ui/stats';
import { C, F } from '@/ui/theme';

const HEADLINES: Record<IntentId, { title: string; body: string }> = {
  career: { title: 'Your career paths are ready.', body: 'Ranked for the worlds and jobs you picked, and the stats you confirmed.' },
  change: { title: 'Your career paths are ready.', body: 'Ranked for the worlds and jobs you picked, so you can test a switch before you make it.' },
  discover: { title: 'Paths that match your character are ready.', body: 'See where your character could grow, one real-world quest at a time.' },
  curious: { title: 'Your character has somewhere to go.', body: 'Your sign is just the beginning. See the paths your character is built for.' },
};

const UNLOCKS = [
  'Every life, unlimited replays, and compare lives side by side',
  'All your career paths, with why each one fits',
  'Every constellation and its five quests',
  'Hybrid titles and an evolving character',
  'Real next steps: courses, communities and entry roles',
];

const SECOND_MOMENT = { title: 'Your first star is lit.', body: 'Unlock the full constellation, and every other path waiting in your sky.' };
const AFTER_LIFE = {
  title: 'You’ve lived one life. More are waiting.',
  body: 'Replay it with better odds, live other careers, and start real quests that raise your stats for real.',
};

export default function Paywall() {
  const { second, life } = useLocalSearchParams<{ second?: string; life?: string }>();
  const onboarding = useOnboarding();
  const { game, begin, unlock } = useGame();
  const character = game?.character ?? onboarding.character;
  if (!character) return <Redirect href="/" />;
  const top = rankingFor(character).ranked[0]!;
  const copy = life === '1' ? AFTER_LIFE : second === '1' ? SECOND_MOMENT : HEADLINES[character.intent ?? 'career'];

  const finish = (paid: boolean) => {
    if (game) {
      if (paid) unlock();
    } else {
      begin(character, paid);
    }
    if (router.canDismiss()) router.dismissAll();
    if (paid) router.replace('/paths');
    // New players, and those who just finished their free life, get the free quest next.
    else router.replace(game && life !== '1' ? '/home' : { pathname: '/paths', params: { free: '1' } });
  };

  return (
    <Screen
      footer={
        <>
          <Button title="Unlock everything" onPress={() => finish(true)} />
          <Text style={styles.stub}>Test build: no payment is taken.</Text>
          <Button title="Not now" variant="ghost" onPress={() => finish(false)} />
        </>
      }
    >
      {game ? null : <Step index={8} total={9} />}
      <Title>{copy.title}</Title>
      <Body muted>{copy.body}</Body>

      <Card>
        <Label>Your top path</Label>
        <Text style={styles.topName}>{CAREERS[top.careerId].name}</Text>
        <DifficultyPill difficulty={top.difficulty} />
        {top.reasons[0] ? <Text style={styles.reason}>✦ {top.reasons[0]}</Text> : null}
      </Card>

      <Card>
        <Label>What you unlock</Label>
        {UNLOCKS.map((u) => (
          <Text key={u} style={styles.unlock}>
            <Text style={{ color: C.gold }}>★ </Text>
            {u}
          </Text>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topName: { fontFamily: F.display, fontSize: 26, lineHeight: 30, color: C.text },
  reason: { fontFamily: F.body, fontSize: 15, color: C.text },
  unlock: { fontFamily: F.body, fontSize: 15, lineHeight: 22, color: C.text },
  stub: { fontFamily: F.body, fontSize: 12, color: C.textMuted, textAlign: 'center' },
});
