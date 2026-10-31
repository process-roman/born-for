// Life at 30 (Life Sim Spec §8): a full-screen night card for a finished life, the "Would you
// want this life?" question, and a 1080×1920 share image without the private parts.

import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_LABELS } from '@/content/attributes';
import type { CareerLife } from '@/content/life';
import { AGE_AT_END, fillTokens, highlightsFor, lifeAsks, NO_HIGHLIGHTS_LINE, type LifeRun, type LifeTokens } from '@/logic/life';
import { shareViewAsImage } from '@/storage/shareImage';
import { Button, Card, Label, Screen } from './components';
import { MetersBar } from './lifeParts';
import { LifeSky } from './LifeSky';
import { fonts, night, palette, radius, S, type } from './theme';

type WouldWant = NonNullable<NonNullable<LifeRun['completed']>['wouldWant']>;

const ANSWERS: { id: WouldWant; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'maybe', label: 'Maybe' },
  { id: 'no', label: 'No' },
];

/** Title, ending, role: shared by the card and the share image. */
function Headline({ life, run, tokens }: { life: CareerLife; run: LifeRun; tokens: LifeTokens }) {
  const ending = life.endings.find((e) => e.id === run.completed!.endingId)!;
  return (
    <View style={styles.headline}>
      <Label>Life at 30 · {life.lifeName}</Label>
      <Text style={styles.title}>{tokens.title}</Text>
      <Text style={styles.ending}>{ending.name}</Text>
      <Text style={styles.endingText}>{fillTokens(ending.text, tokens)}</Text>
      <View style={styles.rolePill}>
        <Text style={styles.role}>{run.completed!.role}</Text>
      </View>
    </View>
  );
}

function Highlights({ run }: { run: LifeRun }) {
  const highlights = highlightsFor(run);
  return (
    <View style={{ gap: S.sm }}>
      {highlights.length ? (
        highlights.map((h) => (
          <View key={h} style={styles.highlight}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.highlightText}>{h}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.highlightText}>{NO_HIGHLIGHTS_LINE}</Text>
      )}
    </View>
  );
}

/** The share image: scene, title, ending, role, meters, highlights and the app name. No asks, no answer. */
function ShareCard({ life, run, tokens }: { life: CareerLife; run: LifeRun; tokens: LifeTokens }) {
  const ending = life.endings.find((e) => e.id === run.completed!.endingId)!;
  const highlights = highlightsFor(run);
  return (
    <View style={styles.shareCard}>
      <LifeSky age={AGE_AT_END} meters={run.meters} element={run.element} variant="card" style={{ aspectRatio: 1.7 }} />
      <View style={styles.headline}>
        <Text style={styles.shareLabel}>Life at 30 · {life.lifeName}</Text>
        <Text style={styles.shareTitle}>{tokens.title}</Text>
        <Text style={styles.shareEnding}>{ending.name}</Text>
        <Text style={styles.shareText}>{fillTokens(ending.text, tokens)}</Text>
        <Text style={styles.role}>{run.completed!.role}</Text>
      </View>
      <MetersBar meters={run.meters} tone="night" />
      <View style={{ gap: 4 }}>
        {(highlights.length ? highlights : [NO_HIGHLIGHTS_LINE]).map((h) => (
          <Text key={h} style={styles.shareHighlight}>
            {highlights.length ? '★  ' : ''}
            {h}
          </Text>
        ))}
      </View>
      <Text style={styles.brand}>☾  BORN FOR</Text>
    </View>
  );
}

export function LifeAt30({
  life,
  run,
  tokens,
  onAnswer,
  preview,
}: {
  life: CareerLife;
  run: LifeRun;
  tokens: LifeTokens;
  /** Saves the "Would you want this life?" answer on the run. */
  onAnswer: (answer: WouldWant) => void;
  /** Dev preview of a forced ending: nothing is saved. */
  preview?: boolean;
}) {
  const [skipped, setSkipped] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const shareRef = useRef<ComponentRef<typeof View>>(null);
  const answer = run.completed!.wouldWant;
  const answered = Boolean(answer) || skipped;
  const { asks, powerUp } = lifeAsks(run);

  const share = async () => {
    try {
      const ok = await shareViewAsImage(shareRef, `My ${life.lifeName} life at 30`);
      if (!ok) setShareNote('Sharing isn’t available on this device.');
      else setSharing(false);
    } catch {
      setShareNote('Couldn’t make the image. Try again.');
    }
  };

  return (
    <Screen
      tone="night"
      footer={
        answered ? (
          <>
            <View style={styles.row}>
              <Button title="Share" variant="secondary" style={styles.half} onPress={() => setSharing(true)} />
              <Button title="Power up" variant="secondary" style={styles.half} onPress={() => router.push({ pathname: '/path/[id]', params: { id: run.career } })} />
            </View>
            <Button title="Live another life" onPress={() => router.replace('/explore')} />
            <Button title="Replay" variant="ghost" onPress={() => router.replace({ pathname: '/life/[career]', params: { career: run.career } })} />
          </>
        ) : undefined
      }
    >
      {preview ? <Text style={styles.preview}>Dev preview: nothing here is saved.</Text> : null}
      <LifeSky age={AGE_AT_END} meters={run.meters} element={run.element} variant="card" />
      <Headline life={life} run={run} tokens={tokens} />
      <MetersBar meters={run.meters} tone="night" />

      <Card>
        <Label>Highlights</Label>
        <Highlights run={run} />
      </Card>

      {asks.length ? (
        <Card>
          <Label>What this life asked of you</Label>
          {asks.map((a) => (
            <Text key={a.attribute} style={styles.ask}>
              <Text style={styles.askName}>{ATTRIBUTE_LABELS[a.attribute]}</Text> · checked {a.count} {a.count === 1 ? 'time' : 'times'} · your odds {a.odds}%
            </Text>
          ))}
          {powerUp ? <Text style={styles.powerUp}>This life leaned on {ATTRIBUTE_LABELS[powerUp]}. Raise it for real.</Text> : null}
        </Card>
      ) : null}

      <Card>
        <Label>Would you want this life?</Label>
        <View style={styles.row}>
          {ANSWERS.map((o) => (
            <Pressable
              key={o.id}
              accessibilityRole="button"
              accessibilityState={{ selected: answer === o.id }}
              onPress={() => onAnswer(o.id)}
              style={[styles.answer, answer === o.id && styles.answerOn]}
            >
              <Text style={[styles.answerText, answer === o.id && { color: palette.plumDeep }]}>{o.label}</Text>
            </Pressable>
          ))}
        </View>
        {!answered ? <Button title="Not sure" variant="ghost" onPress={() => setSkipped(true)} /> : null}
      </Card>

      <Modal visible={sharing} transparent animationType="fade" onRequestClose={() => setSharing(false)}>
        <View style={styles.modal}>
          <View ref={shareRef} collapsable={false}>
            <ShareCard life={life} run={run} tokens={tokens} />
          </View>
          {shareNote ? <Text style={styles.shareNote}>{shareNote}</Text> : null}
          <View style={[styles.row, { width: SHARE_WIDTH }]}>
            <Button title="Cancel" variant="ghost" style={styles.half} onPress={() => setSharing(false)} />
            <Button title="Share image" style={styles.half} onPress={share} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

/** Rendered at 320×569 and captured at 1080×1920. */
const SHARE_WIDTH = 320;

const styles = StyleSheet.create({
  headline: { alignItems: 'center', gap: S.xs },
  title: { ...type.h1, color: night.text, textAlign: 'center' },
  ending: { fontFamily: fonts.serifItalic, fontSize: 26, lineHeight: 30, color: night.accent, textAlign: 'center' },
  endingText: { ...type.body, color: night.text, textAlign: 'center' },
  rolePill: { marginTop: S.xs, borderWidth: 1, borderColor: night.line, borderRadius: radius.pill, paddingHorizontal: S.md, paddingVertical: 4 },
  role: { ...type.label, color: night.gold },
  highlight: { flexDirection: 'row', gap: S.sm, alignItems: 'flex-start' },
  star: { color: night.gold, fontSize: 14, lineHeight: 22 },
  highlightText: { ...type.body, fontSize: 15, lineHeight: 22, color: night.text, flex: 1 },
  ask: { ...type.small, color: night.textMuted },
  askName: { fontFamily: fonts.sansMedium, color: night.text },
  powerUp: { fontFamily: fonts.serifItalic, fontSize: 19, lineHeight: 24, color: night.text },
  row: { flexDirection: 'row', gap: S.sm },
  half: { flex: 1, paddingHorizontal: S.sm },
  answer: { flex: 1, alignItems: 'center', paddingVertical: S.md, borderRadius: radius.pill, borderWidth: 1, borderColor: night.line },
  answerOn: { backgroundColor: palette.peach, borderColor: palette.peach },
  answerText: { ...type.button, color: night.text },
  preview: { ...type.label, color: night.accent, textAlign: 'center' },
  modal: { flex: 1, backgroundColor: 'rgba(42, 30, 58, 0.92)', alignItems: 'center', justifyContent: 'center', gap: S.lg, padding: S.lg },
  shareCard: { width: SHARE_WIDTH, aspectRatio: 9 / 16, backgroundColor: night.bg, borderWidth: 1, borderColor: night.line, padding: S.lg, gap: S.sm, justifyContent: 'space-between' },
  shareNote: { ...type.small, color: night.text },
  shareLabel: { ...type.label, fontSize: 9, color: night.gold },
  shareTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 28, color: night.text, textAlign: 'center' },
  shareEnding: { fontFamily: fonts.serifItalic, fontSize: 19, lineHeight: 22, color: night.accent, textAlign: 'center' },
  shareText: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 17, color: night.text, textAlign: 'center' },
  shareHighlight: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 16, color: night.text },
  brand: { ...type.label, color: night.gold, textAlign: 'center' },
});
