import { StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import { SIGNS } from '@/content/signs';
import { levelOf, litStarNumbers } from '@/logic/character';
import type { Game } from '@/logic/game';
import { titleFor } from '@/logic/titles';
import { LEVEL_THRESHOLDS, xpToNextLevel } from '@/logic/xp';
import { CharacterAvatar } from './CharacterAvatar';
import { useToneColors } from './components';
import { S, type } from './theme';

export function equippedTitleText(game: Game): string | null {
  const id = game.equippedTitle;
  if (!id) return null;
  return titleFor(game.character.sign, id, litStarNumbers(game.character, id))?.text ?? null;
}

/** Glyph, archetype, equipped title and the XP bar toward the next level. */
export function CharacterHeader({ game }: { game: Game }) {
  const { character } = game;
  const sign = SIGNS[character.sign];
  const level = levelOf(character);
  const toNext = xpToNextLevel(character.totalXp);
  const floor = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const ceiling = LEVEL_THRESHOLDS[level] ?? character.totalXp;
  const progress = toNext === null ? 1 : (character.totalXp - floor) / (ceiling - floor);
  const title = equippedTitleText(game);
  const t = useToneColors();

  return (
    <View style={styles.row}>
      <CharacterAvatar character={character} size={68} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[styles.title, { color: t.text }]}>{title ?? sign.archetype}</Text>
        <Text style={[styles.sub, { color: t.textMuted }]}>
          {sign.name} · Level {level}
          {game.equippedTitle ? ` · ${CAREERS[game.equippedTitle].className}` : ''}
        </Text>
        <View style={[styles.track, { backgroundColor: t.track }]}>
          <View style={[styles.fill, { backgroundColor: t.fill }, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <Text style={[styles.xp, { color: t.textMuted }]}>{toNext === null ? `${character.totalXp} XP · max level` : `${character.totalXp} XP · ${toNext} to level ${level + 1}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  title: type.h2,
  sub: { ...type.label, fontSize: 10, letterSpacing: 1.8 },
  track: { height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 2 },
  fill: { height: '100%', borderRadius: 3 },
  xp: { ...type.small, fontSize: 12 },
});
