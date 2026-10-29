// Q2b: "Any of these catch your eye?" Job chips inside the chosen worlds; picking none is fine.

import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { careersInWorld } from '@/content/careers';
import { WORLDS } from '@/content/worlds';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Label, Screen, Step, Title } from '@/ui/components';
import { C, F, S } from '@/ui/theme';

export default function Picks() {
  const { state, dispatch } = useOnboarding();
  if (!state.sign || state.worlds.length === 0) return <Redirect href="/worlds" />;
  const count = state.picks.length;

  return (
    <Screen
      footer={
        <Button
          title={count === 0 ? 'Skip, show me everything' : `Continue with ${count} ${count === 1 ? 'pick' : 'picks'}`}
          onPress={() => router.push('/work')}
        />
      }
    >
      <Step index={6} total={9} />
      <Title>Any of these catch your eye?</Title>
      <Body muted>Tap any jobs you’re curious about, even long shots. Not sure? Skip, and we’ll rank them all for you.</Body>
      {state.worlds.map((w) => (
        <View key={w} style={{ gap: S.sm }}>
          <Label>
            {WORLDS[w].emoji} {WORLDS[w].name}
          </Label>
          <View style={styles.chips}>
            {careersInWorld(w).map((c) => {
              const on = state.picks.includes(c.id);
              return (
                <Pressable
                  key={c.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  onPress={() => dispatch({ type: 'togglePick', careerId: c.id })}
                  style={({ pressed }) => [styles.chip, on && styles.chipOn, pressed && { opacity: 0.85 }]}
                >
                  <Text style={[styles.chipText, on && { color: C.gold }]}>
                    {on ? '✓ ' : ''}
                    {c.name}
                    {c.realityCheck ? ' ✦' : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
      <Text style={styles.legend}>✦ Long shot: still open, with an honest reality check.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  chip: { paddingHorizontal: S.md, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: C.border, backgroundColor: C.night },
  chipOn: { borderColor: C.gold, backgroundColor: C.goldSoft },
  chipText: { fontFamily: F.bodyMedium, fontSize: 14, color: C.text },
  legend: { fontFamily: F.body, fontSize: 12, color: C.textMuted },
});
