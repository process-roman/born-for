// Rewards: the star lights up, XP, attribute XP, level and title moments, then what's next (Blueprint §3 steps 15–16).

import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ATTRIBUTE_IDS, ATTRIBUTE_LABELS } from '@/content/attributes';
import { BADGES } from '@/content/badges';
import { CAREERS, getQuest } from '@/content/careers';
import { SIGNS } from '@/content/signs';
import { litStarNumbers } from '@/logic/character';
import { LAYER_NAMES } from '@/logic/avatar';
import { useGame } from '@/state/game';
import { CharacterAvatar } from '@/ui/CharacterAvatar';
import { Body, Button, Card, Label, Screen, Title } from '@/ui/components';
import { PathConstellation } from '@/ui/PathConstellation';
import { QuestCard } from '@/ui/quest';
import { C, F, S } from '@/ui/theme';

export default function Rewards() {
  const { game, lastResult } = useGame();
  if (!game || !lastResult) return <Redirect href="/home" />;
  const { careerId, star, rewards, next, newBadges } = lastResult;
  const career = CAREERS[careerId];
  const gains = ATTRIBUTE_IDS.filter((a) => rewards.attributeXp[a] > 0);
  const leveledUp = rewards.levelAfter > rewards.levelBefore;
  const suggestion = game.suggestion;
  const home = () => router.replace('/home');

  return (
    <Screen
      footer={
        !game.paid ? (
          <>
            <Button title="Unlock the full constellation" onPress={() => router.replace({ pathname: '/paywall', params: { second: '1' } })} />
            <Button title="Go to home" variant="ghost" onPress={home} />
          </>
        ) : (
          <Button title="Go to home" variant={suggestion ? 'ghost' : 'primary'} onPress={home} />
        )
      }
    >
      <View style={{ alignItems: 'center', gap: S.sm }}>
        <Label>{career.constellation.name}</Label>
        <PathConstellation career={career} lit={litStarNumbers(game.character, careerId)} size={200} fresh={star} />
        <Title>{rewards.constellationComplete ? 'Constellation complete!' : 'A star lights up'}</Title>
        <Text style={styles.xp}>+{rewards.xp} XP</Text>
      </View>

      {gains.length > 0 ? (
        <Card>
          <Label>You trained</Label>
          {gains.map((a) => (
            <Text key={a} style={styles.gain}>
              {ATTRIBUTE_LABELS[a]} <Text style={{ color: C.gold }}>+{rewards.attributeXp[a]}</Text>
            </Text>
          ))}
        </Card>
      ) : (
        <Body muted>Reflect next time to earn attribute XP too.</Body>
      )}

      {leveledUp ? (
        <Card style={{ borderColor: C.goldBorder, alignItems: 'center' }}>
          <Label>Level {rewards.levelAfter}</Label>
          <CharacterAvatar character={game.character} size={120} />
          <Text style={styles.moment}>Your {SIGNS[game.character.sign].archetype.replace('The ', '')} has grown.</Text>
          <Text style={styles.gain}>New: {LAYER_NAMES[rewards.levelAfter - 1]!.toLowerCase()}</Text>
        </Card>
      ) : null}

      {rewards.newTitle ? (
        <Card style={{ borderColor: C.goldBorder, alignItems: 'center' }}>
          <Label>{rewards.newTitle.starred ? 'Title upgraded' : 'New title'}</Label>
          <Text style={styles.moment}>{rewards.newTitle.text}</Text>
        </Card>
      ) : null}

      {newBadges.map((id) => (
        <Card key={id} style={{ borderColor: C.goldBorder, alignItems: 'center' }}>
          <Label>Badge unlocked</Label>
          <Text style={styles.moment}>
            {BADGES[id].emoji} {BADGES[id].name}
          </Text>
          <Text style={styles.gain}>{BADGES[id].description}</Text>
        </Card>
      ))}

      {next.kind === 'path_complete' ? (
        <Card style={{ borderColor: C.goldBorder }}>
          <Label>Real next steps unlocked</Label>
          <Body style={{ textAlign: 'left' }}>Courses, communities and entry roles for {career.name} are now on its path page.</Body>
          <Button title="See next steps" variant="secondary" onPress={() => router.push({ pathname: '/path/[id]', params: { id: careerId } })} />
        </Card>
      ) : null}

      {game.paid && suggestion ? (
        <QuestCard
          careerId={suggestion.careerId}
          quest={getQuest(suggestion.careerId, suggestion.star)}
          kicker={suggestion.careerId === careerId ? 'Next star' : 'Up next'}
        >
          {suggestion.reason ? <Text style={styles.reason}>✦ {suggestion.reason}</Text> : null}
          <Button
            title="Start this quest"
            onPress={() => router.replace({ pathname: '/quest/start', params: { career: suggestion.careerId, star: String(suggestion.star) } })}
          />
        </QuestCard>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  xp: { fontFamily: F.bodyBold, fontSize: 22, color: C.gold },
  gain: { fontFamily: F.bodyMedium, fontSize: 15, color: C.text },
  moment: { fontFamily: F.display, fontSize: 20, color: C.text, textAlign: 'center' },
  reason: { fontFamily: F.body, fontSize: 14, color: C.textMuted },
});
