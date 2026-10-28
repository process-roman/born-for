# Pilot Content & Formulas v0.2
**Companion to:** PRODUCT_BLUEPRINT.md v0.3 and SIGNS_AND_ONBOARDING_SPEC.md v0.2 | **Date:** October 28, 2026

**What changed from v0.1:**
- Six careers became **24 careers in 12 career worlds**, so an 18-year-old who doesn't know what they want can browse the whole job market, not just desk jobs.
- Every career uses the same **beginner-first quest template**: no quest assumes you already work in the field.
- Requirements use the 16 traits from the signs spec.
- Full career entries now live in **CAREERS.md**, generated from `src/content/careers.ts` (`npm run docs:careers`), so the doc and the app can't drift apart.

---

## 1. Career worlds
Broad worlds an 18-year-old can browse, loosely based on how career guidance groups the job market (Holland interest types, government career clusters). A career can sit in more than one world: someone who loves flowers reaches **Florist** through Create & Design and **Landscape gardener** through Nature.

| World | Pilot careers | More later |
|---|---|---|
| 🎨 Create & Design | UX/product design, Florist | Graphic designer, fashion designer, interior designer |
| 💻 Tech & Digital | Software development, Data analysis | IT support, game developer, cybersecurity |
| 📈 Business & Money | Marketing, Project coordination | Sales, accountant, entrepreneur |
| 🤝 People & Care | Teaching, Social work | Counsellor, childcare worker |
| 🩺 Health | Nursing, Physiotherapy | Paramedic, nutritionist, pharmacist |
| ⚽ Sport & Movement | Professional athlete, Personal trainer | Coach, PE teacher, sports analyst |
| 🌍 Nature, Animals & Outdoors | Vet nurse, Landscape gardener | Farmer, park ranger, horticulturist |
| 🔧 Build, Fix & Make | Electrician, Carpenter | Mechanic, plumber, engineering technician |
| 🍳 Food & Hospitality | Chef, Event planner | Baker, hotel manager |
| 🎭 Arts, Media & Performance | Musician, Writer | Actor, photographer, content creator |
| 🔬 Science & Research | Lab scientist, Environmental scientist | Biologist, chemist |
| 🛡️ Public Service & Law | Firefighter, Law | Police officer, city planner |

Cross-listed: Florist (Create, Nature), UX (Create, Tech), Data analysis (Tech, Business), Marketing (Business, Create), Physiotherapy (Health, Sport), Personal trainer (Sport, Health), Vet nurse (Nature, Health), Landscape gardener (Nature, Build), Carpenter (Build, Create), Chef (Food, Create), Event planner (Food, Business), Environmental scientist (Science, Nature), Firefighter (Public service, Health), Law (Public service, Business), Nursing (Health, People).

**Long shots stay open, honestly.** Careers like Professional athlete and Musician carry a "reality check" on their card: the path stays selectable ("no closed doors"), and the card says plainly how narrow it is and points to the realistic jobs around it.

### Preference IDs (Q2)
| ID | Label |
|---|---|
| `making` | Making and designing things |
| `puzzles` | Solving puzzles and problems |
| `helping` | Helping and supporting people |
| `organizing` | Planning and organizing |
| `leading` | Leading and persuading |
| `learning` | Learning and exploring ideas |
| `tech` | Working with tech |
| `performing` | Performing and presenting |
| `active` | Being active and playing sport |
| `nature` | Nature, plants and animals |
| `building` | Building and fixing things |
| `food` | Food and cooking |

### Work style IDs (Q3)
`solo` · `small_team` · `many` · `unsure`

---

## 2. The 24 pilot careers
Key traits are the three primary traits with the level each career asks for. Full entries (day-to-day, downsides, education, quests, next steps) are in CAREERS.md.

| Career | Class | Constellation | Key traits (required) | Interest tags | Work style |
|---|---|---|---|---|---|
| UX/product design | Shaper | The Lens | Creativity 70, Empathy 60, Communication 60 | making 1, tech .5, puzzles .5 | small team |
| Florist | Bloomweaver | The Bouquet | Aesthetic eye 70, Hands-on 65, Creativity 60 | making 1, nature 1, helping .5 | solo, small team |
| Software development | Codesmith | The Anvil | Analytical 75, Persistence 70, Curiosity 60 | tech 1, puzzles 1, making .5 | solo, small team |
| Data analysis | Oracle | The Eye | Analytical 75, Curiosity 65, Detail 60 | puzzles 1, tech .5, learning .5 | solo, small team |
| Marketing | Herald | The Horn | Communication 75, Creativity 65, Curiosity 55 | leading 1, making .5, performing .5 | small team, many |
| Project coordination | Quartermaster | The Key | Organization 75, Communication 65, Leadership 55 | organizing 1, leading .5, helping .5 | many, small team |
| Teaching | Mentor | The Lantern | Communication 75, Empathy 75, Persistence 60 | helping 1, performing 1, learning .5 | many |
| Social work | Keeper | The Hearth | Empathy 80, Calm 65, Communication 65 | helping 1, organizing .5 | many, small team |
| Nursing | Healer | The Chalice | Empathy 75, Calm 70, Detail 65 | helping 1, learning .5, active .5 | many |
| Physiotherapy | Mender | The Spine | Analytical 70, Hands-on 65, Empathy 65 | helping 1, active 1, learning .5 | small team |
| Professional athlete | Contender | The Laurel | Physical energy 85, Persistence 80, Calm 65 | active 1, performing .5 | small team, many |
| Personal trainer | Drillmaster | The Kettlebell | Physical energy 70, Communication 65, Leadership 60 | active 1, helping 1, leading .5 | solo, small team |
| Vet nurse | Beastwarden | The Paw | Empathy 70, Calm 70, Hands-on 60 | nature 1, helping 1 | small team |
| Landscape gardener | Druid | The Oak | Hands-on 70, Aesthetic eye 60, Physical energy 65 | nature 1, building 1, making .5 | solo, small team |
| Electrician | Sparkwright | The Bolt | Hands-on 70, Analytical 65, Detail 65 | building 1, puzzles .5, tech .5 | solo, small team |
| Carpenter | Artisan | The Square | Hands-on 75, Detail 65, Physical energy 60 | building 1, making 1 | solo, small team |
| Chef | Hearthmaster | The Flame | Hands-on 70, Calm 70, Creativity 60 | food 1, making 1 | small team, many |
| Event planner | Steward | The Banner | Organization 75, Communication 65, Calm 60 | organizing 1, leading .5, food .5 | many |
| Musician | Bard | The Lyre | Creativity 75, Persistence 75, Aesthetic eye 65 | performing 1, making 1 | solo, small team |
| Writer | Scribe | The Quill | Creativity 70, Communication 70, Independence 60 | making 1, learning 1 | solo |
| Lab scientist | Alchemist | The Flask | Analytical 75, Detail 75, Curiosity 65 | learning 1, puzzles 1 | solo, small team |
| Environmental scientist | Ranger | The Fern | Analytical 70, Curiosity 70, Physical energy 55 | nature 1, learning 1, puzzles .5 | small team |
| Firefighter | Sentinel | The Shield | Physical energy 80, Courage 70, Teamwork 65 | active 1, helping 1 | many |
| Law | Arbiter | The Scales | Analytical 75, Communication 75, Detail 65 | puzzles 1, leading 1, learning .5 | small team, many |

Every preference reaches at least one career, and every one of the 16 traits matters to at least one career (as a key trait or a quest trait).

---

## 3. The quest template
Every career uses the same five stars. **No quest assumes you already work in the field**: the first two are about discovering the job, the middle two are a beginner version with a free tool or tutorial, and the last one meets the real world. Each quest has a one-line **"What you'll learn"**.

| Star | Tier | Step | What it asks | Time |
|---|---|---|---|---|
| 1 | Taste | **Discover** | Learn the job's one big idea in about 2 minutes, then spot it in everyday life | ~20 min |
| 2 | Taste | **Day in the life** | Watch or read a real person doing the job; note 3 tasks you'd enjoy and 1 you wouldn't | ~20 min |
| 3 | Try | **Beginner version** | Do a small, guided version with a free tool, kit or tutorial | 1–2 h |
| 4 | Try | **Make it yours** | Do it again your own way, or take it one step further | 1–2 h |
| 5 | Test | **Real world** | Show real people, volunteer, or ask someone who does the job | Real world |

Examples across worlds:

| Star | Marketing | Florist | Professional athlete | Electrician |
|---|---|---|---|---|
| 1 Discover | Who, what, where, did it work? The four questions every marketer asks, applied to one ad | Flowers by season: name five at a market and whether they're in season | Watch like a coach: positioning, decisions, effort off the ball | Follow the power: street → meter → panel → circuits (look, don't open) |
| 2 Day in the life | A day as a marketer | A day as a florist | A day as a pro | A day as an electrician |
| 3 Beginner | Meet the customer: read 10 reviews, describe who the customers are | Your first arrangement from supermarket flowers | Train one skill three times, track it | Light a bulb with a battery kit (battery power only) |
| 4 Make it yours | One post for them in a free Canva template | A second arrangement for a specific person | Plan and follow a balanced training week | Add a switch or a second bulb, draw the diagram |
| 5 Real world | Would you click? Show 2 people in the audience | Give it away, ask a florist one question | Join a local club session | Ask an electrician about apprenticeships |

**Safety rules for quests:** no quest involves mains electricity, medical procedures on others, dangerous tools without supervision, or contacting strangers alone. Quests that involve other people suggest safe routes (friends, family, open days, organized volunteering).

---

## 4. Formulas
All formulas were run on the five personas in section 5.

### 4.1 Confirmed stats (from the poll)
- Answer targets: That's me = 85, Sometimes = 55, Not really = 25, Skip = sign value
- `confirmed = round(0.3 × sign + 0.7 × target)`
- `current = min(100, confirmed + earnedAttributeXP)`

### 4.2 Preference score (P, 0–1)
For each selected preference, take the career's tag weight (0 if no match). Sort descending.
- `P = min(1, (w1 + 0.5 × w2) / 1.5)`
- One primary match → 0.67 · primary + secondary → 0.83 · two primary → 1.0 · one secondary only → 0.33 · no match → 0

### 4.3 Attribute fit (A, 0–1)
- `A = Σ weight × min(current / required, 1)` over the career's primary attributes

### 4.4 Work style (W, 0–1)
- 1 if the user's work style is in the career's list · 0.5 if user picked `unsure` · 0 otherwise

### 4.5 Match score (0–100)
- `score = 100 × (0.52 × P + 0.43 × A + 0.05 × W)`
- Preferences still outweigh attributes; work style is a small tiebreaker.
- Sort by score, then P, then A, then career name.
- Don't show the raw number to users; show rank and reasons.

**Fix from testing:** The v0.3 blueprint added work style as a +5 bonus on top of 55/45, which pushed scores above 100. It's now part of the weights.

### 4.6 Difficulty
For each primary attribute: `gap = required − current`. A **key gap** is a gap over 10.
- ★★★ **Challenging but achievable:** 2+ key gaps, or any gap over 30
- ★★ **Some training:** exactly 1 key gap
- ★ **Natural fit:** no key gaps

### 4.7 Feedback adjustments
| Signal | Effect on that career's score |
|---|---|
| Interested | +10 |
| Unsure | 0 |
| Not for me | Moved to a "Not for me" section at the bottom; never in the top 3 |
| Quest reflection: enjoyed (4–5 of 5) | +5 |
| Quest reflection: didn't enjoy (1–2 of 5) | −10 |
| Quest marked "Too hard" | No score change; offer an easier quest on the same path |
| Quest marked "Not for me" | Same as path Not for me |

### 4.8 Reasons (2–3 per career card)
Pick in this order, skipping any that don't apply:
1. **Preference:** highest-weight matched tag → "You enjoy {preference label}"
2. **Strength:** primary attribute with the highest current value at or above required → "Your {attribute} is {band}"
3. **Growth or work style:** largest key gap → "{Attribute} needs some training"; if no gap, work-style match → "Fits how you like to work: {label}"

### 4.9 XP and levels
| Event | Quest XP |
|---|---|
| Taste quest completed | 50 |
| Try quest completed | 120 |
| Test quest completed | 200 |
| Reflection submitted | +30 |

A full 5-star path = 2×50 + 2×120 + 200 + 5×30 = **690 XP**.

| Character level | Total XP | Roughly after |
|---|---|---|
| 1 | 0 | Start |
| 2 | 150 | 2 Taste quests |
| 3 | 450 | Most of one path |
| 4 | 900 | 1.5 paths |
| 5 | 1,500 | 2–3 paths |

### 4.10 Attribute XP
Only granted when a quest is completed **and** reflected on.
- Each of the quest's two attributes: Taste +2 · Try +4 · Test +6
- Each "felt natural" chip in the reflection: +1 (max 2 chips)
- "Felt hard" chips: no XP; stored as a signal for future quest suggestions

**Effect check:** see §5 (finishing a constellation visibly moves its difficulty).

### 4.11 Titles
- First Try star lit on a path → title unlocks: "The {Archetype adjective} {Class}", e.g. "The Gentle Shaper"
- All 5 stars lit → starred form: "★ The Gentle Shaper"

---

## 5. Test personas (computed results)
These are the expected outputs for unit tests (`tests/ranking.test.ts`), computed with the 16 traits and 24 careers. Scores are shown for testing only.

### Persona 1: Maya · Cancer · accepts every sign stat
- **Poll:** all Skip · no background traits added
- **Enjoys:** helping, organizing · **Work:** lots of different people
- **Sign called:** 8 of 8

| Rank | Career | Score | Difficulty |
|---|---|---|---|
| 1 | Project coordination | 89.4 | ★ Natural fit |
| 2 | Social work | 89.3 | ★ Natural fit |
| 3 | Teaching | 81.7 | ★ Natural fit |
| 4 | Event planner | 81.6 | ★ Natural fit |

**Check:** ✅ Her preferences decide the top 4, all people-and-planning paths across three worlds. Science paths sit at the bottom (★★★) but stay listed.

### Persona 2: Liam · Cancer · analytical, not empathetic
- **Poll:** Empathy = Not really · **Background:** Analytical, Curiosity, Independence added
- **Enjoys:** puzzles, tech · **Work:** on my own
- **Stats:** Analytical 74, Curiosity 73, Independence 70, Empathy 43, others as sign
- **Sign called:** 7 of 8 (only Empathy is a Cancer signature trait he changed)

| Rank | Career | Score | Difficulty |
|---|---|---|---|
| 1 | Software development | 99.8 | ★ Natural fit |
| 2 | Data analysis | 91.1 | ★ Natural fit |
| 3 | Lab scientist | 80.5 | ★ Natural fit |

**Check:** ✅ Same sign as Maya, completely different results: background traits let him show strengths Cancer doesn't lead with. Firefighter is last (★★★).

### Persona 3: Zoe · Leo · performer
- **Poll:** all Skip
- **Enjoys:** leading, performing, making · **Work:** lots of different people

| Rank | Career | Score | Difficulty |
|---|---|---|---|
| 1 | Musician | 93.0 | ★ Natural fit |
| 2 | Marketing | 89.4 | ★ Natural fit |
| 3 | Writer | 77.7 | ★ Natural fit |

**Check:** ✅ Leo's Creativity and Communication plus performing put the stage first. Musician's card carries its reality check.

### Persona 4: Noah · Virgo · likes making things
- **Poll:** Creativity = Sometimes (a background trait for Virgo)
- **Enjoys:** making · **Work:** small team

| Rank | Career | Score | Difficulty |
|---|---|---|---|
| 1 | Chef | 79.9 | ★ Natural fit |
| 2 | Carpenter | 77.2 | ★★ Some training (Physical energy) |
| 3 | UX/product design | 76.1 | ★★ Some training (Creativity) |
| 4 | Florist | 75.1 | ★★ Some training (Aesthetic eye) |

**Check:** ✅ "Making" no longer means only screens: hands-on careers lead, and his Virgo hands-on skill and detail make them natural fits.

### Persona 5: Ava · Pisces · unsure how she works
- **Poll:** Organization = Not really (background), Communication = Sometimes
- **Enjoys:** helping, making, learning · **Work:** not sure yet
- **Sign called:** 7 of 8 (Communication dropped a band)

| Rank | Career | Score | Difficulty |
|---|---|---|---|
| 1 | Writer | 94.9 | ★★ Some training (Communication) |
| 2 | Florist | 88.8 | ★ Natural fit |
| 3 | Physiotherapy | 84.5 | ★★ Some training (Analytical) |

**Check:** ✅ "Not sure" work style gets a neutral half-score. Event planner drops to the bottom because she said Not really to Organization.

### Effect check (16 traits)
Completing all five UX quests (reflected, no chips) adds +10 Empathy, +8 Creativity, +6 Communication, +4 Curiosity, +4 Detail, +4 Persistence. For Noah that moves UX design from ★★ Some training to ★ Natural fit.

### Edge cases for unit tests
- Score never exceeds 100 (Liam's 99.8 is the near-maximum case)
- No preference match → P = 0, career still listed under "See all paths"
- Tie scores → sorted by P, then A, then name
- Stats cap at 100 after attribute XP
- Recalibration changes confirmed base but keeps earned XP
- Background traits never change "Your sign called X of 8"

---

## 6. Before launch
- **Verify every resource name, link and price.** Course providers change offerings; check each one shortly before release.
- **Add salary ranges per region** (Canada and US at minimum) from official sources such as Job Bank (Canada) and the Bureau of Labor Statistics (US).
- **Have someone working in each field review its card** for realistic day-to-day and downsides.
- **Tune attribute requirements and weights** using real tester feedback; these numbers are starting assumptions.
