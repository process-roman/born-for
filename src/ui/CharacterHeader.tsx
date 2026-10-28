import { StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import { SIGNS } from '@/content/signs';
import { levelOf, litStarNumbers } from '@/logic/character';
import type { Game } from '@/logic/game';
import { titleFor } from '@/logic/titles';
import { LEVEL_THRESHOLDS, xpToNextLevel } from '@/logic/xp';
import { CharacterAvatar } from './CharacterAvatar';
import { C, F, S } from './theme';

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

  return (
    <View style={styles.row}>
      <CharacterAvatar character={character} size={68} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.title}>{title ?? sign.archetype}</Text>
        <Text style={styles.sub}>
          {sign.name} · Level {level}
          {game.equippedTitle ? ` · ${CAREERS[game.equippedTitle].className}` : ''}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <Text style={styles.xp}>{toNext === null ? `${character.totalXp} XP · max level` : `${character.totalXp} XP · ${toNext} to level ${level + 1}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  title: { fontFamily: F.display, fontSize: 18, color: C.text },
  sub: { fontFamily: F.body, fontSize: 13, color: C.textMuted },
  track: { height: 6, borderRadius: 3, backgroundColor: C.track, overflow: 'hidden', marginTop: 2 },
  fill: { height: '100%', backgroundColor: C.gold, borderRadius: 3 },
  xp: { fontFamily: F.body, fontSize: 12, color: C.textMuted },
});
