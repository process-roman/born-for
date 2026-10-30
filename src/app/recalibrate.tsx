// Recalibrate: rerun the poll on one screen; earned XP stays (Blueprint §4.6).

import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_LABELS, POLL_STATEMENTS, type AttributeId } from '@/content/attributes';
import { BADGES, type BadgeId } from '@/content/badges';
import { backgroundTraits, signatureTraits } from '@/logic/poll';
import type { PollAnswer, PollAnswers } from '@/logic/stats';
import { useGame } from '@/state/game';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { C, F, S } from '@/ui/theme';

const OPTIONS: { id: PollAnswer; label: string }[] = [
  { id: 'yes', label: 'That’s me' },
  { id: 'sometimes', label: 'Sometimes' },
  { id: 'no', label: 'Not really' },
];

export default function Recalibrate() {
  const { game, recalibrate } = useGame();
  const [answers, setAnswers] = useState<PollAnswers>(() => ({ ...(game?.character.answers ?? {}) }));
  const [earned, setEarned] = useState<BadgeId[] | null>(null);
  if (!game) return <Redirect href="/" />;
  const { sign } = game.character;
  const set = (a: AttributeId, value: PollAnswer) => setAnswers({ ...answers, [a]: answers[a] === value ? 'skip' : value });

  if (earned) {
    return (
      <Screen footer={<Button title="See my character" onPress={() => router.replace('/character')} />}>
        <Title>Stats updated</Title>
        <Body muted>Your starting stats now match who you are today. Everything you’ve earned is still there, and “Then vs now” shows the change.</Body>
        {earned.map((id) => (
          <Card key={id} style={{ alignItems: 'center' }}>
            <Label>Badge unlocked</Label>
            <Text style={styles.badge}>
              {BADGES[id].emoji} {BADGES[id].name}
            </Text>
          </Card>
        ))}
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <>
          <Button title="Save my stats" onPress={() => setEarned(recalibrate(answers))} />
          <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
        </>
      }
    >
      <Title>Recalibrate</Title>
      <Body muted>Answer for who you are now. Leave one unselected to keep your sign’s value.</Body>

      <Label>Signature traits</Label>
      {signatureTraits(sign).map((a) => (
        <Card key={a} style={{ gap: S.sm }}>
          <Text style={styles.trait}>{ATTRIBUTE_LABELS[a]}</Text>
          <Text style={styles.statement}>“{POLL_STATEMENTS[a]}”</Text>
          <View style={styles.options}>
            {OPTIONS.map((o) => {
              const on = answers[a] === o.id;
              return (
                <Pressable
                  key={o.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  onPress={() => set(a, o.id)}
                  style={[styles.option, on && styles.optionOn]}
                >
                  <Text style={[styles.optionText, on && { color: C.gold }]}>{o.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ))}

      <Label>Anything else that’s you?</Label>
      <View style={styles.chips}>
        {backgroundTraits(sign).map((a) => {
          const on = answers[a] === 'yes';
          return (
            <Pressable
              key={a}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => set(a, 'yes')}
              style={[styles.chip, on && styles.optionOn]}
            >
              <Text style={[styles.optionText, on && { color: C.gold }]}>{ATTRIBUTE_LABELS[a]}</Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  trait: { fontFamily: F.display, fontSize: 16, color: C.text },
  statement: { fontFamily: F.body, fontStyle: 'italic', fontSize: 14, lineHeight: 20, color: C.textMuted },
  options: { flexDirection: 'row', gap: S.sm },
  option: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: C.border },
  optionOn: { borderColor: C.gold, backgroundColor: C.goldSoft },
  optionText: { fontFamily: F.bodyMedium, fontSize: 13, color: C.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  chip: { paddingHorizontal: S.md, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: C.border, backgroundColor: C.night },
  badge: { fontFamily: F.display, fontSize: 20, color: C.text },
});
