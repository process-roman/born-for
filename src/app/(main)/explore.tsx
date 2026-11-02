import { WorldIcon } from '@/ui/WorldIcon';
// Explore: where to look next. A life to pick up, a short list of your best paths, lives you haven't
// tried, paths outside the worlds you chose, then every career world to browse (Blueprint §12 screen 9,
// Pilot Content §1). The full ranked list lives on Paths, so it isn't repeated here.

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CAREERS, careersInWorld, type CareerId } from '@/content/careers';
import { LIFE_CAREER_IDS, LIVES } from '@/content/life';
import { WORLD_IDS, WORLDS } from '@/content/worlds';
import { rankingFor, statsOf } from '@/logic/character';
import { endingsFound, LIFE_SLOTS, realAge } from '@/logic/life';
import { groupMatches, type CareerMatch } from '@/logic/ranking';
import { useGame } from '@/state/game';
import { activeRun, useLives } from '@/state/lives';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { PathCard } from '@/ui/PathCard';
import { DifficultyPill } from '@/ui/stats';
import { C, F, S } from '@/ui/theme';

/** Paths in the short list, lives suggested, and paths from other worlds. */
const SHORTLIST = 3;
const LIVES_SUGGESTED = 2;
const OFF_MAP = 3;

/** One compact tappable row: name, a line under it, and the difficulty pill. */
function Row({ title, sub, match, onPress, label }: { title: string; sub?: string; match?: CareerMatch; onPress: () => void; label: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.row, pressed && { borderColor: C.gold }]}>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
        {match ? <DifficultyPill difficulty={match.difficulty} /> : null}
      </View>
      <Text style={styles.chevron}>→</Text>
    </Pressable>
  );
}

export default function Explore() {
  const { game } = useGame();
  const { runs } = useLives();
  if (!game) return null;
  const ranking = rankingFor(game.character);
  const { ranked, notForMe } = ranking;
  const top = ranked[0]!;
  const openPath = (id: CareerId) => router.push({ pathname: '/path/[id]', params: { id } });
  const openLife = (id: CareerId) => router.push({ pathname: '/life/[career]', params: { career: id } });

  // A life left halfway comes first: it's the quickest thing to pick back up.
  const inProgress = LIFE_CAREER_IDS.map((id) => activeRun(runs, id)).find((r) => r !== null) ?? null;
  // Lives not played yet, best matches first.
  const untried = ranked.map((m) => m.careerId).filter((id) => LIFE_CAREER_IDS.includes(id) && !runs.some((r) => r.career === id)).slice(0, LIVES_SUGGESTED);
  // Outside the chosen worlds, easiest first, one per world, skipping the wildcards Paths already shows.
  const wildcards = new Set(groupMatches(ranking, statsOf(game.character)).wildcards.map((m) => m.careerId));
  const seenWorlds = new Set<string>();
  const offMap = ranked
    .filter((m) => (m.source === 'other' || m.source === 'near_pick') && !wildcards.has(m.careerId))
    .sort((a, b) => a.difficulty.level - b.difficulty.level || b.attributeFit - a.attributeFit)
    .filter((m) => {
      const world = CAREERS[m.careerId].worlds[0]!;
      if (seenWorlds.has(world)) return false;
      seenWorlds.add(world);
      return true;
    })
    .slice(0, OFF_MAP);

  return (
    <Screen>
      <Title>Explore</Title>
      <Body muted>Where to look next: lives to play, paths outside your worlds, and every world to wander.</Body>

      {inProgress ? (
        <Card>
          <Label>Pick up where you left off</Label>
          <Row
            title={`${LIVES[inProgress.career]!.lifeName} life`}
            sub={`Stopped at age ${realAge(inProgress, LIFE_SLOTS[Math.min(inProgress.slotIndex, LIFE_SLOTS.length - 1)]!.age)}`}
            label={`Resume your ${LIVES[inProgress.career]!.lifeName} life`}
            onPress={() => openLife(inProgress.career)}
          />
        </Card>
      ) : null}

      {game.paid ? (
        <Card>
          <Label>Your short list</Label>
          {ranked.slice(0, SHORTLIST).map((m) => (
            <Row key={m.careerId} title={CAREERS[m.careerId].name} match={m} label={`${CAREERS[m.careerId].name} path`} onPress={() => openPath(m.careerId)} />
          ))}
          <Button title={`See all ${ranked.length} matches`} variant="secondary" onPress={() => router.push('/paths')} />
        </Card>
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
          Play twelve years of a career, starting at your age, in about 5 minutes. Your real stats set the odds.
        </Body>
        {untried.map((id) => {
          const life = LIVES[id]!;
          const found = endingsFound(life, runs).filter((f) => f.firstFoundAt).length;
          return (
            <Row
              key={id}
              title={`${life.lifeName} life`}
              sub={found ? `${found} of ${life.endings.length} endings found` : 'Not lived yet'}
              label={`${life.lifeName} life`}
              onPress={() => openLife(id)}
            />
          );
        })}
        <Button title="See all lives" variant="secondary" onPress={() => router.push('/lives')} />
      </Card>

      {game.paid && offMap.length > 0 ? (
        <Card>
          <Label>Off your map</Label>
          <Body muted style={{ textAlign: 'left' }}>
            Worlds you didn’t pick, with paths your stats already suit.
          </Body>
          {offMap.map((m) => (
            <Row
              key={m.careerId}
              title={CAREERS[m.careerId].name}
              sub={`${WORLDS[CAREERS[m.careerId].worlds[0]!].emoji} ${WORLDS[CAREERS[m.careerId].worlds[0]!].name}`}
              match={m}
              label={`${CAREERS[m.careerId].name} path`}
              onPress={() => openPath(m.careerId)}
            />
          ))}
        </Card>
      ) : null}

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
              accessibilityLabel={`${w.name}, ${careersInWorld(id).length} paths`}
              onPress={() => router.push({ pathname: '/world/[id]', params: { id } })}
              style={({ pressed }) => [styles.world, pressed && { borderColor: C.gold }]}
            >
              <WorldIcon world={id} />
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
            <PathCard key={m.careerId} match={m} onPress={() => openPath(m.careerId)} />
          ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topName: { fontFamily: F.display, fontSize: 22, color: C.text },
  reason: { fontFamily: F.body, fontSize: 14, lineHeight: 20, color: C.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.md, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.night },
  rowTitle: { fontFamily: F.bodyMedium, fontSize: 16, color: C.text },
  rowSub: { fontFamily: F.body, fontSize: 13, color: C.textMuted },
  chevron: { fontSize: 18, color: C.gold },
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
