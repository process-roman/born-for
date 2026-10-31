// Playing a life (Life Sim Spec §12 screens 2–5): event (cream) → roll → outcome → stage
// transition (night) → … → Life at 30 (night). The run is saved after every choice and resumes
// exactly where the user left off.

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_LABELS } from '@/content/attributes';
import { CAREER_IDS, type CareerId } from '@/content/careers';
import { lifeFor, SHARED_EVENTS, STAGE_NAMES, type Stage } from '@/content/life';
import { SIGNS } from '@/content/signs';
import { powerUpQuest } from '@/logic/game';
import { ageFor, choose, eventById, fillTokens, lifeAsks, stageFor, visibleChoices, type LifeRun, type LifeTokens, type Resolution } from '@/logic/life';
import { lifeWithEnding } from '@/logic/lifeDev';
import { statsOf } from '@/logic/character';
import { hybridTitle } from '@/logic/titles';
import { useGame } from '@/state/game';
import { activeRun, latestCompleted, useLives } from '@/state/lives';
import { Button, Card, Label, Screen } from '@/ui/components';
import { LifeAt30 } from '@/ui/LifeAt30';
import { LifeIcon } from '@/ui/lifeIcons';
import { ChoiceButton, MeterDeltas, MetersBar, RealityNote, RollStar } from '@/ui/lifeParts';
import { LifeSky } from '@/ui/LifeSky';
import { day, fonts, night, palette, radius, S, type } from '@/ui/theme';

type Phase =
  | { kind: 'event' }
  | { kind: 'rolling'; res: Resolution; before: LifeRun }
  | { kind: 'outcome'; res: Resolution; before: LifeRun }
  | { kind: 'transition'; stage: Stage; age: number }
  | { kind: 'done'; runId: string };

const TRANSITION_MS = 1500;

function ageLabel(age: number, stage: Stage) {
  return `Age ${age}  ·  ${STAGE_NAMES[stage]}`;
}

function TopBar({ label, onMenu }: { label: string; onMenu: () => void }) {
  return (
    <View style={styles.topBar}>
      <Pressable accessibilityRole="button" accessibilityLabel="Leave for now" onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} style={styles.iconButton}>
        <Text style={styles.iconText}>‹</Text>
      </Pressable>
      <Label>{label}</Label>
      <Pressable accessibilityRole="button" accessibilityLabel="Life menu" onPress={onMenu} style={styles.iconButton}>
        <Text style={styles.iconText}>⋯</Text>
      </Pressable>
    </View>
  );
}

function Menu({ onRestart, onClose }: { onRestart: () => void; onClose: () => void }) {
  return (
    <Card>
      <Label>Life menu</Label>
      <Button title="Restart life" variant="secondary" onPress={onRestart} />
      <Text style={styles.small}>Restarting discards this run. Finished lives are kept.</Text>
      <Button title="Keep playing" variant="ghost" onPress={onClose} />
    </Card>
  );
}

/** Stage transition: the sky moves to the new age and the stage name appears. Tap to skip. */
function Transition({ stage, age, run, onDone }: { stage: Stage; age: number; run: LifeRun; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);
  return (
    <Screen tone="night" scroll={false}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${STAGE_NAMES[stage]}, age ${age}. Tap to continue.`} onPress={onDone} style={styles.transition}>
        <LifeSky age={age} meters={run.meters} element={run.element} variant="full" />
        <View style={styles.transitionText} pointerEvents="none">
          <Text style={styles.transitionAge}>Age {age}</Text>
          <Text style={styles.transitionStage}>{STAGE_NAMES[stage]}</Text>
        </View>
      </Pressable>
    </Screen>
  );
}

export default function LifePlay() {
  const { career, devEnding } = useLocalSearchParams<{ career: string; devEnding?: string }>();
  const { game, finishLife, setLifeWant } = useGame();
  const { runs, save, discard } = useLives();
  const careerId = career as CareerId;
  const life = CAREER_IDS.includes(careerId) ? lifeFor(careerId) : null;
  const active = life ? activeRun(runs, careerId) : null;
  const latest = life ? latestCompleted(runs, careerId) : null;
  const [phase, setPhase] = useState<Phase>(() => (active ? { kind: 'event' } : latest ? { kind: 'done', runId: latest.id } : { kind: 'event' }));
  const [menu, setMenu] = useState(false);
  /** Quest XP from finishing this life, shown on the card (first completion only). */
  const [lifeXp, setLifeXp] = useState(0);
  const toEvent = useCallback(() => setPhase({ kind: 'event' }), []);
  const rolled = useCallback(() => setPhase((p) => (p.kind === 'rolling' ? { kind: 'outcome', res: p.res, before: p.before } : p)), []);
  // Dev only: a real life that reached the requested ending, never saved.
  const [preview, setPreview] = useState<LifeRun | null>(() => {
    if (!__DEV__ || !devEnding || !game || !life) return null;
    const { sign } = game.character;
    return lifeWithEnding(life, SHARED_EVENTS, { id: 'preview', career: careerId, startedAt: new Date().toISOString(), stats: statsOf(game.character), element: SIGNS[sign].element }, devEnding);
  });

  if (!game || !life) return <Redirect href="/" />;
  const sign = SIGNS[game.character.sign];
  const tokens: LifeTokens = { archetype: sign.archetype.replace(/^The /, ''), sign: sign.name, title: hybridTitle(game.character.sign, careerId) };

  const powerUp = (run: LifeRun) => {
    const star = powerUpQuest(game, careerId, lifeAsks(run).powerUp);
    if (star) router.push({ pathname: '/quest/start', params: { career: careerId, star: String(star) } });
    else router.push({ pathname: '/path/[id]', params: { id: careerId } });
  };

  if (preview?.completed) {
    return (
      <LifeAt30
        life={life}
        run={preview}
        tokens={tokens}
        preview
        free={!game.paid}
        onPowerUp={() => powerUp(preview)}
        onAnswer={(wouldWant) => setPreview({ ...preview, completed: { ...preview.completed!, wouldWant } })}
      />
    );
  }

  if (phase.kind === 'done') {
    const run = runs.find((r) => r.id === phase.runId);
    if (!run?.completed) return <Redirect href={{ pathname: '/life/[career]', params: { career: careerId } }} />;
    return (
      <LifeAt30
        life={life}
        run={run}
        tokens={tokens}
        free={!game.paid}
        xp={lifeXp}
        onPowerUp={() => powerUp(run)}
        onAnswer={(wouldWant) => {
          save({ ...run, completed: { ...run.completed!, wouldWant } });
          setLifeWant(careerId, wouldWant);
        }}
      />
    );
  }

  if (phase.kind === 'transition') {
    return <Transition stage={phase.stage} age={phase.age} run={active ?? runs.at(-1)!} onDone={toEvent} />;
  }

  if (phase.kind === 'rolling' || phase.kind === 'outcome') {
    const { res, before } = phase;
    const age = ageFor(before, res.event);
    const stage = stageFor(before, res.event);
    const meters = phase.kind === 'rolling' ? before.meters : res.run.meters;
    const next = () => {
      if (res.run.completed) return setPhase({ kind: 'done', runId: res.run.id });
      const nextEvent = eventById(life, SHARED_EVENTS, res.run.pendingEventId!);
      const nextStage = stageFor(res.run, nextEvent);
      if (nextStage !== stage) setPhase({ kind: 'transition', stage: nextStage, age: ageFor(res.run, nextEvent) });
      else setPhase({ kind: 'event' });
    };
    return (
      <Screen footer={phase.kind === 'outcome' ? <Button title={res.run.completed ? 'See your life at 30' : 'Continue'} onPress={next} /> : undefined}>
        <TopBar label={ageLabel(age, stage)} onMenu={() => setMenu(!menu)} />
        <View>
          <LifeSky age={age} meters={meters} element={before.element} variant="card" />
          {phase.kind === 'rolling' ? <RollStar success={res.check!.success} onDone={rolled} /> : null}
        </View>
        <MetersBar meters={meters} />
        <Card>
          <Text style={styles.chosen}>{res.choice.label}</Text>
          {res.check ? (
            <Label>
              {ATTRIBUTE_LABELS[res.check.attribute]} · {res.check.odds}%
              {phase.kind === 'outcome' ? (res.check.success ? '  ·  It worked' : '  ·  Not this time') : '  ·  Rolling…'}
            </Label>
          ) : null}
          {phase.kind === 'outcome' ? (
            <>
              <Text style={styles.body}>{fillTokens(res.outcome.text, tokens)}</Text>
              <MeterDeltas deltas={res.deltas} />
              {res.outcome.effects.highlight ? (
                <View style={styles.toast}>
                  <Text style={styles.toastText}>★ {res.outcome.effects.highlight}</Text>
                </View>
              ) : null}
            </>
          ) : null}
        </Card>
      </Screen>
    );
  }

  // Event on screen.
  if (!active?.pendingEventId) return <Redirect href={{ pathname: '/life/[career]', params: { career: careerId } }} />;
  const event = eventById(life, SHARED_EVENTS, active.pendingEventId);
  const age = ageFor(active, event);
  const stage = stageFor(active, event);
  const signLine = event.signLines?.[active.element];

  const pick = (choiceId: string) => {
    const res = choose(life, SHARED_EVENTS, active, choiceId);
    save(res.run);
    if (res.run.completed) setLifeXp(finishLife(careerId));
    setMenu(false);
    setPhase(res.check ? { kind: 'rolling', res, before: active } : { kind: 'outcome', res, before: active });
  };

  return (
    <Screen>
      <TopBar label={ageLabel(age, stage)} onMenu={() => setMenu(!menu)} />
      {menu ? (
        <Menu
          onClose={() => setMenu(false)}
          onRestart={() => {
            discard(careerId);
            router.replace({ pathname: '/life/[career]', params: { career: careerId } });
          }}
        />
      ) : null}
      <LifeSky age={age} meters={active.meters} element={active.element} variant="card" />
      <MetersBar meters={active.meters} />
      <View style={styles.eventHead}>
        <LifeIcon name={event.icon} color={day.gold} size={30} />
        <Text style={styles.title}>{event.title}</Text>
      </View>
      <Text style={styles.body}>{fillTokens(event.text, tokens)}</Text>
      {signLine ? <Text style={styles.signLine}>{fillTokens(signLine, tokens)}</Text> : null}
      {event.realityNote ? <RealityNote note={event.realityNote} /> : null}
      <View style={{ gap: S.sm }}>
        {visibleChoices(event, active).map((c) => (
          <ChoiceButton key={c.id} choice={c} run={active} onPress={() => pick(c.id)} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: day.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20, lineHeight: 22, color: day.primary },
  eventHead: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  title: { ...type.h2, color: day.text, flex: 1 },
  body: { ...type.body, color: day.text },
  signLine: { fontFamily: fonts.serifItalic, fontSize: 19, lineHeight: 24, color: day.textMuted },
  chosen: { ...type.h3, color: day.text },
  small: { ...type.small, fontSize: 13, color: day.textMuted },
  toast: { alignSelf: 'flex-start', backgroundColor: day.primary, borderRadius: radius.pill, paddingHorizontal: S.md, paddingVertical: 6 },
  toastText: { ...type.small, fontSize: 13, fontFamily: fonts.sansMedium, color: palette.starlight },
  transition: { flex: 1 },
  transitionText: {
    position: 'absolute',
    alignSelf: 'center',
    top: '70%',
    alignItems: 'center',
    gap: S.xs,
    paddingHorizontal: S.xl,
    paddingVertical: S.md,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(42, 30, 58, 0.72)',
  },
  transitionAge: { ...type.label, color: night.text },
  transitionStage: { fontFamily: fonts.serifMedium, fontSize: 44, lineHeight: 48, color: night.text },
});
