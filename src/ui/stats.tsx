import { StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_IDS, ATTRIBUTE_LABELS, FAMILIES, type AttributeId, type Stats } from '@/content/attributes';
import type { Element } from '@/content/signs';
import type { Difficulty } from '@/logic/difficulty';
import { bandFor } from '@/logic/stats';
import { Pill } from './components';
import { bandColor, C, F, S } from './theme';

const SEGMENTS = 10;

/** Segmented like a game HP bar. `ghost` outlines the sign's prediction behind the value. */
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
  const band = bandFor(value);
  const color = bandColor(band, element);
  return (
    <View style={[styles.row, dim && { opacity: 0.45 }]}>
      <View style={styles.labels}>
        <Text style={[styles.name, highlight && { color: C.gold }]}>
          {highlight ? '★ ' : ''}
          {ATTRIBUTE_LABELS[attribute]}
        </Text>
        <Text style={[styles.band, { color }]}>
          {note ? `${note} · ` : ''}
          {band}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
        {ghost !== undefined ? <View style={[styles.ghost, { width: `${ghost}%` }]} /> : null}
        {Array.from({ length: SEGMENTS - 1 }, (_, i) => (
          <View key={i} style={[styles.divider, { left: `${((i + 1) * 100) / SEGMENTS}%` }]} />
        ))}
      </View>
    </View>
  );
}

/** `attributes` limits and orders the list (default: all 16, highlights first). */
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
  return (
    <View style={{ gap: S.lg }}>
      {FAMILIES.map((f) => (
        <View key={f.id} style={{ gap: S.sm }}>
          <Text style={styles.family}>
            {f.name} <Text style={styles.familyBlurb}>· {f.blurb}</Text>
          </Text>
          <StatList {...props} attributes={f.traits} />
        </View>
      ))}
    </View>
  );
}

const DIFFICULTY_COLORS = { 1: '#7DB46C', 2: C.gold, 3: '#F2784B' } as const;

export function DifficultyPill({ difficulty }: { difficulty: Difficulty }) {
  return <Pill text={`${'★'.repeat(difficulty.level)} ${difficulty.label}`} color={DIFFICULTY_COLORS[difficulty.level]} />;
}

const styles = StyleSheet.create({
  row: { gap: 6 },
  family: { fontFamily: F.display, fontSize: 15, color: C.gold },
  familyBlurb: { fontFamily: F.body, fontSize: 13, color: C.textMuted },
  labels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  name: { fontFamily: F.bodyMedium, fontSize: 14, color: C.text },
  band: { fontFamily: F.body, fontSize: 12 },
  track: { height: 10, borderRadius: 3, backgroundColor: C.track, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3 },
  ghost: { position: 'absolute', left: 0, top: 0, bottom: 0, borderWidth: 1, borderColor: 'rgba(244, 241, 234, 0.55)', borderRadius: 3, borderStyle: 'dashed' },
  divider: { position: 'absolute', top: 0, bottom: 0, width: 2, marginLeft: -1, backgroundColor: C.nightDeep },
});
