// Character: evolving character, stats with Then vs now, titles, badges, night sky (Blueprint §4.6, §5–7, §11).

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BADGE_IDS, BADGES } from '@/content/badges';
import { CAREER_IDS, CAREERS } from '@/content/careers';
import { SIGNS } from '@/content/signs';
import { LAYER_NAMES, avatarLayers, nextLayerName } from '@/logic/avatar';
import { earnedBadges } from '@/logic/badges';
import { litStarNumbers, statsOf, titlesOf } from '@/logic/character';
import { backgroundTraits, topAttributes } from '@/logic/poll';
import { useGame } from '@/state/game';
import { Body, Button, Card, Label, Screen } from '@/ui/components';
import { CharacterAvatar } from '@/ui/CharacterAvatar';
import { CharacterHeader } from '@/ui/CharacterHeader';
import { PathConstellation } from '@/ui/PathConstellation';
import { TraitSheet } from '@/ui/stats';
import { C, F, S } from '@/ui/theme';

export default function CharacterScreen() {
  const { game, equipTitle } = useGame();
  if (!game) return null;
  const { character } = game;
  const sign = SIGNS[character.sign];
  const titles = titlesOf(character);
  const started = CAREER_IDS.filter((id) => litStarNumbers(character, id).length > 0);
  const dimmed = backgroundTraits(character.sign).filter((a) => character.answers[a] !== 'yes' && character.earned[a] === 0);
  const layers = avatarLayers(character);
  const nextLayer = nextLayerName(layers.level);
  const badges = new Set(earnedBadges(character));

  return (
    <Screen>
      <CharacterHeader game={game} />
      <Body muted style={{ textAlign: 'left' }}>
        {sign.revealLine}
      </Body>

      <Card style={{ alignItems: 'center' }}>
        <CharacterAvatar character={character} size={150} />
        <Text style={styles.layer}>
          Level {layers.level}: {LAYER_NAMES[layers.level - 1]}
          {layers.item ? ` · carrying a ${layers.item.name}` : ''}
        </Text>
        <Text style={styles.legendText}>
          {nextLayer ? `Next: ${nextLayer.toLowerCase()} at level ${layers.level + 1}.` : 'Full celestial form reached.'} Placeholder art; illustrations come later.
        </Text>
      </Card>

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
        <Label>
          Badges · {badges.size} of {BADGE_IDS.length}
        </Label>
        <View style={styles.badges}>
          {BADGE_IDS.map((id) => {
            const on = badges.has(id);
            return (
              <View key={id} style={[styles.badge, !on && { opacity: 0.35 }]} accessibilityLabel={`${BADGES[id].name}: ${on ? 'earned' : 'locked'}. ${BADGES[id].description}`}>
                <Text style={styles.badgeEmoji}>{on ? BADGES[id].emoji : '🔒'}</Text>
                <Text style={styles.badgeName}>{BADGES[id].name}</Text>
              </View>
            );
          })}
        </View>
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

      <Button title="Settings" variant="secondary" onPress={() => router.push('/settings')} />
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
  layer: { fontFamily: F.display, fontSize: 15, color: C.text, textAlign: 'center' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  badge: { width: '31%', alignItems: 'center', gap: 4, paddingVertical: S.sm, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  badgeEmoji: { fontSize: 22 },
  badgeName: { fontFamily: F.body, fontSize: 11, color: C.text, textAlign: 'center' },
  skyName: { fontFamily: F.body, fontSize: 12, color: C.textMuted },
});
