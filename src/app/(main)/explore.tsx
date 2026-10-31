// Explore: your top paths, then every career world to browse (Blueprint §12 screen 9, Pilot Content §1).

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CAREERS, careersInWorld } from '@/content/careers';
import { WORLD_IDS, WORLDS } from '@/content/worlds';
import { rankingFor } from '@/logic/character';
import { useGame } from '@/state/game';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { PathCard } from '@/ui/PathCard';
import { ResultGroups } from '@/ui/ResultGroups';
import { DifficultyPill } from '@/ui/stats';
import { C, F, S } from '@/ui/theme';

export default function Explore() {
  const { game } = useGame();
  if (!game) return null;
  const ranking = rankingFor(game.character);
  const { ranked, notForMe } = ranking;
  const top = ranked[0]!;

  return (
    <Screen>
      <Title>Explore</Title>
      {game.paid ? (
        <ResultGroups ranking={ranking} character={game.character} />
      ) : (
        <Card>
          <Label>Your top path</Label>
          <Text style={styles.topName}>{CAREERS[top.careerId].name}</Text>
          <DifficultyPill difficulty={top.difficulty} />
          {top.reasons[0] ? <Text style={styles.reason}>✦ {top.reasons[0]}</Text> : null}
          <Button title="Unlock your paths" onPress={() => router.push('/paywall')} />
        </Card>
      )}

      <Card>
        <Label>Live it first</Label>
        <Body muted style={{ textAlign: 'left' }}>
          Play a career from 18 to 30 in about 5 minutes. Your real stats set the odds.
        </Body>
        <Button title="See all lives" variant="secondary" onPress={() => router.push('/lives')} />
      </Card>

      <Label>Browse worlds</Label>
      <Body muted style={{ textAlign: 'left' }}>
        Not sure yet? Wander. Every path is open, and difficulty just shows how much training it takes.
      </Body>
      <View style={styles.grid}>
        {WORLD_IDS.map((id) => {
          const w = WORLDS[id];
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={w.name}
              onPress={() => router.push({ pathname: '/world/[id]', params: { id } })}
              style={({ pressed }) => [styles.world, pressed && { borderColor: C.gold }]}
            >
              <Text style={styles.emoji}>{w.emoji}</Text>
              <Text style={styles.worldName}>{w.name}</Text>
              <Text style={styles.count}>{careersInWorld(id).length} paths</Text>
            </Pressable>
          );
        })}
      </View>

      {game.paid && notForMe.length > 0 ? (
        <>
          <Label>Not for me</Label>
          {notForMe.map((m) => (
            <PathCard key={m.careerId} match={m} onPress={() => router.push({ pathname: '/path/[id]', params: { id: m.careerId } })} />
          ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topName: { fontFamily: F.display, fontSize: 22, color: C.text },
  reason: { fontFamily: F.body, fontSize: 14, lineHeight: 20, color: C.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  world: {
    width: '48.5%',
    minHeight: 104,
    padding: S.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.night,
    gap: 4,
  },
  emoji: { fontSize: 24 },
  worldName: { fontFamily: F.bodyMedium, fontSize: 14, lineHeight: 18, color: C.text },
  count: { fontFamily: F.body, fontSize: 12, color: C.gold },
});
