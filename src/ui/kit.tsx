// Building blocks for the cream "day" look and the plum "night" cards. All values come from theme.ts.

import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { archGradient, day, MAX_WIDTH, night, palette, radius, shadow, space, type } from './theme';

/** Cream daytime screen with a dark status bar. */
export function DayScreen({ children }: { children: ReactNode }) {
  return (
    <View style={styles.dayRoot}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export function SectionLabel({ children, tone = 'day', style }: { children: ReactNode; tone?: 'day' | 'night'; style?: StyleProp<TextStyle> }) {
  return <Text style={[type.label, { color: tone === 'day' ? day.textMuted : night.gold }, style]}>{children}</Text>;
}

/** Small tracked-caps tag line, e.g. "TASTE · 20 MIN · +80 XP". */
export function Tag({ parts, tone = 'day' }: { parts: string[]; tone?: 'day' | 'night' }) {
  return <Text style={[type.label, { color: tone === 'day' ? day.textMuted : night.textMuted }]}>{parts.join('  ·  ')}</Text>;
}

/** White card with a soft shadow. */
export function SurfaceCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

/** Deep plum card with a faint dusk gradient, for archetype, constellations and other magic. */
export function PlumCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.plumCard, style]}>
      <LinearGradient colors={[palette.plum, palette.plumMid]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

export function PillButton({
  title,
  onPress,
  variant = 'primary',
  arrow,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'text';
  arrow?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const color = variant === 'primary' ? day.onPrimary : day.primary;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        variant === 'primary' && styles.pillPrimary,
        variant === 'outline' && styles.pillOutline,
        variant === 'text' && styles.pillText,
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      <Text style={[variant === 'text' ? styles.textButton : type.button, { color }]}>
        {title}
        {arrow ? '   →' : ''}
      </Text>
    </Pressable>
  );
}

/** Slim progress bar: plum-tinted track, peach fill. */
export function SlimBar({ progress, tone = 'day' }: { progress: number; tone?: 'day' | 'night' }) {
  const pct = `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}%` as const;
  return (
    <View style={[styles.track, { backgroundColor: tone === 'day' ? day.track : night.track }]}>
      <View style={[styles.fill, { width: pct }]} />
    </View>
  );
}

/** Round soft-colored icon badge used on feature tiles. */
export function IconBadge({ symbol, tint }: { symbol: string; tint: 'lavender' | 'peach' | 'gold' }) {
  const bg = tint === 'lavender' ? day.lavenderSoft : tint === 'peach' ? day.accentSoft : day.goldSoft;
  return (
    <View style={[styles.iconBadge, { backgroundColor: bg }]}>
      <Text style={{ fontSize: 20, color: day.primary }}>{symbol}</Text>
    </View>
  );
}

const STARS: readonly [number, number, number][] = [
  [0.22, 0.14, 2],
  [0.7, 0.1, 1.5],
  [0.48, 0.24, 2.5],
  [0.82, 0.3, 1.5],
  [0.3, 0.36, 1.5],
  [0.62, 0.44, 2],
];

/**
 * The recurring arch window motif: a dusk-gradient placeholder with a few stars, a moon and a thin
 * gold orbit. Children render inside the arch (e.g. the character).
 */
export function ArchWindow({ width, height, children }: { width: number; height: number; children?: ReactNode }) {
  return (
    <View style={{ width: width + 32, height: height + 24, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View
        pointerEvents="none"
        style={[styles.orbit, { width: width * 1.25, height: width * 0.5, top: height * 0.18, transform: [{ rotate: '-18deg' }] }]}
      />
      <View style={[styles.arch, { width, height, borderTopLeftRadius: width / 2, borderTopRightRadius: width / 2 }]}>
        <LinearGradient colors={archGradient} style={StyleSheet.absoluteFill} />
        {STARS.map(([x, y, d], i) => (
          <View key={i} style={{ position: 'absolute', left: x * width, top: y * height, width: d, height: d, borderRadius: d, backgroundColor: palette.starlight }} />
        ))}
        <View style={[styles.moon, { right: width * 0.16, top: height * 0.16, width: width * 0.16, height: width * 0.16, borderRadius: width * 0.08 }]} />
        <View style={styles.archContent}>{children}</View>
      </View>
      <Text style={[styles.sparkle, { top: 0, right: 8 }]}>✦</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dayRoot: { flex: 1, backgroundColor: day.bg },
  scroll: { flexGrow: 1, alignItems: 'center', paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.xxxl },
  content: { width: '100%', maxWidth: MAX_WIDTH, gap: space.xl },
  surface: { backgroundColor: day.surface, borderRadius: radius.lg, padding: space.lg, gap: space.md, ...shadow.soft },
  plumCard: { borderRadius: radius.lg, padding: space.xl, gap: space.md, overflow: 'hidden', ...shadow.lifted },
  pill: { minHeight: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  pillPrimary: { backgroundColor: day.primary, ...shadow.soft },
  pillOutline: { borderWidth: 1, borderColor: day.primary },
  pillText: { minHeight: 40, paddingHorizontal: space.sm },
  textButton: { ...type.label, letterSpacing: 1.6 },
  track: { height: 6, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: palette.peach },
  iconBadge: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  arch: { overflow: 'hidden', borderBottomLeftRadius: 4, borderBottomRightRadius: 4, ...shadow.lifted },
  archContent: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: space.lg },
  moon: { position: 'absolute', backgroundColor: palette.peachSoft, opacity: 0.9 },
  orbit: { position: 'absolute', borderWidth: 1, borderColor: day.gold, borderRadius: 999, opacity: 0.55 },
  sparkle: { position: 'absolute', color: day.gold, fontSize: 18 },
});
