// Placeholder art for the evolving character (Blueprint §7). Built as stacked layers so real
// illustrations can replace each one later: base → aura → element glow → path item → celestial frame.

import { StyleSheet, Text, View } from 'react-native';

import { CAREERS } from '@/content/careers';
import { SIGNS } from '@/content/signs';
import { ELEMENT_COLORS } from '@/content/theme';
import { WORLDS } from '@/content/worlds';
import { avatarLayers } from '@/logic/avatar';
import type { Character } from '@/logic/character';
import { C, F, glyph } from './theme';

const AURA_STARS = 10;

export function CharacterAvatar({ character, size }: { character: Character; size: number }) {
  const layers = avatarLayers(character);
  const element = ELEMENT_COLORS[SIGNS[character.sign].element];
  const core = size * 0.72;
  const label = `${SIGNS[character.sign].archetype}, level ${layers.level}${layers.item ? `, carrying a ${layers.item.name}` : ''}`;

  return (
    <View accessibilityRole="image" accessibilityLabel={label} style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {layers.aura
        ? Array.from({ length: AURA_STARS }, (_, i) => {
            const angle = (i / AURA_STARS) * Math.PI * 2;
            const r = size * 0.46;
            const d = i % 3 === 0 ? size * 0.05 : size * 0.03;
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: size / 2 + Math.cos(angle) * r - d / 2,
                  top: size / 2 + Math.sin(angle) * r - d / 2,
                  width: d,
                  height: d,
                  borderRadius: d / 2,
                  backgroundColor: C.text,
                  opacity: 0.7,
                }}
              />
            );
          })
        : null}

      <View
        style={[
          styles.core,
          {
            width: core,
            height: core,
            borderRadius: core / 2,
            borderColor: layers.frame ? C.gold : layers.glow ? element : C.goldBorder,
            borderWidth: layers.frame ? 3 : 1,
          },
          layers.glow && { shadowColor: element, shadowOpacity: 0.9, shadowRadius: size * 0.18, shadowOffset: { width: 0, height: 0 }, backgroundColor: C.cardRaised },
        ]}
      >
        <Text style={{ fontSize: core * 0.5, color: C.gold }}>{glyph(character.sign)}</Text>
      </View>

      {layers.frame
        ? (['✦', '✦', '✦', '✦'] as const).map((s, i) => (
            <Text
              key={i}
              style={[
                styles.spark,
                { fontSize: size * 0.12 },
                i === 0 && { top: 0, left: size * 0.12 },
                i === 1 && { top: 0, right: size * 0.12 },
                i === 2 && { bottom: 0, left: size * 0.12 },
                i === 3 && { bottom: 0, right: size * 0.12 },
              ]}
            >
              {s}
            </Text>
          ))
        : null}

      {layers.item ? (
        <View style={[styles.item, { width: size * 0.32, height: size * 0.32, borderRadius: size * 0.16 }]}>
          <Text style={{ fontSize: size * 0.16 }}>{WORLDS[CAREERS[layers.item.careerId].worlds[0]!].emoji}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  core: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.night },
  spark: { position: 'absolute', color: C.gold, fontFamily: F.body },
  item: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.nightDeep,
    borderWidth: 1,
    borderColor: C.gold,
  },
});
