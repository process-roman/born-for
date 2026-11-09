// Q1: Welcome + intent, under the arch window.

import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { INTENTS } from '@/content/preferences';
import { useGame } from '@/state/game';
import { useOnboarding } from '@/state/onboarding';
import { Body, Label, OptionCard, Screen, Title } from '@/ui/components';
import { LifeIcon } from '@/ui/lifeIcons';
import { ArchWindow } from '@/ui/kit';
import { day, fonts, S, type } from '@/ui/theme';

const LOGO = require('../../assets/images/logo.png');

export default function Welcome() {
  const { state, dispatch } = useOnboarding();
  const { game } = useGame();
  if (game) return <Redirect href="/home" />;
  return (
    <Screen>
      <View style={styles.hero}>
        <ArchWindow width={150} height={200} />
        <View style={styles.brandRow}>
          <Image source={LOGO} style={styles.logo} accessible={false} />
          <Text style={styles.brand}>BORN FOR</Text>
        </View>
        <Title style={type.hero}>
          Explore a career <Text style={styles.accent}>before choosing your path.</Text>
        </Title>
        <Body muted>Step into different career lives. Make decisions, experience the trade-offs, and discover which paths you want to pursue in real life.</Body>
      </View>
      <Label style={{ textAlign: 'center' }}>What brings you here?</Label>
      <View style={{ gap: S.sm }}>
        {INTENTS.map((o) => (
          <OptionCard
            key={o.id}
            icon={<LifeIcon name={{ discover: 'sparkle', career: 'compass', change: 'path', curious: 'star' }[o.id]} size={22} color={day.primary} />}
            label={o.label}
            selected={state.intent === o.id}
            onPress={() => {
              dispatch({ type: 'intent', intent: o.id });
              router.push('/birthday');
            }}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: S.md, marginTop: S.lg, marginBottom: S.md },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm, marginTop: S.sm },
  logo: { width: 28, height: 28 },
  brand: { ...type.label, fontSize: 12, letterSpacing: 6, color: day.primary },
  accent: { fontFamily: fonts.serifItalic, color: day.accent },
});
