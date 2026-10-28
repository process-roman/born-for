// Home: active quest first, then the next recommendation and constellations (Blueprint §4.3, §4.5).

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CAREER_IDS, CAREERS, getQuest, type CareerId } from '@/content/careers';
import { litStarNumbers } from '@/logic/character';
import { homeSuggestion, isStale, type SuggestionKind } from '@/logic/game';
import { useGame } from '@/state/game';
import { Body, Button, Card, Label, Screen } from '@/ui/components';
import { CharacterHeader } from '@/ui/CharacterHeader';
import { PathConstellation } from '@/ui/PathConstellation';
import { QuestCard } from '@/ui/quest';
import { C, F, S } from '@/ui/theme';

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
  const day = due.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  return due.getTime() < Date.now() ? 'Check-in time: how did it go?' : `Check in ${day}`;
}

export default function Home() {
  const { game, snooze, resume, tooHard, notForMe } = useGame();
  if (!game) return null;
  const active = game.activeQuest;
  const suggestion = active && !active.snoozed ? null : homeSuggestion(game);
  const started = CAREER_IDS.filter((id) => litStarNumbers(game.character, id).length > 0);
  const startQuest = (careerId: CareerId, star: number) =>
    router.push({ pathname: '/quest/start', params: { career: careerId, star: String(star) } });

  return (
    <Screen>
      <CharacterHeader game={game} />

      {active && !active.snoozed ? (
        <QuestCard careerId={active.careerId} quest={getQuest(active.careerId, active.star)} kicker="Active quest" hideCareer={!game.paid}>
          <Text style={styles.due}>{isStale(active, new Date()) ? 'Still on it? No pressure, pick what fits.' : dueText(active.dueAt)}</Text>
          <Button title="Done" onPress={() => router.push('/quest/reflect')} />
          <View style={styles.actions}>
            <Button title="Not now" variant="secondary" onPress={snooze} style={styles.action} />
            <Button title="Too hard" variant="secondary" onPress={tooHard} style={styles.action} />
            <Button title="Not for me" variant="secondary" onPress={notForMe} style={styles.action} />
          </View>
        </QuestCard>
      ) : null}

      {suggestion ? (
        <QuestCard
          careerId={suggestion.careerId}
          quest={getQuest(suggestion.careerId, suggestion.star)}
          kicker={SUGGESTION_KICKERS[suggestion.kind]}
          hideCareer={!game.paid}
        >
          {suggestion.reason ? <Text style={styles.reason}>✦ {suggestion.reason}</Text> : null}
          <Button title="Start this quest" onPress={() => startQuest(suggestion.careerId, suggestion.star)} />
        </QuestCard>
      ) : null}

      {!active && !suggestion && !game.paid ? (
        <Card style={{ borderColor: C.goldBorder, alignItems: 'center' }}>
          <Label>Your first star is lit</Label>
          <Body>Unlock the full constellation, and every other path waiting in your sky.</Body>
          <Button title="Unlock your paths" onPress={() => router.push({ pathname: '/paywall', params: { second: '1' } })} style={{ alignSelf: 'stretch' }} />
        </Card>
      ) : null}

      {active?.snoozed ? (
        <Card>
          <Label>Saved for later</Label>
          <Text style={styles.savedName}>{getQuest(active.careerId, active.star).name}</Text>
          <Button title="Pick it back up" variant="secondary" onPress={resume} />
        </Card>
      ) : null}

      <Label>Your constellations</Label>
      {started.length === 0 ? (
        <Body muted style={{ textAlign: 'left' }}>
          Finish a quest and its star lights up here.
        </Body>
      ) : (
        <View style={styles.sky}>
          {started.map((id) => {
            const lit = litStarNumbers(game.character, id);
            return (
              <Pressable
                key={id}
                accessibilityRole="button"
                accessibilityLabel={`${CAREERS[id].name}, ${lit.length} of 5 stars`}
                onPress={() => (game.paid ? router.push({ pathname: '/path/[id]', params: { id } }) : router.push('/paywall'))}
                style={styles.mini}
              >
                <PathConstellation career={CAREERS[id]} lit={lit} size={96} />
                <Text style={styles.miniName}>{CAREERS[id].constellation.name}</Text>
                <Text style={styles.miniCount}>{lit.length} / 5</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  due: { fontFamily: F.bodyMedium, fontSize: 14, color: C.gold },
  actions: { flexDirection: 'row', gap: S.sm },
  action: { flex: 1, paddingHorizontal: S.xs, minHeight: 44 },
  reason: { fontFamily: F.body, fontSize: 14, color: C.textMuted },
  savedName: { fontFamily: F.display, fontSize: 17, color: C.text },
  sky: { flexDirection: 'row', flexWrap: 'wrap', gap: S.md },
  mini: { alignItems: 'center', gap: 4, padding: S.sm, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.night },
  miniName: { fontFamily: F.bodyMedium, fontSize: 13, color: C.text },
  miniCount: { fontFamily: F.body, fontSize: 12, color: C.gold },
});
