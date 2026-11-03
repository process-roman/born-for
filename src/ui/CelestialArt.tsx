import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

/** A shared, scalable star shape; decorative SVGs never intercept touches. */
export const sparklePath = 'M12 0C12 9 15 12 24 12C15 12 12 15 12 24C12 15 9 12 0 12C9 12 12 9 12 0Z';

export function CelestialStar({ size, color }: { size: number; color: string }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden><Path d={sparklePath} fill={color} /></Svg>;
}

/** Abstract dusk illustration, sized by its existing parent arch. */
export function CelestialScene() {
  const id = useId().replace(/\W/g, '');
  return (
    <View pointerEvents="none" accessible={false} style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 240 320" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id={`${id}sky`} x2="0" y2="1">
            <Stop stopColor="#28203F" /><Stop offset="0.48" stopColor="#756486" /><Stop offset="1" stopColor="#F0CEB8" />
          </LinearGradient>
          <RadialGradient id={`${id}halo`} cx="0.5" cy="0.5" r="0.5">
            <Stop stopColor="#FFE4BF" stopOpacity="0.65" /><Stop offset="1" stopColor="#E9A889" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id={`${id}hills`} x2="0" y2="1">
            <Stop stopColor="#887594" /><Stop offset="1" stopColor="#42324F" />
          </LinearGradient>
          <LinearGradient id={`${id}road`} x2="0" y2="1">
            <Stop stopColor="#F3D2AE" /><Stop offset="1" stopColor="#FAEEE0" />
          </LinearGradient>
        </Defs>
        <Rect width="240" height="320" fill={`url(#${id}sky)`} />
        <Circle cx="158" cy="222" r="98" fill={`url(#${id}halo)`} />
        <Circle cx="158" cy="222" r="30" fill="#F5D3AF" opacity="0.8" />
        <Path d="M169 51A22 22 0 1 1 144 84A25 25 0 0 0 169 51Z" fill="#EED4B2" />
        <Ellipse cx="119" cy="129" rx="94" ry="27" transform="rotate(-25 119 129)" fill="none" stroke="#E4C597" strokeWidth="0.6" opacity="0.65" />
        {[ [39,74,2], [93,38,1.3], [202,98,1.3], [67,138,1], [185,159,1], [126,110,1.4], [48,187,1] ].map(([x,y,r],i) => <Circle key={i} cx={x} cy={y} r={r} fill="#F2D7AE" opacity="0.8" />)}
        <Path d={sparklePath} fill="#EED4B2" transform="translate(91 76) scale(.45)" />
        <Path d={sparklePath} fill="#EED4B2" transform="translate(190 40) scale(.24)" />
        <Path d="M0 245Q26 213 52 230T100 223T152 237T206 218T260 226V320H0Z" fill="#B8A3BB" opacity="0.6" />
        <Path d="M0 274Q30 234 65 255T123 250T180 257T240 240V320H0Z" fill={`url(#${id}hills)`} />
        <Path d="M0 303Q35 268 77 284T143 280T208 269T260 275V320H0Z" fill="#362944" />
        <Path d="M122 320C99 300 194 281 151 264C143 259 142 254 149 250C130 255 129 261 138 269C160 287 49 300 67 320Z" fill={`url(#${id}road)`} opacity="0.88" />
      </Svg>
    </View>
  );
}

/** Quiet light and orbital engraving behind existing plum-card content. */
export function CelestialBackdrop() {
  const id = useId().replace(/\W/g, '');
  return (
    <View pointerEvents="none" accessible={false} style={[StyleSheet.absoluteFill, { borderRadius: 24, overflow: 'hidden' }]}>
      <Svg width={240} height={260} style={{ position: 'absolute', top: 0, right: 0 }} viewBox="0 0 400 400" preserveAspectRatio="xMaxYMin meet">
        <Defs>
          <RadialGradient id={`${id}wash`} cx="0.8" cy="0.15" r="0.8">
            <Stop stopColor="#A98AA3" stopOpacity="0.25" /><Stop offset="1" stopColor="#382744" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="400" height="400" fill={`url(#${id}wash)`} />
        <G fill="none" stroke="#E6C27E" strokeWidth="0.6" opacity="0.12">
          <Circle cx="365" cy="90" r="88" /><Circle cx="365" cy="90" r="94" />
          <Ellipse cx="338" cy="117" rx="100" ry="28" transform="rotate(-35 338 117)" />
        </G>
        {Array.from({ length: 26 }, (_, i) => <Circle key={i} cx={190 + (i * 73) % 210} cy={(i * 47) % 400} r={i % 5 === 0 ? 1.1 : .5} fill="#F0D9B1" opacity={i % 3 === 0 ? .28 : .13} />)}
      </Svg>
    </View>
  );
}
