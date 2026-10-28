# Signs, Onboarding & Design Spec v0.1
**Companion to:** PRODUCT_BLUEPRINT.md v0.2 | **Date:** October 27, 2026

---

## 1. The 8 attributes
Every sign uses the same 8 attributes, with different starting values.

| Attribute | What it means in the app |
|---|---|
| Creativity | Coming up with your own ideas and new ways of doing things |
| Analytical thinking | Figuring out how and why things work |
| Empathy | Understanding and caring about how others feel |
| Communication | Expressing ideas and connecting with people |
| Organization | Planning, structure and follow-through on details |
| Independence | Working and deciding on your own |
| Curiosity | Wanting to learn and explore new things |
| Persistence | Sticking with things when they get hard |

**Bands shown to users:**
| Score | Band |
|---|---|
| 80–100 | Strong |
| 60–79 | Solid |
| 40–59 | Developing |
| 0–39 | Untrained |

---

## 2. Sign starting stats
**Balance rule:** Every sign has the same total of **480 points**, like a stat budget in an RPG. No sign is "better" than another; they're distributed differently. Minimum 35, maximum 85, so every sign has room to grow.

**Bold** = top 3, highlighted at the reveal as "strongest probable attributes".

| Sign | Archetype | Element | Creativity | Analytical | Empathy | Communication | Organization | Independence | Curiosity | Persistence |
|---|---|---|---|---|---|---|---|---|---|---|
| Aries | The Trailblazer | Fire | 60 | 50 | 50 | **70** | 40 | **85** | **70** | 55 |
| Taurus | The Builder | Earth | **65** | 55 | 55 | 50 | **70** | 60 | 40 | **85** |
| Gemini | The Messenger | Air | **65** | 60 | 50 | **85** | 40 | 55 | **85** | 40 |
| Cancer | The Guardian | Water | 60 | 50 | **85** | 60 | **65** | 40 | 50 | **70** |
| Leo | The Champion | Fire | **80** | 40 | 55 | **80** | 40 | **65** | 55 | **65** |
| Virgo | The Analyst | Earth | 45 | **85** | 50 | 45 | **85** | 50 | 50 | **70** |
| Libra | The Diplomat | Air | **70** | 60 | **75** | **80** | 55 | 35 | 55 | 50 |
| Scorpio | The Investigator | Water | 45 | **75** | 65 | 40 | 45 | **70** | 55 | **85** |
| Sagittarius | The Explorer | Fire | 60 | 55 | 50 | **65** | 35 | **80** | **85** | 50 |
| Capricorn | The Architect | Earth | 45 | **70** | 45 | 45 | **85** | 60 | 45 | **85** |
| Aquarius | The Inventor | Air | **80** | 65 | 45 | 50 | 35 | **80** | **80** | 45 |
| Pisces | The Dreamer | Water | **85** | 45 | **85** | 60 | 35 | 55 | **65** | 50 |

*Scorpio updated Oct 28, 2026: Empathy 55 → 65 (consistently described as perceptive and intuitive about people), funded by Creativity 50 → 45 and Organization 50 → 45. Top 3 unchanged.*

*Leo has a tie for 3rd (Independence and Persistence at 65): highlight both, or pick Independence.*

### Reveal copy (one line per archetype)
- **Aries, The Trailblazer:** You go first, act fast and figure it out on the way.
- **Taurus, The Builder:** You make things that last, one steady step at a time.
- **Gemini, The Messenger:** Ideas move through you, and you love passing them on.
- **Cancer, The Guardian:** You look after people and the things that matter to them.
- **Leo, The Champion:** You create, you lead, and people notice when you walk in.
- **Virgo, The Analyst:** You see the details others miss and make things work better.
- **Libra, The Diplomat:** You bring people together and find the balance in any room.
- **Scorpio, The Investigator:** You dig deep and don't stop until you find the truth.
- **Sagittarius, The Explorer:** You chase new places, new ideas and the big picture.
- **Capricorn, The Architect:** You plan the climb and you finish what you start.
- **Aquarius, The Inventor:** You imagine what doesn't exist yet and go build it.
- **Pisces, The Dreamer:** You feel deeply and turn imagination into something real.

---

## 3. Onboarding questions
Three questions, all tap-only, no typing.

### Q1: Before the birthday — "What brings you here?" (single choice)
- 🔮 Discover who I am
- 🧭 Find a career direction
- 🔄 I'm thinking about changing careers
- ✨ Just curious about my sign

**Used for:** Tailoring copy and the home screen. "Discover who I am" leads with the character and attribute quests; career answers lead with paths. Also a useful analytics segment.

### Q2: After confirming stats — "What do you enjoy most?" (pick up to 3)
- 🎨 Making and designing things
- 🧩 Solving puzzles and problems
- 🤝 Helping and supporting people
- 📋 Planning and organizing
- 📣 Leading and persuading
- 🔭 Learning and exploring ideas
- 💻 Working with tech
- 🎤 Performing and presenting

**Used for:** The preferences part of career ranking (55% weight). Each option maps to career interest tags.

### Q3: "How do you like to work?" (single choice)
- 🧍 Mostly on my own
- 👥 In a small team
- 🌐 With lots of different people
- 🤷 Not sure yet

**Used for:** Work-style match in career ranking and as a reason shown on career cards.

---

## 4. Confirming attributes: the poll
Instead of sliders, users answer one card per attribute. Each card shows what the sign predicts and a plain behavioral statement.

### Card layout
> **EMPATHY** · Your sign says: **Strong**
> *"You can tell how someone feels before they say it."*
>
> [ That's me ] [ Sometimes ] [ Not really ]

Swipe right = That's me, swipe left = Not really, tap = Sometimes. "Skip" keeps the sign's value.

**Order:** Top 3 strongest attributes first (most likely to get a "That's me", which feels good), then the rest. 8 cards takes about 30 seconds.

### Statements
| Attribute | Statement |
|---|---|
| Creativity | You often come up with your own ideas instead of doing it the usual way. |
| Analytical thinking | You enjoy figuring out why something works, or why it doesn't. |
| Empathy | You can tell how someone feels before they say it. |
| Communication | Explaining things to other people comes easily to you. |
| Organization | You like having a plan and keeping things in order. |
| Independence | You'd rather figure things out yourself than wait for directions. |
| Curiosity | You often go down rabbit holes learning about something new. |
| Persistence | When something gets hard, you usually keep going. |

### Scoring
Each answer has a target value:
- That's me = **85**
- Sometimes = **55**
- Not really = **25**
- Skip = sign value

**Confirmed value = 30% sign value + 70% answer target**, rounded.

Examples for Cancer:
- Empathy 85 + "That's me" → **85** (Strong)
- Independence 40 + "That's me" → **72** (Solid)
- Empathy 85 + "Not really" → **43** (Developing)

The user's answers outweigh the sign, but the sign still shapes the result. Confirmed profiles don't need to total 480.

### Result screen
"**Your sign called 6 of 8.**" Show the sign's stats as a ghost outline behind the confirmed bars, so users see where they matched and where they're unique.
- A match = the answer kept the attribute in the same band.
- This is fun, shareable, and honest about where the user differs from their sign.

---

## 5. Next steps after onboarding

**Full flow:**
Q1 intent → birthday → character reveal → confirm poll → "Your sign called X of 8" → Q2 enjoy → Q3 work style → **paywall** → career reveal → first quest

### After the paywall
1. **Career reveal.** Top 3 paths animate in one by one, each with difficulty (Natural fit / Some training / Challenging but achievable) and 2–3 reasons. "See all paths" below.
2. **Choose a path.** User picks one to start, and can save others. Each path card has Interested / Not for me / Unsure.
3. **First quest.** Three quests per path in tiers, so there's a clear progression:
   - **Taste** (about 20 min): e.g. sketch a better layout for one app screen.
   - **Try** (1–2 hours): e.g. redesign one full screen in a free design tool.
   - **Test** (real world): e.g. ask a designer one question, or show your redesign to someone and get feedback.
   The first quest offered is always a Taste quest.
4. **Reflect.** Three quick taps:
   - How much did you enjoy it? (5 emoji scale)
   - Would you do more of this? (Yes / Maybe / No)
   - What felt natural? (tap attribute chips, e.g. Creativity, Persistence)
5. **Rewards.** Quest XP, attribute XP to chosen attributes, badges, and an updated difficulty label if an attribute leveled up.
6. **Next recommendation.** Based on the reflection:
   - Enjoyed it → next tier on the same path.
   - Didn't enjoy it → offer a different path ("Want to try something different?").
   - Mixed → another Taste quest on a related path.
7. **Home screen.** Character with stats, active quest, path progress (Taste → Try → Test), saved paths, and recent discoveries.

**For "Discover who I am" users:** Same flow, but career paths are framed as "Paths that match your character", and home leads with the character. Later: attribute quests that train a single stat (e.g. "Persistence: finish one thing you've been putting off").

---

## 6. Design style: "Celestial RPG"
**Concept:** A night sky meets a fantasy game character sheet. Mystical enough to feel like real astrology, structured enough to feel like a game. Clean and readable, never cluttered.

### Color
- **Base:** Deep night navy / indigo (`#0E1030`–`#1A1C4A`), dark-first.
- **Primary accent:** Celestial gold (`#E8C26A`) for highlights, XP and key buttons.
- **Text:** Soft white (`#F4F1EA`) and muted lavender-grey for secondary text.
- **Element colors** (tint each sign's character screens):
  - Fire: ember orange `#F2784B`
  - Earth: moss green `#7DB46C`
  - Air: sky blue `#7EC8E3`
  - Water: deep teal `#3FA7A0`
- **Band colors on stat bars:** Untrained grey → Developing lavender → Solid element color → Strong gold.

### Typography
- **Display (archetype names, titles):** an elegant serif with fantasy character, e.g. **Cinzel** or **Cormorant**.
- **UI and body:** a clean sans, e.g. **DM Sans** or **Inter**, for readability on career details.
- Rule: serif for the magic, sans for the facts.

### Key UI elements
- **Character card:** Trading-card / tarot-card shape with the archetype illustration, sign glyph, name and top 3 stats. Designed to be screenshot-friendly for sharing.
- **Stat bars:** Segmented like game HP/XP bars, with an icon per attribute and a band label. Ghost outline shows the sign's original prediction.
- **Quest cards:** Feel like a quest log: tier badge (Taste/Try/Test), time estimate, XP reward.
- **Difficulty labels:** Small pill badges, styled like game difficulty (one, two or three stars).

### Illustration
- One illustrated character per archetype: stylized, semi-realistic, tarot-meets-game-art. Not cartoony, not anime.
- Constellation line art as a recurring motif (backgrounds, loading states, dividers).
- 8 simple attribute glyph icons in a consistent line style.

### Motion and feel
- **Reveal:** Stars appear → connect into the sign's constellation → card flips to show the character. This is the "wow" moment; worth investing in.
- **Confirm poll:** Swipe cards with light haptics; bars fill as answers come in.
- **Level up:** Short gold burst on the stat bar, nothing that slows the user down.
- Optional subtle ambient sound, off by default.

### Tone of copy
- In-world and warm for the game layer: "Your quest awaits," "You leveled up Persistence."
- Plain and accurate for career facts: training needed, salary ranges, day-to-day reality.
- Never negative about low stats: "untrained," "room to grow."

### References
- **Persona 5:** social stats (Knowledge, Guts, Kindness…) that grow through real activities. The closest game reference to this app's core mechanic.
- **Co-Star:** how modern astrology apps feel premium and minimal.
- **Duolingo:** clear progression and rewarding feedback.
- **Tarot cards:** card framing and illustration style for archetypes.

### Avoid
- Dense fantasy UI (ornate borders everywhere, parchment textures, hard-to-read fonts).
- Childish cartoon style, which would undercut the 18–25 audience.
- Too much text on game screens; save detail for career pages.
