import { StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_IDS, ATTRIBUTE_LABELS, type AttributeId, type Stats } from '@/content/attributes';
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
}: {
  attribute: AttributeId;
  value: number;
  element: Element;
  ghost?: number;
  highlight?: boolean;
  note?: string;
}) {
  const band = bandFor(value);
  const color = bandColor(band, element);
  return (
    <View style={styles.row}>
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

export function StatList({
  stats,
  element,
  ghost,
  highlights = [],
  notes = {},
}: {
  stats: Stats;
  element: Element;
  ghost?: Stats;
  highlights?: AttributeId[];
  notes?: Partial<Record<AttributeId, string>>;
}) {
  const order = [...highlights, ...ATTRIBUTE_IDS.filter((a) => !highlights.includes(a))];
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
        />
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
  labels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  name: { fontFamily: F.bodyMedium, fontSize: 14, color: C.text },
  band: { fontFamily: F.body, fontSize: 12 },
  track: { height: 10, borderRadius: 3, backgroundColor: C.track, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3 },
  ghost: { position: 'absolute', left: 0, top: 0, bottom: 0, borderWidth: 1, borderColor: 'rgba(244, 241, 234, 0.55)', borderRadius: 3, borderStyle: 'dashed' },
  divider: { position: 'absolute', top: 0, bottom: 0, width: 2, marginLeft: -1, backgroundColor: C.nightDeep },
});
