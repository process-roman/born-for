import { StyleSheet, Text } from 'react-native';

import { PAY_SOURCE } from '@/content/careerPay';
import type { CareerId } from '@/content/careers';
import { payLines } from '@/logic/pay';
import { Card, Label } from './components';
import { day, F, S } from './theme';

/** "Pay in the US": the typical (median) figure, the range most people earn, and where it comes from. */
export function PayCard({ careerId }: { careerId: CareerId }) {
  const lines = payLines(careerId);
  if (!lines) return null;
  const figure = lines.range !== null;
  return (
    <Card>
      <Label>Pay in the US</Label>
      {figure ? (
        <>
          <Text style={styles.headline}>{lines.headline}</Text>
          <Text style={styles.muted}>Typical (median) pay</Text>
          <Text style={styles.body}>{lines.range}</Text>
        </>
      ) : (
        <Text style={styles.body}>{lines.headline}</Text>
      )}
      {lines.category ? <Text style={styles.muted}>Official category: {lines.category}</Text> : null}
      {figure ? <Text style={styles.source}>Source: {PAY_SOURCE}. Pay outside the US can be very different.</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  headline: { fontFamily: F.display, fontSize: 26, color: day.text },
  body: { fontFamily: F.body, fontSize: 15, lineHeight: 22, color: day.text, marginTop: S.xs },
  muted: { fontFamily: F.body, fontSize: 13, lineHeight: 18, color: day.textMuted },
  source: { fontFamily: F.body, fontSize: 12, lineHeight: 17, color: day.textMuted, marginTop: S.xs },
});
