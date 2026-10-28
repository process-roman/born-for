# Born For

Zodiac + RPG self-discovery app. Specs: `BORN-FOR PRODUCT_BLUEPRINT.md`, `SIGNS_AND_ONBOARDING_SPEC.md` (16 traits, signs, onboarding), `BORN-FOR PILOT_CONTENT.md` (career worlds, quest template, formulas, personas) and `CAREERS.md` (every career in full, generated from the code).

Expo (React Native + TypeScript) with Expo Router.

- `src/app/`: screens. Onboarding: intent → birthday (cusp prompt, manual sign) → character reveal → confirm poll (8 signature traits) → "Anything else that's you?" (background traits) → "Your sign called X of 8" → enjoy → work style → paywall stub → career reveal or free teaser. Then Home | Character | Explore tabs, career worlds, path details, quest start (with check-in reminder), reflection and rewards, Settings (cusp sign, reminders, recalibrate, delete data)
- `src/content/`: 16 traits in four families, all 12 signs (signature and background traits), onboarding questions, 12 career worlds, 24 careers with template quests, constellations, design tokens
- `src/logic/`: sign from birthday (with cusp detection), poll scoring and "Your sign called X of 8", ranking and reasons, difficulty, XP and levels, constellation unlocks, titles, related paths and next-quest recommendations, character state
- `src/logic/game.ts`: the saved game (quests, free tier, what to suggest next, recalibration); `badges.ts` and `avatar.ts`: badges and the evolving character layers
- `src/state/`, `src/storage/`, `src/ui/`: app state, on-device storage (SQLite on phones, localStorage on web), reminders and shared components
- `scripts/careers-doc.ts`: regenerates `CAREERS.md`
- `tests/`: unit tests for content and logic, including the five pilot personas

```bash
npm install
npm run web           # or: npm start, then open in Expo Go
npm test
npm run typecheck
npm run lint
npm run docs:careers  # after editing src/content/careers.ts
```
