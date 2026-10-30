import { StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_IDS, ATTRIBUTE_LABELS, FAMILIES, type AttributeId, type Stats } from '@/content/attributes';
import type { Element } from '@/content/signs';
import type { Difficulty } from '@/logic/difficulty';
import { bandFor } from '@/logic/stats';
import { useToneColors } from './components';
import { bandColor, palette, radius, S, tones, type } from './theme';

/** Slim plum-tinted bar with a peach fill and a small-caps band label. `ghost` marks an earlier value (the sign's prediction, or day one) with a tick. */
export function StatBar({
  attribute,
  value,
  element,
  ghost,
  highlight,
  note,
  dim,
}: {
  attribute: AttributeId;
  value: number;
  element: Element;
  ghost?: number;
  highlight?: boolean;
  note?: string;
  /** Background traits the user hasn't confirmed or trained yet. */
  dim?: boolean;
}) {
  const t = useToneColors();
  const band = bandFor(value);
  return (
    <View style={[styles.row, dim && { opacity: 0.45 }]}>
      <View style={styles.labels}>
        <Text style={[styles.name, { color: t.text }]}>
          {highlight ? <Text style={{ color: t.highlight }}>★ </Text> : null}
          {ATTRIBUTE_LABELS[attribute]}
        </Text>
        <Text style={[styles.band, { color: t.textMuted }]}>
          {note ? `${note} · ` : ''}
          {band}
        </Text>
      </View>
      <View>
        <View style={[styles.track, { backgroundColor: t.track }]}>
          <View style={[styles.fill, { width: `${value}%`, backgroundColor: bandColor(band, element) }]} />
        </View>
        {ghost !== undefined ? <View style={[styles.tick, { left: `${ghost}%`, backgroundColor: t.highlight }]} /> : null}
      </View>
    </View>
  );
}

/** `attributes` limits and orders the list (default: all 16, highlights first). */
/** Legend swatch for the `ghost` tick. */
export function TickLegend({ children }: { children: string }) {
  const t = useToneColors();
  return (
    <View style={styles.legend}>
      <View style={[styles.legendTick, { backgroundColor: t.highlight }]} />
      <Text style={[styles.legendText, { color: t.textMuted }]}>{children}</Text>
    </View>
  );
}

export function StatList({
  stats,
  element,
  attributes,
  ghost,
  highlights = [],
  notes = {},
  dimmed = [],
}: {
  stats: Stats;
  element: Element;
  attributes?: readonly AttributeId[];
  ghost?: Stats;
  highlights?: AttributeId[];
  notes?: Partial<Record<AttributeId, string>>;
  dimmed?: readonly AttributeId[];
}) {
  const order = attributes ?? [...highlights, ...ATTRIBUTE_IDS.filter((a) => !highlights.includes(a))];
  return (
    <View style={{ gap: S.md }}>
      {order.map((a) => (
        <StatBar
          key={a}
          attribute={a}
          value={stats[a]}
          element={element}
          ghost={ghost?.[a]}
          highlight={highlights.includes(a)}
          note={notes[a]}
          dim={dimmed.includes(a)}
        />
      ))}
    </View>
  );
}

/** All 16 traits grouped into the four families, for the character sheet. */
export function TraitSheet(props: Omit<Parameters<typeof StatList>[0], 'attributes'>) {
  const t = useToneColors();
  return (
    <View style={{ gap: S.lg }}>
      {FAMILIES.map((f) => (
        <View key={f.id} style={{ gap: S.sm }}>
          <Text style={[styles.family, { color: t.text }]}>
            {f.name} <Text style={[styles.familyBlurb, { color: t.textMuted }]}>· {f.blurb}</Text>
          </Text>
          <StatList {...props} attributes={f.traits} />
        </View>
      ))}
    </View>
  );
}

/** Soft tint per level; text stays plum so it reads at small size. */
const DIFFICULTY_TINTS = { 1: palette.plumSoft, 2: palette.goldSoft, 3: palette.peachSoft } as const;

export function DifficultyPill({ difficulty }: { difficulty: Difficulty }) {
  return (
    <View style={[styles.difficulty, { backgroundColor: DIFFICULTY_TINTS[difficulty.level] }]}>
      <Text style={styles.difficultyText}>
        {'★'.repeat(difficulty.level)}  {difficulty.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 6 },
  family: type.h3,
  familyBlurb: { ...type.small, fontSize: 13 },
  labels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: S.sm },
  name: { fontFamily: type.bodyMedium.fontFamily, fontSize: 14 },
  band: { ...type.label, fontSize: 10, letterSpacing: 1.8 },
  track: { height: 6, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: radius.pill },
  tick: { position: 'absolute', top: -3, width: 2, height: 12, marginLeft: -1, borderRadius: 1 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  legendTick: { width: 2, height: 12, borderRadius: 1 },
  legendText: { ...type.small, fontSize: 12, lineHeight: 16, flex: 1 },
  difficulty: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  difficultyText: { ...type.label, fontSize: 10, letterSpacing: 1.6, color: tones.day.primary },
});
