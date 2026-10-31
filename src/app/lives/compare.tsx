// Compare lives (cream, Life Sim Spec §12 screen 7): any two careers with a finished life, latest
// runs side by side.

import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CareerId } from '@/content/careers';
import { LIFE_CAREER_IDS, LIVES, METERS } from '@/content/life';
import type { LifeRun } from '@/logic/life';
import { useGame } from '@/state/game';
import { latestCompleted, useLives } from '@/state/lives';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { METER_LABELS } from '@/ui/lifeParts';
import { day, fonts, palette, radius, S, type } from '@/ui/theme';

const WOULD_WANT = { yes: 'Yes', maybe: 'Maybe', no: 'No' } as const;

function Column({ run }: { run: LifeRun }) {
  const life = LIVES[run.career]!;
  const ending = life.endings.find((e) => e.id === run.completed!.endingId)!;
  return (
    <Card style={styles.column}>
      <Label>{life.lifeName}</Label>
      <Text style={styles.ending}>{ending.name}</Text>
      <Text style={styles.role}>{run.completed!.role}</Text>
      <View style={{ gap: S.sm }}>
        {METERS.map((m) => (
          <View key={m} style={{ gap: 3 }}>
            <View style={styles.meterHead}>
              <Text style={styles.meterLabel}>{METER_LABELS[m]}</Text>
              <Text style={styles.meterValue}>{run.meters[m]}</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${run.meters[m]}%` }]} />
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.want}>Would want it: {run.completed!.wouldWant ? WOULD_WANT[run.completed!.wouldWant] : 'Not sure'}</Text>
    </Card>
  );
}

export default function CompareLives() {
  const { game } = useGame();
  const { runs } = useLives();
  const lived = LIFE_CAREER_IDS.filter((id) => latestCompleted(runs, id));
  const [picked, setPicked] = useState<CareerId[]>(() => lived.slice(0, 2));
  if (!game) return <Redirect href="/" />;

  const toggle = (id: CareerId) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p.slice(-1), id]));
  const shown = picked.map((id) => latestCompleted(runs, id)).filter((r): r is LifeRun => r !== null);

  return (
    <Screen footer={<Button title="Back" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/lives'))} />}>
      <Title>Compare lives</Title>
      {!game.paid || lived.length < 2 ? (
        <Body muted>{!game.paid ? 'Unlock to compare lives side by side.' : 'Finish lives in two different careers to compare them.'}</Body>
      ) : (
        <>
          <Body muted>Pick any two. Each shows your latest life in that career.</Body>
          <View style={styles.chips}>
            {lived.map((id) => (
              <Pressable
                key={id}
                accessibilityRole="button"
                accessibilityState={{ selected: picked.includes(id) }}
                onPress={() => toggle(id)}
                style={[styles.chip, picked.includes(id) && styles.chipOn]}
              >
                <Text style={styles.chipText}>{LIVES[id]!.lifeName}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.columns}>
            {shown.map((r) => (
              <Column key={r.id} run={r} />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  chip: { paddingHorizontal: S.md, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: day.line, backgroundColor: day.surface },
  chipOn: { borderColor: day.primary, backgroundColor: day.lavenderSoft },
  chipText: { ...type.bodyMedium, fontSize: 14, color: day.text },
  columns: { flexDirection: 'row', gap: S.sm, alignItems: 'stretch' },
  column: { flex: 1, padding: S.md },
  ending: { ...type.h3, color: day.text },
  role: { ...type.small, fontSize: 13, color: day.textMuted },
  meterHead: { flexDirection: 'row', justifyContent: 'space-between' },
  meterLabel: { ...type.label, fontSize: 9, letterSpacing: 1.4, color: day.textMuted },
  meterValue: { fontFamily: fonts.sansMedium, fontSize: 11, color: day.text },
  track: { height: 5, borderRadius: radius.pill, backgroundColor: day.track, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: palette.peach },
  want: { ...type.small, fontSize: 13, color: day.text },
});
