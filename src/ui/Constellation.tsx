import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';

import type { ZodiacShape } from '@/content/zodiacConstellations';
import { C } from './theme';

const useNativeDriver = Platform.OS !== 'web';

/** Stars appear one by one, then the lines connect them. Calls onDone when finished. */
export function Constellation({
  shape,
  size,
  color = C.gold,
  onDone,
}: {
  shape: ZodiacShape;
  size: number;
  color?: string;
  onDone?: () => void;
}) {
  const [stars] = useState(() => shape.stars.map(() => new Animated.Value(0)));
  const [lines] = useState(() => shape.lines.map(() => new Animated.Value(0)));

  useEffect(() => {
    const appear = (v: Animated.Value, duration: number) =>
      Animated.timing(v, { toValue: 1, duration, easing: Easing.out(Easing.cubic), useNativeDriver });
    const animation = Animated.sequence([
      Animated.stagger(140, stars.map((v) => appear(v, 380))),
      Animated.stagger(110, lines.map((v) => appear(v, 320))),
      Animated.delay(450),
    ]);
    animation.start(({ finished }) => finished && onDone?.());
    return () => animation.stop();
  }, [stars, lines, onDone]);

  const point = ([x, y]: readonly [number, number]) => ({ x: (x / 100) * size, y: (y / 100) * size });

  return (
    <View style={{ width: size, height: size }}>
      {shape.lines.map(([a, b], i) => {
        const p = point(shape.stars[a]!);
        const q = point(shape.stars[b]!);
        const length = Math.hypot(q.x - p.x, q.y - p.y);
        const angle = Math.atan2(q.y - p.y, q.x - p.x);
        return (
          <Animated.View
            key={`l${i}`}
            style={{
              position: 'absolute',
              left: (p.x + q.x) / 2 - length / 2,
              top: (p.y + q.y) / 2 - 0.75,
              width: length,
              height: 1.5,
              backgroundColor: color,
              opacity: lines[i]!.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] }),
              transform: [{ rotate: `${angle}rad` }, { scaleX: lines[i]! }],
            }}
          />
        );
      })}
      {shape.stars.map((s, i) => {
        const p = point(s);
        return (
          <Animated.View
            key={`s${i}`}
            style={{
              position: 'absolute',
              left: p.x - 5,
              top: p.y - 5,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: C.text,
              shadowColor: color,
              shadowOpacity: 0.9,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 0 },
              opacity: stars[i],
              transform: [{ scale: stars[i]!.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }],
            }}
          />
        );
      })}
    </View>
  );
}
