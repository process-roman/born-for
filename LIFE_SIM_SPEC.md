# Life Simulator Spec v1.0 — "Live It First"
**App:** Born For | **Date:** October 30, 2026
**Companion files:** `content/lives/ux_design.json`, `content/shared_events.json`, `balance_check.py` (reference engine + balance test), `LIFE_SIM_CONTENT_PREVIEW.md` (readable version of the content)

---

## 0. Instructions for Claude Code
- Build in the order of **section 15**. Finish and show each step before starting the next.
- The rules in this spec (odds formula, slots, meters, endings) are decided. If something seems wrong or conflicts with the existing app, **ask before changing it**.
- `balance_check.py` is a working Python version of the engine. Port its logic to TypeScript; when the two disagree, the Python file is the reference.
- Don't remove or restructure existing features (onboarding, stats, careers, quests, constellations, titles). This feature plugs into them (section 13).
- Content lives in JSON files. Never hard-code event text in components.

---

## 1. What it is
For each career, the user can play a **5-minute simulated life from age 18 to 30**. Each life is about 10 short scenes with choices. Some choices are **attribute checks**: the user's real stats set the odds. The life ends with a **"Life at 30" card** showing who they became.

**Why it matters:** It turns the core idea ("any career is open to you; low stats make it harder, not impossible") into something you can feel. It's fun immediately, it happens inside the app, and it leads naturally into real-world quests.

### Principles
1. **The sim never changes real stats.** Only real quests do. Stats are snapshotted at the start of each life.
2. **No closed doors.** Check odds are always between 15% and 90%.
3. **No failure endings.** Every ending is a life worth living, including burnout and changing paths.
4. **Honest about the hard parts.** Each career's real downsides appear as events.
5. **No astrology luck mechanics.** Signs matter through stats and "sign lines" only. No omens, retrogrades or fortune events.
6. **Reality notes must be sourced.** A note marked `"verified": false` must be checked against a real source before launch, or removed.
7. **Text and the living scene carry the experience.** No per-event illustrations.

---

## 2. Where it fits in the app
**New flow after onboarding:**
Intent → birthday → reveal → confirm poll → preferences → **career matches → "Live it first" on the top match (free)** → Life at 30 card → paywall → everything else.

- **Free:** one full life for the user's top-matched career that has life content, played once, plus its Life at 30 card.
- **Paid:** every life, unlimited replays, compare lives, real quests, everything already behind the paywall.
- **Paywall moment:** directly after the free Life at 30 card: *"You've lived one life. More are waiting."* This replaces the blurred career teaser from the blueprint.
- **Entry points:** a primary "Live this life" button on each career detail page, and the main card on Home when the user has a life not yet played. Don't restructure the navigation without asking.
- Careers without life content show "Life coming soon" and keep working as before.

---

## 3. Structure of a life
Every life has the same 10 slots:

| # | Stage | Slot kind | Age shown |
|---|---|---|---|
| 1 | start | `opener` (career) | 18 |
| 2 | training | `career` | 19 |
| 3 | training | `life` (shared) | 21 |
| 4 | breaking_in | `job_hunt` (career) | 22 |
| 5 | breaking_in | `career` | 23 |
| 6 | first_job | `career` | 24 |
| 7 | first_job | `sign` (shared, matches user's element) | 25 |
| 8 | crossroads | `crossroads` (career) | 26 |
| 9 | crossroads | `life` (shared) | 28 |
| 10 | thirty | `finale` (career) | 29 |

Then the ending is calculated and shown as **Life at 30**.

**Stage names for the UI:** Start · Training · Breaking In · First Job · Crossroads · Thirty.

**Forced events** (`kind: "forced"`) can be inserted after any slot (section 6). A life has at most 2 forced events.

---

## 4. Life meters
Four meters, 0–100, shown as slim bars at the top of every event screen:

| Meter | Meaning | Starts at |
|---|---|---|
| Joy | How much you enjoy your life and work | 50 |
| Energy | How rested you are (low = burnout risk) | 65 |
| Money | Financial comfort | 30 |
| Mastery | How good you've become at the craft | 0 |

- Effects add or subtract; clamp to 0–100 after each change.
- After each outcome, animate the change ("+10 Mastery").
- **Attributes** (the 8 from the profile) decide the odds. **Meters** describe how this life is going. Never mix them in the UI.

---

## 5. Attribute checks
Some choices have a `check`: `{ attribute, difficulty, bonus? }`.

**Odds formula:**
```
raw  = 50 + 1.5 × (stat − difficulty) + sum(bonus values for flags the player has)
odds = round(clamp(raw, 15, 90))
```
- `stat` = the user's **current** attribute value (confirmed base + earned XP), snapshotted when the life starts.
- Show odds on the choice **before** the user picks: a pill like `PERSISTENCE · 70%`.
- If a bonus applies, show it under the pill: `+10 from your portfolio`. Human-readable bonus labels are in section 10.
- Roll with a seeded random number generator (section 12). Success if `roll × 100 < odds`.
- **Roll animation (~1.2 s):** a small gold star falls across the sky. Success: it lands and glows. Fail: it fades. Then show the outcome text. Users can tap to skip.

**Examples (difficulty 60):** stat 85 → 88% · stat 70 → 65% · stat 50 → 35% · stat 35 → 15% (floor).

---

## 6. Event kinds
| Kind | Source | Used in slot |
|---|---|---|
| `opener` | career file | slot 1 |
| `career` | career file | slots 2, 5, 6 |
| `job_hunt` | career file | slot 4 |
| `crossroads` | career file | slot 8 |
| `finale` | career file | slot 10 |
| `life` | shared file | slots 3, 9 |
| `sign` | shared file | slot 7, filtered by the user's element |
| `forced` | shared file | inserted when its `trigger` is met |

**Forced events:** after every slot, check each forced event that hasn't happened yet in this life. If its `trigger` condition is met (e.g. Energy ≤ 20), play it immediately, using the same age as the previous slot. Max 2 per life.

**Sign lines:** an event can have `signLines` keyed by element (`fire`, `earth`, `air`, `water`). If one matches the user's element, show it in italics under the event text. Replace `{archetype}` with the user's archetype name (e.g. "Guardian").

**Elements:** Fire = Aries, Leo, Sagittarius · Earth = Taurus, Virgo, Capricorn · Air = Gemini, Libra, Aquarius · Water = Cancer, Scorpio, Pisces.

---

## 7. Choosing events
For each slot:
1. Take all events (career file + shared file) with the slot's `kind`, whose `stages` include the slot's stage, that haven't been used in this life, and whose `conditions` are met.
2. Keep only those with the highest `priority` (default 0).
3. Pick one at random, weighted by `weight` (default 1).
4. If none are eligible, skip the slot silently and log it. The balance test reports skipped slots; with the current content there are none.

**Conditions** (all optional, all must pass):
- `flagsAll`: every flag is set
- `flagsNone`: none of the flags are set
- `meterMin` / `meterMax`: e.g. `{ "mastery": 35 }`
- `elements`: the user's element is in the list
- `anyOf`: a list of conditions; at least one must pass

**Choices** can have a `requires` condition. Hide choices whose condition fails. No current content uses this, but support it.

---

## 8. Endings and the Life at 30 card
### Ending
Each career file has an ordered `endings` list. The **first** ending whose `when` condition passes is the result. The last ending always has an empty condition and acts as the default.

Designer endings in order: Found a Different Path → Started Your Own Studio → Burned Out, Then Rebuilt → Thriving → Steady.

### Role reached
1. If the ending has `roleOverride`, use it.
2. Else the first `roles.byFlag` entry whose flag is set.
3. Else the first `roles.byMastery` entry where final Mastery ≥ `min`.

### Highlights
Outcomes can include `highlight`. Show up to **3**, most recent first. If there are none, show "Made it to 30 your own way."

### "What this life asked of you"
Count checks per attribute in this life. Show the **two most-checked attributes** with the user's average odds for each, e.g. *Communication · checked 3 times · your odds 55%*. The one with the lower odds is the **power-up suggestion** (section 13).

### Card content (full-screen, night style)
- Final state of the living scene (section 11)
- Hybrid title in the serif font, e.g. *The Gentle Shaper* (from the existing title system: archetype adjective + career class)
- Ending name and text
- Role reached
- The four meters
- Up to 3 highlights
- "What this life asked of you"
- **"Would you want this life?"** Yes / Maybe / No (required before continuing, skippable with "Not sure")
- Buttons: **Share** · **Power up** · **Live another life** · **Replay**

### Share image
Render the card (scene, title, ending, role, meters, highlights) as a 1080×1920 image with the app name. Exclude "What this life asked of you" and the question.

### Endings collection
Each career page shows its endings as slots: found ones show the name and date first found, unfound ones show "???". Example: "2 of 5 endings found."

---

## 9. Data format
TypeScript types for the JSON files. The JSON files in `content/` already follow this format.

```ts
type Attribute = 'creativity' | 'analytical' | 'empathy' | 'communication'
  | 'organization' | 'independence' | 'curiosity' | 'persistence';
type Meter = 'joy' | 'energy' | 'money' | 'mastery';
type Stage = 'start' | 'training' | 'breaking_in' | 'first_job' | 'crossroads' | 'thirty';
type Element = 'fire' | 'earth' | 'air' | 'water';
type EventKind = 'opener' | 'career' | 'job_hunt' | 'crossroads' | 'finale'
  | 'life' | 'sign' | 'forced';

interface Condition {
  flagsAll?: string[];
  flagsNone?: string[];
  meterMin?: Partial<Record<Meter, number>>;
  meterMax?: Partial<Record<Meter, number>>;
  elements?: Element[];
  anyOf?: Condition[];
}

interface Effects {
  joy?: number; energy?: number; money?: number; mastery?: number;
  set?: string[];      // flags to add
  clear?: string[];    // flags to remove
  highlight?: string;  // shown on the Life at 30 card
}

interface Outcome { text: string; effects: Effects; }

interface Check {
  attribute: Attribute;
  difficulty: number;
  bonus?: Record<string, number>; // flag -> bonus percentage points
}

interface Choice {
  id: string;
  label: string;
  hint?: string;        // short trade-off line under the label
  requires?: Condition;
  check?: Check;        // if present: success + fail required
  success?: Outcome;
  fail?: Outcome;
  result?: Outcome;     // if no check: result required
}

interface LifeEvent {
  id: string;
  kind: EventKind;
  stages?: Stage[];     // not used by forced events
  trigger?: Condition;  // forced events only
  conditions?: Condition;
  priority?: number;    // default 0
  weight?: number;      // default 1
  icon: string;         // Phosphor icon name, kebab-case
  title: string;
  text: string;
  signLines?: Partial<Record<Element, string>>;
  realityNote?: { text: string; verified: boolean; source?: string };
  choices: Choice[];
}

interface Ending {
  id: string;
  name: string;
  when: Condition;      // {} = always
  roleOverride?: string;
  text: string;
}

interface CareerLife {
  career: string;       // matches the existing career id
  lifeName: string;     // "Designer"
  class: string;        // "Shaper", matches the title system
  roles: {
    byFlag: { flag: string; role: string }[];
    byMastery: { min: number; role: string }[];  // ordered high to low
  };
  endings: Ending[];
  events: LifeEvent[];
}
```

### Content validation (run at build time and in tests)
- Every choice has either `check` + `success` + `fail`, or `result`.
- Every flag used in a condition or bonus is set by at least one effect somewhere (warn, don't fail).
- Every icon name exists in the icon library.
- The last ending has `when: {}`.
- Every career life has at least one eligible event for each slot kind (the balance test checks this in practice).
- Event and choice ids are unique.

---

## 10. Text and labels
**Tokens** in event text, sign lines and ending text:
- `{archetype}` → "Guardian"
- `{sign}` → "Cancer"
- `{title}` → "The Gentle Shaper"

**Bonus labels** for the odds pill (map flag → label):
| Flag | Label |
|---|---|
| has_portfolio | your portfolio |
| had_internship | your internship |
| design_friend | your design friends |
| has_mentor | your mentor |
| freelance | your freelance experience |
| manager | your management experience |

**Reality notes:** collapsed by default under the event text, with a small `REAL` tag. Tap to expand. Hide notes with `verified: false` in production builds; show them in development.

**Tone:** warm, honest, lightly witty. Short sentences. No guilt, no doom.

---

## 11. The living scene
One SVG component, `LifeSky`, drawn in code. It replaces illustrations entirely.

**Props:** `age` (18–30), `meters`, `element`, `variant: 'card' | 'full'`.

**Layers (back to front):**
1. Sky gradient inside an arch shape (rounded top, flat bottom)
2. Stars (gold four-point stars)
3. Sun/moon disc
4. Far mountains (low-contrast plum)
5. Near mountains (darker plum)
6. A winding path from the bottom of the arch toward the horizon
7. Mist layer
8. Thin gold arch outline

**How it changes:**
| Driver | Visual |
|---|---|
| Age 18 | Dawn: lavender → soft peach |
| Age 22 | Morning: pale blue-lavender |
| Age 25 | Midday: soft light blue → cream |
| Age 28 | Golden hour: peach → warm gold |
| Age 30 | Dusk: deep plum → peach glow |
| Age (continuous) | Sun/moon moves along an arc from left (18) to right (30); interpolate colors between the keyframes above |
| Mastery | Number of stars = round(mastery ÷ 5); new stars fade in |
| Joy | Shifts the horizon glow warmer (more peach) as Joy rises |
| Energy | Mist opacity rises as Energy falls below 40 |
| Element | Faint horizon tint: fire `#F2784B`, earth `#7DB46C`, air `#7EC8E3`, water `#3FA7A0` at low opacity |

- Transitions: 600 ms ease. Respect the OS "reduce motion" setting (no movement, instant changes).
- `variant: 'card'` sits at the top of event screens (about 40% of screen height). `variant: 'full'` fills the screen for stage transitions and Life at 30.
- Use colors from the existing theme file. Add new tokens there if needed.

**Icons:** each event has a Phosphor icon (`phosphor-react-native`, "light" weight, gold). The content uses kebab-case names (`magnifying-glass` → `MagnifyingGlass`). If a name doesn't exist, pick the closest and report it.

---

## 12. Screens
Follow the existing design system: cream "daytime" screens for reading, deep-plum "night" screens for magic moments.

1. **Life intro** (cream): career name, "Live it first," "About 5 minutes · your real stats set the odds," the user's odds for this career's top 3 checked attributes, and a Start button. On a replay, show any odds that improved since the last life: `Communication 55% → 62%`.
2. **Event screen** (cream): `LifeSky` card variant at the top; meters bar; small tracked-caps label `AGE 22 · BREAKING IN`; icon; title (serif); text; sign line (italic, if any); reality note (collapsed); choice buttons with hint text and odds pill.
3. **Roll + outcome** (same screen): star animation for checks, then outcome text, meter change animations, a small toast if a highlight was earned, and a Continue button.
4. **Stage transition** (night, full screen): the sky moves to the new age and the stage name appears in the serif font. About 1.5 s, tap to skip.
5. **Life at 30** (night, full screen): section 8.
6. **Lives hub** (cream): all careers with life content, each showing "Not lived yet," "2 of 5 endings found" or a lock for free users.
7. **Compare lives** (cream): pick any two careers with a completed life; show their latest runs side by side: ending, role, the four meters, "Would you want this life?" answer.

**Mid-life saving:** if the user leaves, the life resumes exactly where they left off. A "Restart life" option in the menu discards the current run.

---

## 13. Connections to the rest of the app
- **Power up:** the Power up button opens a real quest from that career's constellation that trains the suggested attribute. If none matches, open the career's first unlit Taste quest. Copy: *"This life leaned on Communication. Raise it for real."*
- **The loop:** real quest → attribute XP → higher stats → better odds on the next replay. The life intro shows the improved odds. This is the main reason to replay.
- **Matching signal:** "Would you want this life?" Yes = +10 to that career's match score, Maybe = 0, No = same as the existing "Not for me."
- **Titles:** the Life at 30 card uses the existing hybrid title. Playing a life does **not** unlock or upgrade titles; real quests still do.
- **XP:** completing a life gives **25 quest XP** once per career (first completion only). No attribute XP.
- **Journal (if present):** add an entry per completed life: ending, role, date.

---

## 14. Saving
**Run state** (saved after every choice):
```ts
interface LifeRun {
  id: string;
  career: string;
  seed: number;
  startedAt: string;
  statsSnapshot: Record<Attribute, number>;
  element: Element;
  slotIndex: number;
  meters: Record<Meter, number>;
  flags: string[];
  usedEventIds: string[];
  forcedCount: number;
  log: { eventId: string; choiceId: string; check?: { attribute: Attribute; odds: number; success: boolean } }[];
  highlights: string[];
  pendingEventId?: string;   // event currently on screen
  completed?: {
    endingId: string;
    role: string;
    finishedAt: string;
    wouldWant?: 'yes' | 'maybe' | 'no';
  };
}
```
- Use the same seeded RNG for event picks and rolls, so the same seed + choices always produce the same life (needed for resume and tests).
- Keep all completed runs. Show the latest run per career in compare and the hub.
- Store in the same local database as other progress, and include runs in cloud backup if accounts exist.

---

## 15. Build steps
### Step 1 — Engine (no UI)
- Types, content loader and validation (section 9)
- Seeded RNG, slot plan, event picking, conditions, checks, effects, forced events
- Endings, role, highlights, "what this life asked of you"
- Unit tests: odds formula (including floor, ceiling and bonuses), condition logic (including `anyOf`), ending order, deterministic replay from seed, forced event limit
- **Balance script** (port of `balance_check.py`) runnable from the command line
- **Done when:** tests pass and the balance script output matches the targets in section 16

### Step 2 — Life screens
- `LifeSky` component with all layers and drivers (section 11)
- Life intro, event screen, roll animation, outcome, stage transitions
- Mid-life saving and resume
- **Done when:** a full Designer life can be played on a phone from start to Life at 30 (placeholder card is fine)

### Step 3 — Life at 30
- Full card, share image, "Would you want this life?", endings collection on the career page
- **Done when:** the card looks right in all five endings (add a dev menu to force an ending)

### Step 4 — Connect it to the app
- Free life + paywall moment, lives hub, compare lives, power-up quest link, matching signal, XP, journal entry
- **Done when:** a new user can go from onboarding through a free life to the paywall, and a paid user can replay with improved odds after completing a real quest

### Step 5 — More careers (later)
- New careers are new JSON files only. No engine changes should be needed. Run the balance script for each.

---

## 16. Balance targets
Run with all 12 sign profiles × 3 strategies (random, safe, bold) × 1,000 lives each.

| Metric | Target | Designer result (reference engine) |
|---|---|---|
| Each ending, random strategy | 5–55% | Pivot 15%, Studio 13%, Rebuilt 6%, Thriving 13%, Steady 52% |
| Thriving, bold strategy | Higher than random | 40% vs 13% |
| Average shown odds | 50–65% | 59% |
| Burnout event | 8–20% of lives | 10% |
| Skipped slots | 0 | 0 |
| Events per life | 10–12 | 10.2 |
| Every event appears | ≥ 5% of lives | Lowest: layoffs 8.6% |

**Strategies:** random = random choice; safe = prefers choices without a check; bold = always picks the check with the best odds. Safe play mostly leads to "Steady," and that's intended: playing it safe gives a steady life.

**Sign variety (random strategy):** Thriving ranges from about 5% (Aquarius) to 28% (Libra), and high-Independence signs open studios more often. Signs should feel different but never locked out.

---

## 17. Out of scope for this feature
- Astrology events (omens, retrogrades, moon phases)
- AI-generated text at runtime
- Per-event illustrations
- Lives beyond age 30
- Sim results changing real stats or unlocking titles
- Multiplayer or comparing with friends
