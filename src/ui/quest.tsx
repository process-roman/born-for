import { StyleSheet, Text, View } from 'react-native';

import { CAREERS, type CareerId, type Quest, type QuestTier } from '@/content/careers';
import { QUEST_XP, REFLECTION_XP } from '@/logic/xp';
import { Card, Label } from './components';
import { C, F, S } from './theme';

export const TIER_LABELS: Record<QuestTier, string> = { taste: 'Taste', try: 'Try', test: 'Test' };

/** Quest-log style card: tier badge, time, XP, name and instructions. `hideCareer` keeps the free-tier teaser's path hidden. */
export function QuestCard({
  careerId,
  quest,
  kicker,
  hideCareer,
  children,
}: {
  careerId: CareerId;
  quest: Quest;
  kicker?: string;
  hideCareer?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Card style={{ borderColor: C.goldBorder }}>
      <View style={styles.head}>
        <Label>{[kicker, hideCareer ? null : CAREERS[careerId].name].filter(Boolean).join(' · ')}</Label>
        <Text style={styles.xp}>+{QUEST_XP[quest.tier] + REFLECTION_XP} XP</Text>
      </View>
      <View style={styles.badges}>
        <Text style={styles.tier}>{TIER_LABELS[quest.tier]}</Text>
        <Text style={styles.time}>{quest.time}</Text>
      </View>
      <Text style={styles.name}>{quest.name}</Text>
      <Text style={styles.instructions}>{quest.instructions}</Text>
      <Text style={styles.learn}>
        <Text style={{ fontFamily: F.bodyBold }}>What you’ll learn: </Text>
        {quest.learn}
      </Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: S.sm },
  xp: { fontFamily: F.bodyBold, fontSize: 13, color: C.gold },
  badges: { flexDirection: 'row', gap: S.sm, alignItems: 'center' },
  tier: { fontFamily: F.bodyBold, fontSize: 11, letterSpacing: 1, color: C.nightDeep, backgroundColor: C.gold, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden', textTransform: 'uppercase' },
  time: { fontFamily: F.body, fontSize: 13, color: C.textMuted },
  name: { fontFamily: F.display, fontSize: 20, lineHeight: 26, color: C.text },
  instructions: { fontFamily: F.body, fontSize: 15, lineHeight: 22, color: C.text },
  learn: { fontFamily: F.body, fontSize: 14, lineHeight: 20, color: C.textMuted },
});
