/// <reference types="node" />
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LIFE_CAREER_IDS, LIVES, SHARED_EVENTS } from '../src/content/life';
import { validateLife } from '../src/logic/lifeValidate';

// The registry imports React Native components, so read its names from the source instead.
const registry = new Set([...readFileSync('src/ui/lifeIcons.tsx', 'utf8').matchAll(/^ {2}'([a-z-]+)': /gm)].map((m) => m[1]!));
const pascal = (name: string) => name.replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase());

describe('life icons', () => {
  it('every registered icon exists in Phosphor', () => {
    expect(registry.size).toBeGreaterThan(0);
    for (const name of registry) expect(existsSync(`node_modules/phosphor-react-native/src/icons/${pascal(name)}.tsx`), name).toBe(true);
  });

  it('every icon in the content is registered', () => {
    for (const id of LIFE_CAREER_IDS) expect(validateLife(LIVES[id]!, SHARED_EVENTS, registry).errors).toEqual([]);
  });
});
