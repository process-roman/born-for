// Pieces of the life sim screens (Life Sim Spec §4, §5, §10, §12). Meters describe how the life is
// going; attributes set the odds. They're shown differently and never mixed.

import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { ATTRIBUTE_LABELS } from '@/content/attributes';
import { BONUS_LABELS, METERS, type Choice, type LifeEvent, type Meter, type Meters } from '@/content/life';
import { activeBonuses, oddsFor, type LifeRun } from '@/logic/life';
import { day, fonts, night, palette, radius, shadow, space, type } from './theme';

const useNativeDriver = Platform.OS !== 'web';

export const METER_LABELS: Record<Meter, string> = { joy: 'Joy', energy: 'Energy', money: 'Money', mastery: 'Mastery' };

function MeterBar({ meter, value, tone }: { meter: Meter; value: number; tone: 'day' | 'night' }) {
  const reduceMotion = useReducedMotion();
  const [width] = useState(() => new Animated.Value(value));
  useEffect(() => {
    Animated.timing(width, { toValue: value, duration: reduceMotion ? 0 : 600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start();
  }, [value, width, reduceMotion]);
  const muted = tone === 'day' ? day.textMuted : night.textMuted;
  return (
    <View style={styles.meter} accessible accessibilityLabel={`${METER_LABELS[meter]} ${value} of 100`}>
      <View style={styles.meterHead}>
        <Text style={[styles.meterLabel, { color: muted }]}>{METER_LABELS[meter]}</Text>
        <Text style={[styles.meterValue, { color: tone === 'day' ? day.text : night.text }]}>{value}</Text>
      </View>
      <View style={[styles.track, { backgroundColor: tone === 'day' ? day.track : night.track }]}>
        <Animated.View style={[styles.fill, { width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'], extrapolate: 'clamp' }) }]} />
      </View>
    </View>
  );
}

/** The four life meters as slim bars. */
export function MetersBar({ meters, tone = 'day' }: { meters: Meters; tone?: 'day' | 'night' }) {
  return (
    <View style={styles.meters}>
      {METERS.map((m) => (
        <MeterBar key={m} meter={m} value={meters[m]} tone={tone} />
      ))}
    </View>
  );
}

/** "+10 Mastery  −5 Energy" after an outcome. */
export function MeterDeltas({ deltas }: { deltas: Partial<Meters> }) {
  const entries = METERS.filter((m) => deltas[m]);
  if (entries.length === 0) return null;
  return (
    <View style={styles.deltas}>
      {entries.map((m) => {
        const d = deltas[m]!;
        return (
          <View key={m} style={[styles.delta, { backgroundColor: d > 0 ? day.lavenderSoft : day.accentSoft }]}>
            <Text style={styles.deltaText}>
              {d > 0 ? '+' : '−'}
              {Math.abs(d)} {METER_LABELS[m]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/** A choice with its trade-off hint and, for checks, the odds pill and any bonus. */
export function ChoiceButton({ choice, run, onPress, disabled }: { choice: Choice; run: LifeRun; onPress: () => void; disabled?: boolean }) {
  const odds = choice.check ? oddsFor(run.statsSnapshot, choice.check, run.flags) : null;
  const bonuses = choice.check ? activeBonuses(choice.check, run.flags) : [];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={odds !== null ? `${ATTRIBUTE_LABELS[choice.check!.attribute]} check, ${odds}% chance` : undefined}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.choice, pressed && { opacity: 0.85 }]}
    >
      <Text style={styles.choiceLabel}>{choice.label}</Text>
      {choice.hint ? <Text style={styles.choiceHint}>{choice.hint}</Text> : null}
      {odds !== null ? (
        <View style={styles.oddsRow}>
          <View style={styles.oddsPill}>
            <Text style={styles.oddsText}>
              {ATTRIBUTE_LABELS[choice.check!.attribute]} · {odds}%
            </Text>
          </View>
          {bonuses.map((b) => (
            <Text key={b.flag} style={styles.bonus}>
              +{b.value} from {BONUS_LABELS[b.flag] ?? b.flag.replace(/_/g, ' ')}
            </Text>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

/** Collapsed "REAL" note under the event text. Unverified notes only show in development. */
export function RealityNote({ note }: { note: NonNullable<LifeEvent['realityNote']> }) {
  const [open, setOpen] = useState(false);
  if (!note.verified && !__DEV__) return null;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen(!open)} style={styles.note}>
      <View style={styles.noteHead}>
        <Text style={styles.noteTag}>REAL</Text>
        <Text style={styles.noteToggle}>{open ? 'Hide' : 'What it’s really like'}</Text>
      </View>
      {open ? (
        <Text style={styles.noteText}>
          {note.text}
          {!note.verified ? ' (Unverified: dev builds only.)' : ''}
        </Text>
      ) : null}
    </Pressable>
  );
}

function StarShape({ size }: { size: number }) {
  const c = size / 2;
  return (
    <Svg width={size} height={size}>
      <Path d={`M${c},0 Q${c},${c} ${size},${c} Q${c},${c} ${c},${size} Q${c},${c} 0,${c} Q${c},${c} ${c},0 Z`} fill={palette.goldBright} />
    </Svg>
  );
}

/**
 * The roll (~1.2 s): a gold star falls across the sky; on success it lands and glows, on a fail it
 * fades. Tap to skip. Laid over the sky card.
 */
export function RollStar({ success, onDone }: { success: boolean; onDone: () => void }) {
  const reduceMotion = useReducedMotion();
  const [fall] = useState(() => new Animated.Value(0));
  const [end] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduceMotion) {
      onDone();
      return;
    }
    const animation = Animated.sequence([
      Animated.timing(fall, { toValue: 1, duration: 800, easing: Easing.in(Easing.quad), useNativeDriver }),
      Animated.timing(end, { toValue: 1, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver }),
    ]);
    animation.start(({ finished }) => finished && onDone());
    return () => animation.stop();
  }, [fall, end, onDone, reduceMotion]);

  const size = 28;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Skip" onPress={onDone} style={StyleSheet.absoluteFill}>
      <Animated.View
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          marginLeft: -size / 2,
          marginTop: -size / 2,
          opacity: success ? 1 : end.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          transform: [
            { translateX: fall.interpolate({ inputRange: [0, 1], outputRange: [-140, 0] }) },
            { translateY: fall.interpolate({ inputRange: [0, 1], outputRange: [-120, 0] }) },
            { scale: success ? end.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.9, 1.4] }) : end.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] }) },
          ],
        }}
      >
        {success ? (
          <Animated.View style={[styles.glow, { opacity: end.interpolate({ inputRange: [0, 1], outputRange: [0, 0.35] }) }]} />
        ) : null}
        <StarShape size={size} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  meters: { flexDirection: 'row', gap: space.md },
  meter: { flex: 1, gap: 4 },
  meterHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  meterLabel: { ...type.label, fontSize: 9, letterSpacing: 1.4 },
  meterValue: { fontFamily: fonts.sansMedium, fontSize: 11 },
  track: { height: 5, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: palette.peach },
  deltas: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  delta: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  deltaText: { ...type.label, fontSize: 10, letterSpacing: 1.4, color: day.primary },
  choice: { backgroundColor: day.surface, borderRadius: radius.md, borderWidth: 1, borderColor: day.line, padding: space.lg, gap: 4, ...shadow.soft },
  choiceLabel: { ...type.bodyMedium, color: day.text },
  choiceHint: { ...type.small, fontSize: 13, color: day.textMuted },
  oddsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.sm, marginTop: space.xs },
  oddsPill: { backgroundColor: day.lavenderSoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  oddsText: { ...type.label, fontSize: 10, letterSpacing: 1.6, color: day.primary },
  bonus: { ...type.small, fontSize: 12, color: day.textMuted },
  note: { borderLeftWidth: 2, borderLeftColor: day.gold, paddingLeft: space.md, gap: space.xs },
  noteHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  noteTag: { ...type.label, fontSize: 10, color: day.primary, backgroundColor: day.goldSoft, paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden' },
  noteToggle: { ...type.small, fontSize: 13, color: day.textMuted },
  noteText: { ...type.small, color: day.text },
  glow: { position: 'absolute', left: -14, top: -14, width: 56, height: 56, borderRadius: 28, backgroundColor: palette.goldBright },
});
