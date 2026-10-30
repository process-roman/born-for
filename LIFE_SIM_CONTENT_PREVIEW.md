# Life Content Preview
Readable version of the JSON content files, for reviewing tone and story. Edit the JSON files, not this one.

**Odds:** difficulty 60 means a stat of 60 gives 50%, 70 gives 65%, 50 gives 35%. Always between 15% and 90%.

## Designer life (Shaper)

### Endings (checked in this order)
- **Found a Different Path** — needs pivoted: Design opened a door you didn't expect. You walked through it, and you still see the world like a designer. You just use it differently now.
- **Started Your Own Studio** — needs studio; joy ≥ 40: Your name is on the door. Some months are lean, some are great, and every decision is yours.
- **Burned Out, Then Rebuilt** — needs burned_out: Somewhere in your twenties it got to be too much. You stepped back, learned your limits and came back on your own terms. Most people learn that much later.
- **Thriving** — mastery ≥ 55, joy ≥ 65: You're good at this, and you still love it. People use things you made every day without knowing your name. You know, though.
- **Steady** — default: A solid design career: good work, good people, a life that fits. Not every life needs fireworks.

### Role reached
Studio founder (flag studio), Design manager (flag manager); otherwise by Mastery: Lead designer ≥ 75, Senior designer ≥ 55, Product designer ≥ 35, Junior designer ≥ 0

## Start (18)

### Where It Starts
`ux_opener` · opener · Start (18)

You want to design the apps people use every day. First question: how do you learn?

- **Study design at university** — 4 years · solid foundation · student debt
  - Four years of critiques, all-nighters and one great professor. You graduate knowing why things work, not just how. *(-15 Money, +20 Mastery, -5 Energy)*
- **Do an intensive bootcamp** — 6 months · fast · tougher job hunt
  - Six months of twelve-hour days and one shiny portfolio. You're exhausted, and ready-ish. *(-10 Money, +12 Mastery, -15 Energy)*
- **Teach yourself** — Free · flexible · all on you · `Persistence check, difficulty 60`
  - ✓ Courses, videos and redesigns of every app on your phone. It works. *(+15 Mastery, +5 Joy · ★ "Taught yourself design from scratch")*
  - ✗ Motivation comes and goes. You learn a lot, just slower than you hoped. *(+8 Mastery, -5 Joy)*


## Training (19–21)

### The First Critique
`ux_first_critique` · career · Training (19–21)

Your first project goes up on the wall. Someone calls it "safe." Everyone looks at you.

- **Explain your choices** · `Communication check, difficulty 60`
  - ✓ You walk them through your thinking. The room nods. "Safe" turns out to mean "clear," and clear is good. *(+8 Mastery, +5 Joy)*
  - ✗ You get defensive and it shows. Rough afternoon, useful lesson. *(+5 Mastery, -5 Joy)*
- **Ask what they'd change**
  - You take notes, swallow your pride and redo it. Version two is much better. *(+10 Mastery)*
- **Start over with something bold** · `Creativity check, difficulty 65`
  - ✓ The bold version is the best thing you've made so far. *(+12 Mastery, +10 Joy · ★ "Found your bold style early")*
  - ✗ Bold, yes. Usable, no. Back to the middle ground. *(+3 Mastery, -10 Energy)*

### The Bakery Website
`ux_bakery` · career · Training (19–21)

A friend runs a tiny bakery. Her website has six fonts and a spinning cupcake. She asks if you can help.

- **Redesign it for free** — A real project for your portfolio
  - Your first real client. She cries (the good kind). You have a real case study. *(+6 Mastery, +10 Joy, -5 Energy · ★ "Redesigned your first real website")*
- **Charge a small fee** · `Communication check, difficulty 55`
  - ✓ She says yes. Your first design paycheck buys one very nice dinner. *(+8 Money, +6 Mastery, +5 Joy)*
  - ✗ Awkward. She finds someone cheaper online. Pricing, it turns out, is a skill too. *(-5 Joy)*
- **Say you're too busy**
  - You rest instead. Fair, but your portfolio stays thin. *(+10 Energy, -5 Joy)*

### Everyone Knows Figma
`ux_figma` · career · Training (19–21)

Everyone around you moves through Figma like it's their first language. You're still looking for the align button.

- **Grind tutorials every night** · `Persistence check, difficulty 55`
  - ✓ Three weeks later, you're the fast one. *(+10 Mastery, -10 Energy)*
  - ✗ Tutorial fatigue hits. You pick it up slowly through real projects instead. *(+5 Mastery, -10 Energy)*
- **Team up with a classmate** · `Empathy check, difficulty 50`
  - ✓ You trade lessons: their shortcuts for your eye for color. You've made a friend for life. *(+6 Mastery, +10 Joy)*
  - ✗ They're swamped. You figure it out alone, eventually. *(+5 Mastery)*
- **Learn it on the job later**
  - You focus on ideas over tools. A bit of a gamble. *(+3 Mastery, +5 Joy)*

### The Internship
`ux_internship` · career · Training (19–21)

A well-known agency posts a summer internship. Three hundred people apply.

- **Apply with your best work** · `Creativity check, difficulty 65` (bonus: has_portfolio +10)
  - ✓ You're in. Your first desk, your first client meeting, your first real deadline. *(+10 Mastery, +5 Money, +5 Joy · ★ "Landed an agency internship")*
  - ✗ No reply. You add one more project to your portfolio and keep going. *(+4 Mastery, -5 Joy)*
- **Skip it and keep studying**
  - A quieter summer. You sharpen your basics. *(+6 Mastery, +5 Energy)*


## Breaking In (22–23)

### The Job Hunt
`ux_job_hunt` · job_hunt · Breaking In (22–23)

Forty applications. Two replies. One of them is an automated rejection.

> **REAL** Entry-level design roles are competitive, and employers usually look at your portfolio more than your credentials. *(needs source)*

- **Keep applying** · `Persistence check, difficulty 60` (bonus: has_portfolio +10, had_internship +10)
  - ✓ Application 53 gets an interview. Interview three gets an offer. You're a designer. *(+5 Mastery, +10 Joy, +20 Money · ★ "Landed your first design job")*
  - ✗ Still nothing. You take a café job and design at night. *(-15 Energy, +5 Money, -5 Joy)*
- **Ask your network for referrals** · `Communication check, difficulty 55` (bonus: design_friend +10)
  - ✓ A friend of a friend passes your portfolio along. You're hired within a month. *(+3 Mastery, +5 Joy, +20 Money)*
  - ✗ Lots of "I'll keep an eye out." Nothing yet. *(-10 Joy, -5 Energy)*
- **Go freelance instead** — Freedom · unstable income · `Independence check, difficulty 60`
  - ✓ Three small clients and a lot of invoicing. You're your own boss. *(+5 Mastery, +10 Joy, +10 Money)*
  - ✗ Clients are hard to find. You're doing it, but only just. *(-5 Money, -10 Energy, -5 Joy)*

### The Portfolio Review
`ux_portfolio_review` · career · Breaking In (22–23)

A senior designer offers to review your portfolio. She's famous for being blunt.

- **Take the brutal feedback** · `Empathy check, difficulty 50`
  - ✓ You don't flinch. She likes that. "Send me the next version." You have a mentor. *(+10 Mastery, +5 Joy · ★ "Gained a senior designer as a mentor")*
  - ✗ It stings more than you let on. You fix half of it. *(+5 Mastery, -5 Joy)*
- **Politely pass for now**
  - Maybe another time. Your portfolio stays as it is. *(+5 Energy)*

### The Group Chat
`ux_bootcamp_chat` · career · Breaking In (22–23) · needs route_bootcamp

Your bootcamp group chat is half job offers, half panic.

- **Start a weekly job-hunt call** · `Organization check, difficulty 55`
  - ✓ Shared leads, practice interviews, real support. Three of you get hired within a month. *(+3 Mastery, +10 Joy)*
  - ✗ It fizzles after two weeks. The chat is still nice. *(+5 Joy)*
- **Mute it and focus**
  - Quiet focus. You polish your portfolio instead. *(+6 Mastery, +5 Energy)*

### The Final Project
`ux_grad_show` · career · Breaking In (22–23) · needs route_degree

Final project: anything you want. The best ones go into the grad show, where recruiters wander around holding coffee.

- **Make it safe and polished** · `Organization check, difficulty 55`
  - ✓ Clean, thorough, on time. Two recruiters take your card. *(+8 Mastery)*
  - ✗ Polished, but forgettable. It still goes in the portfolio. *(+5 Mastery)*
- **Go ambitious** · `Creativity check, difficulty 70`
  - ✓ Your app for people with low vision wins the grad show. *(+15 Mastery, +10 Joy · ★ "Won the grad show")*
  - ✗ Too big for the time you had. Half-finished, but you learned a ton. *(+6 Mastery, -10 Energy)*

### The Meetup
`ux_imposter` · career · Breaking In (22–23) · needs route_self

At a design meetup, everyone mentions where they studied. You didn't study anywhere.

- **Talk about your work instead** · `Communication check, difficulty 55`
  - ✓ Nobody asks about your degree again. They ask how you made that. *(+10 Joy)*
  - ✗ You leave early. It's fine. It's not fine. *(-10 Joy)*
- **Sign up for an online certificate**
  - A certificate won't make you a designer, but it does quiet the voice in your head. *(-5 Money, +5 Mastery, +5 Joy)*


## First Job (24–25)

### Still Looking
`ux_still_looking` · career · First Job (24–25) · not if employed

Six months later. The café knows your order by heart. You still design every night.

- **Take a smaller design role** — Not glamorous · still design
  - In-house designer at a furniture company. Not the dream, but it's real design work. *(+5 Mastery, +15 Money)*
- **Build one standout project** · `Creativity check, difficulty 60`
  - ✓ Your concept redesign of the city transit app spreads online. Messages start arriving. *(+10 Mastery, +15 Joy, +15 Money · ★ "Your concept project went viral")*
  - ✗ It's good. Nobody notices. Yet. *(+6 Mastery, -10 Energy)*
- **Start exploring other careers**
  - You read about product management, marketing, research. A door opens a crack. *(-5 Joy)*

### Make the Logo Bigger
`ux_bigger_logo` · career · First Job (24–25) · needs employed

The client wants the logo bigger. Again. Also, can it "pop" more?

> **REAL** Feedback and revisions are a big part of design work. Your favorite ideas often get changed. *(needs source)*

- **Push back with user research** · `Communication check, difficulty 60`
  - ✓ You show them the data. They actually listen. The logo stays put. *(+10 Mastery, +5 Joy)*
  - ✗ They don't care about the data. Bigger logo. *(-10 Joy)*
- **Find out what they're worried about** · `Empathy check, difficulty 60`
  - ✓ Their real fear: nobody remembers the brand. You fix that instead, and the logo stays small. Everyone's happy. *(+10 Mastery, +8 Joy · ★ "Turned a nightmare client into a fan")*
  - ✗ Your compromise makes nobody happy. Bigger logo. *(-5 Joy)*
- **Just make it bigger**
  - It's their product. You make it bigger. It pops. *(-10 Joy, +5 Energy)*

### Launch Week
`ux_crunch` · career · First Job (24–25) · needs employed

Launch is Friday. It's Tuesday. Nothing is done.

- **Pull late nights** · `Persistence check, difficulty 60`
  - ✓ You ship it. Exhausted and very proud. *(+10 Mastery, -20 Energy, +5 Joy · ★ "Shipped your first big launch")*
  - ✗ You ship it, barely, then get sick the week after. *(+5 Mastery, -25 Energy)*
- **Propose cutting scope** · `Communication check, difficulty 65`
  - ✓ You suggest a smaller launch. The product manager looks relieved someone finally said it. *(+10 Mastery, -5 Energy, +5 Joy)*
  - ✗ Nobody wants to hear it. Late nights it is. *(-20 Energy, -5 Joy)*
- **Ask a teammate for help**
  - They take half. You owe them coffee forever. *(+5 Mastery, -10 Energy, +5 Joy)*

### Watching Someone Use It
`ux_user_test` · career · First Job (24–25) · needs employed

For the first time, you watch a real person use something you designed. They can't find the checkout button.

- **Watch quietly and take notes** · `Empathy check, difficulty 55`
  - ✓ Painful, and pure gold. You spot five problems in one hour. *(+12 Mastery, +8 Joy)*
  - ✗ You keep wanting to jump in and help. You miss half of it. *(+5 Mastery)*
- **Fix it on the spot**
  - Fixed. Then the next person can't find the search bar. *(+5 Mastery, -5 Energy)*

### Fourteen Shades of Blue
`ux_design_system` · career · First Job (24–25) · needs employed; not if freelance

Your team's app uses fourteen slightly different blues. Someone needs to sort it out.

- **Volunteer to build a design system** · `Organization check, difficulty 65`
  - ✓ Months of tidy, invisible work. Now everything matches, and the developers adore you. *(+15 Mastery, -10 Energy · ★ "Built your team's design system")*
  - ✗ It's much bigger than you thought. Half-done, but it's a start. *(+5 Mastery, -10 Energy)*
- **Leave it to someone else**
  - The blues remain. Someone else's problem, for now. *(+5 Energy)*

### Three Deadlines, One Week
`ux_freelance_life` · career · First Job (24–25) · needs freelance

Three clients, three deadlines, same week. One of them is paying late. Again.

- **Raise your rates and use proper contracts** · `Communication check, difficulty 60`
  - ✓ Two clients accept. One leaves. You earn more and work less. *(+15 Money, +5 Energy, +5 Joy)*
  - ✗ All three push back. You keep the old rates for now. *(-5 Money, -5 Joy)*
- **Take on even more clients** · `Persistence check, difficulty 65`
  - ✓ Your bank account is happy. Your sleep schedule is not. *(+20 Money, -20 Energy)*
  - ✗ You miss a deadline and lose a client. *(-5 Money, -20 Energy, -10 Joy)*
- **Add a part-time job for stability**
  - Steady money, less freedom. A fair trade for now. *(+10 Money, -5 Joy, +3 Mastery)*


## Crossroads (26–28)

### The Startup Offer
`ux_startup_offer` · crossroads · Crossroads (26–28) · needs employed; not if freelance

A startup offers you a lead designer role: more money, more say, much longer hours. Your current team is small and kind.

*Fire signs:* _Part of you already said yes._

*Earth signs:* _You run the numbers twice before you even reply._

*Air signs:* _Mostly, you're curious what you'd learn there._

*Water signs:* _Your team feels like family, and {archetype}s don't leave family easily._

- **Take the leap** · `Independence check, difficulty 60`
  - ✓ Chaotic, exhausting, thrilling. You learn more in one year than in the last three. *(+15 Mastery, +15 Money, -15 Energy · ★ "Became lead designer at a startup")*
  - ✗ The startup runs out of money after ten months. You land on your feet, with great stories. *(+10 Mastery, -5 Money, -5 Joy)*
- **Stay with your team**
  - You stay. Two years later, you're the one welcoming the new hires. *(+6 Mastery, +10 Joy)*
- **Ask for a raise instead** · `Communication check, difficulty 65`
  - ✓ Your manager doesn't want to lose you. Raise approved. *(+15 Money, +5 Joy)*
  - ✗ "Not this year." Hm. *(-8 Joy)*

### Your Own Studio
`ux_studio` · crossroads · Crossroads (26–28) · needs employed

Two past clients ask if you'd work with them directly. You could open your own studio.

- **Open the studio** · `Independence check, difficulty 65` (bonus: freelance +10, has_portfolio +5)
  - ✓ A name, a website, three clients. It's yours. *(+10 Money, +15 Joy, -10 Energy · ★ "Opened your own design studio")*
  - ✗ After a lean year, you close the studio and take a senior role somewhere else. No regrets, lots of lessons. *(-5 Money, +8 Mastery, -5 Joy)*
- **Stay where you are**
  - Security wins. You file the idea away for later. *(+5 Money)*

### Manager or Maker?
`ux_manager` · crossroads · Crossroads (26–28) · needs employed; not if freelance; mastery ≥ 35

Your manager asks: do you want to lead a team of designers, or keep designing yourself?

- **Become a design manager** · `Empathy check, difficulty 65`
  - ✓ Turns out you're good at this. Your team grows, and so do they. *(+10 Mastery, +8 Joy · ★ "Became a design manager")*
  - ✗ You miss designing. Meetings swallow your weeks. *(-15 Joy, -5 Energy)*
- **Keep designing** · `Creativity check, difficulty 65`
  - ✓ You go deep and become the designer people bring the hard problems to. *(+15 Mastery, +10 Joy)*
  - ✗ You stay hands-on. Comfortable, maybe a little too comfortable. *(+5 Mastery)*
- **Switch to product management**
  - You move to product. You still draw on whiteboards, just less often. *(+10 Money, +5 Mastery)*

### One More Year?
`ux_one_more_year` · crossroads · Crossroads (26–28) · not if employed

You've been trying to break into design for years. Something has to change.

- **Give it one more year** · `Persistence check, difficulty 65` (bonus: has_mentor +10)
  - ✓ This is the year. A product team takes a chance on you, and you don't waste it. *(+10 Mastery, +15 Joy, +15 Money · ★ "Broke into design after years of trying")*
  - ✗ Still nothing. You start to wonder what else is out there. *(-10 Joy)*
- **Move into something next to design** — Marketing, research, product
  - You take a marketing role that uses your design eye. It fits better than you expected. *(+10 Joy, +15 Money)*


## Thirty (29)

### The Big One
`ux_big_project` · finale · Thirty (29) · needs employed; not if pivoted

The biggest project of your career lands on your desk: a redesign of an app a million people use.

- **Lead it** · `Communication check, difficulty 65` (bonus: has_mentor +10, manager +10)
  - ✓ It launches. Your mom uses it without knowing you made it. *(+15 Mastery, +10 Joy · ★ "Led a redesign used by a million people")*
  - ✗ It launches late and over budget, but it launches. *(+10 Mastery, -15 Energy)*
- **Support the person leading it**
  - You do your best work in the background. It feels good to make someone else shine. *(+6 Mastery, +5 Joy, +5 Energy)*
- **Pass on it** — Protect your energy
  - You say no. Somebody else gets the stress, and the credit. *(+15 Energy, -5 Joy)*

### Looking Back
`ux_new_path` · finale · Thirty (29) · (not if employed) OR (needs pivoted)

You're 29. Your path bent away from design. Still, you catch yourself rearranging every menu you see.

- **Keep designing for fun**
  - Design stays yours: weekend projects, no clients, no logo requests. *(+10 Joy)*
- **Bring design into your new work**
  - Turns out a designer's eye is a superpower almost anywhere. *(+5 Mastery, +5 Joy)*


## Shared events (all careers)

### Moving Cities
`shared_move` · life · Training (19–21), Crossroads (26–28)

Your best friend is moving to another city and asks you to come along.

- **Go with them** · `Independence check, difficulty 55`
  - ✓ New city, new start. It takes a while, but it starts to feel like home. *(+10 Joy, -5 Energy)*
  - ✗ The first year is lonely. It gets better, slowly. *(-10 Joy, -5 Energy)*
- **Stay put**
  - You stay. Video calls aren't the same, but you make them work. *(-5 Joy, +5 Energy)*

### Family Needs You
`shared_family` · life · Training (19–21), Crossroads (26–28)

Someone in your family gets sick and needs help for a few months.

- **Step up and help**
  - Hard months. You're glad you were there. *(-15 Energy, +5 Joy · ★ "Showed up for your family when it mattered")*
- **Help from a distance**
  - You call every day and send what you can. It's not the same, and you know it. *(-5 Energy, -5 Joy, -5 Money)*

### Remembered
`shared_referral` · life · Crossroads (26–28)

An old classmate remembers you and mentions your name to their boss.

- **Follow up right away** · `Communication check, difficulty 50`
  - ✓ One coffee, one call, one offer: a better role with better pay. *(+12 Money, +5 Mastery, +5 Joy)*
  - ✗ They'd already hired someone. Still, it's nice to be remembered. *(+3 Joy)*
- **Let it go**
  - You're happy where you are. Probably. *(+5 Energy)*

### Layoffs
`shared_layoffs` · life · Crossroads (26–28) · needs employed; not if studio, freelance, pivoted

Your company announces layoffs. Your name is on the list.

- **Take the severance and job-hunt** · `Persistence check, difficulty 55` (bonus: has_portfolio +5)
  - ✓ Two months later, you're somewhere better. Weirdly, it was a gift. *(+5 Money, +5 Joy)*
  - ✗ It takes six long months. *(-15 Money, -10 Joy, -10 Energy)*
- **Try freelancing for a while** · `Independence check, difficulty 60`
  - ✓ Old contacts become clients. You like being your own boss. *(+5 Money, +10 Joy)*
  - ✗ Freelancing is harder than it looks. You take a contract job after a few months. *(-10 Money, -5 Joy)*

### The Weekend Project
`shared_side_project` · life · Training (19–21), Crossroads (26–28)

You start making something on weekends, just for you.

- **Go all in** · `Creativity check, difficulty 55`
  - ✓ People start asking where they can buy it. A small, happy second income. *(+8 Money, +12 Joy, -10 Energy)*
  - ✗ It eats your weekends and goes nowhere. Still, you made something. *(+3 Joy, -10 Energy)*
- **Keep it casual**
  - No pressure, no plans. It's the best part of your week. *(+8 Joy, +5 Energy)*

### A Random Course
`shared_course` · life · Training (19–21), Crossroads (26–28)

A free online course catches your eye. It has nothing to do with your work.

- **Take it** · `Curiosity check, difficulty 55`
  - ✓ It changes how you see your own work. Best decision of the year. *(+6 Mastery, +10 Joy)*
  - ✗ You stop at module three. Classic. *(-2 Joy)*
- **Skip it**
  - Maybe next year. *(+5 Energy)*

### Coffee With Someone Ahead
`shared_mentor` · life · Training (19–21) · not if has_mentor

Someone a few years ahead in your field offers to grab coffee once a month.

- **Say yes**
  - Monthly coffee, honest advice and someone in your corner. *(+5 Mastery, +5 Joy)*
- **You're fine on your own**
  - You figure things out your own way. *(+5 Energy)*

### Three Months Away
`shared_travel` · life · Training (19–21), Crossroads (26–28)

Your friends are going traveling for three months. There's a spot for you.

- **Go**
  - Night trains, questionable hostels, best months of your life. *(-15 Money, +15 Joy, +20 Energy · ★ "Took three months to travel")*
- **Stay and keep working**
  - You stay. The photos look amazing. You're doing fine. *(+5 Mastery, +5 Money, -3 Joy)*

### Running on Empty
`shared_burnout` · forced · triggers when energy ≤ 20

You wake up and can't make yourself start the day. This has been building for months.

- **Take a real break**
  - Three weeks off. You come back slower, but you come back. *(+40 Energy, -10 Money, +5 Joy)*
- **Push through** · `Persistence check, difficulty 70`
  - ✓ You make it to the other side. Barely. *(+15 Energy)*
  - ✗ Your body decides for you. Two months off. *(+30 Energy, -15 Joy, -10 Money)*
- **Talk to someone**
  - A friend, a doctor, your mom. Saying it out loud helps more than you expected. *(+30 Energy, +10 Joy)*

### Rent Is Due
`shared_broke` · forced · triggers when money ≤ 5

Rent is due, and your bank account says no.

- **Pick up extra shifts**
  - Tired, but paid. *(+20 Money, -15 Energy)*
- **Ask family for help**
  - It's humbling. It's also what family is for. *(+15 Money, -5 Joy)*
- **Sell something you love**
  - Goodbye, good camera. Rent is paid. *(+15 Money, -10 Joy)*

### Someone Has to Decide
`sign_fire` · sign · First Job (24–25) · fire signs only

Your group has been stuck on a decision for two weeks. Everyone is waiting for someone to just go.

*Fire signs:* _{archetype}s don't wait for permission._

- **Make the call** · `Independence check, difficulty 60`
  - ✓ You decide. It's the right call, and people start looking to you. *(+10 Mastery, +10 Joy · ★ "Took charge when everyone else hesitated")*
  - ✗ Too fast. Half of it has to be undone. *(-5 Joy, -5 Energy)*
- **Wait for everyone to agree**
  - Two more weeks of meetings. It gets decided, eventually. *(-5 Energy)*

### The Abandoned Project
`sign_earth` · sign · First Job (24–25) · earth signs only

A project everyone gave up on lands in your lap. Fixing it means months of patient work.

*Earth signs:* _{archetype}s finish what others start._

- **Take it on** · `Persistence check, difficulty 60`
  - ✓ Slowly, steadily, it comes back to life. People notice. *(+15 Mastery, -5 Energy · ★ "Rescued a project everyone gave up on")*
  - ✗ You make progress, but it's a grind. *(+5 Mastery, -10 Energy)*
- **Hand it back**
  - Not your mess. Fair enough. *(+5 Energy)*

### Nobody's Talking
`sign_air` · sign · First Job (24–25) · air signs only

Two groups you work with have stopped talking to each other, and everything is slowing down. You know people on both sides.

*Air signs:* _{archetype}s are made for moments like this._

- **Bring them together** · `Communication check, difficulty 60`
  - ✓ One lunch, one shared document, and suddenly things move. *(+10 Mastery, +10 Joy · ★ "Got two stuck teams working together")*
  - ✗ Both sides think you're on the other one's side. *(-5 Joy)*
- **Stay out of it**
  - Not your circus. Things stay slow. *(+5 Energy)*

### The Quiet Struggle
`sign_water` · sign · First Job (24–25) · water signs only

Someone you work with is clearly struggling but hasn't told anyone. You've noticed.

*Water signs:* _{archetype}s notice what others miss._

- **Check in with them** · `Empathy check, difficulty 55`
  - ✓ They open up. Months later, they tell you it changed everything. *(+15 Joy · ★ "Helped a coworker through a hard time")*
  - ✗ They brush it off. You stay close anyway. *(+5 Joy)*
- **Give them space**
  - You let it be. You wonder about it sometimes. *(-3 Joy)*
