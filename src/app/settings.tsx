// Settings: sign, reminders, recalibrate, delete data (Blueprint §12 screen 15).

import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { SIGNS } from '@/content/signs';
import { remindersOn } from '@/logic/game';
import { useGame } from '@/state/game';
import { remindersSupported } from '@/storage/notifications';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { C, F, glyph, S } from '@/ui/theme';

export default function Settings() {
  const { game, switchCuspSign, setReminders, reset } = useGame();
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
            <Text style={styles.hint}>We kept only your sign, not your birth date.</Text>
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
              thumbColor={C.text}
              accessibilityLabel="Check-in reminders"
            />
          </View>
        ) : (
          <Text style={styles.hint}>Reminders work in the phone app.</Text>
        )}
        <Text style={styles.hint}>One nudge per quest. No streaks, no guilt.</Text>
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
});
