// Start a quest: pick when, and opt into a check-in reminder in context (Blueprint §4.3).

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { CAREER_IDS, getQuest, type CareerId, type StarNumber } from '@/content/careers';
import { canStartQuest, checkInTime, remindersOn, type WhenChoice } from '@/logic/game';
import { useGame } from '@/state/game';
import { remindersSupported } from '@/storage/notifications';
import { Body, Button, Label, OptionCard, Screen, Title } from '@/ui/components';
import { QuestCard } from '@/ui/quest';
import { C, F, palette, S } from '@/ui/theme';

const DAYS_AHEAD = 7;

export default function QuestStart() {
  const params = useLocalSearchParams<{ career: string; star: string }>();
  const { game, startQuest } = useGame();
  const [when, setWhen] = useState<WhenChoice['kind']>('today');
  const [day, setDay] = useState(1);
  const [remind, setRemind] = useState(() => remindersSupported && (!game || remindersOn(game)));
  const [busy, setBusy] = useState(false);

  const careerId = params.career as CareerId;
  const star = Number(params.star) as StarNumber;
  if (!game) return <Redirect href="/" />;
  if (!CAREER_IDS.includes(careerId) || !canStartQuest(game, careerId, star)) return <Redirect href="/home" />;
  const quest = getQuest(careerId, star);

  const days = Array.from({ length: DAYS_AHEAD }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });
  const choice: WhenChoice = when === 'day' ? { kind: 'day', date: days[day - 1]! } : { kind: when };
  const checkIn = checkInTime(choice, new Date());

  const start = async () => {
    setBusy(true);
    await startQuest(careerId, star, choice, remind);
    if (router.canDismiss()) router.dismissAll();
    router.replace('/home');
  };

  return (
    <Screen
      footer={
        <>
          <Button title={busy ? 'Starting…' : 'Start quest'} disabled={busy} onPress={start} />
          <Button title="Back" variant="ghost" onPress={() => router.back()} />
        </>
      }
    >
      <Title>Your quest awaits</Title>
      <QuestCard careerId={careerId} quest={quest} />
      {game.activeQuest ? <Body muted>This replaces your current quest. Its star stays dim until you come back to it.</Body> : null}

      <Label>When will you do it?</Label>
      <View style={{ gap: S.sm }}>
        <OptionCard emoji="🌙" label="Today" selected={when === 'today'} onPress={() => setWhen('today')} />
        <OptionCard emoji="☀️" label="This weekend" selected={when === 'weekend'} onPress={() => setWhen('weekend')} />
        <OptionCard emoji="📅" label="Pick a day" selected={when === 'day'} onPress={() => setWhen('day')} />
      </View>
      {when === 'day' ? (
        <View style={styles.days}>
          {days.map((d, i) => (
            <Pressable
              key={d.toDateString()}
              accessibilityRole="button"
              accessibilityState={{ selected: day === i + 1 }}
              onPress={() => setDay(i + 1)}
              style={[styles.day, day === i + 1 && styles.dayOn]}
            >
              <Text style={styles.dayName}>{d.toLocaleDateString(undefined, { weekday: 'short' })}</Text>
              <Text style={styles.dayNum}>{d.getDate()}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {remindersSupported ? (
        <View style={styles.remind}>
          <View style={{ flex: 1 }}>
            <Text style={styles.remindTitle}>Want a reminder to check in?</Text>
            <Text style={styles.remindSub}>
              {checkIn.toLocaleDateString(undefined, { weekday: 'long' })} at {checkIn.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}. One
              nudge, no streaks.
            </Text>
          </View>
          <Switch value={remind} onValueChange={setRemind} trackColor={{ true: C.gold, false: C.track }} thumbColor={palette.white} />
        </View>
      ) : (
        <Body muted>Check-in reminders work in the phone app. On the web, come back to Home when you’re done.</Body>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  days: { flexDirection: 'row', gap: 6, justifyContent: 'space-between' },
  day: { flex: 1, alignItems: 'center', paddingVertical: S.sm, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.night },
  dayOn: { borderColor: C.gold, backgroundColor: C.goldSoft },
  dayName: { fontFamily: F.body, fontSize: 11, color: C.textMuted },
  dayNum: { fontFamily: F.bodyBold, fontSize: 16, color: C.text },
  remind: { flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.lg, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.night },
  remindTitle: { fontFamily: F.bodyMedium, fontSize: 15, color: C.text },
  remindSub: { fontFamily: F.body, fontSize: 13, lineHeight: 18, color: C.textMuted, marginTop: 2 },
});
