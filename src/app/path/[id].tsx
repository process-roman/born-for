// Path details: constellation, difficulty breakdown, quests, day-to-day and real next steps (Blueprint §12 screen 10).

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_LABELS } from '@/content/attributes';
import { CAREER_IDS, CAREERS, type CareerId } from '@/content/careers';
import { SIGNS } from '@/content/signs';
import { WORLDS } from '@/content/worlds';
import { litStarNumbers, rankingFor, statsOf } from '@/logic/character';
import { lifeFor } from '@/content/life';
import { endingsFound } from '@/logic/life';
import { useLives } from '@/state/lives';
import { isConstellationComplete } from '@/logic/constellation';
import { canStartQuest } from '@/logic/game';
import type { PathInterest } from '@/logic/ranking';
import { useGame } from '@/state/game';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { PathConstellation } from '@/ui/PathConstellation';
import { TIER_LABELS } from '@/ui/quest';
import { DifficultyPill } from '@/ui/stats';
import { PlumCard } from '@/ui/kit';
import { C, day, F, night, S, type } from '@/ui/theme';

const INTEREST_OPTIONS: { id: PathInterest; label: string }[] = [
  { id: 'interested', label: 'Interested' },
  { id: 'unsure', label: 'Unsure' },
  { id: 'not_for_me', label: 'Not for me' },
];

function List({ items }: { items: string[] }) {
  return (
    <View style={{ gap: 6 }}>
      {items.map((i) => (
        <Text key={i} style={styles.item}>
          • {i}
        </Text>
      ))}
    </View>
  );
}

/** "2 of 5 endings found": found ones with the date first found, the rest as ???. */
function EndingsCard({ found }: { found: ReturnType<typeof endingsFound> }) {
  const count = found.filter((f) => f.firstFoundAt).length;
  return (
    <Card>
      <Label>
        Life endings · {count} of {found.length} found
      </Label>
      {found.map(({ ending, firstFoundAt }) => (
        <View key={ending.id} style={styles.endingRow}>
          <Text style={[styles.endingName, !firstFoundAt && { color: C.textMuted }]}>{firstFoundAt ? ending.name : '???'}</Text>
          {firstFoundAt ? <Text style={styles.endingDate}>{new Date(firstFoundAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text> : null}
        </View>
      ))}
    </Card>
  );
}

export default function PathDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { game, setInterest } = useGame();
  const { runs } = useLives();
  if (!game) return <Redirect href="/" />;
  if (!CAREER_IDS.includes(id as CareerId)) return <Redirect href="/explore" />;
  const careerId = id as CareerId;
  const career = CAREERS[careerId];
  const { character } = game;
  const lit = litStarNumbers(character, careerId);
  const stats = statsOf(character);
  const { ranked, notForMe } = rankingFor(character);
  const match = [...ranked, ...notForMe].find((m) => m.careerId === careerId)!;
  const interest = character.feedback[careerId]?.interest;
  const complete = isConstellationComplete(lit);
  const life = lifeFor(careerId);

  return (
    <Screen footer={<Button title="Back" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/explore'))} />}>
      <View style={{ alignItems: 'center', gap: S.xs }}>
        <Label>
          {career.constellation.name} · The {SIGNS[character.sign].adjective} {career.className}
        </Label>
        <Title>{career.name}</Title>
      </View>
      <PlumCard style={styles.sky}>
        <PathConstellation career={career} lit={lit} size={220} />
        <Text style={styles.count}>{lit.length} of 5 stars lit</Text>
      </PlumCard>
      {life ? (
        <Button title="Live this life" onPress={() => router.push({ pathname: '/life/[career]', params: { career: careerId } })} />
      ) : (
        <Text style={styles.comingSoon}>Life coming soon</Text>
      )}
      <Body>{career.oneLiner}</Body>
      <View style={styles.worlds}>
        {career.worlds.map((w) => (
          <Pressable
            key={w}
            accessibilityRole="link"
            onPress={() => router.push({ pathname: '/world/[id]', params: { id: w } })}
            style={styles.world}
          >
            <Text style={styles.worldText}>
              {WORLDS[w].emoji} {WORLDS[w].name}
            </Text>
          </Pressable>
        ))}
      </View>
      {career.realityCheck ? (
        <Card style={{ backgroundColor: day.accentSoft }}>
          <Label>Reality check</Label>
          <Text style={styles.item}>{career.realityCheck}</Text>
        </Card>
      ) : null}

      <View style={styles.interest}>
        {INTEREST_OPTIONS.map((o) => (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            accessibilityState={{ selected: interest === o.id }}
            onPress={() => setInterest(careerId, o.id)}
            style={[styles.chip, interest === o.id && styles.chipOn]}
          >
            <Text style={[styles.chipText, interest === o.id && { color: C.gold }]}>{o.label}</Text>
          </Pressable>
        ))}
      </View>

      {life ? <EndingsCard found={endingsFound(life, runs)} /> : null}

      <Card>
        <Label>Difficulty for you</Label>
        <DifficultyPill difficulty={match.difficulty} />
        {career.requirements.map((r) => {
          const value = stats[r.attribute];
          return (
            <Text key={r.attribute} style={styles.item}>
              {value >= r.required ? '✓' : '○'} {ATTRIBUTE_LABELS[r.attribute]}: {value} of {r.required}
            </Text>
          );
        })}
        {match.reasons.map((r) => (
          <Text key={r} style={styles.reason}>
            ✦ {r}
          </Text>
        ))}
      </Card>

      <Card>
        <Label>Quests</Label>
        {career.quests.map((q) => {
          const isLit = lit.includes(q.star);
          const startable = canStartQuest(game, careerId, q.star);
          const isActive = game.activeQuest?.careerId === careerId && game.activeQuest.star === q.star;
          return (
            <Pressable
              key={q.star}
              accessibilityRole="button"
              disabled={!startable || isActive}
              onPress={() => router.push({ pathname: '/quest/start', params: { career: careerId, star: String(q.star) } })}
              style={[styles.quest, startable && !isActive && styles.questOpen, isLit && { opacity: 1 }]}
            >
              <Text style={[styles.questStar, isLit && { color: C.gold }]}>{isLit ? '★' : '☆'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.questName}>{q.name}</Text>
                <Text style={styles.questMeta}>
                  {TIER_LABELS[q.tier]} · {q.time}
                  {isLit ? ' · Lit' : isActive ? ' · Active' : startable ? ' · Start ›' : game.paid ? ' · Locked' : ' · Unlock to play'}
                </Text>
              </View>
            </Pressable>
          );
        })}
        {!game.paid ? <Button title="Unlock your paths" variant="secondary" onPress={() => router.push('/paywall')} /> : null}
      </Card>

      <Card>
        <Label>Day to day</Label>
        <List items={career.dayToDay} />
        <Label>Downsides</Label>
        <List items={career.downsides} />
        <Label>Education and training</Label>
        <Text style={styles.item}>{career.education}</Text>
      </Card>

      <Card>
        <Label>Real next steps</Label>
        {complete ? (
          <>
            <Text style={styles.sub}>Learn</Text>
            <List items={career.nextSteps.learn} />
            <Text style={styles.sub}>Community</Text>
            <List items={career.nextSteps.community} />
            <Text style={styles.sub}>Entry roles</Text>
            <List items={career.nextSteps.entryRoles} />
            <Text style={styles.sub}>Search for</Text>
            <List items={career.nextSteps.searchFor.map((s) => `“${s}”`)} />
          </>
        ) : (
          <Text style={styles.item}>Light all five stars to unlock courses, communities and entry roles for this path.</Text>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sky: { alignItems: 'center' },
  comingSoon: { ...type.label, color: C.textMuted, textAlign: 'center' },
  endingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  endingName: { ...type.h3, fontSize: 18, color: C.text },
  endingDate: { ...type.label, fontSize: 10, color: C.textMuted },
  count: { ...type.label, color: night.gold },
  interest: { flexDirection: 'row', gap: S.sm, justifyContent: 'center' },
  worlds: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm, justifyContent: 'center' },
  world: { paddingHorizontal: S.md, paddingVertical: 6, borderRadius: 999, backgroundColor: C.goldSoft },
  worldText: { fontFamily: F.bodyMedium, fontSize: 13, color: C.gold },
  chip: { paddingHorizontal: S.md, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: C.border },
  chipOn: { borderColor: C.gold, backgroundColor: C.goldSoft },
  chipText: { fontFamily: F.bodyMedium, fontSize: 14, color: C.text },
  item: { fontFamily: F.body, fontSize: 15, lineHeight: 22, color: C.text },
  reason: { fontFamily: F.body, fontSize: 14, lineHeight: 20, color: C.textMuted },
  sub: { ...type.h3, fontSize: 18, color: C.text, marginTop: S.xs },
  quest: { flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.md, borderRadius: 12, borderWidth: 1, borderColor: C.border, opacity: 0.6 },
  questOpen: { opacity: 1, borderColor: C.gold },
  questStar: { fontSize: 20, color: C.textMuted },
  questName: { ...type.h3, fontSize: 18, color: C.text },
  questMeta: { fontFamily: F.body, fontSize: 13, color: C.textMuted },
});
