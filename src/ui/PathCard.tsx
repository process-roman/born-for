import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import type { CareerMatch } from '@/logic/ranking';
import { Card, Label } from './components';
import { DifficultyPill } from './stats';
import { C, F, S } from './theme';

/** Career card: name, constellation, difficulty, one-liner and 2–3 reasons. */
export function PathCard({ match, rank, onPress }: { match: CareerMatch; rank?: number; onPress?: () => void }) {
  const career = CAREERS[match.careerId];
  const body = (
    <Card>
      <View style={{ gap: 2 }}>
        {rank ? <Label>Path {rank}</Label> : null}
        <Text style={styles.name}>{career.name}</Text>
        <Text style={styles.constellation}>{career.constellation.name}</Text>
      </View>
      <DifficultyPill difficulty={match.difficulty} />
      <Text style={styles.oneLiner}>{career.oneLiner}</Text>
      <View style={{ gap: 4 }}>
        {match.reasons.map((r) => (
          <Text key={r} style={styles.reason}>
            ✦ {r}
          </Text>
        ))}
      </View>
      {onPress ? <Text style={styles.more}>See path ›</Text> : null}
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
  name: { fontFamily: F.display, fontSize: 19, color: C.text },
  constellation: { fontFamily: F.body, fontSize: 13, color: C.gold },
  oneLiner: { fontFamily: F.body, fontSize: 15, lineHeight: 22, color: C.text },
  reason: { fontFamily: F.body, fontSize: 14, lineHeight: 20, color: C.textMuted },
  more: { fontFamily: F.bodyMedium, fontSize: 14, color: C.gold, marginTop: S.xs },
});
