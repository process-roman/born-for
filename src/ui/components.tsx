import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { C, F, MAX_WIDTH, S } from './theme';

/** Deterministic star dots behind every screen. */
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
          style={{ position: 'absolute', left: s.left, top: s.top, width: s.size, height: s.size, borderRadius: s.size, backgroundColor: C.text, opacity: s.opacity }}
        />
      ))}
    </View>
  );
}

export function Screen({ children, footer, scroll = true }: { children: ReactNode; footer?: ReactNode; scroll?: boolean }) {
  const body = <View style={styles.content}>{children}</View>;
  return (
    <View style={styles.root}>
      <Starfield />
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
  );
}

export function Step({ index, total }: { index: number; total: number }) {
  return (
    <View style={styles.steps}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.stepDot, i < index && styles.stepDone, i === index && styles.stepCurrent]} />
      ))}
    </View>
  );
}

export function Title({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Body({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, muted && { color: C.textMuted }, style]}>{children}</Text>;
}

export function Label({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
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
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'ghost' && styles.buttonGhost,
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      <Text style={[styles.buttonText, variant === 'primary' ? { color: C.nightDeep } : { color: variant === 'ghost' ? C.textMuted : C.text }]}>
        {title}
      </Text>
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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && { opacity: 0.85 }, style]}
    >
      {emoji ? <Text style={styles.optionEmoji}>{emoji}</Text> : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.optionLabel}>{label}</Text>
        {detail ? <Text style={styles.optionDetail}>{detail}</Text> : null}
      </View>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Pill({ text, color = C.gold }: { text: string; color?: string }) {
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={[styles.pillText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.nightDeep },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', paddingHorizontal: S.lg, paddingTop: S.lg, paddingBottom: S.xl },
  content: { width: '100%', maxWidth: MAX_WIDTH, gap: S.lg, flexGrow: 1 },
  footer: { width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', paddingHorizontal: S.lg, paddingBottom: S.lg, gap: S.sm },
  steps: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: S.sm },
  stepDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.track },
  stepDone: { backgroundColor: C.goldBorder },
  stepCurrent: { backgroundColor: C.gold, width: 18 },
  title: { fontFamily: F.display, fontSize: 26, lineHeight: 34, color: C.text, textAlign: 'center' },
  body: { fontFamily: F.body, fontSize: 16, lineHeight: 23, color: C.text, textAlign: 'center' },
  label: { fontFamily: F.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: C.textMuted },
  button: { minHeight: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: S.xl },
  buttonPrimary: { backgroundColor: C.gold },
  buttonSecondary: { borderWidth: 1, borderColor: C.goldBorder, backgroundColor: C.goldSoft },
  buttonGhost: { minHeight: 44 },
  buttonText: { fontFamily: F.bodyBold, fontSize: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    minHeight: 60,
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.night,
  },
  optionSelected: { borderColor: C.gold, backgroundColor: C.goldSoft },
  optionEmoji: { fontSize: 22 },
  optionLabel: { fontFamily: F.bodyMedium, fontSize: 16, color: C.text },
  optionDetail: { fontFamily: F.body, fontSize: 13, lineHeight: 18, color: C.textMuted, marginTop: 2 },
  card: { borderRadius: 18, borderWidth: 1, borderColor: C.border, backgroundColor: C.night, padding: S.lg, gap: S.md },
  pill: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontFamily: F.bodyMedium, fontSize: 12 },
});
