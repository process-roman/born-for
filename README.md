# Born For

Zodiac + RPG self-discovery app. See `BORN-FOR PRODUCT_BLUEPRINT.md`, `BORN-FOR PILOT_CONTENT.md` and `SIGNS_AND_ONBOARDING_SPEC.md`.

## M0: content + rules

Pure TypeScript, no UI yet. The Expo app will import from `src/`.

- `src/content/`: attributes and poll statements, all 12 signs, onboarding questions, design tokens, the six pilot careers (quests, constellations, real next steps)
- `src/logic/`: sign from birthday (with cusp detection), poll scoring and "Your sign called X of 8", ranking and reasons, difficulty, XP and levels, constellation unlocks, titles, character state
- `tests/`: the five pilot personas plus edge cases

```bash
npm install
npm test
npm run typecheck
```
