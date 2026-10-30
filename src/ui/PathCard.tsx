import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import type { CareerMatch } from '@/logic/ranking';
import { Card, Label, useToneColors } from './components';
import { DifficultyPill } from './stats';
import { S, type } from './theme';

/** Career card: name, constellation, difficulty, one-liner and 2–3 reasons. */
export function PathCard({ match, rank, onPress }: { match: CareerMatch; rank?: number; onPress?: () => void }) {
  const career = CAREERS[match.careerId];
  const t = useToneColors();
  const body = (
    <Card>
      <View style={{ gap: 2 }}>
        {rank ? <Label>Path {rank}</Label> : null}
        <Text style={[styles.name, { color: t.text }]}>{career.name}</Text>
        <Text style={[styles.constellation, { color: t.textMuted }]}>✦  {career.constellation.name}</Text>
      </View>
      <DifficultyPill difficulty={match.difficulty} />
      <Text style={[styles.oneLiner, { color: t.text }]}>{career.oneLiner}</Text>
      <View style={{ gap: 4 }}>
        {match.reasons.map((r) => (
          <Text key={r} style={[styles.reason, { color: t.textMuted }]}>
            <Text style={{ color: t.highlight }}>✓ </Text>
            {r}
          </Text>
        ))}
      </View>
      {onPress ? <Text style={[styles.more, { color: t.highlight }]}>See path   →</Text> : null}
    </Card>
  );
  if (!onPress) return body;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.85 }}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  name: type.h2,
  constellation: { ...type.label, fontSize: 10, letterSpacing: 1.8 },
  oneLiner: { ...type.body, fontSize: 15, lineHeight: 22 },
  reason: type.small,
  more: { ...type.label, letterSpacing: 1.6, marginTop: S.xs },
});
