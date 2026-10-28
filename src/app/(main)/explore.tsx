// Explore: every path, ranked, with Not for me at the bottom (Blueprint §12 screen 9).

import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { CAREERS } from '@/content/careers';
import { rankingFor } from '@/logic/character';
import { useGame } from '@/state/game';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { PathCard } from '@/ui/PathCard';
import { DifficultyPill } from '@/ui/stats';
import { C, F } from '@/ui/theme';

export default function Explore() {
  const { game } = useGame();
  if (!game) return null;
  const { ranked, notForMe } = rankingFor(game.character);
  const open = (id: string) => router.push({ pathname: '/path/[id]', params: { id } });

  if (!game.paid) {
    const top = ranked[0]!;
    return (
      <Screen footer={<Button title="Unlock your paths" onPress={() => router.push('/paywall')} />}>
        <Title>Your paths</Title>
        <Body muted>Your paths are ready. Unlock them to see every constellation and quest.</Body>
        <Card style={{ borderColor: C.goldBorder }}>
          <Label>Your top path</Label>
          <Text style={styles.hidden}>{CAREERS[top.careerId].name.replace(/\S/g, '•')}</Text>
          <DifficultyPill difficulty={top.difficulty} />
          {top.reasons[0] ? <Text style={styles.reason}>✦ {top.reasons[0]}</Text> : null}
        </Card>
        <Body muted>+ {ranked.length - 1} more paths in your sky</Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <Title>Explore paths</Title>
      <Body muted>Ranked for what you enjoy and your current stats. Difficulty updates as you grow.</Body>
      {ranked.map((m, i) => (
        <PathCard key={m.careerId} match={m} rank={i + 1} onPress={() => open(m.careerId)} />
      ))}
      {notForMe.length > 0 ? (
        <>
          <Label>Not for me</Label>
          {notForMe.map((m) => (
            <PathCard key={m.careerId} match={m} onPress={() => open(m.careerId)} />
          ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hidden: { fontFamily: F.display, fontSize: 19, color: C.textMuted },
  reason: { fontFamily: F.body, fontSize: 14, lineHeight: 20, color: C.textMuted },
});
