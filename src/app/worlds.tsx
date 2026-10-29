// Q2: "Which worlds pull you?" (pick up to 3). Direction first (Signs & Onboarding Spec §3).

import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MAX_WORLDS, WORLD_IDS, WORLDS } from '@/content/worlds';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Screen, Step, Title } from '@/ui/components';
import { C, F, S } from '@/ui/theme';

export default function Worlds() {
  const { state, dispatch } = useOnboarding();
  if (!state.sign) return <Redirect href="/" />;
  const full = state.worlds.length >= MAX_WORLDS;

  return (
    <Screen footer={<Button title="Continue" disabled={state.worlds.length === 0} onPress={() => router.push('/picks')} />}>
      <Step index={5} total={9} />
      <Title>Which worlds pull you?</Title>
      <Body muted>
        Pick up to {MAX_WORLDS}. Go with your gut; you can explore every world later. ({state.worlds.length}/{MAX_WORLDS})
      </Body>
      <View style={styles.grid}>
        {WORLD_IDS.map((id) => {
          const w = WORLDS[id];
          const on = state.worlds.includes(id);
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={w.name}
              onPress={() => dispatch({ type: 'toggleWorld', world: id })}
              style={({ pressed }) => [styles.tile, on && styles.tileOn, !on && full && { opacity: 0.4 }, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.emoji}>{w.emoji}</Text>
              <Text style={[styles.name, on && { color: C.gold }]}>{w.name}</Text>
              <Text style={styles.blurb}>{w.blurb}</Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  tile: { width: '48.5%', minHeight: 112, padding: S.md, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.night, gap: 4 },
  tileOn: { borderColor: C.gold, backgroundColor: C.goldSoft },
  emoji: { fontSize: 24 },
  name: { fontFamily: F.bodyMedium, fontSize: 14, lineHeight: 18, color: C.text },
  blurb: { fontFamily: F.body, fontSize: 12, lineHeight: 16, color: C.textMuted },
});
