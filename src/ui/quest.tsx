import { StyleSheet, Text } from 'react-native';

import { CAREERS, type CareerId, type Quest, type QuestTier } from '@/content/careers';
import { QUEST_XP, REFLECTION_XP } from '@/logic/xp';
import { Card, Label, useToneColors } from './components';
import { fonts, type } from './theme';

export const TIER_LABELS: Record<QuestTier, string> = { taste: 'Taste', try: 'Try', test: 'Test' };

/** Quest card: kicker, serif name, a "TASTE · 20 MIN · +80 XP" tag line and instructions. `hideCareer` keeps the free-tier teaser's path hidden. */
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
  const t = useToneColors();
  const tag = [TIER_LABELS[quest.tier], quest.time, `+${QUEST_XP[quest.tier] + REFLECTION_XP} XP`, ...(hideCareer ? [] : [CAREERS[careerId].name])];
  return (
    <Card>
      {kicker ? <Label>{kicker}</Label> : null}
      <Text style={[styles.name, { color: t.text }]}>{quest.name}</Text>
      <Text style={[type.label, { color: t.textMuted }]}>{tag.join('  ·  ')}</Text>
      <Text style={[styles.instructions, { color: t.text }]}>{quest.instructions}</Text>
      <Text style={[styles.learn, { color: t.textMuted }]}>
        <Text style={{ fontFamily: fonts.sansMedium, color: t.text }}>What you’ll learn: </Text>
        {quest.learn}
      </Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  name: type.h2,
  instructions: { ...type.body, fontSize: 15, lineHeight: 22 },
  learn: type.small,
});
