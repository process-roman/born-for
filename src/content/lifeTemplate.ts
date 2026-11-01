// Template lives (Life Sim Spec §15 step 5): every career without a hand-written life gets one
// built from its own content: how you start (from its training route), its day-to-day work, its
// real downsides, its key traits (which checks it asks for), its entry roles and its role ladder.
// Same slots, meters, numbers and endings as the hand-written Designer life, so balance carries
// over; scripts/life-balance.ts checks every career. A hand-written JSON life replaces the
// template for its career.

import type { AttributeId } from './attributes';
import { CAREER_TRAINING } from './careerTraining';
import { CAREER_IDS, CAREERS, type Career, type CareerId } from './careers';
import type { CareerLife, Choice, LifeEvent } from './life';
import { FAMILY_REPLACES, familyEvents, familyOf } from './lifeFamilies';
import { article, CHANGER, check, firstSentence, inSentence, result } from './lifeKit';
import { ladderFor, type LifeLadder } from './lifeLadders';

/** The most similar other career, for "switch to something next to it". */
function neighbour(career: Career): Career {
  const shared = (other: Career) =>
    other.worlds.filter((w) => career.worlds.includes(w)).length * 2 +
    other.requirements.filter((r) => career.requirements.some((q) => q.attribute === r.attribute)).length;
  return CAREER_IDS.map((id) => CAREERS[id])
    .filter((c) => c.id !== career.id)
    .sort((a, b) => shared(b) - shared(a) || a.name.localeCompare(b.name))[0]!;
}

function openers(career: Career, ladder: LifeLadder, main: AttributeId): LifeEvent[] {
  const training = CAREER_TRAINING[career.id];
  const [min, max] = training.years;
  const name = ladder.lifeName;
  const intro = `${name} it is. ${firstSentence(career.education)}`;
  let choices: Choice[];
  if (training.paidApprenticeship) {
    const [a, b] = training.paidApprenticeship;
    choices = [
      result('apprentice', 'Sign up for an apprenticeship', 'You start at the bottom, paid from day one, though not much. Years of early mornings and patient teachers, and you learn the trade properly.', { money: -5, mastery: 15, energy: -10, set: ['route_degree'] }, `Paid while you learn · ${a}–${b} years to qualify`),
      result('college', 'Do a college program first', 'A year in the classroom and the workshop. You arrive on your first site knowing the theory cold.', { money: -18, mastery: 18, energy: -8, set: ['route_bootcamp'] }, 'Classroom first · costs money'),
      check('helper', 'Start as a helper on the job', main, 60, ['You carry, fetch and watch, and slowly they let you do more. You pick it up fast.', { mastery: 12, joy: 5, set: ['route_self'], highlight: 'Learned the trade on the job' }], ['It’s mostly carrying things for a while, for very little pay. You learn, just slowly.', { mastery: 6, joy: -5, money: -5, set: ['route_self'] }], { hint: 'Learn by doing · no guarantees' }),
    ];
  } else if (min >= 3) {
    choices = [
      result('study', 'Study it properly', 'Years of lectures, exams and late nights. You come out knowing why things work, not just how.', { money: -18, mastery: 20, energy: -10, set: ['route_degree'] }, `${min}–${max} years · solid foundation · student debt`),
      check('part_time', 'Start in a support role and study part-time', 'persistence', 60, ['Work by day, study by night. It takes longer, and you never stop earning.', { mastery: 14, money: 5, set: ['route_self'], highlight: 'Studied part-time while working' }], ['Some terms you manage, some you drop a course. You get there slowly.', { mastery: 7, energy: -15, set: ['route_self'] }], { hint: 'Earn while you learn · slower' }),
      result('shorter', 'Take a shorter route into a nearby role', 'You get in sooner, one step to the side. Less pay and less scope at first, but you’re in the field.', { mastery: 10, money: 5, joy: -5, set: ['route_bootcamp'] }, 'In sooner · less scope at first'),
    ];
  } else {
    choices = [
      result('course', 'Take a course', 'A few intense months and a first bit of real work to show. Tired, and ready-ish.', { money: -14, mastery: 12, energy: -15, set: ['route_bootcamp'] }, 'A few months · fast · costs money'),
      check('self', 'Teach yourself', 'persistence', 60, ['Videos, practice and a lot of trial and error. It works.', { mastery: 15, joy: 5, set: ['route_self'], highlight: 'Taught yourself from scratch' }], ['Motivation comes and goes. You learn a lot, just slower than you hoped.', { mastery: 8, joy: -5, set: ['route_self'] }], { hint: 'Free · flexible · all on you' }),
      check('bottom', 'Start at the bottom and learn on the job', main, 55, [`As ${article(ladder.roles[0])} ${inSentence(ladder.roles[0])}, you watch the people who are good at this and copy them shamelessly.`, { mastery: 12, money: 5, joy: 5 }], ['It’s mostly the jobs nobody else wants. You learn, slowly.', { mastery: 5, energy: -10 }], { hint: `As ${article(ladder.roles[0])} ${inSentence(ladder.roles[0])}` }),
    ];
  }
  const longRoute = min >= 3;
  return [
    { id: `${career.id}_opener`, kind: 'opener', stages: ['start'], conditions: { flagsNone: [CHANGER] }, icon: 'compass', title: 'Where It Starts', text: `${intro} First question: how do you start?`, choices },
    {
      id: `${career.id}_change_opener`,
      kind: 'opener',
      stages: ['start'],
      conditions: { flagsAll: [CHANGER] },
      priority: 1,
      icon: 'compass',
      title: 'A Second Start',
      text: `You’re {age}, years into another job, and ${inSentence(name)} work keeps pulling at you. ${firstSentence(career.education)} How do you make the switch?`,
      signLines: {
        fire: '{archetype}s would rather start late than never.',
        earth: 'You make a plan with a budget before anything else.',
        air: 'Mostly, you want to know if the pull is real.',
        water: 'You think about who depends on you before you decide anything.',
      },
      choices: [
        result('retrain', 'Retrain full time', longRoute ? 'Back to school, years of it, on savings and stubbornness. It’s a lot at {age}, and you do it anyway.' : 'Months of full-time training on your savings, next to classmates ten years younger. You come out ready, and poorer.', { money: longRoute ? -22 : -18, mastery: 15, energy: -8, set: ['route_bootcamp'] }, longRoute ? `${min}–${max} years of study · hard to fit in` : 'Fast · burns savings'),
        check('evenings', 'Learn while you keep your job', 'persistence', longRoute ? 65 : 60, ['Evenings and weekends, for longer than you’d like. You never miss rent, and you get there.', { mastery: 12, joy: 5, energy: -10, set: ['route_self'], highlight: 'Retrained while working full time' }], ['Most weeks, work wins. You learn, just slower than you hoped.', { mastery: 6, energy: -12, set: ['route_self'] }], { hint: 'Slow · safe · exhausting' }),
        check('experience', 'Use what you already know', main, 65, ['Your old job turns out to be a head start: people skills, a network, real-world sense. Doors open faster than you expected.', { mastery: 10, money: 5, joy: 10, set: ['route_internal', 'has_portfolio'], highlight: 'Turned your old career into a head start' }], ['It doesn’t transfer as neatly as you hoped. You start closer to zero.', { mastery: 5, joy: -5, set: ['route_self'] }], { hint: 'Your past as a starting point', check: { attribute: main, difficulty: 65, bonus: { [CHANGER]: 5 } } }),
      ],
    },
  ];
}

export function templateLife(id: CareerId): CareerLife | null {
  const ladder = ladderFor(id);
  if (!ladder) return null;
  const career = CAREERS[id];
  const [main, second] = career.requirements.map((r) => r.attribute) as [AttributeId, AttributeId, ...AttributeId[]];
  const name = ladder.lifeName;
  const work = `${inSentence(name)} work`;
  const day = career.dayToDay.map((d) => inSentence(d));
  const downs = career.downsides.map((d) => inSentence(d));
  // The first rung of the ladder reads as a job title ("bookkeeper roles"); search terms like
  // "club trials near me" don’t.
  const entryRole = inSentence(ladder.roles[0]);
  const next = neighbour(career);
  const [junior, mid, senior, lead] = ladder.roles;
  const e = (suffix: string) => `${id}_${suffix}`;
  const family = familyOf(id);
  const replaced = new Set((family ? FAMILY_REPLACES[family] : []).map(e));

  const allEvents: LifeEvent[] = [
    ...openers(career, ladder, main),

    // Training
    {
      id: e('first_try'),
      kind: 'career',
      stages: ['training'],
      icon: 'sparkle',
      title: 'First Real Try',
      text: `Your first real go at ${day[0] ?? work}. It’s harder than it looks from the outside.`,
      choices: [
        check('feedback', 'Ask for honest feedback', second, 55, ['It stings a little, and it’s exactly what you needed. Version two is much better.', { mastery: 10, joy: 5 }], ['You get defensive and it shows. Rough day, useful lesson.', { mastery: 5, joy: -5 }]),
        check('practice', 'Practice until it’s right', 'persistence', 55, ['Again and again until it clicks. It clicks.', { mastery: 10, energy: -10 }], ['Practice fatigue hits. You improve, slowly.', { mastery: 5, energy: -10 }]),
        check('own_way', 'Try your own way', 'creativity', 65, ['Your version is the best thing you’ve made so far.', { mastery: 12, joy: 10, highlight: 'Found your own style early' }], ['Bold, yes. Right, no. Back to the basics.', { mastery: 3, energy: -10 }]),
      ],
    },
    {
      id: e('small_job'),
      kind: 'career',
      stages: ['training'],
      icon: 'storefront',
      title: 'A Small Real Job',
      text: `Someone you know needs help with some ${work} and can’t pay much. A real job, though.`,
      choices: [
        result('free', 'Do it for free', 'Your first real “client”. You even cover the materials yourself. They’re thrilled, and you have something real to show.', { mastery: 6, joy: 10, energy: -5, money: -5, set: ['has_portfolio'], highlight: 'Did your first real job for someone' }, 'Something real to show'),
        check('fee', 'Charge a small fee', 'communication', 55, ['They say yes. Your first pay in the field buys one very nice dinner.', { money: 8, mastery: 6, joy: 5, set: ['has_portfolio'] }], ['Awkward. They find someone cheaper. Pricing is a skill too.', { joy: -5 }]),
        result('busy', 'Say you’re too busy', 'You rest instead. Fair, but you have less to show.', { energy: 10, joy: -5 }),
      ],
    },
    {
      id: e('basics'),
      kind: 'career',
      stages: ['training'],
      icon: 'books',
      title: 'The Basics Everyone Knows',
      text: `Everyone around you seems to have the basics down already: ${day[1] ?? day[0] ?? work}. You’re still catching up.`,
      choices: [
        check('grind', 'Grind it every night', 'persistence', 55, ['Three weeks later, you’re the fast one.', { mastery: 10, energy: -10 }], ['Fatigue hits. You pick it up slowly through real practice instead.', { mastery: 5, energy: -10 }]),
        check('pair', 'Team up with someone learning too', 'empathy', 50, ['You trade what you each know best. You’ve made a friend for life.', { mastery: 6, joy: 10, set: ['peer_friend'] }], ['They’re swamped. You figure it out alone, eventually.', { mastery: 5 }]),
        result('later', 'Learn it on the job later', 'You focus on the bigger picture. A bit of a gamble.', { mastery: 3, joy: 5 }),
      ],
    },
    {
      id: e('change_evenings'),
      kind: 'career',
      stages: ['training'],
      conditions: { flagsAll: [CHANGER] },
      weight: 2,
      icon: 'laptop',
      title: 'Bills and Breakpoints',
      text: 'Rent, bills, maybe people who depend on you, and training that wants your evenings too.',
      choices: [
        check('protect', 'Protect three evenings a week', 'persistence', 60, ['Three evenings, every week, no excuses. Slowly, you get good.', { mastery: 12, energy: -8, set: ['has_portfolio'] }], ['Life keeps winning. You get some of it done.', { mastery: 5, energy: -15 }]),
        check('use_job', 'Practice through your current job', main, 60, ['You find a way to use the new skills at work. Your old job becomes your practice ground.', { mastery: 10, joy: 8, set: ['has_portfolio'], highlight: 'Turned your old job into practice' }], ['Nobody at work has time for it. You still learned a lot.', { mastery: 5, joy: -5 }], { check: { attribute: main, difficulty: 65, bonus: { [CHANGER]: 10 } } }),
        result('unpaid', 'Take a few weeks unpaid to focus', 'Weeks of nothing but learning. Scary for your savings, great for your skills.', { money: -15, mastery: 12, energy: 5 }),
      ],
    },

    // Breaking in
    {
      id: e('job_hunt'),
      kind: 'job_hunt',
      stages: ['breaking_in'],
      conditions: { flagsNone: [CHANGER] },
      icon: 'briefcase',
      title: 'The Job Hunt',
      text: `You apply for ${entryRole} roles. Lots of applications, very few replies.`,
      choices: [
        check('keep', 'Keep applying', 'persistence', 60, ['One more application gets an interview, and the interview gets an offer. You’re in.', { mastery: 5, joy: 10, money: 20, set: ['employed'], highlight: `Started as ${article(junior)} ${inSentence(junior)}` }], ['Still nothing. Savings shrink, so you take a side job and keep practicing at night.', { energy: -15, money: -5, joy: -5, set: ['side_job'] }], { check: { attribute: 'persistence', difficulty: 60, bonus: { has_portfolio: 10 } } }),
        check('network', 'Ask everyone you know', 'communication', 55, ['A friend of a friend passes your name along. You’re hired within a month.', { mastery: 3, joy: 5, money: 20, set: ['employed'] }], ['Lots of “I’ll keep an eye out.” Nothing yet.', { joy: -10, energy: -5 }], { check: { attribute: 'communication', difficulty: 55, bonus: { has_mentor: 10, peer_friend: 10 } } }),
        check('own', 'Do your own thing instead', 'independence', 60, ['A few small clients and a lot of admin. You’re your own boss.', { mastery: 5, joy: 10, money: 10, set: ['employed', 'freelance'] }], ['Work is hard to find. You’re doing it, but only just, and rent doesn’t wait.', { money: -10, energy: -10, joy: -5 }], { hint: 'Freedom · unstable income' }),
      ],
    },
    {
      id: e('change_job_hunt'),
      kind: 'job_hunt',
      stages: ['breaking_in'],
      conditions: { flagsAll: [CHANGER] },
      priority: 1,
      icon: 'briefcase',
      title: 'Junior at {age}',
      text: `Most ${entryRole} roles were written with 22-year-olds in mind. Your CV has years of work they don’t quite know how to read.`,
      choices: [
        check('pitch', 'Pitch your past as a strength', 'communication', 65, ['One interviewer gets it right away: someone who already knows how work works. You’re hired.', { mastery: 8, joy: 10, money: 15, set: ['employed'], highlight: 'Turned your old career into your edge' }], ['Lots of polite interest, no offers yet. You keep your old job a little longer.', { joy: -10, energy: -5, set: ['side_job'] }], { check: { attribute: 'communication', difficulty: 65, bonus: { has_portfolio: 10, route_internal: 10 } } }),
        result('junior', 'Take a junior role and a pay cut', `Your first job as ${article(junior)} ${inSentence(junior)}, and less money than before. It stings, and it’s exactly what you wanted.`, { money: -10, mastery: 8, joy: 8, set: ['employed'] }, 'In the door · less money for a while'),
        check('old_world', 'Work for your old industry', 'independence', 60, ['Former colleagues become your first clients. Your old network is your pipeline.', { money: 10, joy: 10, mastery: 5, set: ['employed', 'freelance'] }], ['People say they’ll call. Few do. You keep a part-time job to cover the gap.', { money: -5, energy: -10, joy: -5 }], { check: { attribute: 'independence', difficulty: 60, bonus: { [CHANGER]: 10 } } }),
      ],
    },
    {
      id: e('mentor'),
      kind: 'career',
      stages: ['breaking_in'],
      icon: 'users',
      title: 'Someone Ahead',
      text: `${article(senior) === 'an' ? 'An' : 'A'} ${inSentence(senior)} offers to look at your work. They’re known for being blunt.`,
      choices: [
        check('take', 'Take the brutal feedback', 'empathy', 50, ['You don’t flinch. They like that. “Show me the next version.” You have a mentor.', { mastery: 10, joy: 5, set: ['has_mentor'], highlight: 'Gained a mentor in the field' }], ['It stings more than you let on. You fix half of it.', { mastery: 5, joy: -5 }]),
        result('pass', 'Politely pass for now', 'Maybe another time.', { energy: 5 }),
      ],
    },
    {
      id: e('mistake'),
      kind: 'career',
      stages: ['breaking_in'],
      icon: 'warning',
      title: 'Your First Big Mistake',
      text: 'You get something important wrong, and people notice.',
      choices: [
        check('own_it', 'Own it out loud', 'communication', 55, ['You explain what happened and how you’ll fix it. People trust you more, not less.', { mastery: 8, joy: 5 }], ['It comes out wrong. A rough week.', { joy: -10 }]),
        check('fix', 'Quietly fix it', 'persistence', 55, ['Late nights, but it’s fixed before anyone else has to.', { mastery: 8, energy: -10 }], ['Fixed, mostly. You’re exhausted.', { mastery: 3, energy: -10, joy: -5 }]),
        result('help', 'Ask for help', 'Someone shows you a faster way. Lesson learned.', { mastery: 5, joy: 3 }),
      ],
    },

    // First job
    {
      id: e('still_looking'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsNone: ['employed'] },
      priority: 10,
      icon: 'coffee',
      title: 'Still Looking',
      text: `Months later, still no steady ${work}. You keep practicing on the side.`,
      choices: [
        result('smaller', 'Take a smaller role', `Not the dream, but it’s real ${work}.`, { mastery: 5, money: 15, set: ['employed'] }, 'Not glamorous · still the field'),
        check('standout', 'Make one standout piece of work', main, 60, ['It gets noticed. Messages start arriving.', { mastery: 10, joy: 15, money: 15, set: ['employed'], highlight: 'Your work got noticed' }], ['It’s good. Nobody notices. Yet.', { mastery: 6, energy: -10 }]),
        result('explore', 'Start exploring other careers', `You read about ${inSentence(next.name)} and a few others. A door opens a crack.`, { joy: -5, set: ['considering_pivot'] }),
      ],
    },
    {
      id: e('hard_part'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      icon: 'warning',
      title: 'The Hard Part',
      text: `Nobody put this in the brochure: ${downs[0] ?? 'the hard weeks'}.`,
      choices: [
        check('push', 'Push through', 'persistence', 60, ['You get through it, tired and a bit proud.', { mastery: 10, energy: -15, joy: 5 }], ['You get through it, barely, then get sick the week after.', { mastery: 5, energy: -20 }]),
        check('smarter', 'Find a smarter way', main, 60, ['You change how you work, and the hard part gets lighter.', { mastery: 10, joy: 5, highlight: 'Found a smarter way through the hard part' }], ['Your fix makes it worse for a while.', { energy: -10, joy: -5 }]),
        result('talk', 'Talk to someone about it', 'Turns out everyone struggles with this. That helps more than you expected.', { joy: 5, energy: 5, mastery: 3 }),
      ],
    },
    {
      id: e('week'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      icon: 'eye',
      title: 'A Normal Week',
      text: `Most of your week is ${day[2] ?? day[0] ?? work}. You’re getting good at it.`,
      choices: [
        check('deep', 'Go deeper', second, 60, ['You become the person people bring the tricky ones to.', { mastery: 12, joy: 8 }], ['You try, but there’s never quite enough time.', { mastery: 5 }]),
        check('help', 'Help someone newer', 'empathy', 55, ['Teaching it makes you better at it. They never forget it.', { mastery: 6, joy: 10 }], ['They’re not really listening. Still, you tried.', { joy: 3 }]),
        result('steady', 'Keep it steady', 'A good, ordinary week. Those count too.', { energy: 5, mastery: 4 }),
      ],
    },
    {
      id: e('other_side'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      icon: 'lightning',
      title: 'Another Side of the Job',
      text: `${downs[1] ? downs[1].charAt(0).toUpperCase() + downs[1].slice(1) : 'Some weeks are a lot'}. Some weeks it’s fine, some weeks it’s a lot.`,
      choices: [
        check('boundaries', 'Set clear boundaries', 'communication', 60, ['People respect it more than you feared.', { energy: 10, joy: 5 }], ['Nobody wants to hear it. You’re stuck with it for now.', { energy: -10, joy: -5 }]),
        check('lean', 'Lean in for now', 'persistence', 55, ['It pays off in skills and money, and it costs sleep.', { mastery: 10, money: 5, energy: -10 }], ['It just costs sleep.', { energy: -15 }]),
      ],
    },
    {
      id: e('freelance_life'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['freelance'] },
      priority: 5,
      icon: 'wallet',
      title: 'Three Deadlines, One Week',
      text: 'Three clients, three deadlines, same week. One of them is paying late. Again.',
      choices: [
        check('rates', 'Raise your rates and use proper contracts', 'communication', 60, ['Two clients accept. One leaves. You earn more and work less.', { money: 15, energy: 5, joy: 5 }], ['All three push back. You keep the old rates for now.', { money: -5, joy: -5 }]),
        check('more', 'Take on even more work', 'persistence', 65, ['Your bank account is happy. Your sleep is not.', { money: 20, energy: -20 }], ['You miss a deadline and lose a client.', { money: -5, energy: -20, joy: -10 }]),
        result('part_time', 'Add a part-time job for stability', 'Steady money, less freedom. A fair trade for now.', { money: 10, joy: -5, mastery: 3 }),
      ],
    },
    {
      id: e('change_young_boss'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: [CHANGER, 'employed'], flagsNone: ['freelance'] },
      icon: 'users',
      title: 'Your Boss Is Younger',
      text: 'Your new boss is several years younger than you, and a little nervous about it.',
      choices: [
        check('support', 'Offer what you know, quietly', 'empathy', 55, ['You help where you’re strong, they teach you the craft. You become the steady one on the team.', { mastery: 8, joy: 8, highlight: 'Became the steady one on a young team' }], ['It comes across as advice nobody asked for. You both get careful.', { joy: -5 }]),
        result('learn', 'Keep your head down and learn', 'Being new again is humbling, and it works.', { mastery: 8, energy: 5 }),
        check('push', 'Push back when they’re wrong', 'communication', 60, ['You disagree well, with reasons. They start asking for your view first.', { mastery: 10, joy: 5 }], ['You were right; the way you said it wasn’t. Awkward weeks follow.', { joy: -10, energy: -5 }]),
      ],
    },

    // Crossroads
    {
      id: e('offer'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'], flagsNone: ['freelance'] },
      icon: 'rocket',
      title: 'The Bigger Offer',
      text: 'A bigger place offers you more money, more say and much longer hours. Your current team is small and kind.',
      signLines: {
        fire: 'Part of you already said yes.',
        earth: 'You run the numbers twice before you even reply.',
        air: 'Mostly, you’re curious what you’d learn there.',
        water: 'Your team feels like family, and {archetype}s don’t leave family easily.',
      },
      choices: [
        check('leap', 'Take the leap', 'independence', 60, ['Chaotic, exhausting, thrilling. You learn more in a year than in the last three.', { mastery: 15, money: 15, energy: -15, highlight: 'Took the leap to a bigger role' }], ['It falls apart after ten months. You land on your feet, with great stories.', { mastery: 10, money: -5, joy: -5 }]),
        result('stay', 'Stay with your team', 'You stay. Two years later, you’re the one welcoming the new people.', { mastery: 6, joy: 10 }),
        check('raise', 'Ask for a raise instead', 'communication', 65, ['They don’t want to lose you. Raise approved.', { money: 15, joy: 5 }], ['“Not this year.” Hm.', { joy: -8 }]),
      ],
    },
    {
      id: e('own'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      icon: 'door-open',
      title: 'Going Your Own Way',
      text: `People start asking if they can work with you directly. You could open your own ${ladder.ownNoun}.`,
      choices: [
        check('open', `Open your own ${ladder.ownNoun}`, 'independence', 65, ['A name, a sign on the door, the first customers. It’s yours.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Opened your own ${ladder.ownNoun}` }], ['After a lean year, you close it and take a senior role somewhere else. No regrets, lots of lessons.', { money: -5, mastery: 8, joy: -5 }], { check: { attribute: 'independence', difficulty: 65, bonus: { freelance: 10, has_portfolio: 5 } } }),
        result('stay', 'Stay where you are', 'Security wins. You file the idea away for later.', { money: 5 }),
      ],
    },
    {
      id: e('lead'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'], flagsNone: ['freelance'], meterMin: { mastery: 35 } },
      icon: 'users-three',
      title: 'Lead or Keep Doing?',
      text: `You’re offered the step up to ${inSentence(lead)}. More people, more meetings, less hands-on work.`,
      choices: [
        check('lead', 'Take the step up', 'empathy', 65, ['Turns out you’re good at this. Your team grows, and so do they.', { mastery: 10, joy: 8, set: ['manager'], highlight: `Became ${article(lead)} ${inSentence(lead)}` }], ['You miss the actual work. Meetings swallow your weeks.', { joy: -15, energy: -5 }]),
        check('hands_on', 'Keep doing the work', main, 65, ['You go deep and become the one people bring the hard problems to.', { mastery: 15, joy: 10 }], ['You stay hands-on. Comfortable, maybe a little too comfortable.', { mastery: 5 }]),
        result('switch', `Move into ${inSentence(next.name)}`, `You move sideways into ${inSentence(next.name)}. Plenty of what you learned comes with you.`, { money: 10, mastery: 5, set: ['pivoted'] }),
      ],
    },
    {
      id: e('one_more_year'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsNone: ['employed'] },
      priority: 10,
      icon: 'path',
      title: 'One More Year?',
      text: `You’ve been trying to break into ${work} for years. Something has to change.`,
      choices: [
        check('more', 'Give it one more year', 'persistence', 65, ['This is the year. Someone takes a chance on you, and you don’t waste it.', { mastery: 10, joy: 15, money: 15, set: ['employed'], highlight: 'Broke in after years of trying' }], ['Still nothing. You start to wonder what else is out there.', { joy: -10, set: ['considering_pivot'] }], { check: { attribute: 'persistence', difficulty: 65, bonus: { has_mentor: 10 } } }),
        result('next_door', 'Move into something next to it', `You take a role in ${inSentence(next.name)}. It fits better than you expected.`, { joy: 10, money: 15, set: ['pivoted'] }, 'Use what you have, somewhere new'),
      ],
    },

    // Finale
    {
      id: e('big_one'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      icon: 'star',
      title: 'The Big One',
      text: 'The biggest piece of work of your career so far lands on your desk.',
      choices: [
        check('lead_it', 'Lead it', 'communication', 65, ['It works. People you’ll never meet are better off because of it.', { mastery: 15, joy: 10, highlight: 'Pulled off the biggest work of your career' }], ['It’s late and over budget, but it gets done.', { mastery: 10, energy: -15 }], { check: { attribute: 'communication', difficulty: 65, bonus: { has_mentor: 10, manager: 10 } } }),
        result('support', 'Support the person leading it', 'You do your best work in the background. It feels good to make someone else shine.', { mastery: 6, joy: 5, energy: 5 }),
        result('pass', 'Pass on it', 'You say no. Somebody else gets the stress, and the credit.', { energy: 15, joy: -5 }, 'Protect your energy'),
      ],
    },
    {
      id: e('new_path'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { anyOf: [{ flagsNone: ['employed'] }, { flagsAll: ['pivoted'] }] },
      priority: 10,
      icon: 'path',
      title: 'Looking Back',
      text: `You’re {age}. Your path bent away from ${work}. Still, it shaped how you see things.`,
      choices: [
        result('hobby', 'Keep it as something you love', 'It stays yours: no clients, no deadlines, just the good part.', { joy: 10, set: ['pivoted'] }),
        result('bring', 'Bring it into your new work', 'Turns out what you learned is useful almost anywhere.', { mastery: 5, joy: 5, set: ['pivoted'] }),
      ],
    },

    // Scenes shared by the career's family (creators, trades, health care…), weighted to show up most of the time.
    ...familyEvents({ career, ladder, main, next, e }),
  ];
  const events = allEvents.filter((ev) => !replaced.has(ev.id));

  return {
    career: id,
    lifeName: name,
    class: career.className,
    roles: {
      byFlag: [
        { flag: 'studio', role: ladder.ownRole },
        { flag: 'manager', role: lead },
      ],
      byMastery: [
        { min: 75, role: lead },
        { min: 55, role: senior },
        { min: 35, role: mid },
        { min: 0, role: junior },
      ],
    },
    endings: [
      { id: e('end_pivot'), name: 'Found a Different Path', when: { flagsAll: ['pivoted'] }, roleOverride: 'Took your skills somewhere new', text: `${name} opened a door you didn’t expect. You walked through it, and it still shapes how you work.` },
      { id: e('end_own'), name: 'Struck Out On Your Own', when: { flagsAll: ['studio'], meterMin: { joy: 40 } }, roleOverride: ladder.ownRole, text: `Your name is on the door of your own ${ladder.ownNoun}. Some months are lean, some are great, and every decision is yours.` },
      { id: e('end_rebuilt'), name: 'Burned Out, Then Rebuilt', when: { flagsAll: ['burned_out'] }, text: 'Somewhere along the way it got to be too much. You stepped back, learned your limits and came back on your own terms. Most people learn that much later.' },
      { id: e('end_thriving'), name: 'Thriving', when: { meterMin: { mastery: 55, joy: 65 } }, text: 'You’re good at this, and you still love it. People rely on what you do, even when they don’t know your name. You know, though.' },
      { id: e('end_steady'), name: 'Steady', when: {}, text: `A solid life in ${work}: good days, hard days, good people, a life that fits. Not every life needs fireworks.` },
    ],
    events,
  };
}
