// Settings: sign, birth year, reminders, music and sounds, recalibrate, delete data (Blueprint §12 screen 15).

import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { SIGNS } from '@/content/signs';
import { ageOf } from '@/logic/character';
import { remindersOn } from '@/logic/game';
import type { FeelPrefs } from '@/logic/feel';
import { useFeel } from '@/state/feel';
import { useGame } from '@/state/game';
import { useLives } from '@/state/lives';
import { remindersSupported } from '@/storage/notifications';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { C, F, glyph, palette, radius, S } from '@/ui/theme';

const OLDEST_YEAR = 1920;

const FEEL_ROWS: { key: keyof FeelPrefs; label: string }[] = [
  { key: 'music', label: 'Calm music on the reveal and in lives' },
  { key: 'sounds', label: 'Sounds for stars, rolls and endings' },
  { key: 'haptics', label: 'Haptics' },
];

/** Birth year, so paths can show how long a route takes to start at your age. */
function BirthYearCard({ birthYear, age, onSave }: { birthYear: number | undefined; age: number | null; onSave: (year: number | null) => void }) {
  const [editing, setEditing] = useState(!birthYear);
  const [value, setValue] = useState(birthYear ? String(birthYear) : '');
  const [error, setError] = useState<string | null>(null);
  const save = () => {
    const year = Number(value);
    if (!Number.isInteger(year) || year < OLDEST_YEAR || year > new Date().getFullYear()) return setError('Try a four-digit year, like 1998.');
    setError(null);
    setEditing(false);
    onSave(year);
  };
  return (
    <Card>
      <Label>Your age</Label>
      {!editing && birthYear ? (
        <>
          <Text style={styles.value}>
            Born in {birthYear} · about {age}
          </Text>
          <Text style={styles.hint}>Used to show how long each path takes to start at your age. Never shared.</Text>
          <View style={{ flexDirection: 'row', gap: S.sm }}>
            <Button title="Change" variant="secondary" style={{ flex: 1 }} onPress={() => setEditing(true)} />
            <Button
              title="Remove"
              variant="ghost"
              style={{ flex: 1 }}
              onPress={() => {
                setValue('');
                setEditing(true);
                onSave(null);
              }}
            />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.hint}>Add your birth year so paths can account for your age, like how long retraining takes. Only the year is kept.</Text>
          <TextInput
            value={value}
            onChangeText={(t) => setValue(t.replace(/\D/g, '').slice(0, 4))}
            placeholder="YYYY"
            placeholderTextColor={C.grey}
            keyboardType="number-pad"
            maxLength={4}
            accessibilityLabel="Birth year"
            onSubmitEditing={save}
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Save" variant="secondary" disabled={value.length < 4} onPress={save} />
        </>
      )}
    </Card>
  );
}

export default function Settings() {
  const { game, switchCuspSign, setReminders, setBirthYear, reset } = useGame();
  const lives = useLives();
  const feel = useFeel();
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!game) return <Redirect href="/" />;
  const { character } = game;
  const sign = SIGNS[character.sign];
  const otherCuspSign = character.cuspSigns?.find((s) => s !== character.sign) ?? null;

  return (
    <Screen footer={<Button title="Back" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/character'))} />}>
      <Title>Settings</Title>

      <Card>
        <Label>Your sign</Label>
        <View style={styles.signRow}>
          <Text style={styles.glyph}>{glyph(character.sign)}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.value}>
              {sign.name}, {sign.archetype}
            </Text>
            <Text style={styles.hint}>We keep your sign and birth year, never your full birth date.</Text>
          </View>
        </View>
        {otherCuspSign ? (
          <>
            <Text style={styles.hint}>
              You were born on the cusp of {SIGNS[character.cuspSigns![0]].name} and {SIGNS[character.cuspSigns![1]].name}. Switching keeps your XP,
              stars and titles, and recalculates your starting stats.
            </Text>
            <Button title={`Switch to ${SIGNS[otherCuspSign].name}`} variant="secondary" onPress={() => switchCuspSign(otherCuspSign)} />
          </>
        ) : null}
      </Card>

      <BirthYearCard birthYear={character.birthYear} age={ageOf(character)} onSave={setBirthYear} />

      <Card>
        <Label>Your stats</Label>
        <Body muted style={{ textAlign: 'left' }}>
          Changed since day one? Rerun the poll. Only your starting stats change; everything you’ve earned stays.
        </Body>
        <Button title="Recalibrate my stats" variant="secondary" onPress={() => router.push('/recalibrate')} />
      </Card>

      <Card>
        <Label>Check-in reminders</Label>
        {remindersSupported ? (
          <View style={styles.toggle}>
            <Text style={[styles.value, { flex: 1 }]}>Offer a reminder when I start a quest</Text>
            <Switch
              value={remindersOn(game)}
              onValueChange={setReminders}
              trackColor={{ true: C.gold, false: C.track }}
              thumbColor={palette.white}
              accessibilityLabel="Check-in reminders"
            />
          </View>
        ) : (
          <Text style={styles.hint}>Reminders work in the phone app.</Text>
        )}
        <Text style={styles.hint}>One nudge per quest. No streaks, no guilt.</Text>
      </Card>

      <Card>
        <Label>Music and sounds</Label>
        {FEEL_ROWS.map((row) => (
          <View key={row.key} style={styles.toggle}>
            <Text style={[styles.value, { flex: 1 }]}>{row.label}</Text>
            <Switch
              value={feel.prefs[row.key]}
              onValueChange={(on) => feel.setPref(row.key, on)}
              trackColor={{ true: C.gold, false: C.track }}
              thumbColor={palette.white}
              accessibilityLabel={row.label}
            />
          </View>
        ))}
        <Text style={styles.hint}>Music and sounds stay off when your phone is on silent.</Text>
      </Card>

      <Card>
        <Label>Your data</Label>
        <Text style={styles.hint}>Your character is saved on this device. Accounts and cloud backup are coming later.</Text>
        <Button
          title={confirmDelete ? 'Tap again to delete everything' : 'Delete my character and data'}
          variant="ghost"
          onPress={() => {
            if (!confirmDelete) return setConfirmDelete(true);
            reset();
            lives.reset();
            router.replace('/');
          }}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  signRow: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  glyph: { fontSize: 32, color: C.gold },
  value: { fontFamily: F.bodyMedium, fontSize: 15, color: C.text },
  hint: { fontFamily: F.body, fontSize: 13, lineHeight: 19, color: C.textMuted },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.night,
    color: C.text,
    fontFamily: F.bodyMedium,
    fontSize: 20,
    textAlign: 'center',
  },
  error: { fontFamily: F.body, fontSize: 13, color: '#9C3D2B' },
});
