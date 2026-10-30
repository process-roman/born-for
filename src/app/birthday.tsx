// Birthday → sign, with the cusp prompt and manual sign choice (Blueprint §3 step 2, §4.7).

import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { SIGN_IDS, SIGNS, type SignId } from '@/content/signs';
import { isValidBirthDate, signFromBirthday } from '@/logic/birthday';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Label, OptionCard, Screen, Step, Title } from '@/ui/components';
import { C, F, glyph, radius, S, shadow } from '@/ui/theme';

const OLDEST_YEAR = 1920;

type Mode = { kind: 'date' } | { kind: 'cusp'; signs: [SignId, SignId] } | { kind: 'manual' };

export default function Birthday() {
  const { dispatch } = useOnboarding();
  const [mode, setMode] = useState<Mode>({ kind: 'date' });
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState<string | null>(null);
  const monthRef = useRef<ComponentRef<typeof TextInput>>(null);
  const yearRef = useRef<ComponentRef<typeof TextInput>>(null);

  const choose = (sign: SignId, cuspSigns: [SignId, SignId] | null = null) => {
    dispatch({ type: 'sign', sign, cuspSigns });
    router.push('/reveal');
  };

  const submit = () => {
    const date = { year: Number(year), month: Number(month), day: Number(day) };
    const thisYear = new Date().getFullYear();
    if (!isValidBirthDate(date) || date.year < OLDEST_YEAR || date.year > thisYear) {
      setError('That date doesn’t look right. Try DD / MM / YYYY.');
      return;
    }
    setError(null);
    const result = signFromBirthday(date);
    if (result.kind === 'sign') choose(result.sign);
    else setMode({ kind: 'cusp', signs: result.signs });
  };

  if (mode.kind === 'cusp') {
    const [a, b] = mode.signs;
    return (
      <Screen footer={<Button title="Back" variant="ghost" onPress={() => setMode({ kind: 'date' })} />}>
        <Step index={1} total={9} />
        <Title>You were born on the cusp</Title>
        <Body muted>
          The Sun moved from {SIGNS[a].name} into {SIGNS[b].name} around your birthday. Which one feels like you? You can change this later in
          settings.
        </Body>
        <View style={{ gap: S.sm }}>
          {mode.signs.map((s) => (
            <OptionCard
              key={s}
              emoji={glyph(s)}
              label={`${SIGNS[s].name}, ${SIGNS[s].archetype}`}
              detail={SIGNS[s].revealLine}
              onPress={() => choose(s, mode.signs)}
            />
          ))}
        </View>
      </Screen>
    );
  }

  if (mode.kind === 'manual') {
    return (
      <Screen footer={<Button title="Use my birthday instead" variant="ghost" onPress={() => setMode({ kind: 'date' })} />}>
        <Step index={1} total={9} />
        <Title>Choose your sign</Title>
        <View style={styles.grid}>
          {SIGN_IDS.map((s) => (
            <Pressable key={s} accessibilityRole="button" onPress={() => choose(s)} style={({ pressed }) => [styles.signTile, pressed && { borderColor: C.gold }]}>
              <Text style={styles.signGlyph}>{glyph(s)}</Text>
              <Text style={styles.signName}>{SIGNS[s].name}</Text>
            </Pressable>
          ))}
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <>
          <Button title="Reveal my character" onPress={submit} disabled={!day || !month || year.length < 4} />
          <Button title="Choose my sign instead" variant="ghost" onPress={() => setMode({ kind: 'manual' })} />
        </>
      }
    >
      <Step index={1} total={9} />
      <Title>When were you born?</Title>
      <Body muted>We only use it to find your sign. We don’t keep your birth date.</Body>
      <View style={{ gap: S.sm, marginTop: S.lg }}>
        <View style={styles.inputLabels}>
          <Label style={{ flex: 2 }}>Day</Label>
          <Label style={{ flex: 2 }}>Month</Label>
          <Label style={{ flex: 4 }}>Year</Label>
        </View>
        <View style={styles.inputs}>
          <TextInput
            value={day}
            onChangeText={(t) => {
              const digits = t.replace(/D/g, '').slice(0, 2);
              setDay(digits);
              if (digits.length === 2) monthRef.current?.focus();
            }}
            placeholder="DD"
            placeholderTextColor={C.grey}
            keyboardType="number-pad"
            maxLength={2}
            style={[styles.input, { flex: 2 }]}
            accessibilityLabel="Day"
          />
          <TextInput
            ref={monthRef}
            value={month}
            onChangeText={(t) => {
              const digits = t.replace(/\D/g, '').slice(0, 2);
              setMonth(digits);
              if (digits.length === 2) yearRef.current?.focus();
            }}
            placeholder="MM"
            placeholderTextColor={C.grey}
            keyboardType="number-pad"
            maxLength={2}
            style={[styles.input, { flex: 2 }]}
            accessibilityLabel="Month"
          />
          <TextInput
            ref={yearRef}
            value={year}
            onChangeText={(t) => setYear(t.replace(/\D/g, '').slice(0, 4))}
            placeholder="YYYY"
            placeholderTextColor={C.grey}
            keyboardType="number-pad"
            maxLength={4}
            style={[styles.input, { flex: 4 }]}
            accessibilityLabel="Year"
            onSubmitEditing={submit}
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputLabels: { flexDirection: 'row', gap: S.sm },
  inputs: { flexDirection: 'row', gap: S.sm },
  input: {
    minWidth: 0,
    height: 60,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.night,
    color: C.text,
    fontFamily: F.bodyMedium,
    fontSize: 22,
    textAlign: 'center',
  },
  error: { fontFamily: F.body, fontSize: 14, color: '#9C3D2B', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm, justifyContent: 'center' },
  signTile: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: C.night,
    ...shadow.soft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.xs,
  },
  signGlyph: { fontSize: 28, color: C.gold },
  signName: { fontFamily: F.bodyMedium, fontSize: 14, color: C.text },
});
