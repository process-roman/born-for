import { useEffect, useState } from 'react';
import { Animated, Platform, View } from 'react-native';

import type { Career, StarNumber } from '@/content/careers';
import { litLines } from '@/logic/constellation';
import { night } from './theme';

/**
 * A career constellation, drawn as gold line art for plum cards and night scenes: lit stars glow gold, unlit stay dim, and a line draws only when both of
 * its stars are lit (Blueprint §5). Star 5 is the Test "boss" star and renders larger.
 * `fresh` pulses a newly lit star.
 */
export function PathConstellation({
  career,
  lit,
  size,
  fresh,
}: {
  career: Career;
  lit: readonly StarNumber[];
  size: number;
  fresh?: StarNumber;
}) {
  const [pulse] = useState(() => new Animated.Value(fresh ? 0 : 1));
  useEffect(() => {
    if (!fresh) return;
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(pulse, { toValue: 1, friction: 4, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  }, [fresh, pulse]);

  const point = (star: StarNumber) => {
    const [x, y] = career.constellation.stars[star - 1]!;
    return { x: (x / 100) * size, y: (y / 100) * size };
  };
  const dot = Math.max(6, size / 22);

  return (
    <View style={{ width: size, height: size }}>
      {career.constellation.lines.map(([a, b]) => {
        const p = point(a);
        const q = point(b);
        const length = Math.hypot(q.x - p.x, q.y - p.y);
        const on = litLines(career, lit).some(([x, y]) => x === a && y === b);
        return (
          <View
            key={`${a}-${b}`}
            style={{
              position: 'absolute',
              left: (p.x + q.x) / 2 - length / 2,
              top: (p.y + q.y) / 2 - 0.75,
              width: length,
              height: 1.5,
              backgroundColor: on ? night.gold : night.text,
              opacity: on ? 0.75 : 0.14,
              transform: [{ rotate: `${Math.atan2(q.y - p.y, q.x - p.x)}rad` }],
            }}
          />
        );
      })}
      {career.quests.map(({ star }) => {
        const p = point(star);
        const isLit = lit.includes(star);
        const d = star === 5 ? dot * 1.5 : dot;
        const style = {
          position: 'absolute' as const,
          left: p.x - d / 2,
          top: p.y - d / 2,
          width: d,
          height: d,
          borderRadius: d / 2,
          backgroundColor: isLit ? night.gold : 'transparent',
          borderWidth: isLit ? 0 : 1,
          borderColor: 'rgba(248, 241, 231, 0.45)',
          shadowColor: night.gold,
          shadowOpacity: isLit ? 0.9 : 0,
          shadowRadius: d,
          shadowOffset: { width: 0, height: 0 },
        };
        if (star === fresh) {
          return (
            <Animated.View
              key={star}
              style={[style, { opacity: pulse, transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [3, 1] }) }] }]}
            />
          );
        }
        return <View key={star} style={style} />;
      })}
    </View>
  );
}
