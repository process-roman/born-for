// The six pilot careers (Pilot Content §2–3).

import type { AttributeId } from './attributes';
import type { PreferenceId, WorkStyleId } from './preferences';

export const CAREER_IDS = [
  'ux_design',
  'software_dev',
  'marketing',
  'teaching',
  'data_analysis',
  'project_coord',
] as const;

export type CareerId = (typeof CAREER_IDS)[number];

export type QuestTier = 'taste' | 'try' | 'test';

/** Star number within a constellation; matches the quest number. Star 5 is the Test "boss" star. */
export type StarNumber = 1 | 2 | 3 | 4 | 5;

export interface Quest {
  star: StarNumber;
  tier: QuestTier;
  name: string;
  instructions: string;
  time: string;
  attributes: readonly [AttributeId, AttributeId];
}

export interface AttributeRequirement {
  attribute: AttributeId;
  required: number;
  weight: number;
}

export interface Constellation {
  name: string;
  /** x, y on a 0–100 grid from top-left, indexed by star number − 1. */
  stars: readonly [number, number][];
  lines: readonly [StarNumber, StarNumber][];
}

export interface RealNextSteps {
  learn: string[];
  community: string[];
  entryRoles: string[];
  searchFor: string[];
}

export interface Career {
  id: CareerId;
  name: string;
  /** Hybrid-title class (Blueprint §6). */
  className: string;
  /** Item overlay for character level 4 (Blueprint §7). Only "stylus" comes from the spec; the rest are placeholders. */
  item: string;
  oneLiner: string;
  dayToDay: string[];
  downsides: string[];
  education: string;
  requirements: readonly AttributeRequirement[];
  interestTags: Partial<Record<PreferenceId, number>>;
  workStyles: readonly WorkStyleId[];
  quests: readonly Quest[];
  constellation: Constellation;
  nextSteps: RealNextSteps;
}

const TIME = { taste: '20 min', try: '1–2 h', test: 'Real world' } as const;

export const CAREERS: Record<CareerId, Career> = {
  ux_design: {
    id: 'ux_design',
    name: 'UX/product design',
    className: 'Shaper',
    item: 'stylus',
    oneLiner: "Design how apps and websites work so they're easy and pleasant to use.",
    dayToDay: [
      'Talking to users and watching them use products to find what confuses them',
      'Sketching layouts and flows, then building screens in tools like Figma',
      'Turning designs into clickable prototypes and testing them',
      'Working with developers and product managers to get designs built',
      'Presenting and defending design decisions to the team',
    ],
    downsides: [
      'Lots of feedback and revisions; your favorite idea often gets changed',
      'Entry-level jobs are competitive; a strong portfolio matters more than credentials',
      'Many meetings and compromises with business and technical constraints',
    ],
    education:
      'No specific degree is required. Many designers come from design, psychology, computer science or human-computer interaction, and others switch through certificates or bootcamps. A portfolio of 2–3 real case studies is the main thing employers look at.',
    requirements: [
      { attribute: 'creativity', required: 70, weight: 0.4 },
      { attribute: 'empathy', required: 60, weight: 0.3 },
      { attribute: 'communication', required: 60, weight: 0.3 },
    ],
    interestTags: { making: 1, tech: 0.5, puzzles: 0.5 },
    workStyles: ['small_team'],
    quests: [
      { star: 1, tier: 'taste', name: 'Fix a frustrating screen', instructions: 'Pick a screen in an app you use that annoys you. Sketch a clearer version on paper.', time: TIME.taste, attributes: ['creativity', 'empathy'] },
      { star: 2, tier: 'taste', name: 'Onboarding detective', instructions: 'Open three apps you like and go through their first-time setup. Write one line per app on what makes it easy.', time: TIME.taste, attributes: ['curiosity', 'empathy'] },
      { star: 3, tier: 'try', name: 'Redesign in Figma', instructions: 'Recreate your sketch from Quest 1 as a clean screen in Figma (free plan).', time: TIME.try, attributes: ['creativity', 'persistence'] },
      { star: 4, tier: 'try', name: 'Make it clickable', instructions: 'Link 2–3 screens into a simple clickable prototype in Figma.', time: TIME.try, attributes: ['organization', 'creativity'] },
      { star: 5, tier: 'test', name: 'Real user test', instructions: 'Ask two people to complete one task on your prototype while thinking out loud. Note where they get stuck.', time: TIME.test, attributes: ['empathy', 'communication'] },
    ],
    constellation: {
      name: 'The Lens',
      stars: [[30, 30], [55, 20], [70, 45], [50, 65], [80, 85]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 1], [3, 5]],
    },
    nextSteps: {
      learn: ['Google UX Design Professional Certificate (Coursera; paid, financial aid available)', "Figma's free learning resources"],
      community: ['ADPList (free mentorship from working designers)', 'r/UXDesign', 'Local UX meetups'],
      entryRoles: ['Junior UX designer', 'UI designer', 'UX research assistant', 'Product design intern'],
      searchFor: ['junior UX designer', 'UX intern', 'entry level UI designer'],
    },
  },

  software_dev: {
    id: 'software_dev',
    name: 'Software development',
    className: 'Codesmith',
    item: 'hammer',
    oneLiner: 'Write the code that makes apps, websites and tools actually work.',
    dayToDay: [
      'Writing and reviewing code',
      'Debugging: figuring out why something breaks',
      'Breaking big features into small technical tasks',
      'Reading documentation and learning new tools constantly',
      'Short team check-ins and code reviews',
    ],
    downsides: [
      'Long stretches of focused screen time, often alone',
      'Debugging can be frustrating for hours before it clicks',
      'The entry-level job market is competitive; projects and practice matter a lot',
    ],
    education:
      "A computer science degree is common but not required. Many developers are self-taught or come from bootcamps. Employers mostly look at projects you've built and how you solve problems in interviews.",
    requirements: [
      { attribute: 'analytical', required: 75, weight: 0.4 },
      { attribute: 'persistence', required: 70, weight: 0.35 },
      { attribute: 'curiosity', required: 60, weight: 0.25 },
    ],
    interestTags: { tech: 1, puzzles: 1, making: 0.5 },
    workStyles: ['solo', 'small_team'],
    quests: [
      { star: 1, tier: 'taste', name: 'Your first page', instructions: 'In a free online editor like CodePen, make a simple HTML page about yourself: a heading, a paragraph and a list.', time: TIME.taste, attributes: ['curiosity', 'analytical'] },
      { star: 2, tier: 'taste', name: 'Puzzle solver', instructions: 'Solve three beginner coding exercises on a free site like freeCodeCamp.', time: TIME.taste, attributes: ['analytical', 'persistence'] },
      { star: 3, tier: 'try', name: 'Build a tiny tool', instructions: 'Follow a beginner tutorial to build a tip calculator or random quote page with HTML, CSS and JavaScript.', time: TIME.try, attributes: ['persistence', 'analytical'] },
      { star: 4, tier: 'try', name: 'Make it yours', instructions: "Add one feature to your tool that the tutorial didn't include.", time: TIME.try, attributes: ['independence', 'creativity'] },
      { star: 5, tier: 'test', name: 'Ship it', instructions: 'Publish your tool online for free (e.g. GitHub Pages or a CodePen link), share it with two people, ask for one improvement and build it.', time: TIME.test, attributes: ['communication', 'persistence'] },
    ],
    constellation: {
      name: 'The Anvil',
      stars: [[20, 40], [80, 40], [65, 55], [35, 55], [50, 85]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 1], [4, 5], [3, 5]],
    },
    nextSteps: {
      learn: ['freeCodeCamp', 'The Odin Project', "Harvard's CS50 (free online)"],
      community: ['GitHub', 'r/learnprogramming', 'Local hackathons and coding meetups'],
      entryRoles: ['Junior developer', 'Web developer', 'QA tester', 'Software developer intern'],
      searchFor: ['junior developer', 'junior web developer', 'QA tester entry level'],
    },
  },

  marketing: {
    id: 'marketing',
    name: 'Marketing',
    className: 'Herald',
    item: 'horn',
    oneLiner: 'Help people discover products and ideas, and get them excited about them.',
    dayToDay: [
      'Writing posts, emails, ads and website copy',
      'Planning campaigns: who to reach, what to say and where',
      'Creating or briefing visuals and videos',
      'Checking results (views, clicks, sign-ups) and adjusting',
      'Working with sales, design and product teams',
    ],
    downsides: [
      "Results are measured constantly, and many ideas don't work",
      "Trends and platforms change fast, so you're always catching up",
      'Deadlines can be tight, especially around launches',
    ],
    education:
      "A degree in marketing, communications or business is common but not always required. Free certifications and a portfolio of real campaigns or social accounts you've grown can open doors.",
    requirements: [
      { attribute: 'communication', required: 75, weight: 0.4 },
      { attribute: 'creativity', required: 65, weight: 0.35 },
      { attribute: 'curiosity', required: 55, weight: 0.25 },
    ],
    interestTags: { leading: 1, making: 0.5, performing: 0.5 },
    workStyles: ['small_team', 'many'],
    quests: [
      { star: 1, tier: 'taste', name: 'Ad breakdown', instructions: "Pick three ads you remember. For each, write who it's for and why it worked on you.", time: TIME.taste, attributes: ['curiosity', 'empathy'] },
      { star: 2, tier: 'taste', name: 'Rewrite the pitch', instructions: 'Pick a local business or app and write three new one-line taglines for it.', time: TIME.taste, attributes: ['creativity', 'communication'] },
      { star: 3, tier: 'try', name: 'Make a post', instructions: "Create one social post (image or short video plus caption) promoting something you like: a book, a café, a friend's project.", time: TIME.try, attributes: ['creativity', 'communication'] },
      { star: 4, tier: 'try', name: 'Mini campaign', instructions: "Plan three posts over one week for the same thing: who it's for, the message and where to post.", time: TIME.try, attributes: ['organization', 'analytical'] },
      { star: 5, tier: 'test', name: 'Go live', instructions: "Publish your post (or share it with a group), check reactions after 48 hours and note what you'd change.", time: TIME.test, attributes: ['communication', 'analytical'] },
    ],
    constellation: {
      name: 'The Horn',
      stars: [[15, 50], [40, 40], [65, 30], [85, 20], [85, 60]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 3]],
    },
    nextSteps: {
      learn: ['HubSpot Academy (free certifications)', 'Google Skillshop (free Google Ads and Analytics training)', 'Meta Blueprint (free courses)'],
      community: ['r/marketing', 'Local marketing meetups', 'Marketing groups on LinkedIn'],
      entryRoles: ['Marketing coordinator', 'Social media coordinator', 'Content marketing assistant', 'Marketing intern'],
      searchFor: ['marketing coordinator', 'social media coordinator', 'marketing intern'],
    },
  },

  teaching: {
    id: 'teaching',
    name: 'Teaching',
    className: 'Mentor',
    item: 'lantern',
    oneLiner: 'Help people learn and grow, whether in a classroom, a tutoring session or a workshop.',
    dayToDay: [
      'Planning lessons and activities',
      'Explaining ideas in different ways until they click',
      'Supporting learners who are struggling or bored',
      'Marking work and giving feedback',
      'Talking with parents, colleagues and administrators (in schools)',
    ],
    downsides: [
      'Emotionally demanding; you\'re "on" for most of the day',
      'Planning and marking often happen outside class hours',
      'Classroom management can be hard, especially early on',
    ],
    education:
      "In most of Canada and the US, teaching in public K–12 schools requires a bachelor's degree, a teacher education program (e.g. a B.Ed. in Canada) and provincial or state certification. Other routes need less: tutoring, ESL teaching (with a TESL/TESOL certificate), corporate training and coaching.",
    requirements: [
      { attribute: 'communication', required: 75, weight: 0.35 },
      { attribute: 'empathy', required: 75, weight: 0.35 },
      { attribute: 'persistence', required: 60, weight: 0.3 },
    ],
    interestTags: { helping: 1, performing: 1, learning: 0.5 },
    workStyles: ['many'],
    quests: [
      { star: 1, tier: 'taste', name: 'Explain it simply', instructions: 'Pick something you know well. Write or record a two-minute explanation a 12-year-old would understand.', time: TIME.taste, attributes: ['communication', 'empathy'] },
      { star: 2, tier: 'taste', name: 'Your best teacher', instructions: "Think of the best teacher or coach you've had. List three things they did that you'd copy.", time: TIME.taste, attributes: ['empathy', 'curiosity'] },
      { star: 3, tier: 'try', name: 'Teach a friend', instructions: 'Teach a friend or family member a small skill in 20–30 minutes: a recipe, a card trick, an app feature.', time: TIME.try, attributes: ['communication', 'empathy'] },
      { star: 4, tier: 'try', name: 'Plan a mini lesson', instructions: 'Write a 30-minute lesson plan: one goal, one activity and one quick check that people learned it.', time: TIME.try, attributes: ['organization', 'creativity'] },
      { star: 5, tier: 'test', name: 'Volunteer session', instructions: 'Run one real session: volunteer tutoring, a library homework club, a coding club or helping a classmate study. Ask for feedback afterwards.', time: TIME.test, attributes: ['persistence', 'communication'] },
    ],
    constellation: {
      name: 'The Lantern',
      stars: [[50, 10], [30, 35], [70, 35], [30, 75], [70, 75]],
      lines: [[1, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5]],
    },
    nextSteps: {
      learn: ['Info sessions from teacher education programs near you', 'TESL/TESOL certificate programs (for language teaching)'],
      community: ['r/Teachers', 'Local tutoring and volunteer programs'],
      entryRoles: ['Tutor', 'Teaching or educational assistant', 'Camp counselor', 'ESL instructor'],
      searchFor: ['tutor', 'educational assistant', 'ESL instructor', 'volunteer tutor'],
    },
  },

  data_analysis: {
    id: 'data_analysis',
    name: 'Data analysis',
    className: 'Oracle',
    item: 'crystal orb',
    oneLiner: 'Find the story hidden in numbers and help people make better decisions.',
    dayToDay: [
      'Collecting and cleaning messy data',
      'Using spreadsheets, SQL or Python to answer questions',
      'Building charts and dashboards',
      "Explaining findings to people who aren't data experts",
      'Checking your work carefully for mistakes',
    ],
    downsides: [
      'A lot of time goes into cleaning data, not discovering insights',
      'Repetitive reporting tasks are common in junior roles',
      'Small mistakes can lead to wrong decisions, so attention to detail is essential',
    ],
    education:
      'Degrees in statistics, economics, math, computer science or business are common. Many analysts switch in with certificates. Strong spreadsheet and SQL skills plus 2–3 portfolio projects are what employers look for.',
    requirements: [
      { attribute: 'analytical', required: 75, weight: 0.45 },
      { attribute: 'curiosity', required: 65, weight: 0.3 },
      { attribute: 'organization', required: 60, weight: 0.25 },
    ],
    interestTags: { puzzles: 1, tech: 0.5, learning: 0.5 },
    workStyles: ['solo', 'small_team'],
    quests: [
      { star: 1, tier: 'taste', name: 'Read the chart', instructions: 'Find a chart on a topic you care about (e.g. on Our World in Data). Write three things it shows and one question it raises.', time: TIME.taste, attributes: ['curiosity', 'analytical'] },
      { star: 2, tier: 'taste', name: 'Your own data', instructions: 'Put your last 20 purchases (or a week of screen time) in a spreadsheet. Sort it and find your top three categories.', time: TIME.taste, attributes: ['analytical', 'organization'] },
      { star: 3, tier: 'try', name: 'Answer a question', instructions: 'Pick a question and a free dataset (e.g. from Kaggle). Use spreadsheet formulas or a pivot table to answer it.', time: TIME.try, attributes: ['analytical', 'persistence'] },
      { star: 4, tier: 'try', name: 'Make the chart', instructions: 'Create two clear charts that answer your question, each with a one-sentence takeaway.', time: TIME.try, attributes: ['communication', 'creativity'] },
      { star: 5, tier: 'test', name: 'Present findings', instructions: 'Present your charts to someone in three minutes and ask what was unclear.', time: TIME.test, attributes: ['communication', 'analytical'] },
    ],
    constellation: {
      name: 'The Eye',
      // Star 5 is the pupil and stays unconnected.
      stars: [[10, 50], [50, 30], [90, 50], [50, 70], [50, 50]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 1]],
    },
    nextSteps: {
      learn: ['Kaggle Learn (free micro-courses)', 'SQLBolt (free interactive SQL)', 'Google Data Analytics Professional Certificate (Coursera; paid, financial aid available)'],
      community: ['Kaggle', 'r/dataanalysis', 'Local data meetups'],
      entryRoles: ['Junior data analyst', 'Reporting analyst', 'Business or operations analyst'],
      searchFor: ['junior data analyst', 'reporting analyst', 'data analyst intern'],
    },
  },

  project_coord: {
    id: 'project_coord',
    name: 'Project coordination',
    className: 'Quartermaster',
    item: 'key ring',
    oneLiner: 'Keep projects on track so the right things happen at the right time.',
    dayToDay: [
      "Tracking tasks, deadlines and who's doing what",
      'Running meetings and writing up next steps',
      'Following up with people when things slip',
      'Spotting risks early and finding workarounds',
      'Keeping everyone informed with updates',
    ],
    downsides: [
      "You're responsible for deadlines you don't fully control",
      'Lots of follow-ups, reminders and meetings',
      "When things go wrong, you're often the one who has to tell people",
    ],
    education:
      "No specific degree is required, though business degrees are common. Experience organizing events, clubs or group projects counts. Entry-level certificates like the Google Project Management Certificate or PMI's CAPM can help.",
    requirements: [
      { attribute: 'organization', required: 75, weight: 0.45 },
      { attribute: 'communication', required: 65, weight: 0.3 },
      { attribute: 'persistence', required: 60, weight: 0.25 },
    ],
    interestTags: { organizing: 1, leading: 0.5, helping: 0.5 },
    workStyles: ['many', 'small_team'],
    quests: [
      { star: 1, tier: 'taste', name: 'Plan your week', instructions: 'List everything due this week on a free board like Trello. Set priorities and deadlines.', time: TIME.taste, attributes: ['organization', 'analytical'] },
      { star: 2, tier: 'taste', name: 'Break it down', instructions: 'Pick a big goal (a trip, a move, a party) and break it into at least 10 tasks in the right order.', time: TIME.taste, attributes: ['organization', 'persistence'] },
      { star: 3, tier: 'try', name: 'Plan an event', instructions: 'Plan a small get-together: date, budget, tasks and who does what, on a shared list or board.', time: TIME.try, attributes: ['organization', 'communication'] },
      { star: 4, tier: 'try', name: 'Risk check', instructions: 'For your plan, list five things that could go wrong and a backup for each.', time: TIME.try, attributes: ['analytical', 'organization'] },
      { star: 5, tier: 'test', name: 'Deliver it', instructions: "Run the event or a group project, then send everyone a short recap: what went well and what you'd change.", time: TIME.test, attributes: ['communication', 'persistence'] },
    ],
    constellation: {
      name: 'The Key',
      stars: [[20, 30], [35, 18], [35, 42], [60, 30], [85, 30]],
      lines: [[1, 2], [1, 3], [2, 4], [3, 4], [4, 5]],
    },
    nextSteps: {
      learn: ['Google Project Management Professional Certificate (Coursera; paid, financial aid available)', "PMI's CAPM certification", 'Free plans of Trello or Asana for practice'],
      community: ['Local PMI chapters', 'r/projectmanagement'],
      entryRoles: ['Project coordinator', 'Project assistant', 'Operations coordinator', 'Administrative coordinator'],
      searchFor: ['project coordinator', 'project assistant', 'operations coordinator'],
    },
  },
};

export function getQuest(careerId: CareerId, star: StarNumber): Quest {
  const quest = CAREERS[careerId].quests.find((q) => q.star === star);
  if (!quest) throw new Error(`No quest ${star} on ${careerId}`);
  return quest;
}
