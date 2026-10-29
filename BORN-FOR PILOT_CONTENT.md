# Pilot Content & Formulas v0.3
**Companion to:** PRODUCT_BLUEPRINT.md v0.3 and SIGNS_AND_ONBOARDING_SPEC.md v0.2 | **Date:** October 28, 2026

**What changed in v0.3:** direction-first matching (users pick worlds, then jobs), 17 worlds, 99 careers including creator and gaming careers, a new match score (§4.2, §4.5) and result groups (§4.5b).

**What changed in v0.2:**
- Six careers became **24 careers in 12 career worlds**, so an 18-year-old who doesn't know what they want can browse the whole job market, not just desk jobs.
- Every career uses the same **beginner-first quest template**: no quest assumes you already work in the field.
- Requirements use the 16 traits from the signs spec.
- Full career entries now live in **CAREERS.md**, generated from `src/content/careers.ts` (`npm run docs:careers`), so the doc and the app can't drift apart.

---

## 1. Career worlds
v0.3 replaces the abstract "What do you enjoy?" options with a **direction-first** flow (signs spec §3): users pick the worlds that pull them, then the jobs that catch their eye. The worlds are broad areas an 18-year-old recognizes, including the creator and gaming careers younger people actually aim for. A job can sit in up to three worlds.

| World | Jobs |
|---|---|
| 📈 Business & Entrepreneurship | Startup founder, E-commerce store owner, Marketing, Sales, Recruiter, Accountant, Real estate agent, Project coordination, Data analysis, Event planner, Law, Hotel manager, Fashion buyer, Social media manager, Copywriter |
| 👗 Fashion & Beauty | Fashion designer, Stylist, Makeup artist, Hairdresser, Fashion buyer, Nail artist, Model\*, Influencer\*, Tattoo artist |
| 📱 Creators & Media | YouTuber\*, Streamer\*, Influencer\*, Podcaster, Social media manager, Video editor, Photographer, Marketing, Esports caster, Music producer, Journalist, Travel creator\*, Stylist, E-commerce store owner |
| 🎮 Gaming & Esports | Game developer, Game designer, Game artist, Esports player\*, Esports caster, QA tester, Animator, Streamer\* |
| 🎨 Art & Design | Graphic designer, Illustrator, Animator, Tattoo artist, Interior designer, Architect, UX/product design, Florist, Carpenter, Photographer, Video editor, Game artist, Game designer, Makeup artist, Pastry chef, Screenwriter |
| 🎵 Music & Performance | Musician\*, Music producer/DJ, Actor\*, Dancer\*, Sound engineer |
| ✍️ Writing & Journalism | Writer, Journalist, Copywriter, Screenwriter, Podcaster |
| 💻 Tech & AI | Software development, AI engineer, Cybersecurity analyst, App developer, IT support, Data analysis, UX/product design, Game developer, QA tester, Sound engineer, Sports analyst, Drone pilot |
| ⚽ Sport & Fitness | Professional athlete\*, Personal trainer, Sports coach, Physiotherapy, Sports analyst, Yoga instructor, Dancer\*, Esports player\* |
| 🩺 Health & Mind | Nursing, Doctor, Paramedic, Psychologist, Pharmacist, Nutritionist, Physiotherapy, Personal trainer, Vet nurse, Veterinarian, Counsellor, Yoga instructor |
| 🤝 People & Education | Teaching, Early childhood educator, Social work, Counsellor, Youth worker, Recruiter, Psychologist, Sports coach, Tour guide |
| 🌍 Nature & Animals | Veterinarian, Vet nurse, Marine biologist, Park ranger, Farmer, Landscape gardener, Florist, Environmental scientist |
| 🍳 Food & Hospitality | Chef, Pastry chef, Barista, Bartender, Event planner, Hotel manager, Nutritionist |
| 🔧 Build & Fix | Electrician, Carpenter, Mechanic, Plumber, Welder, Drone pilot, Landscape gardener, Interior designer, Architect |
| ✈️ Travel & Adventure | Pilot, Flight attendant, Tour guide, Travel creator\*, Hotel manager, Diplomat |
| 🔬 Science & Space | Astronomer, Chemist, Lab scientist, Environmental scientist, Marine biologist, AI engineer, Doctor, Pharmacist |
| 🛡️ Law & Public Service | Law, Police officer, Firefighter, Diplomat, Policy advisor, Paramedic, Park ranger, Cybersecurity analyst |

\* **Long shots stay open, honestly.** These carry a "reality check" on their card: the path stays selectable ("no closed doors"), and the card says plainly how narrow it is and points to the realistic jobs around it (e.g. YouTuber → video editor, social media manager, marketing).

### Work style IDs (Q3)
`solo` · `small_team` · `many` · `unsure`

---

## 2. Careers
**99 careers** across the 17 worlds. Each has a one-liner, day-to-day, downsides, education, three key traits with required levels, work styles, a five-star constellation built from the quest template (§3), and real next steps. The full list with every quest is in **CAREERS.md**, generated from the content files (`npm run docs:careers`).

Trending careers added in v0.3 for younger users: YouTuber, Streamer, Influencer, Podcaster, Social media manager, Video editor, Game developer, Game designer, Esports player and caster, AI engineer, Cybersecurity analyst, Tattoo artist, Makeup artist, Music producer/DJ, Drone pilot, Travel creator, Astronomer. These came from surveys of younger generations' dream jobs, where YouTuber, TikTok creator, influencer, model and fashion designer rank near the top.

New careers keep the same quality bar as the original 24 (beginner-first quests, honest downsides, realistic routes), but their constellation shapes are generated from the career id instead of drawn by hand.

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

### 4.2 Interest score (I, 0–1)
How much the user's own direction points at a career:
- **Picked** the job on "Any of these catch your eye?" → **1.0**
- In one of the user's **chosen worlds** → **0.6**
- Anywhere else → **0.5 × similarity** to the closest picked job, if that similarity is at least 0.4 (otherwise 0)

Similarity between two careers = 0.5 × shared worlds (Jaccard) + 0.5 × shared key traits (Σ min weight).

### 4.3 Attribute fit (A, 0–1)
- `A = Σ weight × min(current / required, 1)` over the career's primary traits

### 4.4 Work style (W, 0–1)
- 1 if the user's work style is in the career's list · 0.5 if user picked `unsure` · 0 otherwise

### 4.5 Match score (0–100)
- `score = 100 × (0.5 × I + 0.4 × A + 0.1 × W)`
- The user's direction outweighs their traits; traits decide order within it and how hard each path will be.
- Sort by score, then I, then A, then strongest-trait alignment (Σ weight × stat / 100), then career name.
- Don't show the raw number to users; show groups, rank and reasons.

**Fix from v0.2 testing:** with 12 abstract enjoy options and only 24 careers, results felt random (no fashion job at all, "making things" pointing at florist, chef and carpenter at once), and users who skipped the poll got careers chosen mostly by their sign. Direction-first picks and 99 careers fix both.

### 4.5b Result groups
Career reveal and Explore show three groups:
1. **Your picks:** the jobs the user picked, by score.
2. **More in your worlds:** other careers in their chosen worlds, by score.
3. **Wildcards:** up to 2 careers outside their worlds where their traits fit very well (A ≥ 0.9) and whose main key trait is one of the user’s four strongest, by strongest-trait alignment. The card leads with “Runs on your {trait}, one of your superpowers”. This is where the sign and traits add discovery instead of deciding for the user.

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
1. **Interest:** picked → "You picked this"; in a chosen world → "In a world you chose: {world}"; otherwise, if it's close to a pick → "Close to {picked job}"
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
Expected outputs for unit tests (`tests/ranking.test.ts`), computed with direction-first matching, 16 traits and 99 careers. Scores are shown for testing only.

### Persona 1: Maya · Cancer · accepts every sign stat
- **Poll:** all Skip · **Worlds:** People & Education, Business · **Picks:** Teaching · **Work:** lots of people

| Group | Careers |
|---|---|
| Your picks | Teaching (99.1, ★ Natural fit) |
| More in your worlds | Recruiter (80.0), Social media manager (80.0), Event planner (79.0), Real estate agent (78.9) … |
| Wildcards | Built on her Empathy or Persistence (e.g. Nutritionist) |

**Check:** ✅ Her own pick leads. If she marks Teaching "Not for me", Recruiter takes the top spot.

### Persona 2: Liam · Cancer · analytical, not empathetic
- **Poll:** Empathy = Not really · **Background:** Analytical, Curiosity, Independence added
- **Worlds:** Tech & AI, Science & Space · **Picks:** Software development, AI engineer · **Work:** on my own

| Group | Careers |
|---|---|
| Your picks | Software development (99.8, ★), AI engineer (98.8, ★) |
| More in your worlds | App developer (80.0), Sports analyst, Data analysis, Chemist … |

**Check:** ✅ Same sign as Maya, completely different results. Paramedic ranks last.

### Persona 3: Zoe · Leo · performer and creator
- **Poll:** all Skip · **Worlds:** Creators & Media, Music & Performance, Business · **Picks:** YouTuber, Actor · **Work:** lots of people

| Group | Careers |
|---|---|
| Your picks | Actor (94.4, ★★ Empathy to train), YouTuber (88.4, ★) |
| More in your worlds | Sales, Marketing, Real estate agent, Hotel manager … |
| Wildcards | Graphic designer, Writer (built on her Creativity and Aesthetic eye) |

**Check:** ✅ A harder pick (Actor) still ranks above easier jobs she didn't choose. Both picks show their reality checks.

### Persona 4: Noah · Virgo · wants to design
- **Poll:** Creativity = Sometimes · **Worlds:** Art & Design, Build & Fix · **Picks:** UX/product design · **Work:** small team

| Group | Careers |
|---|---|
| Your picks | UX/product design (93.9, ★★ Creativity to train) |
| More in your worlds | Electrician, Drone pilot, Mechanic, Plumber … (Virgo hands-on skill and detail) |
| Wildcards | Accountant, Cybersecurity analyst (built on his Detail and Analytical thinking) |

### Persona 5: Ava · Pisces · unsure, no picks
- **Poll:** Organization = Not really, Communication = Sometimes · **Worlds:** Health & Mind, Art & Design, Nature & Animals · **Picks:** none · **Work:** not sure yet

| Group | Careers |
|---|---|
| Top paths in her worlds | Fashion designer, Florist, Illustrator, Graphic designer (tied on score; ties go to careers built on her strongest traits) |
| Wildcards | Early childhood educator, Influencer (built on her Empathy and Creativity) |

**Check:** ✅ With no picks, the worlds lead. "Not sure" work style is neutral. Accountant drops near the bottom because she said Not really to Organization.

### Effect check (16 traits)
Completing all five UX quests (reflected, no chips) adds +10 Empathy, +8 Creativity, +6 Communication, +4 Curiosity, +4 Detail, +4 Persistence. For Noah that moves UX design from ★★ Some training to ★ Natural fit.

### Edge cases for unit tests
- Score never exceeds 100 (Liam's 99.8 is the near-maximum case)
- No interest → I = 0, career still listed under "Browse worlds"
- Tie scores → sorted by I, then A, then strongest-trait alignment, then name
- "Close to" needs a real resemblance (similarity ≥ 0.4)
- Wildcards: outside the user's worlds, A ≥ 0.9, and the career's main trait is one of the user's four strongest
- Stats cap at 100 after attribute XP
- Recalibration changes confirmed base but keeps earned XP
- Background traits never change "Your sign called X of 8"

---

## 6. Before launch
- **Verify every resource name, link and price.** Course providers change offerings; check each one shortly before release.
- **Add salary ranges per region** (Canada and US at minimum) from official sources such as Job Bank (Canada) and the Bureau of Labor Statistics (US).
- **Have someone working in each field review its card** for realistic day-to-day and downsides.
- **Tune attribute requirements and weights** using real tester feedback; these numbers are starting assumptions.
