// Lives hub (cream, Life Sim Spec §12 screen 6): every career with a life, and how far you got.

import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import { LIFE_CAREER_IDS, LIVES } from '@/content/life';
import { rankingFor } from '@/logic/character';
import { endingsFound, LIFE_SLOTS, realAge } from '@/logic/life';
import { canPlayLife } from '@/logic/lifeAccess';
import { useGame } from '@/state/game';
import { activeRun, latestCompleted, useLives } from '@/state/lives';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { day, S, type } from '@/ui/theme';

/** Lives shown before "Show all". */
const SHOWN = 8;

export default function LivesHub() {
  const { game } = useGame();
  const { runs } = useLives();
  const [showAll, setShowAll] = useState(false);
  if (!game) return <Redirect href="/" />;
  const lived = LIFE_CAREER_IDS.filter((id) => latestCompleted(runs, id));
  // Lives you've started or finished first, then your matches in ranking order.
  const { ranked, notForMe } = rankingFor(game.character);
  const byMatch = [...ranked, ...notForMe].map((m) => m.careerId).filter((id) => LIFE_CAREER_IDS.includes(id));
  const touched = byMatch.filter((id) => runs.some((r) => r.career === id));
  const order = [...touched, ...byMatch.filter((id) => !touched.includes(id))];
  const shown = showAll ? order : order.slice(0, Math.max(SHOWN, touched.length));

  return (
    <Screen footer={<Button title="Back" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/explore'))} />}>
      <Title>Lives</Title>
      <Body muted>Live twelve years of a career, starting at your age, before you try it for real. Your real stats set the odds.</Body>

      {shown.map((id) => {
        const life = LIVES[id]!;
        const active = activeRun(runs, id);
        const found = endingsFound(life, runs).filter((f) => f.firstFoundAt).length;
        const locked = !canPlayLife(game, runs, id);
        const status = locked
          ? 'Locked: unlock to play'
          : active
            ? `In progress · age ${realAge(active, LIFE_SLOTS[Math.min(active.slotIndex, LIFE_SLOTS.length - 1)]!.age)}`
            : found
              ? `${found} of ${life.endings.length} endings found`
              : 'Not lived yet';
        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/life/[career]', params: { career: id } })}
            style={({ pressed }) => pressed && { opacity: 0.85 }}
          >
            <Card>
              <View style={styles.row}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.name}>{life.lifeName} life</Text>
                  <Text style={styles.career}>{CAREERS[id].name}</Text>
                </View>
                <Text style={styles.chevron}>{locked ? '🔒' : '→'}</Text>
              </View>
              <Label>{status}</Label>
            </Card>
          </Pressable>
        );
      })}
      {shown.length < order.length ? <Button title={`Show all ${order.length} lives`} variant="ghost" onPress={() => setShowAll(true)} /> : null}

      <Card>
        <Label>Compare lives</Label>
        <Text style={styles.body}>
          {!game.paid
            ? 'Unlock to compare lives side by side.'
            : lived.length < 2
              ? 'Finish lives in two different careers to compare them side by side.'
              : 'See your latest lives side by side: endings, roles and how each one felt.'}
        </Text>
        {game.paid && lived.length >= 2 ? <Button title="Compare lives" variant="secondary" onPress={() => router.push('/lives/compare')} /> : null}
        {!game.paid ? <Button title="Unlock every life" variant="secondary" onPress={() => router.push({ pathname: '/paywall', params: { life: '1' } })} /> : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  name: { ...type.h2, color: day.text },
  career: { ...type.small, color: day.textMuted },
  chevron: { fontSize: 18, color: day.primary },
  body: { ...type.body, fontSize: 15, lineHeight: 22, color: day.text },
});
