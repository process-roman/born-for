/// <reference types="node" />
// Balance test for the life simulator (Life Sim Spec §16), ported from balance_check.py.
// Plays 12 signs × 3 strategies × N lives and checks the targets.
//
//   npm run life:balance                    ux_design with the app's sign stats
//   npm run life:balance -- ux_design --reference   the profiles from balance_check.py
//   npm run life:balance -- --runs 200
//
// Exits with 1 when content is invalid or a target is missed.

import type { AttributeId, Stats } from '../src/content/attributes';
import { ATTRIBUTE_IDS } from '../src/content/attributes';
import type { CareerId } from '../src/content/careers';
import { LIVES, METERS, SHARED_EVENTS, type Choice, type Meter } from '../src/content/life';
import { SIGN_IDS, SIGNS, type Element, type SignId } from '../src/content/signs';
import { createRng, oddsFor, playLife, type LifeRun } from '../src/logic/life';
import { validateLife } from '../src/logic/lifeValidate';

/** The 8-trait profiles balance_check.py uses, for comparing against the reference numbers. */
const REFERENCE: Record<SignId, [Element, Partial<Record<AttributeId, number>>]> = {
  aries: ['fire', { creativity: 60, analytical: 50, empathy: 50, communication: 70, organization: 40, independence: 85, curiosity: 70, persistence: 55 }],
  taurus: ['earth', { creativity: 65, analytical: 55, empathy: 55, communication: 50, organization: 70, independence: 60, curiosity: 40, persistence: 85 }],
  gemini: ['air', { creativity: 65, analytical: 60, empathy: 50, communication: 85, organization: 40, independence: 55, curiosity: 85, persistence: 40 }],
  cancer: ['water', { creativity: 60, analytical: 50, empathy: 85, communication: 60, organization: 65, independence: 40, curiosity: 50, persistence: 70 }],
  leo: ['fire', { creativity: 80, analytical: 40, empathy: 55, communication: 80, organization: 40, independence: 65, curiosity: 55, persistence: 65 }],
  virgo: ['earth', { creativity: 45, analytical: 85, empathy: 50, communication: 45, organization: 85, independence: 50, curiosity: 50, persistence: 70 }],
  libra: ['air', { creativity: 70, analytical: 60, empathy: 75, communication: 80, organization: 55, independence: 35, curiosity: 55, persistence: 50 }],
  scorpio: ['water', { creativity: 50, analytical: 75, empathy: 55, communication: 40, organization: 50, independence: 70, curiosity: 55, persistence: 85 }],
  sagittarius: ['fire', { creativity: 60, analytical: 55, empathy: 50, communication: 65, organization: 35, independence: 80, curiosity: 85, persistence: 50 }],
  capricorn: ['earth', { creativity: 45, analytical: 70, empathy: 45, communication: 45, organization: 85, independence: 60, curiosity: 45, persistence: 85 }],
  aquarius: ['air', { creativity: 80, analytical: 65, empathy: 45, communication: 50, organization: 35, independence: 80, curiosity: 80, persistence: 45 }],
  pisces: ['water', { creativity: 85, analytical: 45, empathy: 85, communication: 60, organization: 35, independence: 55, curiosity: 65, persistence: 50 }],
};

const STRATEGIES = ['random', 'safe', 'bold'] as const;
type Strategy = (typeof STRATEGIES)[number];

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const career = (args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--runs') ?? 'ux_design') as CareerId;
const runsPer = Number(option('runs') ?? 1000);
const reference = flag('reference');

const life = LIVES[career];
if (!life) {
  console.error(`No life content for "${career}". Lives: ${Object.keys(LIVES).join(', ')}`);
  process.exit(1);
}

const report = validateLife(life, SHARED_EVENTS);
for (const w of report.warnings) console.log(`warning: ${w}`);
if (report.errors.length) {
  for (const e of report.errors) console.error(`error: ${e}`);
  process.exit(1);
}

function profile(sign: SignId): { stats: Stats; element: Element } {
  if (!reference) return { stats: SIGNS[sign].stats, element: SIGNS[sign].element };
  const [element, values] = REFERENCE[sign];
  return { stats: Object.fromEntries(ATTRIBUTE_IDS.map((a) => [a, values[a] ?? 50])) as Stats, element };
}

const rng = createRng(42);
const pickRandom = <T>(items: T[]): T => items[Math.floor(rng() * items.length)]!;

function chooser(strategy: Strategy) {
  return (_event: unknown, choices: Choice[], run: LifeRun): Choice => {
    if (strategy === 'random') return pickRandom(choices);
    if (strategy === 'safe') {
      const safe = choices.filter((c) => !c.check);
      return pickRandom(safe.length ? safe : choices);
    }
    const checks = choices.filter((c) => c.check);
    if (!checks.length) return pickRandom(choices);
    // Highest odds; the first one wins ties, like Python's max().
    return checks.reduce((best, c) => (oddsFor(run.statsSnapshot, c.check!, run.flags) > oddsFor(run.statsSnapshot, best.check!, run.flags) ? c : best));
  };
}

const endingIds = life.endings.map((e) => e.id);
const endings: Record<Strategy, Map<string, number>> = { random: new Map(), safe: new Map(), bold: new Map() };
const signEndings = new Map<SignId, Map<string, number>>();
const eventCounts = new Map<string, number>();
const skipped = new Map<string, number>();
const finals: Record<Meter, number> = { joy: 0, energy: 0, money: 0, mastery: 0 };
let checks = 0;
let oddsSum = 0;
let successes = 0;
let burnout = 0;
let events = 0;
let total = 0;
const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);

for (const strategy of STRATEGIES) {
  for (const sign of SIGN_IDS) {
    const { stats, element } = profile(sign);
    for (let i = 0; i < runsPer; i++) {
      const seed = Math.floor(rng() * 4294967296);
      const { run, skipped: skips } = playLife(life, SHARED_EVENTS, { id: `${total}`, career, seed, startedAt: '2026-10-30T00:00:00Z', stats, element }, chooser(strategy));
      total += 1;
      const ending = run.completed!.endingId;
      bump(endings[strategy], ending);
      if (strategy === 'random') {
        if (!signEndings.has(sign)) signEndings.set(sign, new Map());
        bump(signEndings.get(sign)!, ending);
      }
      for (const entry of run.log) {
        bump(eventCounts, entry.eventId);
        events += 1;
        if (entry.check) {
          checks += 1;
          oddsSum += entry.check.odds;
          successes += entry.check.success ? 1 : 0;
        }
      }
      if (run.log.some((l) => l.eventId === 'shared_burnout')) burnout += 1;
      for (const s of skips) bump(skipped, s);
      for (const m of METERS) finals[m] += run.meters[m];
    }
  }
}

const perStrategy = runsPer * SIGN_IDS.length;
const pct = (n: number, of: number) => (100 * n) / of;
const fmt = (n: number) => `${n.toFixed(1)}%`;

console.log(`\nCareer: ${career} · ${total} lives (12 signs × 3 strategies × ${runsPer}) · ${reference ? 'reference profiles' : 'app sign stats'}\n`);
console.log('Endings by strategy (%):');
console.log(`  ${'ending'.padEnd(18)}${STRATEGIES.map((s) => s.padStart(9)).join('')}`);
for (const id of endingIds) console.log(`  ${id.padEnd(18)}${STRATEGIES.map((s) => fmt(pct(endings[s].get(id) ?? 0, perStrategy)).padStart(9)).join('')}`);

const short = (id: string) => id.replace(/^ux_end_/, '');
console.log('\nEndings by sign (random strategy, %):');
for (const [sign, counts] of signEndings) {
  const n = [...counts.values()].reduce((a, b) => a + b, 0);
  console.log(`  ${sign.padEnd(12)}${endingIds.map((id) => `${short(id)} ${pct(counts.get(id) ?? 0, n).toFixed(1).padStart(5)}`).join('  ')}`);
}

const avgOdds = oddsSum / checks;
const eventsPerLife = events / total;
console.log(`\nChecks: ${checks} · average shown odds ${avgOdds.toFixed(1)}% · actual success ${fmt(pct(successes, checks))}`);
console.log(`Burnout event in ${fmt(pct(burnout, total))} of lives`);
console.log(`Average final meters: ${METERS.map((m) => `${m} ${Math.round(finals[m] / total)}`).join(', ')}`);
console.log(`Average events per life: ${eventsPerLife.toFixed(1)}`);
console.log(`Skipped slots: ${skipped.size ? JSON.stringify(Object.fromEntries(skipped)) : 'none'}`);

const allIds = [...life.events, ...SHARED_EVENTS].map((e) => e.id);
console.log('\nEvent appearance (% of lives):');
for (const id of allIds) console.log(`  ${id.padEnd(22)} ${fmt(pct(eventCounts.get(id) ?? 0, total)).padStart(6)}`);
const rarest = allIds.reduce((a, b) => ((eventCounts.get(a) ?? 0) <= (eventCounts.get(b) ?? 0) ? a : b));

// Targets (§16).
const thriving = endingIds.find((id) => id.endsWith('_thriving'));
const targets: [string, boolean, string][] = [
  ...endingIds.map((id): [string, boolean, string] => {
    const p = pct(endings.random.get(id) ?? 0, perStrategy);
    return [`${life.endings.find((e) => e.id === id)!.name}, random: 5–55%`, p >= 5 && p <= 55, fmt(p)];
  }),
  ...(thriving
    ? [
        [
          'Thriving, bold higher than random',
          (endings.bold.get(thriving) ?? 0) > (endings.random.get(thriving) ?? 0),
          `${fmt(pct(endings.bold.get(thriving) ?? 0, perStrategy))} vs ${fmt(pct(endings.random.get(thriving) ?? 0, perStrategy))}`,
        ] as [string, boolean, string],
      ]
    : []),
  ['Average shown odds: 50–65%', avgOdds >= 50 && avgOdds <= 65, fmt(avgOdds)],
  ['Burnout event: 8–20% of lives', pct(burnout, total) >= 8 && pct(burnout, total) <= 20, fmt(pct(burnout, total))],
  ['Skipped slots: 0', skipped.size === 0, String([...skipped.values()].reduce((a, b) => a + b, 0))],
  ['Events per life: 10–12', eventsPerLife >= 10 && eventsPerLife <= 12, eventsPerLife.toFixed(1)],
  ['Every event appears in ≥ 5% of lives', pct(eventCounts.get(rarest) ?? 0, total) >= 5, `lowest: ${rarest} ${fmt(pct(eventCounts.get(rarest) ?? 0, total))}`],
];

console.log('\nTargets:');
for (const [name, ok, value] of targets) console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(40)} ${value}`);
const failed = targets.filter(([, ok]) => !ok).length;
console.log(failed ? `\n${failed} target(s) missed.` : '\nAll targets met.');
process.exit(failed ? 1 : 0);
