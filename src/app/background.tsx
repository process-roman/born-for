// "Anything else that's you?": optional chips for the sign's 8 background traits (Signs & Onboarding Spec §4).

import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_DESCRIPTIONS, ATTRIBUTE_LABELS } from '@/content/attributes';
import { SIGNS } from '@/content/signs';
import { backgroundTraits } from '@/logic/poll';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Screen, Step, Title } from '@/ui/components';
import { C, F, S } from '@/ui/theme';

export default function Background() {
  const { state, dispatch } = useOnboarding();
  if (!state.sign) return <Redirect href="/" />;
  const sign = SIGNS[state.sign];
  const traits = backgroundTraits(state.sign);
  const picked = traits.filter((a) => state.answers[a] === 'yes');

  return (
    <Screen
      footer={<Button title={picked.length ? `Add ${picked.length} and continue` : 'Nothing else, continue'} onPress={() => router.push('/called')} />}
    >
      <Step index={3} total={9} />
      <Title>Anything else that’s you?</Title>
      <Body muted>
        {sign.name} doesn’t usually lead with these, but plenty of {sign.name}s have them. Tap any that sound like you.
      </Body>
      <View style={{ gap: S.sm }}>
        {traits.map((a) => {
          const on = picked.includes(a);
          return (
            <Pressable
              key={a}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => dispatch({ type: 'answer', attribute: a, answer: on ? 'skip' : 'yes' })}
              style={({ pressed }) => [styles.trait, on && styles.traitOn, pressed && { opacity: 0.85 }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, on && { color: C.gold }]}>{ATTRIBUTE_LABELS[a]}</Text>
                <Text style={styles.desc}>{ATTRIBUTE_DESCRIPTIONS[a]}</Text>
              </View>
              <Text style={[styles.check, on && { color: C.gold, borderColor: C.gold }]}>{on ? '✓' : '+'}</Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  trait: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.night,
  },
  traitOn: { borderColor: C.gold, backgroundColor: C.goldSoft },
  name: { fontFamily: F.bodyMedium, fontSize: 16, color: C.text },
  desc: { fontFamily: F.body, fontSize: 13, color: C.textMuted, marginTop: 2 },
  check: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: C.border, textAlign: 'center', lineHeight: 26, color: C.textMuted, fontFamily: F.bodyBold },
});
