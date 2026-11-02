// An engraved celestial medallion. The five progression layers keep their original rules.

import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { SIGNS } from '@/content/signs';
import { avatarLayers } from '@/logic/avatar';
import type { Character } from '@/logic/character';
import { elementGlow, fonts, night, palette } from './theme';
import { ArchetypePortrait } from './ArchetypePortrait';
import { CareerAccessory } from './CareerAccessory';
import { CelestialStar } from './CelestialArt';

const AURA_STARS = 10;

export function CharacterAvatar({ character, size }: { character: Character; size: number }) {
  const layers = avatarLayers(character);
  const element = elementGlow[SIGNS[character.sign].element];
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
                  opacity: 0.7,
                }}
              ><CelestialStar size={d} color={night.gold} /></View>
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
            borderColor: layers.frame ? night.gold : layers.glow ? element : night.line,
            borderWidth: layers.frame ? 3 : 1,
          },
          layers.glow && { shadowColor: element, shadowOpacity: 0.9, shadowRadius: size * 0.18, shadowOffset: { width: 0, height: 0 }, backgroundColor: palette.plum },
        ]}
      >
        <LinearGradient colors={['#695373', '#342541', '#241B33']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: core / 2 }]} />
        <Svg width={core} height={core} viewBox="0 0 100 100" style={StyleSheet.absoluteFill} aria-hidden>
          <Circle cx="50" cy="50" r="44" fill="none" stroke={night.gold} strokeWidth=".45" opacity=".65" />
          <Circle cx="50" cy="50" r="39" fill="none" stroke={night.gold} strokeWidth=".25" opacity=".3" />
          <G stroke={night.gold} strokeWidth=".6" opacity=".5">
            {Array.from({ length: 12 }, (_, i) => <Path key={i} d="M50 7V11" transform={`rotate(${i * 30} 50 50)`} />)}
          </G>
        </Svg>
        <View><ArchetypePortrait key={character.sign} sign={character.sign} size={core * .86} /></View>
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
          <CareerAccessory careerId={layers.item.careerId} size={size * .22} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  core: { alignItems: 'center', justifyContent: 'center', backgroundColor: palette.plumDeep },
  spark: { position: 'absolute', color: night.gold, fontFamily: fonts.sans },
  item: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.plumDeep,
    borderWidth: 1,
    borderColor: night.gold,
  },
});
