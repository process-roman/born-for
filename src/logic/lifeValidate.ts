// Content validation for life sim JSON (Life Sim Spec §9). Run by tests and the balance script.
// Errors break a life; warnings (e.g. a flag nobody sets) are worth a look but don't.

import { ATTRIBUTE_IDS } from '../content/attributes';
import { CAREER_IDS, CAREERS } from '../content/careers';
import { EVENT_KINDS, METERS, STAGES, type CareerLife, type Condition, type LifeEvent, type Outcome } from '../content/life';
import { LIFE_SLOTS } from './life';

const ELEMENTS = ['fire', 'earth', 'air', 'water'];

export interface ValidationReport {
  errors: string[];
  warnings: string[];
}

/** `iconNames`: kebab-case names available in the icon library; skipped when not given. */
export function validateLife(life: CareerLife, shared: LifeEvent[], iconNames?: ReadonlySet<string>): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const events = [...life.events, ...shared];

  if (!CAREER_IDS.includes(life.career)) errors.push(`${life.career}: not a known career id`);
  else if (CAREERS[life.career].className !== life.class) {
    errors.push(`${life.career}: class "${life.class}" doesn't match the title system ("${CAREERS[life.career].className}")`);
  }

  const setFlags = new Set<string>();
  const usedFlags = new Map<string, string>(); // flag → where it's used
  const noteFlags = (flags: string[] | undefined, where: string) => flags?.forEach((f) => usedFlags.has(f) || usedFlags.set(f, where));

  const checkCondition = (c: Condition | undefined, where: string) => {
    if (!c) return;
    noteFlags(c.flagsAll, where);
    noteFlags(c.flagsNone, where);
    for (const m of [...Object.keys(c.meterMin ?? {}), ...Object.keys(c.meterMax ?? {})]) {
      if (!(METERS as readonly string[]).includes(m)) errors.push(`${where}: unknown meter "${m}"`);
    }
    for (const e of c.elements ?? []) if (!ELEMENTS.includes(e)) errors.push(`${where}: unknown element "${e}"`);
    c.anyOf?.forEach((sub, i) => checkCondition(sub, `${where} anyOf[${i}]`));
  };

  const checkOutcome = (o: Outcome | undefined, where: string) => {
    if (!o) return;
    if (!o.text) errors.push(`${where}: outcome has no text`);
    for (const key of Object.keys(o.effects ?? {})) {
      if (!['set', 'clear', 'highlight', ...METERS].includes(key)) errors.push(`${where}: unknown effect "${key}"`);
    }
    o.effects?.set?.forEach((f) => setFlags.add(f));
  };

  const eventIds = new Set<string>();
  for (const e of events) {
    const at = e.id;
    if (eventIds.has(e.id)) errors.push(`${at}: duplicate event id`);
    eventIds.add(e.id);
    if (!(EVENT_KINDS as readonly string[]).includes(e.kind)) errors.push(`${at}: unknown kind "${e.kind}"`);
    if (e.kind === 'forced') {
      if (!e.trigger) errors.push(`${at}: forced event without a trigger`);
    } else if (!e.stages?.length) {
      errors.push(`${at}: no stages`);
    }
    for (const s of e.stages ?? []) if (!(STAGES as readonly string[]).includes(s)) errors.push(`${at}: unknown stage "${s}"`);
    if (!e.title || !e.text) errors.push(`${at}: missing title or text`);
    if (iconNames && !iconNames.has(e.icon)) errors.push(`${at}: icon "${e.icon}" isn't in the icon library`);
    if (e.realityNote && !e.realityNote.verified) warnings.push(`${at}: reality note not verified yet (hidden in production)`);
    checkCondition(e.trigger, `${at} trigger`);
    checkCondition(e.conditions, `${at} conditions`);
    if (e.choices.length === 0) errors.push(`${at}: no choices`);

    const choiceIds = new Set<string>();
    for (const c of e.choices) {
      const where = `${at}/${c.id}`;
      if (choiceIds.has(c.id)) errors.push(`${where}: duplicate choice id`);
      choiceIds.add(c.id);
      checkCondition(c.requires, `${where} requires`);
      if (c.check) {
        if (!c.success || !c.fail) errors.push(`${where}: a check needs both success and fail`);
        if (c.result) errors.push(`${where}: a check can't also have a result`);
        if (!(ATTRIBUTE_IDS as readonly string[]).includes(c.check.attribute)) errors.push(`${where}: unknown attribute "${c.check.attribute}"`);
        noteFlags(Object.keys(c.check.bonus ?? {}), `${where} bonus`);
      } else if (!c.result) {
        errors.push(`${where}: needs either a check (with success and fail) or a result`);
      }
      checkOutcome(c.success, where);
      checkOutcome(c.fail, where);
      checkOutcome(c.result, where);
    }
  }

  life.endings.forEach((end) => {
    checkCondition(end.when, `ending ${end.id}`);
  });
  const last = life.endings.at(-1);
  if (!last || Object.keys(last.when).length > 0) errors.push(`${life.career}: the last ending must have when: {}`);
  life.roles.byFlag.forEach((r) => noteFlags([r.flag], `role ${r.role}`));
  if (life.roles.byMastery.at(-1)?.min !== 0) errors.push(`${life.career}: roles.byMastery needs a final entry with min 0`);

  for (const [flag, where] of usedFlags) if (!setFlags.has(flag)) warnings.push(`${where}: flag "${flag}" is never set by any effect`);

  // Every slot needs at least one event of its kind and stage (conditions are checked in practice by the balance script).
  for (const slot of LIFE_SLOTS) {
    const any = events.some((e) => e.kind === slot.kind && e.stages?.includes(slot.stage));
    if (!any) errors.push(`${life.career}: no ${slot.kind} event for stage ${slot.stage}`);
  }

  return { errors, warnings };
}
