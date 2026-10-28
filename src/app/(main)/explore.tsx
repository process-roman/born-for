// Explore: your top paths, then every career world to browse (Blueprint §12 screen 9, Pilot Content §1).

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CAREERS, careersInWorld } from '@/content/careers';
import { WORLD_IDS, WORLDS } from '@/content/worlds';
import { rankingFor } from '@/logic/character';
import { useGame } from '@/state/game';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { PathCard } from '@/ui/PathCard';
import { DifficultyPill } from '@/ui/stats';
import { C, F, S } from '@/ui/theme';

const TOP = 3;

export default function Explore() {
  const { game } = useGame();
  if (!game) return null;
  const { ranked, notForMe } = rankingFor(game.character);
  const top = ranked[0]!;

  return (
    <Screen>
      <Title>Explore</Title>
      {game.paid ? (
        <>
          <Label>Top paths for you</Label>
          {ranked.slice(0, TOP).map((m, i) => (
            <PathCard key={m.careerId} match={m} rank={i + 1} onPress={() => router.push({ pathname: '/path/[id]', params: { id: m.careerId } })} />
          ))}
        </>
      ) : (
        <Card style={{ borderColor: C.goldBorder }}>
          <Label>Your top path</Label>
          <Text style={styles.hidden}>{CAREERS[top.careerId].name.replace(/\S/g, '•')}</Text>
          <DifficultyPill difficulty={top.difficulty} />
          {top.reasons[0] ? <Text style={styles.reason}>✦ {top.reasons[0]}</Text> : null}
          <Button title="Unlock your paths" onPress={() => router.push('/paywall')} />
        </Card>
      )}

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
  hidden: { fontFamily: F.display, fontSize: 19, color: C.textMuted },
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
