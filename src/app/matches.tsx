// End of onboarding (Life Sim Spec §2): career matches, then "Live it first" on the top match that
// has a life, free. The paywall comes after the free life's Life at {age} card.

import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import { lifeFor } from '@/content/life';
import type { IntentId } from '@/content/preferences';
import { ageOf, rankingFor } from '@/logic/character';
import { lifeStart, START_METERS } from '@/logic/life';
import { freeLifeCareer } from '@/logic/lifeAccess';
import { useGame } from '@/state/game';
import { useOnboarding } from '@/state/onboarding';
import { Body, Button, Card, Label, Screen, Step, Title } from '@/ui/components';
import { LifeSky } from '@/ui/LifeSky';
import { SIGNS } from '@/content/signs';
import { PathCard } from '@/ui/PathCard';
import { day, S, type } from '@/ui/theme';

const SHOWN = 3;

const TITLES: Record<IntentId, string> = {
  career: 'Paths where your superpowers shine',
  change: 'Paths worth testing with your superpowers',
  discover: 'Where your superpowers could take you',
  curious: 'Where your character could go',
};

export default function Matches() {
  const onboarding = useOnboarding();
  const { game, begin } = useGame();
  const character = game?.character ?? onboarding.character;
  if (!character) return <Redirect href="/" />;
  const { ranked } = rankingFor(character);
  const freeCareer = freeLifeCareer(character);
  const life = freeCareer ? lifeFor(freeCareer) : null;
  const topHasLife = freeCareer === ranked[0]?.careerId;
  const { startAge, track } = lifeStart(ageOf(character));
  const span = `from ${startAge} to ${startAge + 12}`;

  /** The game starts here, unpaid, so the free life and its card have somewhere to live. */
  const ensureGame = () => {
    if (!game) begin(character, false);
  };

  return (
    <Screen
      footer={
        <>
          {freeCareer ? (
            <Button
              title="Live it first"
              onPress={() => {
                ensureGame();
                router.push({ pathname: '/life/[career]', params: { career: freeCareer } });
              }}
            />
          ) : null}
          <Button title={freeCareer ? 'See everything you can unlock' : 'Continue'} variant={freeCareer ? 'ghost' : 'primary'} onPress={() => router.push('/paywall')} />
        </>
      }
    >
      {game ? null : <Step index={8} total={9} />}
      <Title>{TITLES[character.intent ?? 'career']}</Title>
      <Body muted>Starting points based on your interests and questionnaire traits. Picking a career shows curiosity, not proven ability. Open a path to explore its work and training.</Body>

      {freeCareer && life ? (
        <Card>
          <LifeSky age={18} meters={START_METERS} element={SIGNS[character.sign].element} variant="card" style={{ aspectRatio: 2 }} />
          <Label>Live it first · free</Label>
          <Text style={styles.lifeTitle}>{life.lifeName} life</Text>
          <Text style={styles.body}>
            {topHasLife
              ? `Before you decide anything, live your top match ${span}${track === 'change' ? ' as a career change' : ''}. About 5 minutes, and your character stats set the game odds.`
              : `Lives are coming to more careers. Start with ${CAREERS[freeCareer].name}: about 5 minutes ${span}, and your character stats set the game odds.`}
          </Text>
        </Card>
      ) : null}

      <Label>Your top matches</Label>
      <View style={{ gap: S.md }}>
        {ranked.slice(0, SHOWN).map((m, i) => (
          <PathCard key={m.careerId} match={m} character={character} rank={i + 1} onPress={() => {
            ensureGame();
            router.push({ pathname: '/path/[id]', params: { id: m.careerId } });
          }} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lifeTitle: { ...type.h2, color: day.text },
  body: { ...type.body, fontSize: 15, lineHeight: 22, color: day.text },
});
