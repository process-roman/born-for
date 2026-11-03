import { Pressable, StyleSheet } from 'react-native';
import { SpeakerHighIcon } from 'phosphor-react-native/src/icons/SpeakerHigh';
import { SpeakerSlashIcon } from 'phosphor-react-native/src/icons/SpeakerSlash';

import { useFeel } from '@/state/feel';
import { day, night } from './theme';

/** One tap to mute or bring back the calm music on the screens that have it. */
export function MusicToggle({ tone = 'day' }: { tone?: 'day' | 'night' }) {
  const { prefs, setPref } = useFeel();
  const color = tone === 'day' ? day.primary : night.text;
  const Glyph = prefs.music ? SpeakerHighIcon : SpeakerSlashIcon;
  return (
    <Pressable
      role="switch"
      aria-label="Music"
      aria-checked={prefs.music}
      hitSlop={8}
      onPress={() => setPref('music', !prefs.music)}
      style={styles.button}
    >
      <Glyph size={20} color={color} weight="light" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
