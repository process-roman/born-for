# Born For

Zodiac + RPG self-discovery app. See `BORN-FOR PRODUCT_BLUEPRINT.md`, `BORN-FOR PILOT_CONTENT.md` and `SIGNS_AND_ONBOARDING_SPEC.md`.

Expo (React Native + TypeScript) with Expo Router.

- `src/app/`: screens. Onboarding: intent → birthday (cusp prompt, manual sign) → character reveal → confirm poll → "Your sign called X of 8" → enjoy → work style → paywall stub → career reveal or free teaser. Then Home | Character | Explore tabs, path details, quest start (with check-in reminder), reflection and rewards
- `src/content/`: attributes and poll statements, all 12 signs and their constellations, onboarding questions, design tokens, the six pilot careers (quests, constellations, real next steps)
- `src/logic/`: sign from birthday (with cusp detection), poll scoring and "Your sign called X of 8", ranking and reasons, difficulty, XP and levels, constellation unlocks, titles, related paths and next-quest recommendations, character state
- `src/logic/game.ts`: the saved game (quests, free tier, what to suggest next)
- `src/state/`, `src/storage/`, `src/ui/`: app state, on-device storage (SQLite on phones, localStorage on web), reminders and shared components
- `tests/`: unit tests for content and logic, including the five pilot personas

```bash
npm install
npm run web        # or: npm start, then open in Expo Go
npm test
npm run typecheck
npm run lint
```
