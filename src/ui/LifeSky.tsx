// The living scene for the life sim (Life Sim Spec §11): one SVG drawn in code, no illustrations.
// Age moves the sky from dawn to dusk and the sun across it; Mastery adds stars, Joy warms the
// horizon, low Energy brings in mist, and the element tints the horizon.

import { useEffect, useId, useRef, useState } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import type { Meters } from '@/content/life';
import type { Element } from '@/content/signs';
import { dayProgress, glowOpacity, mistOpacity, mixHex, skyColors, starOpacity, type SkyState } from './lifeSkyModel';
import { elementGlow, lifeSky } from './theme';

const TRANSITION_MS = 600;
const MAX_STARS = 20;

/** Eases the scene toward new values over 600 ms; instant when the OS asks for reduced motion. */
function useTweened(target: SkyState): SkyState {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(target);
  const current = useRef(target);
  const { age, joy, energy, money, mastery } = target;

  useEffect(() => {
    const to: SkyState = { age, joy, energy, money, mastery };
    const from = current.current;
    if (reduceMotion) {
      current.current = to;
      return;
    }
    let frame = 0;
    const start = Date.now();
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / TRANSITION_MS);
      const k = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; // ease in-out
      const next = Object.fromEntries((Object.keys(to) as (keyof SkyState)[]).map((key) => [key, from[key] + (to[key] - from[key]) * k])) as unknown as SkyState;
      current.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [age, joy, energy, money, mastery, reduceMotion]);

  return reduceMotion ? target : value;
}

/** Four-point star centered on (x, y). */
function starPath(x: number, y: number, s: number): string {
  return `M${x},${y - s} Q${x},${y} ${x + s},${y} Q${x},${y} ${x},${y + s} Q${x},${y} ${x - s},${y} Q${x},${y} ${x},${y - s} Z`;
}

/** Deterministic star spots inside the top of the arch. */
function starSpots(w: number, h: number): [number, number, number][] {
  const r = w / 2;
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const spots: [number, number, number][] = [];
  while (spots.length < MAX_STARS) {
    const x = w * (0.12 + rand() * 0.76);
    const y = h * (0.08 + rand() * 0.42);
    const size = 3.5 + rand() * 3.5;
    const inside = y >= r || (x - r) ** 2 + (y - r) ** 2 < (r * 0.86) ** 2;
    if (inside) spots.push([x, y, size]);
  }
  return spots;
}

function ridge(w: number, h: number, points: [number, number][]): string {
  return `M0,${h} ${points.map(([x, y]) => `L${x * w},${y * h}`).join(' ')} L${w},${h} Z`;
}

/** The winding path: a cubic centerline from the bottom of the arch to the horizon, tapering. */
function roadPath(w: number, h: number): string {
  const p = [
    [0.5, 1.0],
    [0.12, 0.88],
    [0.86, 0.77],
    [0.55, 0.665],
  ] as const;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const u = 1 - t;
    const x = u ** 3 * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t ** 3 * p[3][0];
    const y = u ** 3 * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t ** 3 * p[3][1];
    const half = ((0.17 * u + 0.006 * t) * w) / 2;
    left.push(`${x * w - half},${y * h}`);
    right.unshift(`${x * w + half},${y * h}`);
  }
  return `M${left.join(' L')} L${right.join(' L')} Z`;
}

export function LifeSky({
  age,
  meters,
  element,
  variant,
  style,
}: {
  age: number;
  meters: Meters;
  element: Element;
  variant: 'card' | 'full';
  style?: StyleProp<ViewStyle>;
}) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const s = useTweened({ age, ...meters });
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (!size || Math.abs(size.w - width) > 0.5 || Math.abs(size.h - height) > 0.5) setSize({ w: width, h: height });
  };

  const box: StyleProp<ViewStyle> = variant === 'card' ? { width: '100%', aspectRatio: 1.15 } : { flex: 1, width: '100%' };
  if (!size) return <View style={[box, style]} onLayout={onLayout} />;

  const { w, h } = size;
  const r = w / 2;
  const arch = `M0,${h} L0,${r} A${r},${r} 0 0 1 ${w},${r} L${w},${h} Z`;
  const horizon = h * 0.62;
  const sky = skyColors(s.age);
  const t = dayProgress(s.age);
  const sunR = w * 0.055;
  const sunX = w * (0.14 + 0.72 * t);
  const sunY = horizon - Math.sin(Math.PI * t) * horizon * 0.58 - h * 0.05;
  const sunColor = s.age >= 27 ? mixHex(lifeSky.sun, lifeSky.glow, (s.age - 27) / 3) : lifeSky.sun;
  const label = `Age ${Math.round(s.age)}. Joy ${Math.round(meters.joy)}, energy ${Math.round(meters.energy)}, money ${Math.round(meters.money)}, mastery ${Math.round(meters.mastery)}.`;

  return (
    <View style={[box, style]} onLayout={onLayout} accessibilityRole="image" accessibilityLabel={label}>
      <Svg width={w} height={h}>
        <Defs>
          <ClipPath id={`arch${id}`}>
            <Path d={arch} />
          </ClipPath>
          <LinearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={sky.top} />
            <Stop offset="1" stopColor={sky.bottom} />
          </LinearGradient>
          <LinearGradient id={`glow${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={lifeSky.glow} stopOpacity={0} />
            <Stop offset="0.8" stopColor={lifeSky.glow} stopOpacity={glowOpacity(s.joy)} />
            <Stop offset="1" stopColor={lifeSky.glow} stopOpacity={0} />
          </LinearGradient>
          <LinearGradient id={`tint${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={elementGlow[element]} stopOpacity={0} />
            <Stop offset="1" stopColor={elementGlow[element]} stopOpacity={0.22} />
          </LinearGradient>
          <LinearGradient id={`mist${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={lifeSky.mist} stopOpacity={0} />
            <Stop offset="1" stopColor={lifeSky.mist} stopOpacity={mistOpacity(s.energy)} />
          </LinearGradient>
        </Defs>

        <G clipPath={`url(#arch${id})`}>
          <Rect x={0} y={0} width={w} height={h} fill={`url(#sky${id})`} />
          <Rect x={0} y={horizon - h * 0.3} width={w} height={h * 0.34} fill={`url(#glow${id})`} />
          <Rect x={0} y={horizon - h * 0.14} width={w} height={h * 0.14} fill={`url(#tint${id})`} />
          {starSpots(w, h).map(([x, y, sz], i) => {
            const opacity = starOpacity(s.mastery, i);
            return opacity > 0 ? <Path key={i} d={starPath(x, y, sz)} fill={lifeSky.star} opacity={opacity} /> : null;
          })}
          <Circle cx={sunX} cy={sunY} r={sunR * 2.3} fill={sunColor} opacity={0.22} />
          <Circle cx={sunX} cy={sunY} r={sunR} fill={sunColor} />
          <Path
            d={ridge(w, h, [
              [0, 0.6],
              [0.12, 0.52],
              [0.27, 0.58],
              [0.42, 0.47],
              [0.58, 0.56],
              [0.74, 0.49],
              [0.88, 0.57],
              [1, 0.53],
            ])}
            fill={lifeSky.farMountains}
            opacity={0.6}
          />
          <Path
            d={ridge(w, h, [
              [0, 0.7],
              [0.17, 0.63],
              [0.33, 0.69],
              [0.5, 0.645],
              [0.68, 0.71],
              [0.85, 0.635],
              [1, 0.68],
            ])}
            fill={lifeSky.nearMountains}
          />
          <Path d={roadPath(w, h)} fill={lifeSky.path} opacity={0.7} />
          <Rect x={0} y={h * 0.45} width={w} height={h * 0.55} fill={`url(#mist${id})`} />
        </G>
        <Path d={arch} fill="none" stroke={lifeSky.outline} strokeWidth={1.5} />
      </Svg>
    </View>
  );
}
