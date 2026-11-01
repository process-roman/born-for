// Career families: hand-written scenes shared by similar careers, so a template life feels like
// its kind of work (creators get the algorithm, trades get the licence exam, health care gets
// night shifts). Each career still fills in its own names, roles and "own business". Family scenes
// join the template's generic scenes with a higher weight, so they show up most of the time
// without crowding out the rest.

import type { AttributeId } from './attributes';
import type { Career, CareerId } from './careers';
import type { LifeEvent } from './life';
import { article, check, inSentence, result } from './lifeKit';
import type { LifeLadder } from './lifeLadders';

export type FamilyId = 'creators' | 'trades' | 'health' | 'tech' | 'studio' | 'performing' | 'sport' | 'care' | 'business' | 'food' | 'fashion';

export const FAMILY_NAMES: Record<FamilyId, string> = { creators: 'Creators', trades: 'Trades', health: 'Health care', tech: 'Tech', studio: 'Creative studio', performing: 'Performing', sport: 'Sport', care: 'Care and education', business: 'Business', food: 'Food and hospitality', fashion: 'Fashion and beauty' };

/** Careers in each family. Careers in no family use the generic template scenes only. */
export const FAMILIES: Record<FamilyId, readonly CareerId[]> = {
  creators: ['youtuber', 'streamer', 'influencer', 'podcaster', 'travel_creator'],
  trades: ['electrician', 'plumber', 'carpenter', 'mechanic', 'welder'],
  health: ['nursing', 'paramedic', 'physio', 'doctor', 'pharmacist', 'vet_nurse', 'veterinarian'],
  tech: ['software_dev', 'app_developer', 'ai_engineer', 'data_analysis', 'cybersecurity', 'it_support', 'qa_tester', 'game_developer'],
  studio: ['graphic_designer', 'illustrator', 'animator', 'game_artist', 'game_designer', 'photographer', 'video_editor'],
  performing: ['actor', 'dancer', 'musician', 'model'],
  sport: ['athlete', 'sports_coach', 'personal_trainer', 'yoga_instructor', 'esports_player'],
  care: ['teaching', 'social_work', 'counsellor', 'youth_worker', 'early_childhood', 'psychologist'],
  business: ['marketing', 'sales', 'recruiter', 'accountant', 'real_estate', 'entrepreneur', 'ecommerce_owner', 'project_coord'],
  food: ['chef', 'pastry_chef', 'barista', 'bartender', 'hotel_manager', 'event_planner'],
  fashion: ['fashion_designer', 'stylist', 'makeup_artist', 'hairdresser', 'nail_artist', 'fashion_buyer'],
};

/**
 * Generic template scenes a family drops because they don't fit its kind of work (creators have no
 * boss to promote them). Listed by the generic scene's id suffix.
 */
export const FAMILY_REPLACES: Record<FamilyId, readonly string[]> = {
  creators: ['job_hunt', 'change_job_hunt', 'change_young_boss', 'lead', 'offer', 'big_one'],
  trades: [],
  health: [],
  tech: [],
  studio: [],
  // Performers audition instead of applying, and nobody promotes them at a desk.
  performing: ['job_hunt', 'change_job_hunt', 'change_young_boss', 'lead', 'offer', 'big_one', 'week', 'other_side'],
  // Sport has trials and first spots, not job applications.
  sport: ['big_one', 'job_hunt', 'change_job_hunt'],
  care: ['big_one'],
  business: ['big_one'],
  // Food has its own nights-and-weekends scene.
  food: ['big_one', 'other_side'],
  // Fashion and beauty has its own on-your-feet scene.
  fashion: ['big_one', 'other_side'],
};

export function familyOf(id: CareerId): FamilyId | null {
  return (Object.keys(FAMILIES) as FamilyId[]).find((f) => FAMILIES[f].includes(id)) ?? null;
}

/** What creators make, for "your first video" / "your first stream". */
const MEDIUM: Partial<Record<CareerId, { one: string; many: string }>> = {
  youtuber: { one: 'video', many: 'videos' },
  streamer: { one: 'stream', many: 'streams' },
  influencer: { one: 'post', many: 'posts' },
  podcaster: { one: 'episode', many: 'episodes' },
  travel_creator: { one: 'video', many: 'videos' },
};

export interface FamilyContext {
  career: Career;
  ladder: LifeLadder;
  /** The career's most important trait. */
  main: AttributeId;
  /** The most similar other career, for pivots. */
  next: Career;
  /** Makes a career-specific event id. */
  e: (suffix: string) => string;
}

/** Family scenes weigh more than the generic ones in the same slot… */
const WEIGHT = 3;
/** …a little less at the crossroads and finale, where the generic choices (own business, leading a team) matter too. */
const LATE_WEIGHT = 2;

function creators({ career, ladder, main, next, e }: FamilyContext): LifeEvent[] {
  const m = MEDIUM[career.id] ?? { one: 'piece', many: 'pieces' };
  return [
    {
      id: e('c_first_post'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'sparkle',
      title: `${m.one.charAt(0).toUpperCase() + m.one.slice(1)} Number One`,
      text: `You publish your first ${m.one}. Eleven views. Four of them are you.`,
      choices: [
        check('weekly', 'Post every week, no matter what', 'persistence', 60, ['Week after week, even when nobody watches. Slowly, people start to.', { mastery: 10, joy: 5, energy: -12, highlight: 'Never missed a week' }], ['Some weeks you just can’t. You keep going, unevenly.', { mastery: 5, energy: -18 }]),
        check('study', 'Study what the big names do', 'curiosity', 55, ['You pull apart hundreds of hits until you see the patterns.', { mastery: 10 }], ['Lots of notes, not much changes. Yet.', { mastery: 5, joy: -5 }]),
        check('weird', 'Make something weird and personal', 'creativity', 65, ['It’s strange and completely you. The few people who find it love it.', { mastery: 12, joy: 10, set: ['has_portfolio'], highlight: 'Found your voice early' }], ['Too weird, even for you. Back to basics.', { mastery: 3, joy: -5 }]),
      ],
    },
    {
      id: e('c_comment'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'chat-circle',
      title: 'The First Mean Comment',
      text: `Someone you’ve never met writes that your ${m.many} are cringe. It shouldn’t matter. It does.`,
      choices: [
        check('humor', 'Reply with humor', 'communication', 60, ['Your reply gets more likes than their comment. They go quiet.', { joy: 8, mastery: 8 }], ['It turns into a pile-on. You log off for the night, rattled.', { joy: -10, energy: -8 }]),
        result('delete', 'Delete it and keep going', 'Gone. You make the next one anyway.', { joy: -3, energy: 5, mastery: 3 }),
        result('friend', 'Show it to a friend', 'They laugh until you laugh too. It shrinks.', { joy: 5, energy: 5, mastery: 4 }),
      ],
    },
    {
      id: e('c_viral'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'lightning',
      title: 'It Blows Up',
      text: `One of your ${m.many} takes off overnight. Thousands of new followers, and they all want more of the same.`,
      choices: [
        check('more', 'Make more of what worked', 'persistence', 60, ['You ride the wave, and for the first time it pays like a job. You also stop sleeping much.', { money: 10, mastery: 8, joy: 5, energy: -8, set: ['employed'], highlight: 'Went viral for the first time' }], ['The follow-ups flop. The wave was real, though.', { energy: -18, joy: -5 }]),
        check('yourself', 'Stay yourself and risk it', 'creativity', 60, ['Some new followers leave. The ones who stay are yours.', { joy: 12, mastery: 8, set: ['employed'] }], ['You lose most of the new crowd. A lesson, not a disaster.', { joy: -5, mastery: 3 }]),
        result('break', 'Take a break from the noise', 'You step away for a week. The numbers drop; your head clears.', { energy: 15, joy: -5 }),
      ],
    },
    {
      id: e('c_brand'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'handshake',
      title: 'The Brand Deal',
      text: `A brand offers real money for ${article(m.one)} ${m.one} about a product you would never use.`,
      choices: [
        result('no', 'Say no, politely', 'It hurts your wallet. Your audience never knows, and you sleep fine.', { joy: 8, money: -5, mastery: 5, highlight: 'Turned down money that didn’t fit you' }),
        check('negotiate', 'Negotiate something that fits', 'communication', 60, ['They agree to a product you actually like. Everyone wins.', { money: 15, joy: 5, mastery: 5 }], ['They walk away. Fair enough.', { joy: -5 }]),
        result('take', 'Take the money', 'Rent is paid. A few comments notice. You notice too.', { money: 15, joy: -8, mastery: 3 }),
      ],
    },
    {
      id: e('c_full_time'),
      kind: 'job_hunt',
      stages: ['breaking_in'],
      conditions: { flagsNone: ['track_changer'] },
      icon: 'briefcase',
      title: 'Going Full-Time',
      text: `Your ${m.many} pay for coffee, not rent. To make this your job, you need a plan.`,
      choices: [
        check('grind', 'Post more and grind', 'persistence', 60, ['Months of daily work, and then the numbers tip. It pays like a job.', { mastery: 5, joy: 10, money: 20, energy: -8, set: ['employed'], highlight: 'Went full-time as a creator' }], ['Still not enough to live on. You keep a side job and keep going.', { energy: -18, money: -5, joy: -5, set: ['side_job'] }], { check: { attribute: 'persistence', difficulty: 60, bonus: { has_portfolio: 10 } } }),
        check('pitch', 'Pitch brands and collabs', 'communication', 55, ['A few good partners say yes. Suddenly there’s a real income.', { mastery: 3, joy: 5, money: 20, set: ['employed'] }], ['Lots of “not right now.” Nothing yet.', { joy: -10, energy: -5 }], { check: { attribute: 'communication', difficulty: 55, bonus: { has_mentor: 10, peer_friend: 10 } } }),
        check('behind', 'Edit and help other creators on the side', 'independence', 60, ['Other creators pay you for your skills while your own channel grows.', { mastery: 5, joy: 10, money: 10, set: ['employed', 'freelance'] }], ['Clients are hard to find. You’re doing it, but only just.', { money: -10, energy: -10, joy: -5 }], { hint: 'Steadier money · less time for your own' }),
      ],
    },
    {
      id: e('c_start_over'),
      kind: 'job_hunt',
      stages: ['breaking_in'],
      conditions: { flagsAll: ['track_changer'] },
      priority: 1,
      icon: 'briefcase',
      title: 'Starting Over at {age}',
      text: 'Most of the creators you watch started at sixteen. You’re {age}, with a job, bills, and a lot of life the teenagers don’t have.',
      choices: [
        check('angle', 'Make your experience the angle', 'communication', 65, ['Turns out people want someone who has actually lived a bit. You grow fast.', { mastery: 8, joy: 10, money: 15, set: ['employed'], highlight: 'Made your age your advantage' }], ['Your angle doesn’t land yet. You keep your old job a little longer.', { joy: -10, energy: -5, set: ['side_job'] }], { check: { attribute: 'communication', difficulty: 65, bonus: { has_portfolio: 10, route_internal: 10 } } }),
        result('slow', 'Keep the day job until it pays', 'Evenings and weekends, slowly, until it covers half your rent. Then all of it.', { money: -5, mastery: 8, joy: 8, energy: -10, set: ['employed'] }, 'Slow · safe'),
        check('niche', 'Make content about your old industry', 'independence', 60, ['Nobody else knows that world like you. Your old industry becomes your niche.', { money: 10, joy: 10, mastery: 5, set: ['employed', 'freelance'], highlight: 'Turned your old industry into your niche' }], ['Too niche, for now. You keep a part-time job to cover the gap.', { money: -5, energy: -10, joy: -5 }], { check: { attribute: 'independence', difficulty: 60, bonus: { track_changer: 10 } } }),
      ],
    },
    {
      id: e('c_two_jobs'),
      kind: 'career',
      stages: ['breaking_in'],
      conditions: { flagsAll: ['track_changer'] },
      weight: WEIGHT,
      icon: 'battery-low',
      title: 'Two Jobs at Once',
      text: `By day, your old job. By night, your ${m.many}. Something has to give.`,
      choices: [
        check('both', 'Keep both for now', 'persistence', 60, ['Exhausting, but the savings stay safe while the audience grows.', { money: 10, mastery: 8, energy: -15 }], ['You run on empty for months.', { energy: -20, joy: -5 }]),
        check('quit', 'Quit the day job', 'independence', 65, ['Terrifying and freeing. Your work gets better fast.', { joy: 10, mastery: 10, money: -15, set: ['employed'] }], ['Savings vanish faster than the audience grows.', { money: -20, joy: -10 }]),
        result('part_time', 'Cut back to part-time', 'Less money, more evenings. A slower, saner build.', { money: -5, energy: 5, mastery: 5 }),
      ],
    },
    {
      id: e('c_algorithm'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'warning',
      title: 'The Algorithm Changes',
      text: 'Overnight, your views drop by half. Nobody explains why.',
      choices: [
        check('adapt', 'Adapt fast', 'curiosity', 60, ['You test, learn and change formats within weeks. Numbers come back.', { mastery: 10, money: 5 }], ['You chase every trend and lose your own voice for a while.', { energy: -10, joy: -5 }]),
        check('own_audience', 'Build an audience you own', 'organization', 60, ['A newsletter, a community, a list. Next time the algorithm sneezes, you’re fine.', { mastery: 8, joy: 8, set: ['has_portfolio'] }], ['Good idea, hard to keep up next to everything else.', { mastery: 3, energy: -10 }]),
        result('wait', 'Wait it out', 'It comes back, slowly. The waiting is the worst part.', { joy: -8, energy: 5, mastery: 3 }),
      ],
    },
    {
      id: e('c_always_on'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'battery-low',
      title: 'Always On',
      text: 'Your audience expects something new all the time. You haven’t taken a real day off in months.',
      choices: [
        check('days_off', 'Schedule real days off', 'independence', 55, ['You tell your audience. They’re kinder about it than you feared.', { energy: 15, joy: 5, mastery: 5 }], ['You try, then feel guilty and post anyway.', { energy: -5, joy: -5 }]),
        result('help', 'Hire help', 'An editor takes the boring half, then another. You’re running a small team now. Your bank balance dips; your life gets better.', { money: -10, energy: 10, mastery: 5, set: ['manager'] }),
        check('push', 'Push harder', 'persistence', 60, ['Growth spurt. Your sleep pays for it.', { money: 10, mastery: 8, energy: -18 }], ['You run out of steam mid-week.', { energy: -20 }]),
      ],
    },
    {
      id: e('c_platform'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'rocket',
      title: 'Your Own Thing',
      text: 'You’re big enough to choose: an exclusive deal with a platform, or keep building something that’s yours.',
      choices: [
        result('exclusive', 'Sign the exclusive deal', 'Steady money and less freedom. A fair trade, mostly.', { money: 20, joy: -5, mastery: 8 }),
        check('build', `Build your own ${ladder.ownNoun}`, 'independence', 65, ['A team, a brand, a plan. It’s yours.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Built your own ${ladder.ownNoun}` }], ['Too much, too fast. You pull back to just you, older and wiser.', { money: -5, mastery: 8, joy: -5 }], { check: { attribute: 'independence', difficulty: 65, bonus: { has_portfolio: 5 } } }),
        result('small', 'Keep it small and sustainable', 'No empire, no exclusives. Just you, a loyal audience and weekends off.', { joy: 8, energy: 10, mastery: 5 }),
        result('behind', `Move into ${inSentence(next.name)}`, `You take your skills behind the scenes into ${inSentence(next.name)}. Steadier, and still creative.`, { money: 10, mastery: 5, set: ['pivoted'] }),
      ],
    },
    {
      id: e('c_collab'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      weight: LATE_WEIGHT,
      icon: 'star',
      title: 'The Big Collab',
      text: 'The biggest name in your space asks to make something together.',
      choices: [
        check('go_big', 'Go big', main, 65, ['It’s the best thing either of you has made. Your hero follows you now.', { mastery: 15, joy: 10, highlight: 'Made something with your hero' }], ['It’s fine. Just fine. You learn a ton anyway.', { mastery: 10, energy: -15 }], { check: { attribute: main, difficulty: 65, bonus: { has_portfolio: 10 } } }),
        result('your_voice', 'Bring your audience’s voice', 'You make it about the people who got you here. They notice.', { mastery: 6, joy: 8 }),
        result('pass', 'Pass on it', 'You say no. Some days you wonder. Mostly you’re fine.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

function trades({ ladder, main, next, e }: FamilyContext): LifeEvent[] {
  const [, , senior, lead] = ladder.roles;
  return [
    {
      id: e('t_winter'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'lightning',
      title: 'First Winter on Site',
      text: 'Six in the morning, freezing, and you’re carrying the heavy stuff while everyone else does the interesting work.',
      choices: [
        check('early', 'Show up early, every day', 'persistence', 55, ['Nobody says anything. Then one day they hand you the real job.', { mastery: 10, energy: -12, highlight: 'Never missed a day on site' }], ['Some mornings the bed wins. You get there, slower.', { mastery: 5, energy: -18 }]),
        check('questions', 'Ask a lot of questions', 'curiosity', 55, ['The old-timers love explaining. You learn twice as fast.', { mastery: 10, joy: 5 }], ['Wrong moment, wrong question. You get the cold shoulder for a week.', { mastery: 4, joy: -5 }]),
        result('head_down', 'Keep your head down', 'You do what you’re told and learn by watching.', { mastery: 4, energy: 5 }),
      ],
    },
    {
      id: e('t_tools'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'wallet',
      title: 'Your Own Tools',
      text: 'Good tools are expensive. Cheap tools break. Your first real kit costs more than a month’s pay.',
      choices: [
        result('credit', 'Buy good tools on credit', 'They’ll last twenty years. The payments last one.', { money: -15, mastery: 10, joy: 5 }),
        check('used', 'Buy used, carefully', 'analytical', 55, ['You find quality tools for half the price and learn what good looks like.', { money: -5, mastery: 8 }], ['Half of it is junk. Lesson learned.', { money: -8, joy: -5 }]),
        result('borrow', 'Borrow until you can afford it', 'Your crew lends you theirs, with commentary.', { mastery: 6, joy: -3 }),
      ],
    },
    {
      id: e('t_exam'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'books',
      title: 'The Licence Exam',
      text: 'Years of work come down to one exam: theory, codes and a practical test.',
      choices: [
        check('study', 'Study every night for months', 'persistence', 60, ['You pass on the first try. Your crew takes you out.', { mastery: 12, joy: 10, set: ['employed'], highlight: 'Passed your licence exam on the first try' }], ['You miss by a few points. The retake is in three months.', { mastery: 5, joy: -10, energy: -10 }], { check: { attribute: 'persistence', difficulty: 60, bonus: { has_mentor: 10 } } }),
        result('course', 'Pay for a prep course', 'Expensive, structured, and it works.', { money: -10, mastery: 10, set: ['employed'] }),
        check('wing', 'Trust your hands and wing it', main, 65, ['The practical is easy for you. The theory, just about.', { mastery: 8, joy: 10, set: ['employed'] }], ['The theory catches you out. Retake it is.', { joy: -15, energy: -5 }]),
      ],
    },
    {
      id: e('t_old_hand'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'users',
      title: 'The Old Hand',
      text: `The most experienced ${inSentence(senior)} on the crew usually ignores new people. Today, they start talking to you.`,
      choices: [
        check('listen', 'Listen more than you talk', 'empathy', 50, ['Twenty years of tricks, handed over one lunch break at a time.', { mastery: 10, set: ['has_mentor'], highlight: 'Learned from an old hand' }], ['You nod a lot and remember little.', { mastery: 4 }]),
        check('show', 'Show what you can do', main, 60, ['They watch, nod once, and start giving you the harder jobs.', { mastery: 8, joy: 8 }], ['You rush it and they have to fix it. Humbling.', { joy: -8 }]),
      ],
    },
    {
      id: e('t_body'),
      kind: 'career',
      stages: ['breaking_in'],
      conditions: { flagsAll: ['track_changer'] },
      weight: WEIGHT,
      icon: 'battery-low',
      title: 'Your Body Notices',
      text: 'Lifting, kneeling, ladders all day. Your body reminds you, loudly, that you didn’t start at nineteen.',
      choices: [
        check('pace', 'Learn to work smart, not hard', 'organization', 55, ['Better technique, better kit, fewer sore days. The young ones start copying you.', { mastery: 8, energy: -5 }], ['Old habits. Your back keeps score.', { energy: -15 }]),
        result('push', 'Push through like everyone else', 'You keep up. Evenings are for ice packs.', { mastery: 6, energy: -18 }),
        check('fitness', 'Start training outside work', 'persistence', 60, ['Six months later, you’re stronger than you were at thirty.', { energy: 5, joy: 8 }], ['Too tired to train after work. Maybe next month.', { energy: -10, joy: -5 }]),
      ],
    },
    {
      id: e('t_no_pay'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'wallet',
      title: 'The Customer Who Won’t Pay',
      text: 'The job’s done, it’s good work, and the customer stops answering your calls.',
      choices: [
        check('chase', 'Stay calm and keep chasing', 'communication', 60, ['Polite, firm, persistent. The money arrives.', { money: 10, joy: 5 }], ['They never pay. You eat the cost.', { money: -10, joy: -5 }]),
        result('write_off', 'Write it off and learn', 'Deposits and written quotes from now on. Expensive lesson.', { money: -10, mastery: 5 }),
        check('claims', 'Take it to small claims', 'persistence', 60, ['Paperwork, a hearing, and a judgment in your favor.', { money: 10, energy: -10 }], ['Months of hassle for half the money.', { money: -5, energy: -15 }]),
      ],
    },
    {
      id: e('t_close_call'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'warning',
      title: 'A Close Call',
      text: 'A slip, a spark, a heavy load. Something almost goes very wrong. You’re fine. Mostly.',
      choices: [
        check('safety', 'Take safety seriously from now on', 'organization', 55, ['You become the one who checks everything twice. Nobody laughs after the next close call.', { energy: 5, mastery: 8, joy: 5, highlight: 'Became the safety-minded one on the crew' }], ['Good intentions, busy weeks. It slips.', { mastery: 3 }]),
        result('rest', 'Take a few days to recover', 'Your body thanks you. Your wallet doesn’t.', { energy: 15, money: -5 }),
        check('shake', 'Shake it off and keep working', 'persistence', 60, ['Back at it the same afternoon.', { mastery: 5, money: 5 }], ['It catches up with you a week later.', { energy: -20, joy: -5 }]),
      ],
    },
    {
      id: e('t_van'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'door-open',
      title: 'Your Own Van',
      text: 'Customers start calling you directly. With a van, insurance and some nerve, you could go out on your own.',
      choices: [
        check('own', 'Go out on your own', 'independence', 65, ['Your name on the van. The phone rings more than you expected.', { money: 15, joy: 15, energy: -10, set: ['studio'], highlight: `Started your own ${ladder.ownNoun}` }], ['A thin year, then back to working for someone else. You learned how the business side works.', { money: -10, mastery: 8, joy: -5 }], { check: { attribute: 'independence', difficulty: 65, bonus: { has_mentor: 5 } } }),
        check('supervise', `Step up to ${inSentence(lead)}`, 'empathy', 60, ['Running the crew suits you. Fewer callbacks, happier apprentices.', { mastery: 10, joy: 5, set: ['manager'] }], ['Paperwork and arguments. You miss the tools.', { joy: -10 }]),
        result('tools', 'Stay on the tools', 'You like the work itself. Steady jobs, good crew, home by six.', { money: 5, joy: 5, energy: 5, mastery: 5 }),
      ],
    },
    {
      id: e('t_big_build'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      weight: LATE_WEIGHT,
      icon: 'star',
      title: 'The Big Build',
      text: 'The biggest job of your career: a whole building, a tight deadline, and your name on the work.',
      choices: [
        check('lead', 'Run the job', 'communication', 65, ['On time, up to code, and the inspector has nothing to say.', { mastery: 15, joy: 10, highlight: 'Ran the biggest job of your career' }], ['Late and over budget, but it passes.', { mastery: 10, energy: -15 }], { check: { attribute: 'communication', difficulty: 65, bonus: { manager: 10, has_mentor: 10 } } }),
        check('perfect', 'Do your part perfectly', main, 60, ['Your part is the bit people point at.', { mastery: 12, joy: 8 }], ['Solid work. Nothing special.', { mastery: 5 }]),
        result('pass', 'Pass on it', 'Someone else takes the stress. You take your weekends.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

function health({ ladder, main, next, e }: FamilyContext): LifeEvent[] {
  const [, , , lead] = ladder.roles;
  return [
    {
      id: e('h_placement'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'heart',
      title: 'First Placement',
      text: 'Real patients, real families, and you’re terrified of doing something wrong.',
      choices: [
        check('watch', 'Watch everything and take notes', 'curiosity', 55, ['By the end, you know why things are done, not just how.', { mastery: 10, joy: 5 }], ['Too much at once. You remember half of it.', { mastery: 5 }]),
        check('volunteer', 'Volunteer for every task', 'persistence', 55, ['Exhausting, and you learn more in a month than in a term.', { mastery: 12, energy: -8 }], ['You take on too much and drop a few things.', { mastery: 5, energy: -10 }]),
        check('talk', 'Take time to talk with patients', 'empathy', 50, ['One of them asks for you by name the next day.', { joy: 12, mastery: 6, highlight: 'A patient asked for you by name' }], ['You get pulled away mid-sentence, again.', { joy: 3 }]),
      ],
    },
    {
      id: e('h_exams'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'books',
      title: 'The Exams Never Stop',
      text: 'Anatomy, medications, procedures. The exams keep coming, and they all matter.',
      choices: [
        check('group', 'Form a study group', 'communication', 55, ['Quizzing each other at midnight. You all pass, and stay friends.', { mastery: 10, joy: 8, set: ['peer_friend'] }], ['The group turns into a chat group. You study alone after all.', { mastery: 5 }]),
        check('solo', 'Study alone, every evening', 'persistence', 60, ['Slow, steady, solid. You know it cold.', { mastery: 12, energy: -8 }], ['You burn out a little before the big one.', { mastery: 6, energy: -10 }]),
        result('cram', 'Cram the night before', 'You pass, barely, and forget most of it by Friday.', { mastery: 5, energy: -10, joy: -5 }),
      ],
    },
    {
      id: e('h_nights'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'battery-low',
      title: 'Night Shifts',
      text: 'Your first run of night shifts. It’s quiet at four in the morning, until it isn’t.',
      choices: [
        check('routine', 'Build a routine to cope', 'organization', 55, ['Blackout curtains, a strict sleep plan, real meals. You adapt.', { energy: 5, mastery: 8 }], ['Your body clock never quite agrees.', { energy: -10 }]),
        check('team', 'Lean on the team', 'empathy', 50, ['The night crew becomes your people. Three a.m. snacks help.', { joy: 8, mastery: 6 }], ['Everyone is too tired to talk.', { joy: -3, energy: -5 }]),
        result('through', 'Just get through it', 'You do. You also sleep through your day off.', { energy: -10, mastery: 6 }),
      ],
    },
    {
      id: e('h_near_miss'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'warning',
      title: 'A Near Miss',
      text: 'In a rush, you almost give the wrong thing to the wrong patient. A colleague catches it just in time.',
      choices: [
        check('report', 'Report it and learn from it', 'communication', 55, ['Your report changes how the team double-checks. Nobody else makes that mistake.', { mastery: 10, joy: 5, highlight: 'Owned a near miss and made things safer' }], ['It feels like a confession. A rough week.', { joy: -10 }]),
        result('double', 'Double-check everything from now on', 'Slower, careful, and it never happens again.', { mastery: 8, energy: -5 }),
        result('quiet', 'Keep it to yourself', 'Nobody finds out. You think about it anyway.', { joy: -10, energy: -5 }),
      ],
    },
    {
      id: e('h_patient'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'heart',
      title: 'The One You Can’t Forget',
      text: 'One patient stays with you long after your shift ends.',
      choices: [
        check('talk', 'Talk it through with someone', 'empathy', 50, ['Saying it out loud helps. You learn how to carry it.', { joy: 10, energy: 5 }], ['You don’t find the words yet.', { joy: -5 }]),
        check('into_work', 'Put it into your work', main, 60, ['You change one small thing about how you work, for them.', { mastery: 10, joy: 5 }], ['It weighs on you more than it helps.', { energy: -5, joy: -5 }]),
        result('push_down', 'Push it down and move on', 'It works, for now.', { energy: -5, joy: -5 }),
      ],
    },
    {
      id: e('h_short_staffed'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'users-three',
      title: 'Short-Staffed Again',
      text: 'Two people called in sick. Again. Everyone is doing the work of three.',
      choices: [
        result('extra', 'Pick up the extra shift', 'The overtime is good. The tiredness is not.', { money: 10, energy: -10, joy: 3 }),
        check('no', 'Say no this time', 'communication', 60, ['They find someone else. The world keeps turning.', { energy: 10, joy: 5 }], ['The guilt trip works. You stay.', { joy: -8, energy: -5 }]),
        check('organize', 'Organize the chaos', 'organization', 60, ['You reshuffle the shift and everyone gets a break.', { mastery: 10, joy: 5, highlight: 'Kept the shift together when it was falling apart' }], ['Nobody follows the new plan.', { energy: -10 }]),
      ],
    },
    {
      id: e('h_specialize'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'path',
      title: 'Specialize?',
      text: 'You could specialize in the part you love most, step up to run things, or start something of your own.',
      choices: [
        check('specialize', 'Specialize in what you love', 'curiosity', 60, ['More training, then the work you actually wanted all along.', { mastery: 15, joy: 10, highlight: 'Specialized in what you love' }], ['The training is brutal on top of the job. You pause it.', { mastery: 5, energy: -10 }]),
        check('lead', `Step up to ${inSentence(lead)}`, 'empathy', 65, ['You turn out to be the calm one others steady themselves on.', { mastery: 10, joy: 8, set: ['manager'] }], ['Rotas and meetings. You miss patients.', { joy: -15 }]),
        check('own', `Open your own ${ladder.ownNoun}`, 'independence', 65, ['Your own place, your own way of caring for people.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Opened your own ${ladder.ownNoun}` }], ['The business side swamps you. You go back to a team.', { money: -5, mastery: 8, joy: -5 }]),
        result('move', `Move into ${inSentence(next.name)}`, `You move into ${inSentence(next.name)}. Different days, same reason for doing it.`, { money: 5, mastery: 5, set: ['pivoted'] }),
      ],
    },
    {
      id: e('h_hardest_day'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      weight: LATE_WEIGHT,
      icon: 'star',
      title: 'The Hardest Day',
      text: 'The hardest day of your career: everything at once, and people are counting on you.',
      choices: [
        check('lead', 'Hold it together and lead', main, 65, ['Later, someone says they don’t know how you stayed so calm. Neither do you.', { mastery: 15, joy: 10, highlight: 'Held it together on the hardest day' }], ['You get everyone through it, and fall apart afterwards.', { mastery: 10, energy: -15 }], { check: { attribute: main, difficulty: 65, bonus: { manager: 10, has_mentor: 10 } } }),
        result('support', 'Support the team', 'You do every small thing that keeps it all moving.', { mastery: 6, joy: 5, energy: 5 }),
        result('step_back', 'Step back and look after yourself', 'You hand over. It’s the right call, and it’s hard.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

function tech({ ladder, main, e }: FamilyContext): LifeEvent[] {
  return [
    {
      id: e('x_bug'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'magnifying-glass',
      title: 'The Bug That Won’t Die',
      text: 'Three days on one bug. When you finally find the fix, it’s a single character.',
      choices: [
        check('duck', 'Explain it out loud, line by line', 'analytical', 55, ['Halfway through explaining it to your coffee mug, you see it.', { mastery: 10, joy: 5 }], ['You talk it through twice. Still broken.', { mastery: 5, energy: -10 }]),
        check('forum', 'Ask for help online', 'communication', 55, ['A stranger on the other side of the world spots it in a minute. You make a friend.', { mastery: 8, joy: 5, set: ['peer_friend'] }], ['Your question gets closed as a duplicate. Ouch.', { joy: -5 }]),
        check('rewrite', 'Rewrite it from scratch', 'persistence', 60, ['The new version is cleaner, and the bug is gone.', { mastery: 12, energy: -10 }], ['The new version has two new bugs.', { mastery: 4, energy: -15 }]),
      ],
    },
    {
      id: e('x_side_project'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'laptop',
      title: 'The Side Project',
      text: 'You build something small just for you: a tool, a game, an app nobody asked for.',
      choices: [
        check('ship', 'Finish it and put it out there', 'persistence', 60, ['A few hundred people use it. One sends a thank-you email.', { mastery: 10, joy: 8, set: ['has_portfolio'], highlight: 'Shipped your first side project' }], ['The last 10% takes 90% of the time. It stalls.', { mastery: 5, joy: -5 }]),
        check('polish', 'Make it beautiful', 'creativity', 60, ['People share it just because it looks so good.', { mastery: 8, joy: 10, set: ['has_portfolio'] }], ['You polish one screen for a month.', { mastery: 3 }]),
        result('next', 'Drop it for a new idea', 'The new idea is exciting. So was the last one.', { joy: 5, mastery: 3 }),
      ],
    },
    {
      id: e('x_interview'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'chats',
      title: 'The Technical Interview',
      text: 'A whiteboard, a stranger, and a puzzle you have never seen before.',
      choices: [
        check('aloud', 'Think out loud', 'communication', 60, ['You don’t finish, but they love how you think. Offer by Friday.', { mastery: 5, joy: 10, money: 15, set: ['employed'], highlight: 'Won over a technical interview' }], ['You go quiet and freeze. Next time.', { joy: -10 }]),
        check('grind', 'Grind practice problems first', 'persistence', 60, ['Weeks of practice. The puzzle looks familiar. You’re in.', { mastery: 8, money: 15, set: ['employed'] }], ['You practiced the wrong kind of problem.', { energy: -15, joy: -5 }]),
        check('show', 'Show them what you’ve built', main, 60, ['They spend the hour asking about your project. You’re hired.', { money: 15, joy: 8, set: ['employed'] }], ['They want the puzzle, not the project.', { joy: -5 }], { check: { attribute: main, difficulty: 60, bonus: { has_portfolio: 15 } } }),
      ],
    },
    {
      id: e('x_tools'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'lightning',
      title: 'The Tools Change Again',
      text: 'Everything you learned last year is suddenly called “legacy”.',
      choices: [
        check('learn', 'Learn the new thing', 'curiosity', 55, ['A weekend of tutorials and you’re ahead of most of the team.', { mastery: 10 }], ['It’s changing faster than you can learn it.', { mastery: 5, energy: -10 }]),
        check('fundamentals', 'Go deep on the fundamentals', 'analytical', 60, ['Tools come and go. You understand what’s underneath all of them.', { mastery: 12, joy: 5, highlight: 'Learned the fundamentals that never change' }], ['Theory is slow. You feel behind for a while.', { mastery: 5 }]),
        result('stick', 'Stick with what works', 'It still works. For now.', { energy: 5, joy: -3 }),
      ],
    },
    {
      id: e('x_outage'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'warning',
      title: 'The Outage',
      text: 'It’s 2 a.m. and everything is down. Your phone won’t stop buzzing.',
      choices: [
        check('debug', 'Stay calm and debug', 'analytical', 60, ['By 3 a.m. it’s back up. The team chat fills with thank-yous.', { mastery: 12, joy: 5, energy: -10, highlight: 'Brought everything back up at 2 a.m.' }], ['It’s back by morning, and you’re a wreck.', { energy: -20, joy: -5 }]),
        result('escalate', 'Wake up someone senior', 'They fix it in twenty minutes and show you how. Humbling, useful.', { mastery: 5, energy: -5 }),
        check('postmortem', 'Write up what went wrong afterwards', 'organization', 55, ['Your write-up changes how the team works. It never happens that way again.', { mastery: 8, joy: 5 }], ['Nobody reads it.', { energy: -5 }]),
      ],
    },
    {
      id: e('x_ai_tools'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'sparkle',
      title: 'The New AI Tool',
      text: 'A new AI tool does in seconds what used to take you a day. People start asking if your job will still exist.',
      choices: [
        check('use', 'Learn to work with it', 'curiosity', 55, ['You get twice as much done and become the team’s go-to for it.', { mastery: 12, money: 5, joy: 5 }], ['It makes confident mistakes you don’t catch. Lesson learned.', { mastery: 5, joy: -5 }]),
        check('human', 'Focus on what it can’t do', 'communication', 60, ['Understanding people and problems turns out to be the hard part. That’s you.', { mastery: 8, joy: 8, highlight: 'Became the person the tools can’t replace' }], ['Hard to explain your value in a meeting full of demos.', { joy: -8 }]),
        result('ignore', 'Ignore it for now', 'The hype passes, mostly. The tool stays.', { joy: -5, energy: 5 }),
      ],
    },
    {
      id: e('x_startup'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'rocket',
      title: 'Startup or Big Company?',
      text: 'Two offers: a startup that might change everything, or a big company with free lunches and a pension.',
      choices: [
        check('startup', 'Join the startup', 'independence', 60, ['Chaos, ownership, and more learning in a year than in the last three.', { mastery: 15, money: 10, energy: -15, highlight: 'Bet on a startup and learned a ton' }], ['It runs out of money in a year. Great stories, thin wallet.', { mastery: 10, money: -5, joy: -5 }]),
        result('big', 'Join the big company', 'Good pay, good snacks, slow decisions.', { money: 20, joy: -3, mastery: 5 }),
        check('own', `Start your own ${ladder.ownNoun}`, 'independence', 65, ['Your first customers, your first hire, your name on it.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Started your own ${ladder.ownNoun}` }], ['A year in, you shut it down and go back to a team, much wiser.', { money: -5, mastery: 8, joy: -5 }], { check: { attribute: 'independence', difficulty: 65, bonus: { has_portfolio: 5 } } }),
      ],
    },
    {
      id: e('x_launch'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      weight: LATE_WEIGHT,
      icon: 'star',
      title: 'Launch Day',
      text: 'The thing you have spent a year building goes live to millions of people.',
      choices: [
        check('lead', 'Lead the launch', main, 65, ['It holds. Millions use it, and almost none of them notice, which is the point.', { mastery: 15, joy: 10, highlight: 'Launched something millions use' }], ['A rocky first week, then it settles.', { mastery: 10, energy: -15 }], { check: { attribute: main, difficulty: 65, bonus: { manager: 10, has_mentor: 10 } } }),
        result('watch', 'Watch the dashboards, nervously', 'You refresh the graphs all day. They look fine.', { mastery: 6, joy: 5 }),
        result('holiday', 'Hand it over and take a holiday', 'Someone else watches the graphs. You watch the sea.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

function studio({ ladder, main, e }: FamilyContext): LifeEvent[] {
  return [
    {
      id: e('s_portfolio'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'squares-four',
      title: 'The Empty Portfolio',
      text: 'Every job wants a portfolio. You have three school projects and a sketchbook.',
      choices: [
        check('pretend', 'Make projects for pretend clients', 'creativity', 55, ['Your made-up brands look more real than some real ones. Many late nights.', { mastery: 10, energy: -8, set: ['has_portfolio'] }], ['They look like homework. Still, it’s a start.', { mastery: 5 }]),
        result('redo', 'Redo things you love, your way', 'Your versions of famous work get noticed. Weekends disappear.', { mastery: 8, joy: 8, energy: -8, set: ['has_portfolio'], highlight: 'Built a portfolio from scratch' }),
        result('wait', 'Wait for real work first', 'Real work doesn’t come without a portfolio. Chicken, meet egg.', { energy: 5, joy: -5 }),
      ],
    },
    {
      id: e('s_style'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'palette',
      title: 'Finding Your Style',
      text: 'Everything you make looks a bit like someone else’s work.',
      choices: [
        check('masters', 'Copy the masters on purpose, then break away', 'persistence', 55, ['A hundred studies later, something of your own starts to show.', { mastery: 10, joy: 5, energy: -8 }], ['You get stuck in the copying phase for a while.', { mastery: 5 }]),
        check('experiment', 'Experiment wildly', 'creativity', 65, ['One strange experiment clicks. That’s your style now.', { mastery: 12, joy: 10, energy: -8, highlight: 'Found your own style' }], ['A lot of interesting mess, nothing that sticks yet.', { mastery: 3, joy: -5 }]),
        result('trends', 'Follow what’s trending', 'It gets likes. It doesn’t feel like yours.', { mastery: 7, joy: -3 }),
      ],
    },
    {
      id: e('s_more_fun'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'chat-circle',
      title: 'Make It More Fun',
      text: 'The client wants it “more fun, but also serious, and can the colors pop?”',
      choices: [
        check('ask', 'Ask what they really mean', 'empathy', 55, ['Turns out they’re worried their customers find them boring. You fix that instead.', { mastery: 10, joy: 5 }], ['They don’t know what they mean either. Three more rounds.', { joy: -5 }]),
        check('options', 'Show them three options', 'organization', 55, ['They pick one in five minutes. You charge for all three.', { mastery: 8, money: 5 }], ['They want a mix of all three.', { energy: -12 }]),
        result('do_it', 'Just do what they say', 'The colors pop. You don’t put it in your portfolio.', { joy: -8, money: 5, mastery: 4 }),
      ],
    },
    {
      id: e('s_copied'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'eye',
      title: 'Someone Copies Your Work',
      text: 'You find your work in someone else’s portfolio, with their name on it.',
      choices: [
        check('call_out', 'Call it out publicly', 'communication', 60, ['People back you up. They take it down and apologize.', { joy: 8, highlight: 'Stood up for your work' }], ['It turns into a messy argument online.', { joy: -10, energy: -10 }]),
        check('private', 'Message them privately', 'empathy', 55, ['They take it down, embarrassed. Quietly settled.', { joy: 5, mastery: 3 }], ['No reply. It stays up.', { joy: -5 }]),
        result('more', 'Let it go and make more', 'They copied one piece. You make ten new ones.', { mastery: 8, joy: -3, energy: -5 }),
      ],
    },
    {
      id: e('s_revisions'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'warning',
      title: 'Revision Twelve',
      text: 'Version twelve. The client wants to go back to version two.',
      choices: [
        check('limits', 'Set clear revision limits', 'communication', 60, ['Your new contracts include two rounds of changes. Clients respect it.', { energy: 10, joy: 5, money: 5 }], ['They walk. Some clients aren’t worth it anyway.', { energy: -10, joy: -5 }]),
        check('grit', 'Grit your teeth and do it', 'persistence', 55, ['Version two it is, again. They pay on time, at least.', { mastery: 6, money: 5, energy: -12 }], ['Version thirteen arrives the next morning.', { energy: -18, joy: -5 }]),
        check('reasons', 'Push back with reasons', main, 60, ['You explain why version nine works. They agree.', { mastery: 10, joy: 8 }], ['They don’t want reasons. They want version two.', { joy: -8 }]),
      ],
    },
    {
      id: e('s_ai_images'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'sparkle',
      title: 'The Machines Can Make Pictures',
      text: 'A free tool makes images in seconds. Some clients ask why they should still pay you.',
      choices: [
        check('sketch', 'Use it as a sketching tool', 'curiosity', 55, ['You explore ideas faster, then make the real thing by hand.', { mastery: 10, money: 5 }], ['Everything starts looking a bit generic.', { mastery: 4, joy: -5 }]),
        check('value', 'Sell what only you can do', 'communication', 60, ['Taste, ideas and understanding the client: they pay more for you, not less.', { money: 10, joy: 8, highlight: 'Showed clients what only you can do' }], ['A few clients leave for the cheap option.', { joy: -8, money: -5 }]),
        check('craft', 'Double down on craft', 'persistence', 60, ['Your work gets more personal and more valuable.', { mastery: 12, joy: 5 }], ['Craft takes time you don’t have this month.', { energy: -10 }]),
      ],
    },
    {
      id: e('s_studio'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'door-open',
      title: 'Agency, Freelance or Your Own?',
      text: `You could join a big agency, go freelance, or open your own ${ladder.ownNoun}.`,
      choices: [
        result('agency', 'Join a big agency', 'Big clients, big budgets, a lot of meetings.', { money: 15, mastery: 10, joy: -3 }),
        check('freelance', 'Go freelance', 'independence', 60, ['Your own hours, your own clients, your own rules.', { money: 10, joy: 10, set: ['freelance'] }], ['Feast, then famine. You take a part-time job for stability.', { money: -10, joy: -5 }]),
        check('own', `Open your own ${ladder.ownNoun}`, 'independence', 65, ['A small team, a door with your name on it, work you’re proud of.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Opened your own ${ladder.ownNoun}` }], ['Running a business eats your making time. You go back to just you.', { money: -5, mastery: 8, joy: -5 }], { check: { attribute: 'independence', difficulty: 65, bonus: { has_portfolio: 10 } } }),
      ],
    },
    {
      id: e('s_big'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      weight: LATE_WEIGHT,
      icon: 'star',
      title: 'Your Work, Everywhere',
      text: 'Your work is about to be seen by more people than ever before.',
      choices: [
        check('yours', 'Make it unmistakably yours', 'creativity', 65, ['People recognize it as yours before they see your name.', { mastery: 15, joy: 10, highlight: 'Made work millions saw' }], ['Too personal for the brief. It still goes out, softened.', { mastery: 10, energy: -15 }], { check: { attribute: 'creativity', difficulty: 65, bonus: { has_portfolio: 10 } } }),
        check('safe', 'Make it polished and safe', main, 60, ['Flawless. Nobody complains, nobody gasps.', { mastery: 12, joy: 5 }], ['Fine. Just fine.', { mastery: 5 }]),
        result('pass', 'Pass it to someone else', 'Someone else gets the spotlight. You get your evenings.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

function performing({ ladder, main, next, e }: FamilyContext): LifeEvent[] {
  return [
    {
      id: e('p_basics'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'books',
      title: 'The Basics, Again',
      text: 'Your teacher makes you do the basics for the hundredth time.',
      choices: [
        check('perfect', 'Do them perfectly anyway', 'persistence', 55, ['On the hundred-and-first time, something clicks in your body.', { mastery: 10, energy: -10 }], ['Your mind wanders. Your teacher notices.', { mastery: 5, energy: -12 }]),
        check('why', 'Ask why it matters', 'curiosity', 55, ['The answer changes how you do everything else.', { mastery: 10, joy: 5 }], ['“Because I said so.” Fair enough.', { mastery: 4 }]),
        check('skip', 'Sneak ahead to the fun part', 'creativity', 60, ['Your shortcut works, and it’s joyful.', { mastery: 8, joy: 10 }], ['The fun part falls apart without the basics.', { mastery: 3, joy: -5 }]),
      ],
    },
    {
      id: e('p_first_show'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'sparkle',
      title: 'The First Time',
      text: 'Your first real performance. Your hands are shaking, and the room is half full.',
      choices: [
        check('go', 'Breathe and go for it', 'courage', 55, ['Somewhere in the middle, the fear turns into joy.', { joy: 12, mastery: 8, highlight: 'Survived your first time in front of an audience' }], ['You rush through it in a blur.', { joy: -8, energy: -8 }]),
        result('safe', 'Play it safe', 'Clean, careful, forgettable. It counts.', { mastery: 6, joy: 3 }),
        check('crowd', 'Feed off the audience', 'communication', 60, ['They laugh, they lean in, they clap for real.', { joy: 10, mastery: 8 }], ['The audience is on their phones.', { joy: -5 }]),
      ],
    },
    {
      id: e('p_auditions'),
      kind: 'job_hunt',
      stages: ['breaking_in'],
      conditions: { flagsNone: ['track_changer'] },
      icon: 'briefcase',
      title: 'Audition Season',
      text: 'Twenty auditions this month. Two callbacks. One of them is for a yogurt commercial.',
      choices: [
        check('keep', 'Keep auditioning', 'persistence', 60, ['Audition thirty-one says yes. A real, paid job.', { mastery: 5, joy: 10, money: 15, set: ['employed'], highlight: 'Booked your first real job' }], ['Still nothing. You pick up shifts and keep going.', { energy: -15, money: -5, joy: -5, set: ['side_job'] }], { check: { attribute: 'persistence', difficulty: 60, bonus: { has_portfolio: 10 } } }),
        check('network', 'Ask everyone you know', 'communication', 55, ['A friend recommends you to a director. You’re in.', { mastery: 3, joy: 5, money: 15, set: ['employed'] }], ['Lots of love, no work yet.', { joy: -10, energy: -5 }], { check: { attribute: 'communication', difficulty: 55, bonus: { has_mentor: 10, peer_friend: 10 } } }),
        check('own_show', 'Make your own show', 'independence', 60, ['Your own small show, your own audience. People start coming back.', { mastery: 5, joy: 12, money: 5, set: ['employed', 'freelance'] }], ['Twelve people come. Four are your family.', { money: -10, energy: -10, joy: -5 }], { hint: 'Your rules · your risk' }),
      ],
    },
    {
      id: e('p_auditions_change'),
      kind: 'job_hunt',
      stages: ['breaking_in'],
      conditions: { flagsAll: ['track_changer'] },
      priority: 1,
      icon: 'briefcase',
      title: 'First Audition at {age}',
      text: 'The room is full of twenty-year-olds. You have something they don’t: a whole life to draw from.',
      choices: [
        check('lived', 'Use everything you’ve lived', main, 65, ['You bring something real into the room. They cast you.', { mastery: 8, joy: 12, money: 10, set: ['employed'], highlight: 'Made your life your edge' }], ['Not this time. You keep your day job a little longer.', { joy: -10, energy: -5, set: ['side_job'] }], { check: { attribute: main, difficulty: 65, bonus: { track_changer: 10 } } }),
        result('nights', 'Keep the day job and perform at night', 'Small gigs, late nights, slow progress, and you love every one of them.', { money: 5, energy: -10, mastery: 6, joy: 6, set: ['employed'] }, 'Slow · safe · tiring'),
        result('teach', 'Teach while you build', 'Freelance teaching pays the bills and sharpens your own craft.', { money: 10, mastery: 5, joy: 5, set: ['employed', 'freelance'] }),
      ],
    },
    {
      id: e('p_rejection'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'warning',
      title: 'Rejection Number Fifty',
      text: 'Another “not quite what we’re looking for.” You’ve stopped counting. Almost.',
      choices: [
        check('feedback', 'Ask for honest feedback', 'communication', 55, ['One casting director tells you exactly what was missing. Gold.', { mastery: 10, joy: 3 }], ['No reply. Of course.', { joy: -8 }]),
        check('train', 'Train harder', 'persistence', 60, ['More classes, more practice. You get noticeably better.', { mastery: 10, energy: -10 }], ['You’re exhausted, and still getting no.', { energy: -15, joy: -5 }]),
        result('pause', 'Take a week off', 'A week of not trying. You come back hungry.', { energy: 12, joy: 3 }),
      ],
    },
    {
      id: e('p_day_job'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'coffee',
      title: 'The Day Job',
      text: 'Rent doesn’t care about dreams. You need a day job that leaves room for the other one.',
      choices: [
        check('teach', 'Teach what you do', 'empathy', 55, ['Your students make you better. Rent is paid.', { money: 10, mastery: 6, joy: 5 }], ['Teaching drains you more than you expected.', { money: 5, energy: -10 }]),
        result('tables', 'Wait tables at night', 'The money is fine. Your feet are not.', { money: 10, energy: -12 }),
        check('little', 'Live on very little', 'persistence', 60, ['Instant noodles and full days of practice. It works, for now.', { mastery: 10, money: -10, joy: 5 }], ['Broke and stressed is not a creative state.', { money: -15, joy: -10 }]),
      ],
    },
    {
      id: e('p_body'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'battery-low',
      title: 'Your Body Is Your Instrument',
      text: 'Long rehearsals, late shows and early calls start to take their toll.',
      choices: [
        check('recover', 'Rest and recover properly', 'organization', 55, ['Sleep, food, warm-ups. You last longer than people who don’t.', { energy: 15, mastery: 4 }], ['Good plan, chaotic schedule.', { energy: -5 }]),
        check('push', 'Push through', 'persistence', 60, ['You deliver every night. You pay for it on your day off.', { mastery: 10, energy: -15 }], ['Something gives. A week of rest, forced.', { energy: -20, joy: -5 }]),
        result('pro', 'See a professional', 'A coach or physio fixes what you’d been ignoring.', { money: -10, energy: 10, joy: 5 }),
      ],
    },
    {
      id: e('p_review'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'eye',
      title: 'The Review',
      text: 'A well-known critic reviews your work. Everyone you know is going to read it.',
      choices: [
        check('read', 'Read it', 'calm', 55, ['One line about you makes you cry, the good kind.', { joy: 10, mastery: 5, highlight: 'Got a review you’ll keep forever' }], ['One line about you makes you cry, the other kind.', { joy: -12 }]),
        result('skip', 'Don’t read it', 'Your friends tell you it was good. You choose to believe them.', { energy: 5, mastery: 3 }),
        check('fuel', 'Let it fuel you, whatever it says', 'persistence', 60, ['You use every word to get better.', { mastery: 12 }], ['It gets in your head for a month.', { joy: -8 }]),
      ],
    },
    {
      id: e('p_crossroads'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'path',
      title: 'The Steady Gig',
      text: 'A long-running, steady job is on the table. Or you keep chasing the big dream.',
      choices: [
        result('steady', 'Take the steady gig', 'Same show, same people, steady money. Comfortable, maybe too comfortable.', { money: 20, joy: -3, mastery: 5 }),
        check('dream', 'Chase the dream', 'courage', 65, ['It’s brutal, and some of it comes true.', { mastery: 15, joy: 10, energy: -10, highlight: 'Chased the dream and caught some of it' }], ['A hard year with little work. You don’t regret trying.', { joy: -10, money: -10 }]),
        check('company', 'Lead your own ensemble', 'empathy', 60, ['You gather people you love working with and lead them well.', { mastery: 10, joy: 8, set: ['manager'] }], ['Herding artists is harder than it looks.', { joy: -10, energy: -5 }]),
        check('own', `Open your own ${ladder.ownNoun}`, 'independence', 65, ['Your own place, your own rules, a sign with your name.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Opened your own ${ladder.ownNoun}` }], ['The business side swallows your art time. You close it.', { money: -5, mastery: 8, joy: -5 }]),
        result('move', `Move into ${inSentence(next.name)}`, `You take everything you learned into ${inSentence(next.name)}. Steadier, still creative.`, { money: 10, mastery: 5, set: ['pivoted'] }),
      ],
    },
    {
      id: e('p_opening'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      icon: 'star',
      title: 'The Biggest Night',
      text: 'The biggest night of your career. The lights go down, and it’s you.',
      choices: [
        check('everything', 'Give it everything', main, 65, ['Standing ovation. You will remember this for the rest of your life.', { mastery: 15, joy: 10, highlight: 'Owned the biggest night of your career' }], ['Not your best night, but you got through it with grace.', { mastery: 10, energy: -15 }], { check: { attribute: main, difficulty: 65, bonus: { has_mentor: 10, manager: 10 } } }),
        check('precise', 'Do it clean and precise', 'persistence', 60, ['Flawless. People talk about the precision for weeks.', { mastery: 10, joy: 5 }], ['Clean, but a little cold.', { mastery: 5 }]),
        result('share', 'Let someone else take the lead', 'You shine in a smaller part. Someone else gets their big night.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

function sport({ ladder, main, next, e }: FamilyContext): LifeEvent[] {
  const [, , , lead] = ladder.roles;
  return [
    {
      id: e('g_sunrise'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'lightning',
      title: 'Before Sunrise',
      text: 'Training at six, everything else at nine, training again at six.',
      choices: [
        check('never_miss', 'Never miss a session', 'persistence', 55, ['Months of it. You’re visibly better than the people who skipped.', { mastery: 10, energy: -12 }], ['You miss a few, then feel guilty about it.', { mastery: 5, energy: -15 }]),
        check('smart', 'Train smarter, not more', 'analytical', 55, ['You track everything and cut the useless sessions. Better results, more sleep.', { mastery: 10, energy: 5 }], ['Your data says one thing, your body another.', { mastery: 4 }]),
        check('partner', 'Find a training partner', 'empathy', 50, ['You push each other and become close friends.', { mastery: 8, joy: 8, set: ['peer_friend'] }], ['They quit after three weeks.', { mastery: 4 }]),
      ],
    },
    {
      id: e('g_selection'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'users-three',
      title: 'Selection Day',
      text: 'The list goes up on the wall. Everyone crowds around it.',
      choices: [
        check('prove', 'Prove it every single practice', main, 60, ['Your name is on the list.', { mastery: 10, joy: 10, highlight: 'Made the team' }], ['Not this time. Next season.', { joy: -10 }]),
        check('ask', 'Ask the coach what’s missing', 'communication', 55, ['They tell you exactly what to work on. You work on it.', { mastery: 10 }], ['“Keep working.” Not very helpful.', { joy: -5 }]),
        check('elsewhere', 'Try out somewhere else', 'independence', 55, ['A different team sees what this one didn’t.', { mastery: 8, joy: 5 }], ['Starting over somewhere new is lonely.', { mastery: 3, joy: -5 }]),
      ],
    },
    {
      id: e('g_first_spot'),
      kind: 'job_hunt',
      stages: ['breaking_in'],
      conditions: { flagsNone: ['track_changer'] },
      icon: 'briefcase',
      title: 'Getting Your First Spot',
      text: 'A handful of places, on a team, at a club, in a gym, and a lot of people who want them.',
      choices: [
        check('trial', 'Prove it in the trial', 'persistence', 60, ['You outwork everyone in the room. They give you the spot.', { mastery: 5, joy: 10, money: 15, set: ['employed'], highlight: 'Earned your first spot' }], ['Not this time. You keep a side job and keep training.', { energy: -15, money: -5, joy: -5, set: ['side_job'] }], { check: { attribute: 'persistence', difficulty: 60, bonus: { peer_friend: 10 } } }),
        check('vouch', 'Ask your coach to vouch for you', 'communication', 55, ['One phone call from the right person, and you’re in.', { mastery: 3, joy: 5, money: 15, set: ['employed'] }], ['They’d love to help, but there’s nothing right now.', { joy: -10, energy: -5 }], { check: { attribute: 'communication', difficulty: 55, bonus: { has_mentor: 10 } } }),
        result('small', 'Start small and part-time', 'Semi-pro, a few clients, a small club. Real, if not glamorous.', { money: 5, energy: -10, mastery: 5, joy: 5, set: ['employed'] }, 'In the game · not much money yet'),
      ],
    },
    {
      id: e('g_first_spot_change'),
      kind: 'job_hunt',
      stages: ['breaking_in'],
      conditions: { flagsAll: ['track_changer'] },
      priority: 1,
      icon: 'briefcase',
      title: 'Starting at {age}',
      text: 'Most people in your sport started as kids. You’re {age}, and you have the discipline most of them didn’t at your age.',
      choices: [
        check('level', 'Find the level where you can compete', main, 60, ['You find your level and you shine there. Age turns out to be just a number.', { mastery: 8, joy: 12, money: 5, set: ['employed'], highlight: 'Proved age is just a number' }], ['Not this season. You keep your day job a little longer.', { joy: -10, energy: -5, set: ['side_job'] }], { check: { attribute: main, difficulty: 60, bonus: { track_changer: 10 } } }),
        result('coach', 'Coach others while you train', 'Coaching pays the bills and keeps you close to the game.', { money: 10, mastery: 5, joy: 5, set: ['employed'] }),
        result('love', 'Do it for love, keep your job', 'Evenings and weekends in the sport you love. Tiring, and worth it.', { money: 5, joy: 8, mastery: 5, energy: -8, set: ['employed'] }),
      ],
    },
    {
      id: e('g_injury'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'warning',
      title: 'The Injury',
      text: 'Something gives. Weeks out, maybe months.',
      choices: [
        check('rehab', 'Do every bit of rehab', 'persistence', 60, ['Boring, painful, and you come back stronger.', { mastery: 8, energy: 5, highlight: 'Came back stronger from an injury' }], ['Progress is slow, and so is your mood.', { energy: -10, joy: -10 }]),
        check('early', 'Come back early', 'physical', 65, ['It holds. You’re back before anyone expected.', { mastery: 8, joy: 5 }], ['It doesn’t hold. Longer out this time.', { energy: -20, joy: -10 }]),
        check('study', 'Use the time to study the game', 'analytical', 55, ['You watch hours of footage and come back smarter.', { mastery: 10 }], ['Watching others play just makes you sad.', { joy: -5 }]),
      ],
    },
    {
      id: e('g_cut'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'door-open',
      title: 'Cut From the Squad',
      text: 'You’re told you won’t be kept on next season.',
      choices: [
        check('trial', 'Trial somewhere else', 'persistence', 60, ['A new club takes you on. Fresh start.', { money: 10, joy: 8, set: ['employed'] }], ['Three trials, no offers.', { joy: -10, energy: -10 }]),
        check('coach_young', 'Start coaching younger players', 'empathy', 55, ['The kids love you, and soon you have your own groups and clients.', { mastery: 6, joy: 8, set: ['employed', 'freelance'] }], ['Coaching isn’t clicking yet.', { joy: -5 }]),
        result('reset', 'Take a season to reset', 'Rest, think, and come back clearer.', { energy: 15, joy: -5 }),
      ],
    },
    {
      id: e('g_pressure'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'star',
      title: 'Big-Game Pressure',
      text: 'A crowd, cameras, and everything riding on the next ten minutes.',
      choices: [
        check('calm', 'Stay calm and execute', 'calm', 60, ['Your best performance comes when it matters most.', { mastery: 10, joy: 10, highlight: 'Delivered under pressure' }], ['Your nerves get the better of you.', { joy: -10 }]),
        result('role', 'Do your job, nothing fancy', 'Solid. Coaches love solid.', { mastery: 6, joy: 3 }),
        check('team', 'Lean on your teammates', 'empathy', 55, ['You lift each other. It’s a team win.', { joy: 8, mastery: 6 }], ['Everyone is too tense to help anyone.', { joy: -3 }]),
      ],
    },
    {
      id: e('g_body'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'battery-low',
      title: 'The Body Keeps Score',
      text: 'Every season takes a little more out of you.',
      choices: [
        check('recovery', 'Take recovery seriously', 'organization', 55, ['Sleep, food, mobility. You outlast people who are more talented.', { energy: 12, mastery: 3 }], ['Good intentions, packed schedule.', { energy: -5 }]),
        check('push', 'Push through', 'persistence', 60, ['Another strong season, another tired body.', { mastery: 10, money: 5, energy: -15 }], ['Your body forces a break.', { energy: -20 }]),
        result('physio', 'Pay for the good physio', 'Expensive, and worth every cent.', { money: -10, energy: 10 }),
      ],
    },
    {
      id: e('g_after'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'path',
      title: 'What Comes After',
      text: 'Careers in sport are short. You start thinking about what comes next.',
      choices: [
        check('lead', `Become ${article(lead)} ${inSentence(lead)}`, 'empathy', 60, ['You’re good at building people up. It suits you.', { mastery: 10, joy: 8, set: ['manager'] }], ['Leading is harder than doing.', { joy: -10 }]),
        check('own', `Open your own ${ladder.ownNoun}`, 'independence', 65, ['Your own place, your own way of training people.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Opened your own ${ladder.ownNoun}` }], ['The business side is tougher than any training session.', { money: -5, mastery: 8, joy: -5 }]),
        check('compete', 'Keep competing as long as you can', 'persistence', 65, ['A few more good years than anyone expected.', { mastery: 15, joy: 8, energy: -10 }], ['Your body has other plans.', { energy: -15, joy: -5 }]),
        result('move', `Move into ${inSentence(next.name)}`, `You take what the sport taught you into ${inSentence(next.name)}.`, { money: 10, mastery: 5, set: ['pivoted'] }),
      ],
    },
    {
      id: e('g_final'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      icon: 'star',
      title: 'The Final',
      text: 'The biggest day of your career. Everyone you love is watching.',
      choices: [
        check('everything', 'Leave everything out there', main, 65, ['Whatever the score, it’s the best you’ve ever been.', { mastery: 15, joy: 10, highlight: 'Gave everything on the biggest day' }], ['Not your day. You’re proud you got here.', { mastery: 10, energy: -15 }], { check: { attribute: main, difficulty: 65, bonus: { manager: 10, has_mentor: 10 } } }),
        result('job', 'Do your job for the team', 'You play your part perfectly. The team does the rest.', { mastery: 6, joy: 5, energy: 5 }),
        result('step_aside', 'Step aside for someone younger', 'You watch from the side as someone you trained shines.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

function care({ ladder, main, next, e }: FamilyContext): LifeEvent[] {
  return [
    {
      id: e('k_placement'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'heart',
      title: 'Your First Placement',
      text: 'Your first placement with real people who need you. They can tell you’re new.',
      choices: [
        check('listen', 'Listen more than you talk', 'empathy', 50, ['By the end of the week, they trust you.', { mastery: 10, joy: 8 }], ['You try, but you’re too nervous to really hear them.', { mastery: 5 }]),
        check('prepare', 'Prepare everything', 'organization', 55, ['Your plans are so good your supervisor borrows them.', { mastery: 10, energy: -8 }], ['You prepare for the wrong things.', { energy: -12 }]),
        check('yourself', 'Just be yourself', 'communication', 55, ['Someone opens up to you on your first day.', { joy: 10, mastery: 6, highlight: 'Someone opened up to you on day one' }], ['Being yourself turns out to need practice.', { joy: -5 }]),
      ],
    },
    {
      id: e('k_theory'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'books',
      title: 'Theory vs Real Life',
      text: 'What the textbook says and what actually happens in the room are two very different things.',
      choices: [
        check('ask', 'Ask the experienced people', 'curiosity', 55, ['They tell you what no course ever will.', { mastery: 10 }], ['They’re too busy today.', { mastery: 4 }]),
        check('reflect', 'Reflect and write it all down', 'persistence', 55, ['Your notebook becomes your best teacher.', { mastery: 8, joy: 5, energy: -5 }], ['Too tired to write most nights.', { energy: -8 }]),
        result('instinct', 'Trust your instincts', 'Sometimes they’re right. You learn which times.', { mastery: 5, joy: 3 }),
      ],
    },
    {
      id: e('k_hard_case'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'warning',
      title: 'The Hard Case',
      text: 'Someone you’re supporting is going through something far bigger than you were trained for.',
      choices: [
        check('supervisor', 'Bring in your supervisor', 'communication', 55, ['Together you find the right help. You learn how it’s done.', { mastery: 10, joy: 5, set: ['has_mentor'] }], ['They’re stretched thin too. You manage, barely.', { joy: -5 }]),
        check('stay', 'Stay with them and listen', 'empathy', 55, ['You don’t fix it. You stay. It matters more than you know.', { joy: 10, mastery: 6, energy: -8, highlight: 'Stayed when it mattered' }], ['It follows you home for weeks.', { energy: -12, joy: -5 }]),
        check('procedure', 'Follow the procedure exactly', 'organization', 55, ['The process works the way it should.', { mastery: 8 }], ['The procedure doesn’t quite fit the person.', { energy: -8 }]),
      ],
    },
    {
      id: e('k_paperwork'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'squares-four',
      title: 'The Paperwork Mountain',
      text: 'Half your week is forms, reports and notes.',
      choices: [
        check('organize', 'Get ruthlessly organized', 'organization', 60, ['Templates, routines, fifteen minutes a day. Your evenings come back.', { energy: 10, mastery: 6 }], ['Your system collapses in the first busy week.', { energy: -10 }]),
        result('evenings', 'Do it at home in the evenings', 'It gets done. Your evenings don’t.', { energy: -12, mastery: 5 }),
        check('push_back', 'Push back on what’s pointless', 'communication', 60, ['Two forms get scrapped. Everyone thanks you.', { energy: 8, joy: 5 }], ['Nobody wants to hear it.', { joy: -8 }]),
      ],
    },
    {
      id: e('k_fatigue'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'battery-low',
      title: 'Running on Empathy',
      text: 'You care a lot, and lately it’s costing you.',
      choices: [
        check('boundaries', 'Set boundaries', 'independence', 55, ['You care just as much, and you go home at five.', { energy: 15, joy: 5 }], ['You set them. You break them by Thursday.', { energy: -5, joy: -5 }]),
        result('supervision', 'Use your supervision time', 'Talking it through with someone who gets it helps a lot.', { energy: 10, joy: 5, mastery: 3 }),
        check('give', 'Keep giving everything', 'persistence', 60, ['People feel how much you care. You feel it too, in your bones.', { mastery: 10, joy: 5, energy: -15 }], ['You run out. A week off, forced.', { energy: -20 }]),
      ],
    },
    {
      id: e('k_thanks'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'heart',
      title: 'The One Who Comes Back',
      text: 'Someone you helped years ago finds you to say thank you.',
      choices: [
        check('ask', 'Ask what made the difference', 'curiosity', 50, ['It was something tiny you don’t even remember. You never forget it now.', { mastery: 10, joy: 10, highlight: 'Someone came back to thank you' }], ['They can’t put it into words. You both just smile.', { joy: 8 }]),
        result('enjoy', 'Just enjoy the moment', 'You carry that conversation for years.', { joy: 12 }),
        result('team', 'Share it with your team', 'Everyone needed to hear it.', { joy: 8, mastery: 4 }),
      ],
    },
    {
      id: e('k_step_up'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'path',
      title: 'Step Up or Stay Close?',
      text: 'You’re offered a role running things: less time with people, more time on decisions.',
      choices: [
        check('step_up', 'Take the step up', 'empathy', 60, ['You shape how a whole team cares for people.', { mastery: 10, joy: 8, set: ['manager'] }], ['Budgets and meetings. You miss the people.', { joy: -12 }]),
        result('stay', 'Stay close to the people', 'You turn it down. The work you love stays yours.', { joy: 10, mastery: 6 }),
        check('own', `Start your own ${ladder.ownNoun}`, 'independence', 65, ['Your own place, built around how you think people should be treated.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Started your own ${ladder.ownNoun}` }], ['Running it all alone is too much. You go back to a team.', { money: -5, mastery: 8, joy: -5 }]),
        result('move', `Move into ${inSentence(next.name)}`, `You bring everything you know about people into ${inSentence(next.name)}.`, { money: 5, mastery: 5, set: ['pivoted'] }),
      ],
    },
    {
      id: e('k_big_day'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      icon: 'star',
      title: 'The Day It Comes Together',
      text: 'A big day you’ve worked toward for years: a graduation, a hearing, a breakthrough.',
      choices: [
        check('lead', 'Be there and lead it', main, 65, ['Someone reaches a day they fought for, and you helped them get there.', { mastery: 15, joy: 10, highlight: 'Helped someone reach a day they fought for' }], ['It’s messy and emotional, and it still happens.', { mastery: 10, energy: -15 }], { check: { attribute: main, difficulty: 65, bonus: { manager: 10, has_mentor: 10 } } }),
        result('support', 'Support from the side', 'You make sure every small thing goes right.', { mastery: 6, joy: 5, energy: 5 }),
        result('step_back', 'Let someone else take this one', 'A colleague leads. You get a rare quiet day.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

function business({ ladder, main, next, e }: FamilyContext): LifeEvent[] {
  return [
    {
      id: e('b_spreadsheet'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'squares-four',
      title: 'The Spreadsheet',
      text: 'Your first real spreadsheet: hundreds of rows, a deadline, and someone who wants “just the headline.”',
      choices: [
        check('dig', 'Dig into the numbers', 'analytical', 55, ['You find the one number that matters. Your manager quotes you in a meeting.', { mastery: 10 }], ['You drown in rows and miss the point.', { mastery: 5, energy: -8 }]),
        check('system', 'Build a clean system first', 'organization', 55, ['Your template gets copied by the whole team.', { mastery: 10, energy: -5 }], ['Beautiful system, missed deadline.', { energy: -10 }]),
        check('shortcuts', 'Ask someone to show you the shortcuts', 'communication', 50, ['Twenty minutes with a colleague saves you twenty hours. New friend, too.', { mastery: 8, joy: 5, set: ['peer_friend'] }], ['They’re too busy today.', { mastery: 4 }]),
      ],
    },
    {
      id: e('b_first_pitch'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'chats',
      title: 'Your First Pitch',
      text: 'Five minutes to convince a room of people who are checking their phones.',
      choices: [
        check('story', 'Tell a story', 'communication', 60, ['Phones go down. Someone asks a follow-up question. You’ve got them.', { mastery: 10, joy: 8, highlight: 'Won over a room with your first pitch' }], ['The story wanders. So does the room.', { joy: -8 }]),
        check('numbers', 'Lead with the numbers', 'analytical', 55, ['Hard to argue with your numbers. They don’t.', { mastery: 10 }], ['Too many slides. Glazed eyes.', { joy: -5 }]),
        check('rehearse', 'Rehearse it twenty times', 'persistence', 55, ['Smooth, confident, on time.', { mastery: 8, energy: -8 }], ['Over-rehearsed and stiff.', { energy: -10 }]),
      ],
    },
    {
      id: e('b_target'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'path',
      title: 'The Target',
      text: 'Your first real target for the quarter. It looks impossible.',
      choices: [
        check('grind', 'Grind every lead', 'persistence', 60, ['You hit it on the last day. Barely, gloriously.', { money: 10, mastery: 8, energy: -12 }], ['You miss it by a little and sleep for a weekend.', { energy: -15, joy: -5 }]),
        check('smart', 'Find the best leads first', 'analytical', 60, ['Fewer calls, better calls. You beat the target.', { money: 10, mastery: 10 }], ['Your clever plan misses the obvious.', { joy: -5 }]),
        check('ask_best', 'Ask the top performer how they do it', 'communication', 55, ['They take you under their wing.', { mastery: 10, set: ['has_mentor'], highlight: 'Learned from the best on the team' }], ['They guard their secrets.', { joy: -3 }]),
      ],
    },
    {
      id: e('b_credit'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'users',
      title: 'Office Politics',
      text: 'Someone takes credit for your work in a big meeting.',
      choices: [
        check('speak', 'Speak up, calmly', 'communication', 60, ['“Glad you liked it. I built that part.” People notice.', { joy: 8, mastery: 5 }], ['It comes out bitter. Awkward silence.', { joy: -10 }]),
        check('private', 'Talk to them privately', 'empathy', 55, ['They apologize and credit you next time.', { joy: 5, mastery: 3 }], ['They act like they don’t know what you mean.', { joy: -5 }]),
        check('results', 'Let your results speak', 'persistence', 55, ['Your next three projects make it obvious who does the work.', { mastery: 8, money: 5 }], ['Results speak quietly. Nobody hears.', { joy: -8 }]),
      ],
    },
    {
      id: e('b_quarter_end'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'lightning',
      title: 'Quarter End',
      text: 'The end of the quarter: deals to close, reports due, and everyone is on edge.',
      choices: [
        result('late', 'Stay late all week', 'It all gets done. You don’t remember the week.', { money: 10, energy: -15, mastery: 5 }),
        check('prioritize', 'Prioritize ruthlessly', 'organization', 60, ['You drop the unimportant half and nobody notices.', { mastery: 10, energy: 5 }], ['You dropped the wrong half.', { energy: -10 }]),
        check('weekends', 'Keep your weekends sacred', 'independence', 55, ['You come back Monday sharper than everyone else.', { energy: 12, joy: 5 }], ['You spend the weekend checking your phone anyway.', { joy: -5, energy: -5 }]),
      ],
    },
    {
      id: e('b_big_client'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'handshake',
      title: 'The Big Client',
      text: 'A client who could double your numbers, and who knows it.',
      choices: [
        check('negotiate', 'Negotiate hard', 'communication', 65, ['Fair terms, a long contract, and a client who respects you.', { money: 15, mastery: 8, highlight: 'Landed the big client' }], ['They push you around and walk anyway.', { money: -5, joy: -8 }]),
        check('overdeliver', 'Overdeliver', 'persistence', 60, ['They’re so happy they refer two more clients.', { mastery: 10, joy: 5, money: 5, energy: -10 }], ['You give everything; they want more.', { energy: -15 }]),
        result('walk', 'Walk away from a bad deal', 'It hurts the numbers. It saves your sanity.', { joy: 5, money: -5, mastery: 3 }),
      ],
    },
    {
      id: e('b_climb'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'rocket',
      title: 'Climb, Study or Start?',
      text: `You could chase the promotion, go back to study, or start your own ${ladder.ownNoun}.`,
      choices: [
        check('climb', 'Chase the promotion', 'empathy', 60, ['You get it, and turn out to be a manager people want to work for.', { mastery: 10, joy: 5, money: 10, set: ['manager'] }], ['Someone else gets it. You learn what they had that you didn’t.', { joy: -10 }]),
        result('study', 'Go back to study, in the evenings', 'Two years of evenings. A qualification that opens bigger doors.', { money: -15, mastery: 15, joy: 3 }),
        check('own', `Start your own ${ladder.ownNoun}`, 'independence', 65, ['Your name on the door, your first clients, your own rules.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Started your own ${ladder.ownNoun}` }], ['A lean year, then back to a team, with a much better feel for business.', { money: -5, mastery: 8, joy: -5 }], { check: { attribute: 'independence', difficulty: 65, bonus: { has_mentor: 5 } } }),
        result('move', `Move into ${inSentence(next.name)}`, `You take your business sense into ${inSentence(next.name)}.`, { money: 10, mastery: 5, set: ['pivoted'] }),
      ],
    },
    {
      id: e('b_deal'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      icon: 'star',
      title: 'The Deal of Your Career',
      text: 'One deal, one launch, one number that will define your year.',
      choices: [
        check('lead', 'Lead it from the front', main, 65, ['Signed, celebrated, framed on the wall.', { mastery: 15, joy: 10, money: 10, highlight: 'Closed the deal of your career' }], ['It closes late and smaller than you hoped. Still closes.', { mastery: 10, energy: -15 }], { check: { attribute: main, difficulty: 65, bonus: { manager: 10, has_mentor: 10 } } }),
        result('back_up', 'Back up the team', 'You make everyone around you look good.', { mastery: 6, joy: 5, energy: 5 }),
        result('pass', 'Let someone else take it', 'You stay out of the spotlight and the stress.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

function food({ ladder, main, next, e }: FamilyContext): LifeEvent[] {
  return [
    {
      id: e('f_burns'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'fire',
      title: 'Burns and Blisters',
      text: 'Your first weeks: hot pans, heavy trays, ten hours on your feet.',
      choices: [
        check('tough', 'Toughen up', 'persistence', 55, ['By week four, you barely notice. You’re fast now.', { mastery: 10, energy: -10 }], ['Every shift hurts. You keep going.', { energy: -15 }]),
        check('technique', 'Learn the right technique', 'curiosity', 55, ['Turns out there’s a right way to carry, lift and stand. Less pain, more speed.', { mastery: 10 }], ['Old habits are hard to break mid-rush.', { mastery: 4, energy: -5 }]),
        result('copy', 'Watch the fastest person and copy them', 'You steal every move they make. They don’t mind.', { mastery: 8, joy: 3 }),
      ],
    },
    {
      id: e('f_prep'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'coffee',
      title: 'The Prep Station',
      text: 'Before anything exciting, you prep: the same small task, hundreds of times.',
      choices: [
        check('perfect', 'Do it perfectly every time', 'persistence', 55, ['Nobody says anything. Then they start trusting you with more.', { mastery: 10, highlight: 'Earned the trust of the whole team' }], ['Perfect is slow. You fall behind.', { mastery: 5, energy: -8 }]),
        check('faster', 'Get a little faster every day', 'organization', 55, ['A month later, you’re done before anyone else.', { mastery: 10, energy: 5 }], ['Faster, sloppier.', { energy: -8 }]),
        check('ask', 'Ask to try something new', 'communication', 55, ['They let you. You don’t mess it up.', { mastery: 8, joy: 8 }], ['“Not yet.” Back to prep.', { joy: -5 }]),
      ],
    },
    {
      id: e('f_rush'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'lightning',
      title: 'The Rush',
      text: 'Friday night. Every table full, orders flying, and someone just called in sick.',
      choices: [
        check('calm', 'Stay calm and keep moving', 'calm', 60, ['Somehow it flows. At midnight the team cheers.', { mastery: 12, joy: 8, energy: -10, highlight: 'Held it together through the worst rush' }], ['You survive it. Barely.', { energy: -15, joy: -5 }]),
        check('lead', 'Call it out clearly and lead', 'communication', 60, ['You take charge and everyone falls into place.', { mastery: 10, joy: 5 }], ['Too many people giving orders. Chaos.', { joy: -8 }]),
        result('head_down', 'Keep your head down', 'You do your part, fast and silent.', { mastery: 6, energy: -12 }),
      ],
    },
    {
      id: e('f_review'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'warning',
      title: 'The One-Star Review',
      text: 'A one-star review goes viral. It’s about a night you worked.',
      choices: [
        check('kind', 'Respond kindly and fix it', 'empathy', 55, ['They come back, and update the review to five stars.', { joy: 5, mastery: 8 }], ['Your reply makes it worse.', { joy: -8 }]),
        check('learn', 'Find out what went wrong', 'analytical', 55, ['You fix the real problem behind it.', { mastery: 10 }], ['Nobody agrees on what went wrong.', { joy: -5 }]),
        result('ignore', 'Ignore it', 'The internet forgets in a week. You take a little longer.', { joy: -5, energy: 5 }),
      ],
    },
    {
      id: e('f_hours'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'battery-low',
      title: 'Nights and Weekends',
      text: 'You work when everyone else is off. Your friends have stopped inviting you.',
      choices: [
        check('day_off', 'Fight for one real day off a week', 'communication', 55, ['You get it. That one day saves you.', { energy: 12, joy: 5 }], ['“Maybe next month.”', { joy: -8 }]),
        check('work_friends', 'Make friends at work', 'empathy', 50, ['The after-shift crew becomes your people.', { joy: 10, set: ['peer_friend'] }], ['Everyone is too tired after shifts.', { joy: -3 }]),
        result('accept', 'Accept it for now', 'Good tips, no social life. For now.', { money: 5, energy: -10, joy: -5 }),
      ],
    },
    {
      id: e('f_creation'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'sparkle',
      title: 'Your Own Idea',
      text: 'You get the chance to add something of your own: a dish, a drink, an event.',
      choices: [
        check('bold', 'Make it bold', 'creativity', 60, ['People order it again and again. It’s yours.', { mastery: 12, joy: 10, highlight: 'Got your own creation on the menu' }], ['Too bold for most people. A few love it.', { mastery: 4, joy: -5 }]),
        check('crowd', 'Make it a crowd-pleaser', main, 55, ['Everyone loves it. It sells out on weekends.', { mastery: 8, money: 5 }], ['Safe, and a bit forgettable.', { mastery: 4 }]),
        result('pass', 'Let someone else have the chance', 'Next time. Probably.', { energy: 5, joy: -3 }),
      ],
    },
    {
      id: e('f_own_place'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'storefront',
      title: 'Your Own Place',
      text: `A small place comes up for rent. Everyone says you should open your own ${ladder.ownNoun}.`,
      choices: [
        check('open', `Open your own ${ladder.ownNoun}`, 'independence', 65, ['Opening night: full house, wobbly knees, your name above the door.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Opened your own ${ladder.ownNoun}` }], ['A brutal first year. You close it, older and much wiser.', { money: -10, mastery: 8, joy: -5 }], { check: { attribute: 'independence', difficulty: 65, bonus: { has_mentor: 5 } } }),
        check('head', 'Take the top job somewhere big', 'empathy', 60, ['You run a big team, and run it well.', { mastery: 10, joy: 5, money: 10, set: ['manager'] }], ['Big place, big egos. Hard year.', { joy: -10 }]),
        result('abroad', 'Work abroad for a year and learn', 'A year somewhere new, learning how they do it. You come back with ideas.', { joy: 10, mastery: 10, money: -15 }),
        result('move', `Move into ${inSentence(next.name)}`, `You take everything you learned into ${inSentence(next.name)}. Better hours, same love.`, { money: 5, mastery: 5, set: ['pivoted'] }),
      ],
    },
    {
      id: e('f_big_night'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      icon: 'star',
      title: 'The Night Everyone Comes',
      text: 'A big event, a critic in the room, a packed house. Everything has to be perfect.',
      choices: [
        check('lead', 'Run the whole night', main, 65, ['Perfect, start to finish. The critic comes back to say thank you.', { mastery: 15, joy: 10, highlight: 'Pulled off the night everyone came' }], ['One thing goes wrong; nobody notices but you.', { mastery: 10, energy: -15 }], { check: { attribute: main, difficulty: 65, bonus: { manager: 10, has_mentor: 10 } } }),
        check('station', 'Run your part perfectly', 'persistence', 60, ['Your part is flawless.', { mastery: 10, joy: 5 }], ['Good, not flawless.', { mastery: 5 }]),
        result('night_off', 'Take the night off', 'Someone else gets the glory. You get a rare free Friday.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

function fashion({ ladder, main, next, e }: FamilyContext): LifeEvent[] {
  return [
    {
      id: e('y_practice'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'palette',
      title: 'Practice, Practice',
      text: 'You practice on mannequins, friends and anyone who will sit still long enough.',
      choices: [
        check('hours', 'Put in the hours', 'persistence', 55, ['Hundreds of hours later, your hands just know.', { mastery: 10, energy: -8 }], ['Some weeks you just can’t face it.', { mastery: 5, energy: -10 }]),
        check('copy', 'Recreate looks you love', 'creativity', 60, ['You learn how the best do it by doing it yourself.', { mastery: 10, joy: 5 }], ['Your versions don’t look quite right yet.', { mastery: 4 }]),
        check('friends', 'Practice on friends of friends', 'communication', 55, ['Word spreads. People start asking for you, evenings and weekends.', { mastery: 8, money: 5, energy: -5, set: ['has_portfolio'] }], ['A friend’s friend is not happy.', { joy: -5 }]),
      ],
    },
    {
      id: e('y_trend'),
      kind: 'career',
      stages: ['training'],
      weight: WEIGHT,
      icon: 'sparkle',
      title: 'The Trend',
      text: 'Everyone wants the same look this year. Secretly, you think it’s ugly.',
      choices: [
        result('master', 'Master it anyway', 'You get very good at something you don’t love. It pays.', { mastery: 8, money: 5, joy: -3 }),
        check('twist', 'Put your own twist on it', 'creativity', 60, ['Your version becomes the version people ask for. Long nights getting it right.', { mastery: 10, joy: 10, energy: -6, highlight: 'Turned a trend into your signature' }], ['Too far from what people asked for.', { mastery: 3, joy: -5 }]),
        result('ignore', 'Ignore it', 'You stay true to yourself. Some clients go elsewhere.', { joy: 3, money: -5 }),
      ],
    },
    {
      id: e('y_regular'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'heart',
      title: 'Your First Regular',
      text: 'Someone keeps coming back, and only wants you.',
      choices: [
        check('know', 'Learn everything about them', 'empathy', 55, ['You remember their kids’ names and their big days. They tell everyone about you.', { joy: 10, mastery: 6, money: 5, highlight: 'Built your first loyal regular' }], ['You try, but you’re too busy to really connect.', { joy: 3 }]),
        check('upsell', 'Suggest something new, gently', 'communication', 55, ['They love it. So does your bank account.', { money: 10 }], ['It feels pushy. They notice.', { joy: -5 }]),
        result('referral', 'Ask them for a referral', 'Two new clients the next month.', { money: 5, mastery: 3, set: ['has_portfolio'] }),
      ],
    },
    {
      id: e('y_assist'),
      kind: 'career',
      stages: ['breaking_in'],
      weight: WEIGHT,
      icon: 'eye',
      title: 'Assisting Someone Big',
      text: 'You get to assist someone well known in your field for a whole season.',
      choices: [
        check('absorb', 'Watch and absorb everything', 'curiosity', 55, ['You learn more in a season than in years of classes, and sleep less than ever.', { mastery: 12, energy: -8, set: ['has_mentor'], highlight: 'Assisted someone you admire' }], ['It’s mostly fetching coffee. You still learn a little.', { mastery: 5 }]),
        check('indispensable', 'Make yourself indispensable', 'persistence', 60, ['By the end, they won’t work without you.', { mastery: 10, money: 5, energy: -10 }], ['You run yourself into the ground.', { energy: -18 }]),
        check('pitch', 'Pitch them your own ideas', 'courage', 65, ['They use one of your ideas, and credit you.', { mastery: 8, joy: 10 }], ['They’re not interested in the assistant’s ideas.', { joy: -8 }]),
      ],
    },
    {
      id: e('y_feet'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'battery-low',
      title: 'On Your Feet All Day',
      text: 'Ten hours of standing, bending and focusing. Your back has opinions.',
      choices: [
        check('care', 'Take care of your body', 'organization', 55, ['Good shoes, stretches, real breaks. You last.', { energy: 12 }], ['Easier said than done on a fully booked day.', { energy: -5 }]),
        check('push', 'Push through', 'persistence', 60, ['Full books, full wallet, sore everything.', { mastery: 8, money: 5, energy: -15 }], ['Your body forces a week off.', { energy: -20 }]),
        result('cut_back', 'Cut back your hours', 'Less money, more life.', { money: -10, energy: 10, joy: 5 }),
      ],
    },
    {
      id: e('y_feed'),
      kind: 'career',
      stages: ['first_job'],
      conditions: { flagsAll: ['employed'] },
      weight: WEIGHT,
      icon: 'storefront',
      title: 'Your Feed Is Your Shop Window',
      text: 'New clients find you on social media now. Every post is an advert.',
      choices: [
        check('consistent', 'Post consistently', 'persistence', 55, ['Your books fill weeks in advance.', { money: 10, mastery: 5, set: ['has_portfolio'] }], ['Hard to post after a ten-hour day.', { energy: -10 }]),
        check('process', 'Show your real process', 'creativity', 60, ['People love the behind-the-scenes. Clients come to your door.', { joy: 8, money: 8, highlight: 'Your feed brought clients to your door' }], ['Nobody watches the process videos.', { joy: -3 }]),
        result('ignore', 'Ignore it', 'Word of mouth only. Slower, calmer.', { energy: 5, money: -5 }),
      ],
    },
    {
      id: e('y_own'),
      kind: 'crossroads',
      stages: ['crossroads'],
      conditions: { flagsAll: ['employed'] },
      weight: LATE_WEIGHT,
      icon: 'door-open',
      title: 'They’d Follow You Anywhere',
      text: `Your clients say they would follow you anywhere. You could open your own ${ladder.ownNoun}.`,
      choices: [
        check('open', `Open your own ${ladder.ownNoun}`, 'independence', 65, ['Your own place, your own look, and your clients came with you.', { money: 10, joy: 15, energy: -10, set: ['studio'], highlight: `Opened your own ${ladder.ownNoun}` }], ['Rent and staff eat everything. You go back to working for someone else.', { money: -10, mastery: 8, joy: -5 }], { check: { attribute: 'independence', difficulty: 65, bonus: { has_portfolio: 10 } } }),
        result('famous', 'Join a famous house', 'A big name on your CV, big clients, less freedom.', { money: 15, mastery: 10, joy: -3 }),
        check('lead', 'Lead a team of juniors', 'empathy', 65, ['You train the next generation, and they’re good.', { mastery: 10, joy: 8, set: ['manager'] }], ['Teaching takes patience you don’t have this year.', { joy: -10 }]),
        result('move', `Move into ${inSentence(next.name)}`, `You take your eye into ${inSentence(next.name)}.`, { money: 5, mastery: 5, set: ['pivoted'] }),
      ],
    },
    {
      id: e('y_show'),
      kind: 'finale',
      stages: ['thirty'],
      conditions: { flagsAll: ['employed'], flagsNone: ['pivoted'] },
      icon: 'star',
      title: 'The Big Show',
      text: 'A runway, a wedding of the year, a magazine shoot: your work in the spotlight.',
      choices: [
        check('lead', 'Make it unforgettable', main, 65, ['People talk about your work for weeks.', { mastery: 15, joy: 10, highlight: 'Your work stole the show' }], ['Good, not unforgettable. The pressure was huge.', { mastery: 10, energy: -15 }], { check: { attribute: main, difficulty: 65, bonus: { has_portfolio: 10, manager: 10 } } }),
        check('flawless', 'Execute flawlessly', 'persistence', 60, ['Not a hair out of place.', { mastery: 10, joy: 5 }], ['One small thing slips. Only you notice.', { mastery: 5 }]),
        result('pass', 'Hand it to someone you trained', 'They shine. You watch, proud.', { energy: 15, joy: -5 }),
      ],
    },
  ];
}

const BUILDERS: Record<FamilyId, (ctx: FamilyContext) => LifeEvent[]> = { creators, trades, health, tech, studio, performing, sport, care, business, food, fashion };

/** The family scenes for a career, or none if it's in no family. */
export function familyEvents(ctx: FamilyContext): LifeEvent[] {
  const family = familyOf(ctx.career.id);
  return family ? BUILDERS[family](ctx) : [];
}
