/// <reference types="node" />
// Generates CAREERS.md from src/content/careers.ts so the doc and the app can't drift apart.
// Run with: npm run docs:careers

import { writeFileSync } from 'node:fs';

import { ATTRIBUTE_LABELS } from '../src/content/attributes';
import { CAREER_IDS, CAREERS, type QuestStep } from '../src/content/careers';
import { WORK_STYLE_LABELS } from '../src/content/preferences';
import { WORLDS } from '../src/content/worlds';

const STEP_LABELS: Record<QuestStep, string> = {
  discover: 'Discover',
  day: 'Day in the life',
  beginner: 'Beginner version',
  own: 'Make it yours',
  real: 'Real world',
};

const TIER_LABELS = { taste: 'Taste', try: 'Try', test: 'Test' } as const;

const cell = (s: string) => s.replace(/\|/g, '\\|');
const list = (items: string[]) => items.map((i) => `- ${i}`).join('\n');

const lines: string[] = [
  '# Careers',
  '',
  '*Generated from `src/content/careers.ts` by `npm run docs:careers`. Edit the source, not this file.*',
  '',
  `${CAREER_IDS.length} careers. Rules, worlds, ranking and the quest template are in BORN-FOR PILOT_CONTENT.md.`,
  '',
];

CAREER_IDS.forEach((id, i) => {
  const c = CAREERS[id];
  const worlds = c.worlds.map((w) => `${WORLDS[w].emoji} ${WORLDS[w].name}`).join(' · ');

  lines.push(
    '---',
    '',
    `## ${i + 1}. ${c.name} · ${c.className} · ${c.constellation.name}`,
    '',
    `**Worlds:** ${worlds}`,
    '',
    `**One-liner:** ${c.oneLiner}`,
    '',
  );
  if (c.realityCheck) lines.push(`> **Reality check:** ${c.realityCheck}`, '');
  lines.push(
    '**Day-to-day:**',
    list(c.dayToDay),
    '',
    '**Downsides:**',
    list(c.downsides),
    '',
    `**Education & training:** ${c.education}`,
    '',
    '**Key traits:**',
    '| Trait | Required | Weight |',
    '|---|---|---|',
    ...c.requirements.map((r) => `| ${ATTRIBUTE_LABELS[r.attribute]} | ${r.required} | ${r.weight.toFixed(2)} |`),
    '',
    `**Work style:** ${c.workStyles.map((w) => WORK_STYLE_LABELS[w]).join(' · ')}`,
    '',
    '**Quests:**',
    '| # | Tier | Step | Quest | Instructions | What you\'ll learn | Time | Traits |',
    '|---|---|---|---|---|---|---|---|',
    ...c.quests.map(
      (q) =>
        `| ${q.star} | ${TIER_LABELS[q.tier]} | ${STEP_LABELS[q.step]} | ${cell(q.name)} | ${cell(q.instructions)} | ${cell(q.learn)} | ${q.time} | ${q.attributes.map((a) => ATTRIBUTE_LABELS[a]).join(', ')} |`,
    ),
    '',
    '**Real next steps:**',
    `- **Learn:** ${c.nextSteps.learn.join(' · ')}`,
    `- **Community:** ${c.nextSteps.community.join(' · ')}`,
    `- **Entry roles:** ${c.nextSteps.entryRoles.join(' · ')}`,
    `- **Search for:** ${c.nextSteps.searchFor.map((s) => `"${s}"`).join(', ')}`,
    '',
  );
});

writeFileSync('CAREERS.md', lines.join('\n'));
console.log(`Wrote CAREERS.md (${CAREER_IDS.length} careers)`);
