# Born For

Zodiac + RPG self-discovery app. See `BORN-FOR PRODUCT_BLUEPRINT.md` and `BORN-FOR PILOT_CONTENT.md`.

## M0: content + rules

Pure TypeScript, no UI yet. The Expo app will import from `src/`.

- `src/content/`: attributes, signs, preferences and work styles, the six pilot careers (quests, constellations, real next steps)
- `src/logic/`: poll scoring, ranking and reasons, difficulty, XP and levels, constellation unlocks, titles, character state
- `tests/`: the five pilot personas plus edge cases

```bash
npm install
npm test
npm run typecheck
```
