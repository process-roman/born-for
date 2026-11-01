// Small builders shared by template lives and family scene packs.

import type { AttributeId } from './attributes';
import type { Choice, Effects } from './life';

export const CHANGER = 'track_changer';

export const article = (word: string) => (/^[aeiou]/i.test(word) && !/^(uni|eu|one)/i.test(word) ? 'an' : 'a');

/** Lowercases a name for use mid-sentence, but leaves names like "YouTuber" or "AI engineer" alone. */
export function inSentence(name: string): string {
  return /^[A-Z]{2}|^[A-Z][a-z]+[A-Z]/.test(name) ? name : name.charAt(0).toLowerCase() + name.slice(1);
}

/** The first sentence, not fooled by "e.g." or "i.e.". */
export function firstSentence(text: string): string {
  for (const m of text.matchAll(/\.\s/g)) {
    const before = text.slice(0, m.index);
    if (/\b(e\.g|i\.e|etc|vs)$/i.test(before)) continue;
    return text.slice(0, m.index + 1);
  }
  return text;
}

const outcome = (text: string, effects: Effects) => ({ text, effects });

export function check(id: string, label: string, attribute: AttributeId, difficulty: number, success: [string, Effects], fail: [string, Effects], extra: Partial<Choice> = {}): Choice {
  return { id, label, check: { attribute, difficulty, ...(extra.check ?? {}) }, success: outcome(...success), fail: outcome(...fail), ...omitCheck(extra) };
}

function omitCheck(extra: Partial<Choice>): Partial<Choice> {
  const { check: _check, ...rest } = extra;
  return rest;
}

export function result(id: string, label: string, text: string, effects: Effects, hint?: string): Choice {
  return { id, label, ...(hint ? { hint } : {}), result: outcome(text, effects) };
}
