// Home (cream "daytime"): welcome, character in the arch window, archetype card, active or next quest,
// shortcuts and constellations (Blueprint §4.3, §4.5).

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_LABELS } from '@/content/attributes';
import { BADGE_IDS } from '@/content/badges';
import { CAREER_IDS, CAREERS, getQuest, type CareerId, type StarNumber } from '@/content/careers';
import { SIGNS } from '@/content/signs';
import { earnedBadges } from '@/logic/badges';
import { levelOf, litStarNumbers } from '@/logic/character';
import { homeSuggestion, isStale, type Game, type SuggestionKind } from '@/logic/game';
import { topAttributes } from '@/logic/poll';
import { LEVEL_THRESHOLDS, QUEST_XP, REFLECTION_XP, xpToNextLevel } from '@/logic/xp';
import { useGame } from '@/state/game';
import { CharacterAvatar } from '@/ui/CharacterAvatar';
import { equippedTitleText } from '@/ui/CharacterHeader';
import { ArchWindow, DayScreen, IconBadge, PillButton, PlumCard, SectionLabel, SlimBar, SurfaceCard, Tag } from '@/ui/kit';
import { PathConstellation } from '@/ui/PathConstellation';
import { TIER_LABELS } from '@/ui/quest';
import { day, fonts, night, palette, radius, space, type } from '@/ui/theme';

const SUGGESTION_KICKERS: Record<SuggestionKind, string> = {
  start: 'Your first quest',
  same_path: 'Next star',
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

function QuestCard({
  game,
  careerId,
  star,
  kicker,
  children,
}: {
  game: Game;
  careerId: CareerId;
  star: StarNumber;
  kicker: string;
  children?: React.ReactNode;
}) {
  const quest = getQuest(careerId, star);
  return (
    <SurfaceCard>
      <SectionLabel>{kicker}</SectionLabel>
      <Tag parts={[TIER_LABELS[quest.tier], quest.time, `+${QUEST_XP[quest.tier] + REFLECTION_XP} XP`]} />
      <Text style={styles.questName}>{quest.name}</Text>
      {game.paid ? <Text style={styles.questCareer}>{CAREERS[careerId].name}</Text> : null}
      <Text style={styles.body}>{quest.instructions}</Text>
      <Text style={styles.small}>
        <Text style={{ fontFamily: fonts.sansMedium }}>What you’ll learn: </Text>
        {quest.learn}
      </Text>
      {children}
    </SurfaceCard>
  );
}

export default function Home() {
  const { game, snooze, resume, tooHard, notForMe } = useGame();
  if (!game) return null;
  const { character } = game;
  const sign = SIGNS[character.sign];
  const level = levelOf(character);
  const toNext = xpToNextLevel(character.totalXp);
  const active = game.activeQuest;
  const suggestion = active && !active.snoozed ? null : homeSuggestion(game);
  const started = CAREER_IDS.filter((id) => litStarNumbers(character, id).length > 0);
  const badges = earnedBadges(character).length;
  const startQuest = (careerId: CareerId, star: number) =>
    router.push({ pathname: '/quest/start', params: { career: careerId, star: String(star) } });

  return (
    <DayScreen>
      <View style={styles.header}>
        <View style={styles.mark}>
          <Text style={styles.markGlyph}>☾</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>Born For</Text>
          <Text style={styles.tagline}>Know your nature</Text>
          <Text style={styles.tagline}>Shape your tomorrow</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={() => router.push('/settings')} style={styles.profile}>
          <Text style={styles.profileIcon}>⚙︎</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={{ flex: 1, gap: space.md }}>
          <SectionLabel>
            {sign.name} · Level {level}
          </SectionLabel>
          <Text style={styles.heroTitle}>
            Welcome back,{'\n'}
            <Text style={styles.heroItalic}>{sign.archetype.replace('The ', '')}.</Text>
          </Text>
          <Text style={styles.body}>{sign.revealLine}</Text>
        </View>
        <ArchWindow width={136} height={196}>
          <CharacterAvatar character={character} size={96} />
        </ArchWindow>
      </View>

      <Pressable accessibilityRole="button" onPress={() => router.push('/character')} style={({ pressed }) => pressed && { opacity: 0.92 }}>
        <PlumCard>
          <SectionLabel tone="night">{game.equippedTitle ? 'Your title' : 'Your archetype'}</SectionLabel>
          <Text style={styles.archetype}>{equippedTitleText(game) ?? sign.archetype}</Text>
          <Text style={styles.superpowers}>
            Superpowers: {topAttributes(character.sign).map((a) => ATTRIBUTE_LABELS[a]).join(' · ')}
          </Text>
          <SlimBar progress={levelProgress(character.totalXp, level)} tone="night" />
          <View style={styles.plumFooter}>
            <Text style={styles.plumSmall}>
              Level {level} · {character.totalXp} XP{toNext === null ? ' · max level' : ` · ${toNext} to level ${level + 1}`}
            </Text>
            <View style={styles.chevron}>
              <Text style={styles.chevronText}>›</Text>
            </View>
          </View>
        </PlumCard>
      </Pressable>

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

      <View style={styles.tiles}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/character')} style={styles.tilePress}>
          <SurfaceCard style={styles.tile}>
            <IconBadge symbol="☾" tint="lavender" />
            <Text style={styles.tileTitle}>Superpowers</Text>
            <Text style={styles.tileSub}>Your stats and traits</Text>
          </SurfaceCard>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/explore')} style={styles.tilePress}>
          <SurfaceCard style={styles.tile}>
            <IconBadge symbol="✧" tint="peach" />
            <Text style={styles.tileTitle}>Career paths</Text>
            <Text style={styles.tileSub}>Explore 17 worlds</Text>
          </SurfaceCard>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/character')} style={styles.tilePress}>
          <SurfaceCard style={styles.tile}>
            <IconBadge symbol="✦" tint="gold" />
            <Text style={styles.tileTitle}>Badges</Text>
            <Text style={styles.tileSub}>
              {badges} of {BADGE_IDS.length} earned
            </Text>
          </SurfaceCard>
        </Pressable>
      </View>

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
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  mark: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: day.primary, alignItems: 'center', justifyContent: 'center' },
  markGlyph: { fontSize: 26, color: palette.peach },
  brand: { fontFamily: fonts.serifMedium, fontSize: 30, lineHeight: 34, color: day.text },
  tagline: { ...type.label, fontSize: 9, letterSpacing: 2.2, color: day.textMuted },
  profile: { width: 44, height: 44, borderRadius: 22, backgroundColor: day.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  profileIcon: { fontSize: 20, color: day.primary },
  hero: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm },
  heroTitle: { fontFamily: fonts.serifMedium, fontSize: 36, lineHeight: 40, color: day.text },
  heroItalic: { fontFamily: fonts.serifItalic, color: day.accent },
  body: { ...type.body, color: day.textMuted },
  small: { ...type.small, color: day.textMuted },
  archetype: { ...type.h1, color: night.text },
  superpowers: { ...type.small, color: night.textMuted },
  plumFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  plumSmall: { ...type.small, color: night.textMuted },
  chevron: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: night.line, alignItems: 'center', justifyContent: 'center' },
  chevronText: { fontSize: 20, lineHeight: 22, color: night.text },
  questName: { ...type.h2, color: day.text },
  questCareer: { ...type.small, fontFamily: fonts.sansMedium, color: day.textMuted, marginTop: -space.sm },
  due: { ...type.small, fontFamily: fonts.sansMedium, color: day.text },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { flex: 1, paddingHorizontal: 0 },
  tiles: { flexDirection: 'row', gap: space.sm },
  tilePress: { flex: 1 },
  tile: { alignItems: 'center', padding: space.md, gap: space.sm, minHeight: 156 },
  tileTitle: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 20, color: day.text, textAlign: 'center' },
  tileSub: { ...type.small, fontSize: 12, lineHeight: 16, color: day.textMuted, textAlign: 'center' },
  sky: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  skyItem: { width: '47%' },
  skyCard: { alignItems: 'center', padding: space.lg, gap: space.xs },
  skyName: { fontFamily: fonts.serif, fontSize: 18, color: night.text },
});
