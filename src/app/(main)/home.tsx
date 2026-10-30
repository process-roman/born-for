// Home (cream "daytime"): what to do next first. Compact welcome, the active or next quest,
// one character card with your top superpowers, then your constellations (Blueprint §4.3, §4.5).

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_LABELS } from '@/content/attributes';
import { CAREER_IDS, CAREERS, getQuest, type CareerId, type StarNumber } from '@/content/careers';
import { SIGNS } from '@/content/signs';
import { levelOf, litStarNumbers, statsOf } from '@/logic/character';
import { confirmedTraits, recentGain } from '@/logic/confirmed';
import { homeSuggestion, isStale, type Game, type SuggestionKind } from '@/logic/game';
import { topTraits } from '@/logic/ranking';
import { bandFor } from '@/logic/stats';
import { LEVEL_THRESHOLDS, QUEST_XP, REFLECTION_XP, xpToNextLevel } from '@/logic/xp';
import { useGame } from '@/state/game';
import { CharacterAvatar } from '@/ui/CharacterAvatar';
import { equippedTitleText } from '@/ui/CharacterHeader';
import { ArchWindow, DayScreen, PillButton, PlumCard, SectionLabel, SlimBar, SurfaceCard, Tag } from '@/ui/kit';
import { PathConstellation } from '@/ui/PathConstellation';
import { TIER_LABELS } from '@/ui/quest';
import { day, fonts, night, palette, radius, space, type } from '@/ui/theme';

const SUPERPOWERS_ON_HOME = 3;

const SUGGESTION_KICKERS: Record<SuggestionKind, string> = {
  start: 'Your first quest',
  same_path: 'Your next star',
  related_path: 'Try a related path',
  different_path: 'Try something different',
  easier: 'A smaller step',
  after_path: 'Your next constellation',
};

function dueText(dueAt: string): string {
  const due = new Date(dueAt);
  const when = due.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  return due.getTime() < Date.now() ? 'Check-in time: how did it go?' : `Check in ${when}`;
}

function levelProgress(totalXp: number, level: number): number {
  const floor = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const ceiling = LEVEL_THRESHOLDS[level];
  return ceiling === undefined ? 1 : (totalXp - floor) / (ceiling - floor);
}

function QuestCard({ game, careerId, star, kicker, children }: { game: Game; careerId: CareerId; star: StarNumber; kicker: string; children?: React.ReactNode }) {
  const quest = getQuest(careerId, star);
  return (
    <SurfaceCard>
      <SectionLabel>{kicker}</SectionLabel>
      <Text style={styles.questName}>{quest.name}</Text>
      <Tag parts={[TIER_LABELS[quest.tier], quest.time, `+${QUEST_XP[quest.tier] + REFLECTION_XP} XP`, ...(game.paid ? [CAREERS[careerId].name] : [])]} />
      <Text style={styles.body}>{quest.instructions}</Text>
      {children}
    </SurfaceCard>
  );
}

/** Title, level and the top superpowers as slim bars, with ✓ for traits confirmed on quests. */
function CharacterCard({ game }: { game: Game }) {
  const { character } = game;
  const sign = SIGNS[character.sign];
  const level = levelOf(character);
  const toNext = xpToNextLevel(character.totalXp);
  const stats = statsOf(character);
  const confirmed = confirmedTraits(character);
  const gain = recentGain(character);

  return (
    <Pressable accessibilityRole="button" accessibilityHint="Opens your full character sheet" onPress={() => router.push('/character')} style={({ pressed }) => pressed && { opacity: 0.92 }}>
      <PlumCard>
        <View style={styles.cardHead}>
          <View style={{ flex: 1, gap: 2 }}>
            <SectionLabel tone="night">{game.equippedTitle ? 'Your title' : 'Your archetype'}</SectionLabel>
            <Text style={styles.title}>{equippedTitleText(game) ?? sign.archetype}</Text>
          </View>
          <View style={styles.chevron}>
            <Text style={styles.chevronText}>›</Text>
          </View>
        </View>
        <SlimBar progress={levelProgress(character.totalXp, level)} tone="night" />
        <Text style={styles.plumSmall}>
          Level {level} · {character.totalXp} XP{toNext === null ? ' · max level' : ` · ${toNext} to level ${level + 1}`}
        </Text>

        <View style={styles.divider} />
        <SectionLabel tone="night">Your superpowers</SectionLabel>
        {topTraits(stats, SUPERPOWERS_ON_HOME).map((a) => (
          <View key={a} style={{ gap: 6 }}>
            <View style={styles.traitRow}>
              <Text style={styles.traitName}>
                {ATTRIBUTE_LABELS[a]}
                {confirmed.includes(a) ? <Text style={styles.check}>  ✓</Text> : null}
              </Text>
              <Text style={styles.band}>{bandFor(stats[a])}</Text>
            </View>
            <SlimBar progress={stats[a] / 100} tone="night" />
          </View>
        ))}
        {gain ? (
          <Text style={styles.gain}>
            ↑ +{gain.amount} {ATTRIBUTE_LABELS[gain.attribute]} from your last quests
          </Text>
        ) : (
          <Text style={styles.plumSmall}>Finish a quest and reflect to grow them.</Text>
        )}
      </PlumCard>
    </Pressable>
  );
}

export default function Home() {
  const { game, snooze, resume, tooHard, notForMe } = useGame();
  if (!game) return null;
  const { character } = game;
  const sign = SIGNS[character.sign];
  const active = game.activeQuest;
  const suggestion = active && !active.snoozed ? null : homeSuggestion(game);
  const started = CAREER_IDS.filter((id) => litStarNumbers(character, id).length > 0);
  const startQuest = (careerId: CareerId, star: number) =>
    router.push({ pathname: '/quest/start', params: { career: careerId, star: String(star) } });

  return (
    <DayScreen>
      <View style={styles.brandRow}>
        <View style={styles.mark}>
          <Text style={styles.markGlyph}>☾</Text>
        </View>
        <Text style={[styles.brand, { flex: 1 }]}>Born For</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={() => router.push('/settings')} style={styles.settings}>
          <Text style={styles.settingsIcon}>⚙︎</Text>
        </Pressable>
      </View>

      <View style={styles.welcome}>
        <View style={{ flex: 1, gap: space.sm }}>
          <Text style={styles.greeting}>
            Welcome back, <Text style={styles.greetingItalic}>{sign.archetype.replace('The ', '')}</Text>
          </Text>
          <SectionLabel>
            {sign.name} · Level {levelOf(character)}
          </SectionLabel>
        </View>
        <ArchWindow width={92} height={124}>
          <CharacterAvatar character={character} size={64} />
        </ArchWindow>
      </View>

      {active && !active.snoozed ? (
        <QuestCard game={game} careerId={active.careerId} star={active.star} kicker="Your active quest">
          <Text style={styles.due}>☾ {isStale(active, new Date()) ? 'Still on it? No pressure, pick what fits.' : dueText(active.dueAt)}</Text>
          <PillButton title="Done, reflect" arrow onPress={() => router.push('/quest/reflect')} />
          <View style={styles.actions}>
            <PillButton title="Not now" variant="text" onPress={snooze} style={styles.action} />
            <PillButton title="Too hard" variant="text" onPress={tooHard} style={styles.action} />
            <PillButton title="Not for me" variant="text" onPress={notForMe} style={styles.action} />
          </View>
        </QuestCard>
      ) : null}

      {suggestion ? (
        <QuestCard game={game} careerId={suggestion.careerId} star={suggestion.star} kicker={SUGGESTION_KICKERS[suggestion.kind]}>
          {suggestion.reason ? <Text style={styles.small}>✦ {suggestion.reason}</Text> : null}
          <PillButton title="Start this quest" arrow onPress={() => startQuest(suggestion.careerId, suggestion.star)} />
        </QuestCard>
      ) : null}

      {!active && !suggestion && !game.paid ? (
        <SurfaceCard style={{ alignItems: 'center' }}>
          <SectionLabel>Your first star is lit</SectionLabel>
          <Text style={[styles.questName, { textAlign: 'center' }]}>Unlock the full constellation</Text>
          <Text style={[styles.body, { textAlign: 'center' }]}>And every other path waiting in your sky.</Text>
          <PillButton title="Unlock your paths" arrow onPress={() => router.push({ pathname: '/paywall', params: { second: '1' } })} style={{ alignSelf: 'stretch' }} />
        </SurfaceCard>
      ) : null}

      {active?.snoozed ? (
        <SurfaceCard>
          <SectionLabel>Saved for later</SectionLabel>
          <Text style={styles.questName}>{getQuest(active.careerId, active.star).name}</Text>
          <PillButton title="Pick it back up" variant="outline" onPress={resume} />
        </SurfaceCard>
      ) : null}

      <CharacterCard game={game} />

      <View style={{ gap: space.md }}>
        <SectionLabel>Your constellations</SectionLabel>
        {started.length === 0 ? (
          <Text style={styles.small}>Finish a quest and its star lights up here.</Text>
        ) : (
          <View style={styles.sky}>
            {started.map((id) => {
              const lit = litStarNumbers(character, id);
              return (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  accessibilityLabel={`${CAREERS[id].name}, ${lit.length} of 5 stars`}
                  onPress={() => (game.paid ? router.push({ pathname: '/path/[id]', params: { id } }) : router.push('/paywall'))}
                  style={({ pressed }) => [styles.skyItem, pressed && { opacity: 0.9 }]}
                >
                  <PlumCard style={styles.skyCard}>
                    <PathConstellation career={CAREERS[id]} lit={lit} size={104} />
                    <Text style={styles.skyName}>{CAREERS[id].constellation.name}</Text>
                    <Text style={styles.plumSmall}>{lit.length} of 5 stars</Text>
                  </PlumCard>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </DayScreen>
  );
}

const styles = StyleSheet.create({
  welcome: { flexDirection: 'row', alignItems: 'flex-end', gap: space.md },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: -space.md },
  mark: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: day.primary, alignItems: 'center', justifyContent: 'center' },
  markGlyph: { fontSize: 18, color: palette.peach },
  brand: { fontFamily: fonts.serifMedium, fontSize: 22, lineHeight: 26, color: day.text },
  greeting: { fontFamily: fonts.serifMedium, fontSize: 32, lineHeight: 36, color: day.text },
  greetingItalic: { fontFamily: fonts.serifItalic, color: day.accent },
  settings: { width: 40, height: 40, borderRadius: 20, backgroundColor: day.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 18, color: day.primary },
  body: { ...type.body, color: day.textMuted },
  small: { ...type.small, color: day.textMuted },
  questName: { ...type.h2, color: day.text },
  due: { ...type.small, fontFamily: fonts.sansMedium, color: day.text },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { flex: 1, paddingHorizontal: 0 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  title: { ...type.h1, color: night.text },
  chevron: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: night.line, alignItems: 'center', justifyContent: 'center' },
  chevronText: { fontSize: 20, lineHeight: 22, color: night.text },
  plumSmall: { ...type.small, color: night.textMuted },
  divider: { height: 1, backgroundColor: night.line, opacity: 0.6, marginVertical: space.xs },
  traitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  traitName: { ...type.bodyMedium, fontSize: 15, color: night.text },
  check: { color: night.gold },
  band: { ...type.label, color: night.textMuted },
  gain: { ...type.small, fontFamily: fonts.sansMedium, color: night.text },
  sky: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  skyItem: { width: '47%' },
  skyCard: { alignItems: 'center', padding: space.lg, gap: space.xs },
  skyName: { fontFamily: fonts.serif, fontSize: 18, color: night.text },
});
