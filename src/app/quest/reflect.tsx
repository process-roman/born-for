// Reflection: enjoyment, would you do more, what felt natural, what felt hard (Blueprint §3 step 14).

import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_IDS, ATTRIBUTE_LABELS, type AttributeId } from '@/content/attributes';
import { getQuest } from '@/content/careers';
import type { Reflection, WouldDoMore } from '@/logic/character';
import { MAX_FELT_NATURAL } from '@/logic/xp';
import { useGame } from '@/state/game';
import { Button, Label, Screen, Title } from '@/ui/components';
import { C, F, S } from '@/ui/theme';

const FACES = ['😞', '🙁', '😐', '🙂', '😍'] as const;
const MORE: { id: WouldDoMore; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'maybe', label: 'Maybe' },
  { id: 'no', label: 'No' },
];

function Chips({ selected, onToggle, max }: { selected: AttributeId[]; onToggle: (a: AttributeId) => void; max?: number }) {
  return (
    <View style={styles.chips}>
      {ATTRIBUTE_IDS.map((a) => {
        const on = selected.includes(a);
        const full = max !== undefined && selected.length >= max && !on;
        return (
          <Pressable
            key={a}
            accessibilityRole="button"
            accessibilityState={{ selected: on, disabled: full }}
            disabled={full}
            onPress={() => onToggle(a)}
            style={[styles.chip, on && styles.chipOn, full && { opacity: 0.4 }]}
          >
            <Text style={[styles.chipText, on && { color: C.gold }]}>{ATTRIBUTE_LABELS[a]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Reflect() {
  const { game, finish } = useGame();
  const [enjoyment, setEnjoyment] = useState<Reflection['enjoyment'] | null>(null);
  const [more, setMore] = useState<WouldDoMore | null>(null);
  const [natural, setNatural] = useState<AttributeId[]>([]);
  const [hard, setHard] = useState<AttributeId[]>([]);
  if (!game?.activeQuest) return <Redirect href="/home" />;
  const quest = getQuest(game.activeQuest.careerId, game.activeQuest.star);
  const toggle = (list: AttributeId[], set: (l: AttributeId[]) => void) => (a: AttributeId) =>
    set(list.includes(a) ? list.filter((x) => x !== a) : [...list, a]);

  const submit = (reflection: Reflection | null) => {
    finish(reflection);
    router.replace('/rewards');
  };

  return (
    <Screen
      footer={
        <>
          <Button
            title="Light my star"
            disabled={!enjoyment || !more}
            onPress={() => submit({ enjoyment: enjoyment!, wouldDoMore: more!, feltNatural: natural, feltHard: hard })}
          />
          <Button title="Skip reflection (less XP)" variant="ghost" onPress={() => submit(null)} />
        </>
      }
    >
      <Label style={{ textAlign: 'center' }}>{quest.name}</Label>
      <Title>How did it go?</Title>

      <Label>How much did you enjoy it?</Label>
      <View style={styles.faces}>
        {FACES.map((face, i) => {
          const value = (i + 1) as Reflection['enjoyment'];
          return (
            <Pressable
              key={face}
              accessibilityRole="button"
              accessibilityLabel={`${value} of 5`}
              accessibilityState={{ selected: enjoyment === value }}
              onPress={() => setEnjoyment(value)}
              style={[styles.face, enjoyment === value && styles.faceOn]}
            >
              <Text style={{ fontSize: 28 }}>{face}</Text>
            </Pressable>
          );
        })}
      </View>

      <Label>Would you do more of this?</Label>
      <View style={styles.more}>
        {MORE.map((o) => (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            accessibilityState={{ selected: more === o.id }}
            onPress={() => setMore(o.id)}
            style={[styles.moreOption, more === o.id && styles.chipOn]}
          >
            <Text style={[styles.chipText, more === o.id && { color: C.gold }]}>{o.label}</Text>
          </Pressable>
        ))}
      </View>

      <Label>What felt natural? (up to {MAX_FELT_NATURAL})</Label>
      <Chips selected={natural} onToggle={toggle(natural, setNatural)} max={MAX_FELT_NATURAL} />

      <Label>What felt hard?</Label>
      <Chips selected={hard} onToggle={toggle(hard, setHard)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  faces: { flexDirection: 'row', justifyContent: 'space-between' },
  face: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, backgroundColor: C.night },
  faceOn: { borderColor: C.gold, backgroundColor: C.goldSoft },
  more: { flexDirection: 'row', gap: S.sm },
  moreOption: { flex: 1, alignItems: 'center', paddingVertical: S.md, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.night },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  chip: { paddingHorizontal: S.md, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: C.border, backgroundColor: C.night },
  chipOn: { borderColor: C.gold, backgroundColor: C.goldSoft },
  chipText: { fontFamily: F.bodyMedium, fontSize: 14, color: C.text },
});
