// Character: stats with Then vs now, titles, night sky (Blueprint §4.6, §5, §6).

import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CAREER_IDS, CAREERS } from '@/content/careers';
import { SIGNS } from '@/content/signs';
import { litStarNumbers, statsOf, titlesOf } from '@/logic/character';
import { backgroundTraits, topAttributes } from '@/logic/poll';
import { useGame } from '@/state/game';
import { Body, Button, Card, Label, Screen } from '@/ui/components';
import { CharacterHeader } from '@/ui/CharacterHeader';
import { PathConstellation } from '@/ui/PathConstellation';
import { TraitSheet } from '@/ui/stats';
import { C, F, S } from '@/ui/theme';

export default function CharacterScreen() {
  const { game, equipTitle, reset } = useGame();
  const [confirmReset, setConfirmReset] = useState(false);
  if (!game) return null;
  const { character } = game;
  const sign = SIGNS[character.sign];
  const titles = titlesOf(character);
  const started = CAREER_IDS.filter((id) => litStarNumbers(character, id).length > 0);
  const dimmed = backgroundTraits(character.sign).filter((a) => character.answers[a] !== 'yes' && character.earned[a] === 0);

  return (
    <Screen>
      <CharacterHeader game={game} />
      <Body muted style={{ textAlign: 'left' }}>
        {sign.revealLine}
      </Body>

      <Card>
        <Label>Then vs now</Label>
        <TraitSheet stats={statsOf(character)} ghost={character.dayOne} element={sign.element} highlights={topAttributes(character.sign)} dimmed={dimmed} />
        <View style={styles.legend}>
          <View style={styles.legendGhost} />
          <Text style={styles.legendText}>Dashed outline: your stats on day one. Faded: background traits you haven’t unlocked yet.</Text>
        </View>
      </Card>

      <Card>
        <Label>Titles</Label>
        {titles.length === 0 ? (
          <Body muted style={{ textAlign: 'left' }}>
            Light the first Try star on a path to earn its title, like “The {sign.adjective} {CAREERS.ux_design.className}”.
          </Body>
        ) : (
          titles.map((t) => {
            const equipped = game.equippedTitle === t.careerId;
            return (
              <Pressable key={t.careerId} accessibilityRole="button" onPress={() => equipTitle(t.careerId)} style={[styles.title, equipped && styles.titleOn]}>
                <Text style={styles.titleText}>{t.text}</Text>
                <Text style={styles.titleState}>{equipped ? 'Equipped' : 'Equip'}</Text>
              </Pressable>
            );
          })
        )}
      </Card>

      <Card>
        <Label>Night sky</Label>
        {started.length === 0 ? (
          <Body muted style={{ textAlign: 'left' }}>
            Every path you explore adds a constellation here.
          </Body>
        ) : (
          <View style={styles.sky}>
            {started.map((id) => (
              <Pressable key={id} accessibilityRole="button" onPress={() => router.push({ pathname: '/path/[id]', params: { id } })} style={{ alignItems: 'center' }}>
                <PathConstellation career={CAREERS[id]} lit={litStarNumbers(character, id)} size={88} />
                <Text style={styles.skyName}>{CAREERS[id].constellation.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </Card>

      <Button
        title={confirmReset ? 'Tap again to delete your character' : 'Start over'}
        variant="ghost"
        onPress={() => {
          if (!confirmReset) return setConfirmReset(true);
          reset();
          router.replace('/');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  legendGhost: { width: 22, height: 10, borderRadius: 3, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(244, 241, 234, 0.55)' },
  legendText: { fontFamily: F.body, fontSize: 12, color: C.textMuted },
  title: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: S.md, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  titleOn: { borderColor: C.gold, backgroundColor: C.goldSoft },
  titleText: { fontFamily: F.display, fontSize: 16, color: C.text, flexShrink: 1 },
  titleState: { fontFamily: F.bodyMedium, fontSize: 13, color: C.gold },
  sky: { flexDirection: 'row', flexWrap: 'wrap', gap: S.lg, justifyContent: 'center' },
  skyName: { fontFamily: F.body, fontSize: 12, color: C.textMuted },
});
