import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Character } from '@/logic/character';
import { CAREERS } from '@/content/careers';
import type { CareerMatch } from '@/logic/ranking';
import { Card, Label, useToneColors } from './components';
import { DifficultyPill } from './stats';
import { S, type } from './theme';

/** Career card: name, constellation, difficulty, one-liner and 2–3 reasons. */
export function PathCard({ match, rank, onPress, character }: { match: CareerMatch; rank?: number; onPress?: () => void; character?: Character }) {
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
      <Text style={[styles.oneLiner, { color: t.textMuted }]}>Character trait fit · not a qualification</Text>
      <Text style={[styles.oneLiner, { color: t.text }]}>{career.oneLiner}</Text>
      <View style={{ gap: 4 }}>
        <Label>Interests and character traits</Label>
        {match.reasons.map((r) => (
          <Text key={r} style={[styles.reason, { color: t.textMuted }]}>
            <Text style={{ color: t.highlight }}>✓ </Text>
            {r}
          </Text>
        ))}
      </View>
      {character ? <Text style={[styles.reason, { color: t.textMuted }]}>Real-world practice: {character.stars[match.careerId]?.length ? `${character.stars[match.careerId]!.length} completed on this path; self-reported practice, not certification.` : 'No quests completed on this path yet.'}</Text> : null}
      {onPress ? <Text style={[styles.more, { color: t.highlight }]}>See path   →</Text> : null}
    </Card>
  );
  if (!onPress) return body;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${career.name}, ${match.difficulty.label}`} accessibilityHint="Opens this path" onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.85 }}>
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
