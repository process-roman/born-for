// One career world: every path in it, ranked for you (Pilot Content §1).

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { careersInWorld } from '@/content/careers';
import { WORLD_IDS, WORLDS, type WorldId } from '@/content/worlds';
import { rankingFor } from '@/logic/character';
import { useGame } from '@/state/game';
import { Body, Button, Card, Screen, Title } from '@/ui/components';
import { PathCard } from '@/ui/PathCard';
import { DifficultyPill } from '@/ui/stats';
import { C, F, S } from '@/ui/theme';

export default function WorldScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { game } = useGame();
  if (!game) return <Redirect href="/" />;
  if (!WORLD_IDS.includes(id as WorldId)) return <Redirect href="/explore" />;
  const world = WORLDS[id as WorldId];
  const inWorld = new Set(careersInWorld(world.id).map((c) => c.id));
  const { ranked, notForMe } = rankingFor(game.character);
  const matches = [...ranked, ...notForMe].filter((m) => inWorld.has(m.careerId));

  return (
    <Screen
      footer={
        <>
          {!game.paid ? <Button title="Unlock your paths" onPress={() => router.push('/paywall')} /> : null}
          <Button title="Back" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/explore'))} />
        </>
      }
    >
      <View style={{ alignItems: 'center', gap: S.xs }}>
        <Text style={{ fontSize: 40 }}>{world.emoji}</Text>
        <Title>{world.name}</Title>
        <Body muted>{world.blurb}</Body>
      </View>
      {matches.map((m) =>
        game.paid ? (
          <PathCard key={m.careerId} match={m} onPress={() => router.push({ pathname: '/path/[id]', params: { id: m.careerId } })} />
        ) : (
          <Card key={m.careerId}>
            <Text style={styles.name}>{careersInWorld(world.id).find((c) => c.id === m.careerId)!.name}</Text>
            <DifficultyPill difficulty={m.difficulty} />
            <Text style={styles.locked}>Unlock to see why it fits and start its quests.</Text>
          </Card>
        ),
      )}
      <Body muted>More paths are coming to this world.</Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontFamily: F.display, fontSize: 19, color: C.text },
  locked: { fontFamily: F.body, fontSize: 14, color: C.textMuted },
});
