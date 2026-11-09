// Life intro (cream): "Live it first", your odds on this career's most-checked attributes, and
// start or resume (Life Sim Spec §12 screen 1). On a replay, odds that improved since last time.

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_LABELS, type Stats } from '@/content/attributes';
import { CAREER_IDS, CAREERS, type CareerId } from '@/content/careers';
import { lifeFor, SHARED_EVENTS, type CareerLife } from '@/content/life';
import { SIGNS, type Element } from '@/content/signs';
import { ageOf, statsOf } from '@/logic/character';
import { LIFE_SLOTS, lifeStart, mostCheckedAttributes, realAge, START_METERS, startLife, typicalOdds, type LifeRun } from '@/logic/life';
import { useGame } from '@/state/game';
import { canPlayLife } from '@/logic/lifeAccess';
import { payShort } from '@/logic/pay';
import { activeRun, latestCompleted, useLives } from '@/state/lives';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { LifeSky } from '@/ui/LifeSky';
import { day, S, type } from '@/ui/theme';

/** A fresh run with a random seed, starting now. Only called from button handlers. */
function newRun(life: CareerLife, careerId: CareerId, stats: Stats, element: Element, age: number | null): LifeRun {
  const now = new Date();
  return startLife(life, SHARED_EVENTS, {
    id: `${careerId}-${now.getTime()}`,
    career: careerId,
    seed: Math.floor(Math.random() * 4294967296),
    startedAt: now.toISOString(),
    stats,
    element,
    age,
  }).run;
}

export default function LifeIntro() {
  const { career } = useLocalSearchParams<{ career: string }>();
  const { game } = useGame();
  const { runs, save } = useLives();
  if (!game) return <Redirect href="/" />;
  const careerId = career as CareerId;
  const life = CAREER_IDS.includes(careerId) ? lifeFor(careerId) : null;
  if (!life) return <Redirect href="/explore" />;

  const { character } = game;
  const stats = statsOf(character);
  const element = SIGNS[character.sign].element;
  const active = activeRun(runs, careerId);
  const previous = latestCompleted(runs, careerId);
  const attributes = mostCheckedAttributes(life);
  const allowed = canPlayLife(game, runs, careerId);
  const age = ageOf(character);
  const { startAge, track } = lifeStart(age);
  const play = () => router.push({ pathname: '/life/play', params: { career: careerId } });

  /** Saving a new run replaces the career's unfinished one, so this also restarts. */
  const start = () => {
    save(newRun(life, careerId, stats, element, age));
    play();
  };

  return (
    <Screen
      footer={
        <>
          {!allowed ? (
            <Button title="Unlock every life" onPress={() => router.push({ pathname: '/paywall', params: { life: '1' } })} />
          ) : active ? (
            <>
              <Button title="Resume your life" onPress={play} />
              <Button title="Restart life" variant="ghost" onPress={start} />
            </>
          ) : (
            <Button title={previous ? 'Live it again' : game.paid ? 'Start' : 'Start my free life'} onPress={start} />
          )}
          <Button title="Back" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace({ pathname: '/path/[id]', params: { id: careerId } }))} />
        </>
      }
    >
      <LifeSky age={18} meters={START_METERS} element={element} variant="card" />
      <View style={{ alignItems: 'center', gap: S.xs }}>
        <Label>{track === 'change' ? `A career change at ${startAge}` : 'Live it first'}</Label>
        <Title>{life.lifeName} life</Title>
        <Body muted>
          {CAREERS[careerId].name}, from {startAge} to {startAge + 12}. About 5 minutes · your character’s stats set the odds.
        </Body>
        {payShort(careerId) ? <Text style={styles.small}>{payShort(careerId)}</Text> : null}
        {age === null ? <Text style={styles.small}>Add your birth year in Settings to start this life at your own age.</Text> : null}
      </View>

      {!allowed ? (
        <Card>
          <Label>Locked</Label>
          <Text style={styles.body}>
            {previous ? 'You’ve lived your free life. Unlock to replay it and live other careers.' : 'Your free life is the one on your top match. Unlock to live every career.'}
          </Text>
        </Card>
      ) : null}

      {active ? (
        <Card>
          <Label>In progress</Label>
          <Text style={styles.body}>
            You stopped at age {realAge(active, LIFE_SLOTS[Math.min(active.slotIndex, LIFE_SLOTS.length - 1)]!.age)}. Pick up exactly where you left off.
          </Text>
        </Card>
      ) : null}

      <Card>
        <Label>Your odds in this life</Label>
        {attributes.map((a) => {
          const now = typicalOdds(life, a, stats)!;
          const before = previous ? typicalOdds(life, a, previous.statsSnapshot)! : null;
          return (
            <View key={a} style={styles.row}>
              <Text style={styles.attribute}>{ATTRIBUTE_LABELS[a]}</Text>
              <Text style={styles.odds}>{before !== null && now > before ? `${before}% → ${now}%` : `${now}%`}</Text>
            </View>
          );
        })}
        <Text style={styles.small}>Real-world quests and reflections grow your character’s stats, and higher stats mean better odds next time.</Text>
      </Card>

      {__DEV__ ? (
        <Card>
          <Label>Dev: preview an ending</Label>
          {life.endings.map((e) => (
            <Button
              key={e.id}
              title={e.name}
              variant="ghost"
              onPress={() => router.push({ pathname: '/life/play', params: { career: careerId, devEnding: e.id } })}
            />
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { ...type.body, fontSize: 15, color: day.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  attribute: { ...type.bodyMedium, fontSize: 15, color: day.text },
  odds: { ...type.label, fontSize: 12, color: day.primary },
  small: { ...type.small, fontSize: 13, color: day.textMuted },
});
