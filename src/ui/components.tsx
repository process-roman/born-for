// Shared screen building blocks. Every screen is either a cream "day" screen or a deep plum "night"
// scene (Screen's `tone`); the components inside pick their colors from that tone.

import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MAX_WIDTH, radius, shadow, space, tones, type, type Tone, type ToneColors } from './theme';

const ToneContext = createContext<Tone>('day');

export function useTone(): Tone {
  return useContext(ToneContext);
}

export function useToneColors(): ToneColors {
  return tones[useContext(ToneContext)];
}

/** Deterministic star dots behind night scenes. */
const STARS = (() => {
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 70 }, () => ({
    left: `${rand() * 100}%` as const,
    top: `${rand() * 100}%` as const,
    size: rand() < 0.85 ? 1.5 : 2.5,
    opacity: 0.15 + rand() * 0.45,
  }));
})();

function Starfield() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {STARS.map((s, i) => (
        <View
          key={i}
          style={{ position: 'absolute', left: s.left, top: s.top, width: s.size, height: s.size, borderRadius: s.size, backgroundColor: tones.night.text, opacity: s.opacity }}
        />
      ))}
    </View>
  );
}

export function Screen({ children, footer, scroll = true, tone = 'day' }: { children: ReactNode; footer?: ReactNode; scroll?: boolean; tone?: Tone }) {
  const body = <View style={styles.content}>{children}</View>;
  return (
    <ToneContext.Provider value={tone}>
      <View style={[styles.root, { backgroundColor: tones[tone].bg }]}>
        <StatusBar style={tone === 'day' ? 'dark' : 'light'} />
        {tone === 'night' ? <Starfield /> : null}
        <SafeAreaView style={styles.safe}>
          {scroll ? (
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
              {body}
            </ScrollView>
          ) : (
            <View style={[styles.scroll, { flex: 1 }]}>{body}</View>
          )}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </SafeAreaView>
      </View>
    </ToneContext.Provider>
  );
}

export function Step({ index, total }: { index: number; total: number }) {
  const t = useToneColors();
  return (
    <View style={styles.steps}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.stepDot,
            { backgroundColor: t.track },
            i < index && { backgroundColor: t.fill },
            i === index && { backgroundColor: t.highlight, width: 18 },
          ]}
        />
      ))}
    </View>
  );
}

export function Title({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const t = useToneColors();
  return <Text style={[styles.title, { color: t.text }, style]}>{children}</Text>;
}

export function Body({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: StyleProp<TextStyle> }) {
  const t = useToneColors();
  return <Text style={[styles.body, { color: muted ? t.textMuted : t.text }, style]}>{children}</Text>;
}

export function Label({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const tone = useTone();
  return <Text style={[type.label, { color: tone === 'day' ? tones.day.textMuted : tones.night.highlight }, style]}>{children}</Text>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useToneColors();
  const color = variant === 'primary' ? t.onPrimary : variant === 'ghost' ? t.textMuted : t.text;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && [styles.buttonPrimary, { backgroundColor: t.primary }],
        variant === 'secondary' && { borderWidth: 1, borderColor: t.selectedBorder },
        variant === 'ghost' && styles.buttonGhost,
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      <Text style={[variant === 'ghost' ? styles.ghostText : type.button, { color }]}>{title}</Text>
    </Pressable>
  );
}

export function OptionCard({
  emoji,
  label,
  detail,
  selected,
  onPress,
  style,
}: {
  emoji?: string;
  label: string;
  detail?: string;
  selected?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useToneColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { backgroundColor: t.surface, borderColor: t.line },
        selected && { borderColor: t.selectedBorder, backgroundColor: t.surfaceSoft },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {emoji ? <Text style={styles.optionEmoji}>{emoji}</Text> : null}
      <View style={{ flex: 1 }}>
        <Text style={[styles.optionLabel, { color: t.text }]}>{label}</Text>
        {detail ? <Text style={[styles.optionDetail, { color: t.textMuted }]}>{detail}</Text> : null}
      </View>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const tone = useTone();
  return <View style={[styles.card, tone === 'day' ? styles.cardDay : styles.cardNight, style]}>{children}</View>;
}

export function Pill({ text, color }: { text: string; color?: string }) {
  const t = useToneColors();
  const c = color ?? t.highlight;
  return (
    <View style={[styles.pill, { borderColor: c }]}>
      <Text style={[styles.pillText, { color: c }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', paddingHorizontal: space.lg, paddingTop: space.lg, paddingBottom: space.xl },
  content: { width: '100%', maxWidth: MAX_WIDTH, gap: space.lg, flexGrow: 1 },
  footer: { width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.sm },
  steps: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: space.sm },
  stepDot: { width: 6, height: 6, borderRadius: 3 },
  title: { ...type.h1, textAlign: 'center' },
  body: { ...type.body, textAlign: 'center' },
  button: { minHeight: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  buttonPrimary: shadow.soft,
  buttonGhost: { minHeight: 44 },
  ghostText: { ...type.label, letterSpacing: 1.6 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 60,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  optionEmoji: { fontSize: 22 },
  optionLabel: type.bodyMedium,
  optionDetail: { ...type.small, fontSize: 13, lineHeight: 18, marginTop: 2 },
  card: { borderRadius: radius.lg, padding: space.lg, gap: space.md },
  cardDay: { backgroundColor: tones.day.surface, ...shadow.soft },
  cardNight: { backgroundColor: tones.night.surface, borderWidth: 1, borderColor: tones.night.line },
  pill: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontFamily: type.label.fontFamily, fontSize: 12 },
});
