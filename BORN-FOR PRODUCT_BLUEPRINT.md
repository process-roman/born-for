# Product Blueprint v0.3
## Zodiac + RPG self-discovery app
**Status:** Working specification | **Date:** October 27, 2026 | **Product name:** TBD
**Companion file:** SIGNS_AND_ONBOARDING_SPEC.md (sign stat tables, poll statements, onboarding questions, design style)

**What changed from v0.2:**
- Closed seven gaps in the journey: free-user experience, account and backup, return triggers, path endings, unfinished quests, stat recalibration, cusp birthdays.
- Added three signature features: constellation skill trees, hybrid titles, an evolving character.
- Merged in the onboarding questions, confirm poll, quest tiers and reflection flow from the spec.

---

### 1. Product concept
**Promise:** Your sign reveals your strongest probable attributes. Confirm them, choose what you enjoy, and discover career paths you can grow into.

**Style:** "Celestial RPG": a blend of video game and real horoscope. The sign is the starting point of your character; the RPG layer lets you develop it through real-world quests.

**Tagline hypothesis:** *Your sign is just the beginning.*

**Core mechanic:** Like an RPG, you don't start from zero. Your sign gives you starting stats. You develop them through real-world quests. Every career is open to you; low-stat paths are harder, not closed.

**Primary audience:** Curious young adults, initially **18–25**, exploring identity, strengths and career possibilities.

**Secondary audience:** Astrology fans who want something more practical than daily horoscopes.

**User problem:** "I don't know what suits me, where to start, or how to explore it without committing to a big decision."

**Success outcome:** A user sees their character, confirms their attributes, unlocks their paths, completes a quest, reflects on it and comes back for the next star in their constellation.

---

### 2. Product principles
1. **Your sign sets your starting stats.** Each sign has a defined profile of probable strongest attributes, presented as "your sign suggests…". All signs share an equal 480-point stat budget.
2. **The user confirms.** Starting stats are confirmed through a quick poll. The user's answers count more than the sign.
3. **Preferences matter most.** What the user enjoys outweighs attribute scores in career ranking.
4. **No closed doors.** Every career is selectable. Low-attribute paths are labeled harder, never impossible.
5. **Untrained, not weak.** Low stats are framed as untrained or developing, never as flaws.
6. **Explain recommendations.** Every career direction shows why it appeared and how hard it may be.
7. **Fast first reveal.** The character reveal arrives within seconds, with no account required.
8. **No dead ends.** Every screen, including after declining the paywall or finishing a path, has a clear next step.
9. **Progress is visible and beautiful.** Growth shows up in the character, the constellations and the titles, not just in numbers.

---

### 3. User journey (Cancer example)

#### Free onboarding
1. **Welcome + intent.** "What brings you here?" Discover who I am / Find a career direction / Thinking about changing careers / Just curious about my sign. Tailors copy and home emphasis.
2. **Birthday.** Enter date of birth or choose sign manually. Derive Cancer. If the date is on a cusp, ask (see 4.7). Store the sign, not the full birth date.
3. **Character reveal.** Stars connect into the Cancer constellation, then the card flips: "Cancer: The Guardian." Show all eight starting stats, top 3 highlighted as strongest probable attributes.
4. **Confirm poll.** One swipe card per attribute with a behavioral statement and the sign's prediction. That's me / Sometimes / Not really / Skip. Top 3 first. About 30 seconds.
5. **"Your sign called 6 of 8."** Confirmed bars shown over a ghost outline of the sign's prediction. Shareable character card offered here.
6. **What do you enjoy?** Pick up to 3 of 8 options.
7. **How do you like to work?** On my own / Small team / Lots of people / Not sure.
8. **Paywall.** "Your career paths are ready." See section 10 for what free users get if they decline.

#### After unlocking
9. **Save your character.** Prompt to create an optional account right after purchase (4.2).
10. **Career reveal.** Top 3 paths animate in, each with difficulty, 2–3 reasons and an empty constellation. "See all paths" below.
11. **Choose a path.** Pick one to start; save others. Mark paths Interested / Not for me / Unsure.
12. **First quest.** Always a Taste quest. Choose when to do it; enable a check-in reminder (4.3).
13. **Do the quest** in the real world.
14. **Reflect.** Enjoyment (5-emoji scale), Would you do more? (Yes / Maybe / No), What felt natural? (attribute chips), What felt hard? (attribute chips).
15. **Rewards.** A star lights up in the constellation, quest XP, attribute XP, badges, possible difficulty or title upgrade.
16. **Next recommendation.** Enjoyed → next star on the same path. Didn't enjoy → a different path. Mixed → a Taste quest on a related path.
17. **Return loop.** Home: character, active quest, constellations, titles, next recommended quest. Repeat **Choose → Try → Reflect → Level up**.

---

### 4. Journey gaps and solutions

#### 4.1 Free users and the paywall dead end
**Gap:** Users who decline the paywall, especially "Just curious about my sign" users, hit a dead end with nothing to keep.
**Solution:**
- Free users keep their **character card**, confirmed stats and "Your sign called X of 8" result, all shareable.
- Show the **top career blurred**, with its difficulty and one visible reason, as a teaser.
- Give **one free Taste quest** on the top path so they experience the full quest → reflect → star loop once.
- Free home screen shows the character, one lit star and the locked constellations, with a clear "Unlock your paths" button.
- After the free quest reflection, show the paywall again: "Your first star is lit. Unlock the full constellation."
- "Just curious" users get copy focused on the character, not careers.

#### 4.2 Account and backup
**Gap:** Users pay, but all progress lives only on the phone. Restore-purchases restores the payment, not the character.
**Solution:**
- No account needed for onboarding or the free experience.
- Right after purchase: **"Save your character"** with Sign in with Apple, Google or email. Skippable, with a reminder after the first completed quest.
- Signed-in users get cloud backup of character, confirmed stats, XP, quests, reflections and titles. Data syncs on change; app remains offline-first.
- Restore flow on a new phone: sign in → character and progress return; purchase restores through the store.
- Settings: delete account and data.

#### 4.3 No reason to reopen the app
**Gap:** Quests happen outside the app, so nothing brings people back.
**Solution:**
- When starting a quest, user picks a time: **Today / This weekend / Pick a day**.
- Ask for notification permission at that moment, in context ("Want a reminder to check in?"), not at launch.
- **Check-in notification** after the chosen time: "How did your Taste quest go? Your star is waiting."
- At most one nudge per week if no active quest: "A new star is waiting in your Design constellation."
- No streaks, no guilt copy.
- **Day-2 home screen:** active quest card at the top with "Done / Not yet / Change quest"; if no active quest, the next recommended quest; then constellations and character.

#### 4.4 Nothing after the last quest of a path
**Gap:** After the Test tier, the path just ends.
**Solution:**
- **Path complete moment:** the constellation fully lights, the path's title upgrades to its starred form (section 6) and a badge unlocks.
- **"Real next steps"** section on every career, unlocked at completion: 2–3 free courses or resources, communities to join, entry-level job titles and what to search for, and typical education routes.
- Then suggest: a related path ("Designers often explore Marketing") or a new path matching the user's strongest grown attribute.

#### 4.5 Quests that don't happen
**Gap:** No way to skip, postpone or abandon a quest; an unfinished quest just sits there.
**Solution:** Every active quest has four options:
- **Done** → reflection.
- **Not now** → quest stays saved, removed from the top of home.
- **Too hard** → offer an easier quest on the same path; counts as a "felt hard" signal.
- **Not for me** → offer a different path; counts toward the path's Not for me signal.
- If a quest is active for 14 days with no action: one gentle "Still on it?" prompt with the same options.

#### 4.6 Stats can't be revisited
**Gap:** Confirmed stats are final; no way to recalibrate or see change.
**Solution:**
- Each stat = **confirmed base + earned XP**.
- **"Recalibrate"** on the Character screen reruns the confirm poll and updates the base only. Earned XP always stays.
- Character screen has a **"Then vs now"** view: day-one stats against current stats.
- Suggest recalibrating after a path is completed or every few months.

#### 4.7 Cusp birthdays
**Gap:** Sign boundaries shift by about a day depending on the year, so some users get the wrong sign.
**Solution:**
- Bundle a table of the Sun's sign-change dates by year (e.g. 1940–2015) and derive the sign from the exact date and year.
- If the birthday falls within one day of a boundary: "You were born on the cusp of Gemini and Cancer. Which one feels like you?" The choice is stored and editable in settings.
- Manual sign selection always available.

---

### 5. Signature feature: Constellation skill trees
Each career path is a **constellation**. Every completed quest lights up a star.

**Structure per path:** 5 stars.
| Star | Tier | Example (UX design) |
|---|---|---|
| 1 | Taste (~20 min) | Sketch a clearer layout for one screen you use often |
| 2 | Taste (~20 min) | Find three apps with great onboarding and note what they do well |
| 3 | Try (1–2 hours) | Redesign one full screen in a free design tool |
| 4 | Try (1–2 hours) | Turn your redesign into a simple clickable prototype |
| 5 | Test, the boss star (real world) | Show your redesign to two people and collect feedback, or ask a working designer one question |

**Rules:**
- Stars light in order within a tier; the Test star unlocks after at least one Try star.
- A lit star shows the quest name, date and the user's reflection when tapped.
- Constellation lines draw between stars as they light, so a path's shape slowly appears.
- Each path's constellation has a unique shape, designed as part of the career's content.
- Character screen shows all started constellations together as the user's **night sky**, a single view of everything they've explored.
- "Too hard" or "Not for me" don't break the constellation; unlit stars simply stay dim.

---

### 6. Signature feature: Hybrid titles
Titles combine the user's archetype with a path they've progressed in.

**Formula:** [Archetype adjective] + [Path class]

**Archetype adjectives:**
| Sign | Adjective |
|---|---|
| Aries | Bold |
| Taurus | Steady |
| Gemini | Quick |
| Cancer | Gentle |
| Leo | Radiant |
| Virgo | Precise |
| Libra | Graceful |
| Scorpio | Relentless |
| Sagittarius | Wandering |
| Capricorn | Unshakable |
| Aquarius | Visionary |
| Pisces | Dreaming |

**Path classes (pilot careers):**
| Career | Class |
|---|---|
| UX/product design | Shaper |
| Software development | Codesmith |
| Marketing | Herald |
| Teaching | Mentor |
| Writing/content | Scribe |
| Data analysis | Oracle |
| Project coordination | Quartermaster |
| Entrepreneurship | Founder |
| Healthcare | Healer |
| Community support | Keeper |

**Progression:**
- **First Try star lit:** unlock the title, e.g. "The Gentle Shaper."
- **Constellation complete:** starred form, e.g. "★ The Gentle Shaper."
- User **equips one title**, shown on the character card and home screen.
- Titles from all paths are collected in a titles list on the Character screen.
- New title unlocks are a natural share moment ("I'm now The Gentle Shaper").

---

### 7. Signature feature: Evolving character
The archetype illustration visibly grows as the user progresses.

**Character level** comes from total XP (quests + reflections). Five visual stages:
| Level | Visual change |
|---|---|
| 1 | Base archetype illustration |
| 2 | Faint constellation aura around the character |
| 3 | Element glow (fire, earth, air or water color) |
| 4 | An item from the most-progressed path (e.g. a stylus for Shaper, a quill for Scribe) |
| 5 | Full celestial form: golden frame, stars woven into the outfit or background |

**Production approach:** Build as layers to keep art costs manageable:
- 12 base archetype illustrations (one per sign).
- Shared overlay layers (aura, element glow, celestial frame) tinted per element.
- Small path item overlays (one per career class).
This avoids drawing 60 separate illustrations.

**Level-up moment:** short animation of the new layer appearing, then "Your Guardian has grown." The evolved character appears on the shareable card.

---

### 8. Attribute model
Sixteen traits, each 0–100, in four families: Mind (Analytical thinking, Curiosity, Attention to detail, Organization), Spark (Creativity, Aesthetic eye, Courage, Independence), Heart (Empathy, Communication, Teamwork, Leadership) and Body (Hands-on skill, Physical energy, Persistence, Calm under pressure). Each sign has 8 **signature** traits (confirmed in the poll) and 8 **background** traits (optional to confirm, trainable). Full sign tables and poll statements are in SIGNS_AND_ONBOARDING_SPEC.md v0.2.

**Bands:** Strong (80–100), Solid (60–79), Developing (40–59), Untrained (0–39).

**Starting stats:** Each sign ranks all 16 traits on a shared ladder, so every profile totals 930 points.

**Confirmed base:** From the poll. Answer targets: That's me = 85, Sometimes = 55, Not really = 25, Skip = sign value. **Confirmed value = 30% sign + 70% answer target.**

**Current stat:** Confirmed base + earned attribute XP (capped at 100).

**Recalibration:** Changes the confirmed base only (4.6).

---

### 9. Matching engine
A transparent weighted model in pure TypeScript. No AI at launch.

Each career has: description and day-to-day reality, 2–3 primary attributes with required levels, interest tags, work style, training/education and downsides, a 5-star constellation of quests, a class name for titles, a constellation shape and "Real next steps" content.

**Ranking (provisional):** **55% preferences + 45% confirmed attribute fit.** Work style adds a small bonus and appears as a reason.

**Difficulty:** From the gap between current stats and the career's primary attribute requirements:
- ★ **Natural fit**: attributes already match well
- ★★ **Some training**: one key attribute needs development
- ★★★ **Challenging but achievable**: several key attributes are untrained

Difficulty updates live as attributes grow. It never hides a career.

**Explanations:** 2–3 reasons on each card, e.g. "You enjoy helping people," "Your Empathy is Strong," "Communication needs some training."

**Feedback signals:** Interested / Not for me / Unsure, "Too hard," "Not for me" on quests, and reflection answers all adjust ranking. "Not for me" weighs heavily.

---

### 10. Monetization
**Model:** Hard paywall at a small price.

**Placement:** After the reveal, confirm poll and preferences, at "Your career paths are ready."

**Free:**
- Character reveal and card (shareable)
- Confirm poll and "Your sign called X of 8"
- Blurred top career with difficulty and one reason
- One Taste quest on the top path, with reflection and one lit star

**Paid:**
- All career results and path details
- All constellations and quests
- Hybrid titles and character evolution beyond level 1
- Real next steps
- Recalibration and Then vs now

**Second paywall moment:** After the free quest reflection: "Your first star is lit. Unlock the full constellation."

**Pricing to test:** One-time unlock around $5–10 vs a low-cost subscription. Apple and Google take 15–30% and require in-app purchase.

---

### 11. Gamification rules
- **Quest XP** for completing a quest; **reflection XP** for reflecting.
- **Attribute XP** only when a quest is completed **and** reflected on, going to the quest's related attributes and the ones the user marked as "felt natural."
- **Character level** from total XP drives the evolving illustration.
- **Stars** light per completed quest; full constellations upgrade titles.
- **Difficulty labels** improve as attributes grow.
- **Badges:** First Star, First Constellation, Three Paths Explored, Recalibrated, and similar.
- **No streaks**, no punitive resets, no guilt notifications.

---

### 12. MVP screens
1. Welcome + intent
2. Birthday (with cusp prompt)
3. Character reveal
4. Confirm poll
5. "Your sign called X of 8" + share card
6. What do you enjoy? / How do you like to work?
7. Paywall (plus free-tier teaser)
8. Save your character (account prompt)
9. Explore Paths: ranked career cards with difficulty and reasons
10. Path Details: day-to-day reality, difficulty breakdown, constellation, real next steps
11. Quest: active quest with Done / Not now / Too hard / Not for me
12. Reflection + rewards
13. Home: active quest, next recommendation, constellations
14. Character: evolving illustration, stats, Then vs now, titles, night sky, recalibrate
15. Settings: account, notifications, sign, delete data

Navigation after onboarding: **Home | Character | Explore**.

---

### 13. Technical architecture
**Framework:** React Native + Expo + TypeScript.

**Content:** Version-controlled JSON/TypeScript fixtures for sign profiles, sun-sign date table, poll statements, preferences, careers, quests, constellation shapes, archetype adjectives and path classes.

**Local storage:** Expo SQLite. Offline-first.

**Accounts and backup:** Sign in with Apple, Google and email via a backend such as Supabase or Firebase. Syncs character, stats, XP, quests, reflections and titles.

**Payments:** In-app purchases through a library such as RevenueCat.

**Notifications:** Local scheduled notifications for quest check-ins; no server push needed at MVP.

**Graphics:** Constellations and reveal animation with react-native-svg and Reanimated (or Skia). Character evolution as stacked image layers.

**Logic:** Pure TypeScript functions for sign derivation (including cusp), poll scoring, ranking, difficulty, XP, levels and titles. Unit-tested.

**AI:** Not needed for MVP.

**Privacy:** No birth time or birthplace. Don't retain full birth date. Account stores email only when the user signs in. Reflections are mostly taps; no sensitive free text required. Accurate privacy disclosures and account deletion before store launch.

---

### 14. Content scope
**Pilot (internal, one-sign vertical slice):** Cancer profile and illustration, all poll statements, **24 careers across 12 career worlds, each with a full 5-star constellation built from one beginner-first quest template (120 quests)**, real next steps for those 6, titles for those 6, evolving character layers for Cancer, full flow including free tier, paywall stub, account and notifications.

**First external MVP:** All 12 sign profiles and illustrations, ~30 careers with constellations (~150 quests, using shared quest templates where possible), real next steps for every career, all titles, all character layers, real payments, cloud backup.

**Content note:** Quests are the largest content cost. Write reusable templates (e.g. "Find three examples of great X and note what makes them work") and adapt them per path.

---

### 15. Not in MVP
Daily horoscopes, full birth charts, partner compatibility, party mode, astrological season events, AI coach, social profiles, leaderboards, real-money rewards, job application tools, therapist-style advice, deeper personality quiz, user-generated content, quest photo inventory, yearly recap.

**Strong candidates for v1.1:** Astrological season events (monthly themed quests) and party mode (compare characters with friends).

---

### 16. Key risks and mitigations
| Risk | Mitigation |
|---|---|
| Users feel misread by their sign | Quick confirm poll; answers outweigh the sign; recalibration anytime |
| Low stats feel insulting | "Untrained/Developing" labels; growth framing; difficulty never blocks a path |
| Career suggestions feel random | Preferences weighted highest; 2–3 reasons per card; feedback adjusts ranking |
| Low paywall conversion | Strong free tier, one free quest, second paywall moment after first star |
| Users pay but never return | Contextual check-in reminders; day-2 home; constellations show what's next |
| Lost progress angers paying users | Account prompt right after purchase; cloud backup |
| Abandoned quests clutter the app | Not now / Too hard / Not for me; 14-day check |
| Wrong sign for cusp birthdays | Year-accurate sign table and cusp prompt |
| Content volume (150+ quests) | Reusable quest templates; pilot with 6 full paths first |
| Art cost of evolving characters | Layered illustration system instead of separate drawings |
| Overclaiming about careers | Accurate education and next-steps info; "possible paths," not guarantees |
| Scope creep | Pilot one sign end to end before adding all 12 |
| Younger users | 18+ audience at launch; revisit if expanding |

---

### 17. Milestones
**M0: Content + rules.** Cancer profile; poll statements; preferences; 6 careers with attribute requirements, 5-star constellations, class names and real next steps; ranking, difficulty, XP, level and title formulas; cusp table; five test personas with expected results.

**M1: Vertical slice.** A Cancer user completes the full flow: intent → reveal → poll → preferences → free quest or paywall stub → careers → quest → reflection → star lit → title unlocked, with progress saved after reopening and a working check-in notification.

**M2: Accounts, payments and testing.** Account and backup, sandbox payments, unit tests for all logic, 5–10 usability testers, notes on confusing matches and stat disagreements.

**M3: External MVP.** All 12 signs and illustrations, ~30 careers, real payments, store compliance, privacy materials, device testing.

---

### 18. Questions to validate
1. How often do users change their sign's stats in the poll?
2. Does the reveal plus free quest make people want to pay?
3. Which price and model convert best?
4. Do career explanations and difficulty labels feel accurate and motivating?
5. Do check-in reminders bring people back to reflect?
6. Do constellations, titles and character evolution make people want to continue?

**North-star indicator:** Share of new users who pay **and** light at least two stars.

**Supporting measures:** Reveal → poll completion, stat change rate, share rate, free quest completion, paywall conversion (first and second moment), account creation, notification opt-in, quest completion, reflections, return visits, paths completed.

---

### 19. Immediate next step
Write the Cancer content for six careers: attribute requirements, 5 quests each, class names, constellation shapes and real next steps. Define the ranking, difficulty, XP and level formulas and test them on five personas before building screens.
