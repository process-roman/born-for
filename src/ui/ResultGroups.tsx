// The three result groups: your picks, more in your worlds, wildcards (Pilot Content §4.5b).

import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { statsOf, type Character } from '@/logic/character';
import { groupMatches, type CareerMatch, type Ranking } from '@/logic/ranking';
import { Body, Button, Label } from './components';
import { PathCard } from './PathCard';
import { S } from './theme';

const WORLD_PREVIEW = 4;

function Group({ title, blurb, matches, limit }: { title: string; blurb?: string; matches: CareerMatch[]; limit?: number }) {
  const [all, setAll] = useState(false);
  if (matches.length === 0) return null;
  const shown = limit && !all ? matches.slice(0, limit) : matches;
  return (
    <View style={{ gap: S.md }}>
      <Label>{title}</Label>
      {blurb ? (
        <Body muted style={{ textAlign: 'left', marginTop: -S.sm }}>
          {blurb}
        </Body>
      ) : null}
      {shown.map((m) => (
        <PathCard key={m.careerId} match={m} onPress={() => router.push({ pathname: '/path/[id]', params: { id: m.careerId } })} />
      ))}
      {limit && !all && matches.length > limit ? <Button title={`Show all ${matches.length}`} variant="ghost" onPress={() => setAll(true)} /> : null}
    </View>
  );
}

export function ResultGroups({ ranking, character }: { ranking: Ranking; character: Character }) {
  const groups = groupMatches(ranking, statsOf(character));
  return (
    <View style={{ gap: S.xl }}>
      <Group title="Your picks" blurb="The jobs you chose, ranked by how naturally they fit you right now." matches={groups.picks} />
      <Group
        title={character.picks.length ? 'More in your worlds' : 'Top paths in your worlds'}
        matches={groups.inWorlds}
        limit={WORLD_PREVIEW}
      />
      <Group title="Wildcards" blurb="Outside your worlds, but built on your strongest traits." matches={groups.wildcards} />
    </View>
  );
}
