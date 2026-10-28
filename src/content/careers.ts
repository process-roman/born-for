// The 24 pilot careers across 12 worlds (Pilot Content §1–3). CAREERS.md is generated from this file.
//
// Every career uses the same five-star quest template, and no quest assumes you already work in the
// field: Discover → Day in the life → Beginner version → Make it yours → Real world.

import type { AttributeId } from './attributes';
import type { PreferenceId, WorkStyleId } from './preferences';
import type { WorldId } from './worlds';

export const CAREER_IDS = [
  'ux_design',
  'florist',
  'software_dev',
  'data_analysis',
  'marketing',
  'project_coord',
  'teaching',
  'social_work',
  'nursing',
  'physio',
  'athlete',
  'personal_trainer',
  'vet_nurse',
  'landscape_gardener',
  'electrician',
  'carpenter',
  'chef',
  'event_planner',
  'musician',
  'writer',
  'lab_scientist',
  'env_scientist',
  'firefighter',
  'law',
] as const;

export type CareerId = (typeof CAREER_IDS)[number];

export type QuestTier = 'taste' | 'try' | 'test';

export type QuestStep = 'discover' | 'day' | 'beginner' | 'own' | 'real';

/** Star number within a constellation; matches the quest number. Star 5 is the Test "boss" star. */
export type StarNumber = 1 | 2 | 3 | 4 | 5;

export interface Quest {
  star: StarNumber;
  tier: QuestTier;
  step: QuestStep;
  name: string;
  instructions: string;
  /** "What you'll learn", one line. */
  learn: string;
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
  worlds: readonly WorldId[];
  /** Hybrid-title class (Blueprint §6). */
  className: string;
  /** Item overlay for character level 4 (Blueprint §7). Only "stylus" comes from the spec; the rest are placeholders. */
  item: string;
  oneLiner: string;
  /** Shown on long-shot careers: honest about how narrow the path is, and what's around it. */
  realityCheck?: string;
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

// ---------------------------------------------------------------------------------------------
// Quest template

interface QuestDraft {
  name: string;
  instructions: string;
  learn: string;
  attributes: readonly [AttributeId, AttributeId];
}

const TEMPLATE: readonly { step: QuestStep; tier: QuestTier; time: string }[] = [
  { step: 'discover', tier: 'taste', time: '20 min' },
  { step: 'day', tier: 'taste', time: '20 min' },
  { step: 'beginner', tier: 'try', time: '1–2 h' },
  { step: 'own', tier: 'try', time: '1–2 h' },
  { step: 'real', tier: 'test', time: 'Real world' },
];

/** `role` includes its article: "a florist", "an electrician". */
function dayInTheLife(role: string, attribute: AttributeId): QuestDraft {
  return {
    name: `A day as ${role}`,
    instructions: `Watch a 10-minute "day in the life of ${role}" video or read an interview with one. Write three tasks you'd enjoy and one you wouldn't.`,
    learn: 'What the job really looks like day to day.',
    attributes: ['curiosity', attribute],
  };
}

function questsFor(role: string, dayAttribute: AttributeId, s: { discover: QuestDraft; beginner: QuestDraft; own: QuestDraft; real: QuestDraft }): Quest[] {
  const drafts = [s.discover, dayInTheLife(role, dayAttribute), s.beginner, s.own, s.real];
  return drafts.map((d, i) => ({ ...d, ...TEMPLATE[i]!, star: (i + 1) as StarNumber }));
}

// ---------------------------------------------------------------------------------------------

export const CAREERS: Record<CareerId, Career> = {
  ux_design: {
    id: 'ux_design',
    name: 'UX/product design',
    worlds: ['create', 'tech'],
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
    quests: questsFor('a UX designer', 'empathy', {
      discover: {
        name: 'Spot bad design',
        instructions: 'Learn the three questions of usability: can I find it, do I understand it, can I finish what I came to do? Find one app screen that fails one of them and note which.',
        learn: 'What UX design is really about: making things easy.',
        attributes: ['empathy', 'curiosity'],
      },
      beginner: {
        name: 'Sketch a better screen',
        instructions: 'Follow a free beginner wireframing video, then sketch a clearer version of the screen from your first quest on paper.',
        learn: 'Wireframing: planning a screen before you design it.',
        attributes: ['creativity', 'detail'],
      },
      own: {
        name: 'Make it clickable',
        instructions: "Rebuild your sketch in Figma's free plan and link two screens into a simple prototype.",
        learn: 'Prototyping: turning an idea into something people can try.',
        attributes: ['creativity', 'persistence'],
      },
      real: {
        name: 'Real user test',
        instructions: 'Ask two people to use your prototype while thinking out loud. Note where they get stuck.',
        learn: 'User testing, the most important habit in UX.',
        attributes: ['empathy', 'communication'],
      },
    }),
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

  florist: {
    id: 'florist',
    name: 'Florist',
    worlds: ['create', 'nature'],
    className: 'Bloomweaver',
    item: 'shears',
    oneLiner: "Design flower arrangements that mark people's biggest moments, from birthdays to weddings.",
    dayToDay: [
      'Processing fresh deliveries: cutting, cleaning and conditioning stems',
      'Designing bouquets, arrangements and pieces for events',
      'Talking with customers about the occasion, colors and budget',
      'Caring for stock so flowers last as long as possible',
      'Early mornings at flower markets and busy holiday rushes',
    ],
    downsides: [
      "Early starts and very long days before Valentine's Day and Mother's Day",
      'On your feet all day, with cold water, thorns and heavy buckets',
      'Entry-level pay is modest, and many florists build their own business to earn more',
    ],
    education:
      'No degree required. Many florists learn on the job in a shop; short floristry courses and certificates help, and some go on to open their own studio.',
    requirements: [
      { attribute: 'aesthetic', required: 70, weight: 0.4 },
      { attribute: 'hands_on', required: 65, weight: 0.35 },
      { attribute: 'creativity', required: 60, weight: 0.25 },
    ],
    interestTags: { making: 1, nature: 1, helping: 0.5 },
    workStyles: ['solo', 'small_team'],
    quests: questsFor('a florist', 'aesthetic', {
      discover: {
        name: 'Flowers by season',
        instructions: "Learn why flowers have seasons and what 'conditioning' a stem means. Then visit a market or supermarket and name five flowers on sale and whether they're in season.",
        learn: 'The basics every florist starts with: seasons and keeping flowers fresh.',
        attributes: ['curiosity', 'aesthetic'],
      },
      beginner: {
        name: 'Your first arrangement',
        instructions: 'Buy a small bunch of supermarket flowers and follow a free beginner video to make a hand-tied bouquet or a jar arrangement.',
        learn: 'Basic arranging: shape, balance and the spiral technique.',
        attributes: ['hands_on', 'aesthetic'],
      },
      own: {
        name: 'Design for someone',
        instructions: 'Make a second arrangement for a specific person or occasion, choosing every color and flower on purpose.',
        learn: 'Designing for a brief, the way florists work with customers.',
        attributes: ['creativity', 'aesthetic'],
      },
      real: {
        name: 'Give it away',
        instructions: 'Give your arrangement to someone and watch their reaction, then ask a local florist one question about the job.',
        learn: "How people react to your work, and what the job is like from someone in it.",
        attributes: ['communication', 'courage'],
      },
    }),
    constellation: {
      name: 'The Bouquet',
      stars: [[50, 88], [28, 38], [50, 20], [72, 38], [50, 55]],
      lines: [[1, 5], [5, 2], [5, 3], [5, 4], [2, 3], [3, 4]],
    },
    nextSteps: {
      learn: ['Short floristry courses at local colleges or flower schools', 'Free arranging tutorials from working florists on YouTube'],
      community: ['Local flower shops (many hire seasonal helpers)', 'r/florists'],
      entryRoles: ['Florist assistant', 'Flower shop retail assistant', 'Event flower helper'],
      searchFor: ['florist assistant', 'flower shop assistant', 'floral design assistant'],
    },
  },

  software_dev: {
    id: 'software_dev',
    name: 'Software development',
    worlds: ['tech'],
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
    quests: questsFor('a software developer', 'analytical', {
      discover: {
        name: 'Code is instructions',
        instructions: 'Learn what code is: exact, step-by-step instructions a computer follows. Write the steps to make a sandwich for a robot that takes everything literally, then spot where it would go wrong.',
        learn: 'Thinking like a programmer: breaking things into precise steps.',
        attributes: ['analytical', 'detail'],
      },
      beginner: {
        name: 'Your first page',
        instructions: 'In a free online editor like CodePen, follow a beginner tutorial to make a simple HTML page about yourself: a heading, a paragraph and a list.',
        learn: 'HTML, the building blocks of every website.',
        attributes: ['analytical', 'persistence'],
      },
      own: {
        name: 'Make it do something',
        instructions: "Follow a beginner JavaScript tutorial to add a button to your page, then change it to do something the tutorial didn't.",
        learn: 'JavaScript basics: making a page respond.',
        attributes: ['creativity', 'persistence'],
      },
      real: {
        name: 'Ship it',
        instructions: 'Publish your page for free (a CodePen link or GitHub Pages), share it with two people, ask for one improvement and build it.',
        learn: 'Shipping: putting real work in front of real users.',
        attributes: ['communication', 'persistence'],
      },
    }),
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

  data_analysis: {
    id: 'data_analysis',
    name: 'Data analysis',
    worlds: ['tech', 'business'],
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
      { attribute: 'detail', required: 60, weight: 0.25 },
    ],
    interestTags: { puzzles: 1, tech: 0.5, learning: 0.5 },
    workStyles: ['solo', 'small_team'],
    quests: questsFor('a data analyst', 'detail', {
      discover: {
        name: 'Read the chart',
        instructions: 'Learn the idea behind the job: turning numbers into answers. Find a chart on a topic you care about (e.g. on Our World in Data) and write three things it shows and one question it raises.',
        learn: 'How analysts read data and ask good questions.',
        attributes: ['curiosity', 'analytical'],
      },
      beginner: {
        name: 'Your own data',
        instructions: 'Follow a beginner spreadsheet tutorial on sorting and SUM, then put your last 20 purchases (or a week of screen time) in a sheet and find your top three categories.',
        learn: "Spreadsheets, the analyst's main tool.",
        attributes: ['analytical', 'organization'],
      },
      own: {
        name: 'Make the chart',
        instructions: 'Turn your data into one clear chart with a one-sentence takeaway someone else would understand.',
        learn: 'Data visualization: making numbers easy to see.',
        attributes: ['creativity', 'communication'],
      },
      real: {
        name: 'Present findings',
        instructions: 'Present your chart to someone in three minutes and ask what was unclear.',
        learn: 'Explaining data to people who are not data experts.',
        attributes: ['communication', 'analytical'],
      },
    }),
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

  marketing: {
    id: 'marketing',
    name: 'Marketing',
    worlds: ['business', 'create'],
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
    quests: questsFor('a marketer', 'communication', {
      discover: {
        name: 'Who, what, where, did it work?',
        instructions: "Learn the four questions every marketer asks: who is it for, what's the message, where do they see it, and did it work? Answer them for one ad that got your attention.",
        learn: 'The core of modern marketing in four questions.',
        attributes: ['curiosity', 'analytical'],
      },
      beginner: {
        name: 'Meet the customer',
        instructions: 'Read 10 online reviews of a local café or shop and write a short description of who its customers really are and what they care about.',
        learn: 'Audience research: understanding people before you sell to them.',
        attributes: ['empathy', 'analytical'],
      },
      own: {
        name: 'One post for them',
        instructions: 'Use a free Canva template to make one social post that would speak to those customers.',
        learn: 'Writing and designing a message for a specific audience.',
        attributes: ['creativity', 'communication'],
      },
      real: {
        name: 'Would you click?',
        instructions: "Show your post to two people who fit that audience and ask what they'd do next. Note one thing to change.",
        learn: 'Testing messages with real people, like marketers do every day.',
        attributes: ['communication', 'courage'],
      },
    }),
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

  project_coord: {
    id: 'project_coord',
    name: 'Project coordination',
    worlds: ['business'],
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
      { attribute: 'leadership', required: 55, weight: 0.25 },
    ],
    interestTags: { organizing: 1, leading: 0.5, helping: 0.5 },
    workStyles: ['many', 'small_team'],
    quests: questsFor('a project coordinator', 'organization', {
      discover: {
        name: 'Break it down',
        instructions: 'Learn the basic idea of project management: a big goal becomes small tasks, each with an owner and a deadline. Break a goal of your own (a trip, a party) into 10 tasks in order.',
        learn: 'How every project, big or small, gets planned.',
        attributes: ['organization', 'analytical'],
      },
      beginner: {
        name: 'Plan it on a board',
        instructions: 'Follow a short Trello beginner guide and put your tasks on a free board with due dates and columns for To do, Doing and Done.',
        learn: 'Using a task board, the everyday tool of project work.',
        attributes: ['organization', 'detail'],
      },
      own: {
        name: 'Risk check',
        instructions: 'List five things that could go wrong with your plan and a backup for each.',
        learn: "Risk planning: thinking ahead so surprises don't derail you.",
        attributes: ['analytical', 'calm'],
      },
      real: {
        name: 'Deliver it',
        instructions: "Run your plan for real (the event or group project), then send everyone a short recap: what went well and what you'd change.",
        learn: 'Leading people through a plan and learning from it.',
        attributes: ['leadership', 'communication'],
      },
    }),
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

  teaching: {
    id: 'teaching',
    name: 'Teaching',
    worlds: ['people'],
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
    quests: questsFor('a teacher', 'empathy', {
      discover: {
        name: 'Explain it simply',
        instructions: 'Learn the idea at the heart of teaching: start from what the learner already knows. Write or record a two-minute explanation of something you know well that a 12-year-old would understand.',
        learn: 'Explaining one idea clearly, where all teaching starts.',
        attributes: ['communication', 'empathy'],
      },
      beginner: {
        name: 'Teach a friend',
        instructions: 'Using a simple lesson shape (show it, let them try, check they got it), teach a friend a small skill in 20 minutes: a recipe, a card trick, an app feature.',
        learn: 'A simple lesson structure teachers use every day.',
        attributes: ['communication', 'organization'],
      },
      own: {
        name: 'Plan a mini lesson',
        instructions: 'Write your own 30-minute lesson plan: one goal, one activity and one quick check that people learned it.',
        learn: 'Lesson planning: designing learning on purpose.',
        attributes: ['organization', 'creativity'],
      },
      real: {
        name: 'Volunteer session',
        instructions: 'Run one real session: volunteer tutoring, a library homework club, a coding club or helping a classmate study. Ask for feedback afterwards.',
        learn: 'What teaching feels like with real learners.',
        attributes: ['persistence', 'leadership'],
      },
    }),
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

  social_work: {
    id: 'social_work',
    name: 'Social work',
    worlds: ['people'],
    className: 'Keeper',
    item: 'hearthstone',
    oneLiner: 'Help people and families through hard times and connect them with the support they need.',
    dayToDay: [
      'Meeting people to understand their situation and what they need',
      'Connecting them with housing, health, money or family support',
      'Writing case notes and reports',
      'Working with schools, doctors, courts and community groups',
      'Visiting people in crisis when someone may be at risk',
    ],
    downsides: [
      "Emotionally heavy: you'll see people in very hard situations",
      'Lots of paperwork alongside the people work',
      'Caseloads can be high and progress can feel slow',
    ],
    education:
      "Social workers usually need a bachelor's in social work (BSW), and many roles ask for a master's (MSW), plus registration or licensing where you live. Support worker and community roles are open with less training.",
    requirements: [
      { attribute: 'empathy', required: 80, weight: 0.4 },
      { attribute: 'calm', required: 65, weight: 0.3 },
      { attribute: 'communication', required: 65, weight: 0.3 },
    ],
    interestTags: { helping: 1, organizing: 0.5 },
    workStyles: ['many', 'small_team'],
    quests: questsFor('a social worker', 'empathy', {
      discover: {
        name: 'Map the help',
        instructions: 'Learn what social workers do: help people solve problems by connecting them with the right support. Look up three free services in your area (food, housing, mental health) and write who each one helps.',
        learn: 'How support in your community fits together.',
        attributes: ['curiosity', 'empathy'],
      },
      beginner: {
        name: 'Active listening',
        instructions: "Learn the basics of active listening from a free video (reflect back, ask open questions, don't rush to fix), then practise it in one conversation with a friend.",
        learn: 'Active listening, the core skill of every helping job.',
        attributes: ['empathy', 'communication'],
      },
      own: {
        name: 'Make a help guide',
        instructions: 'Turn your research into a one-page guide a friend could use if they were struggling.',
        learn: 'Making support easy to find, a big part of the job.',
        attributes: ['organization', 'empathy'],
      },
      real: {
        name: 'Volunteer once',
        instructions: 'Volunteer for one shift at a food bank or community center, then write what surprised you.',
        learn: 'What helping work feels like in real life.',
        attributes: ['teamwork', 'calm'],
      },
    }),
    constellation: {
      name: 'The Hearth',
      stars: [[25, 80], [25, 45], [50, 20], [75, 45], [75, 80]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]],
    },
    nextSteps: {
      learn: ['Free mental health first aid or active listening courses', 'Info sessions for BSW programs near you'],
      community: ['Local food banks and community centers', 'r/socialwork'],
      entryRoles: ['Community support worker', 'Youth worker', 'Case aide', 'Residential support worker'],
      searchFor: ['community support worker', 'youth worker', 'case aide'],
    },
  },

  nursing: {
    id: 'nursing',
    name: 'Nursing',
    worlds: ['health', 'people'],
    className: 'Healer',
    item: 'chalice',
    oneLiner: 'Care for patients, keep them safe and help them recover, often when they need it most.',
    dayToDay: [
      "Checking patients' vital signs and how they're feeling",
      'Giving medicines and treatments safely',
      'Talking with patients and their families',
      'Working closely with doctors and the care team',
      'Writing accurate notes on every shift',
    ],
    downsides: [
      'Long shifts, nights and weekends',
      'Physically and emotionally demanding',
      'Mistakes matter, so the pressure is real',
    ],
    education:
      'Registered nurses need a nursing degree or diploma and must pass a licensing exam (the NCLEX in the US and Canada). Practical nurse programs are shorter, and personal support or nursing assistant roles are a common first step.',
    requirements: [
      { attribute: 'empathy', required: 75, weight: 0.35 },
      { attribute: 'calm', required: 70, weight: 0.35 },
      { attribute: 'detail', required: 65, weight: 0.3 },
    ],
    interestTags: { helping: 1, learning: 0.5, active: 0.5 },
    workStyles: ['many'],
    quests: questsFor('a nurse', 'empathy', {
      discover: {
        name: 'Your vital signs',
        instructions: 'Learn the four vital signs nurses check (temperature, pulse, breathing rate, blood pressure). Measure your own resting pulse for one minute and compare it with the normal range.',
        learn: 'The basic checks behind every nursing shift.',
        attributes: ['detail', 'curiosity'],
      },
      beginner: {
        name: 'First aid basics',
        instructions: 'Do a free online first aid introduction (e.g. from the Red Cross) and learn what to do for a burn and for someone who has fainted.',
        learn: 'Basic first aid, and how calm, clear steps help in an emergency.',
        attributes: ['calm', 'detail'],
      },
      own: {
        name: 'A care plan',
        instructions: "Imagine looking after a grandparent with a bad cold for a day. Write a simple care plan: what to check, when, and what would make you call a doctor.",
        learn: 'Care planning: how nurses think ahead for each patient.',
        attributes: ['organization', 'empathy'],
      },
      real: {
        name: 'Ask a nurse',
        instructions: 'Ask a nurse (a family friend, school nurse or hospital volunteer program) about their hardest and best moments, or sign up for a certified first aid class.',
        learn: 'What nursing is really like, from someone who does it.',
        attributes: ['communication', 'courage'],
      },
    }),
    constellation: {
      name: 'The Chalice',
      stars: [[28, 22], [72, 22], [62, 50], [50, 86], [38, 50]],
      lines: [[1, 2], [2, 3], [3, 5], [5, 1], [3, 4]],
    },
    nextSteps: {
      learn: ['Certified first aid and CPR courses (Red Cross, St John Ambulance)', 'Info sessions for nursing and practical nursing programs near you'],
      community: ['Hospital volunteer programs', 'r/StudentNurse'],
      entryRoles: ['Personal support worker', 'Nursing assistant', 'Health care aide', 'Hospital volunteer'],
      searchFor: ['personal support worker', 'nursing assistant', 'health care aide'],
    },
  },

  physio: {
    id: 'physio',
    name: 'Physiotherapy',
    worlds: ['health', 'sport'],
    className: 'Mender',
    item: 'resistance band',
    oneLiner: 'Help people recover from injury and move without pain, from athletes to grandparents.',
    dayToDay: [
      'Assessing how a patient moves and where it hurts',
      'Planning exercise and treatment programs',
      'Hands-on treatment like massage and joint mobilization',
      'Coaching patients to keep up their exercises',
      'Tracking progress and adjusting the plan',
    ],
    downsides: [
      'A long road of study before you can practise',
      "Progress can be slow, and patients don't always do their exercises",
      'Physically demanding on your own body',
    ],
    education:
      "Physiotherapists (physical therapists) need a master's or doctoral degree in physiotherapy and a licence. Physio assistant roles need a shorter college program and are a good way in.",
    requirements: [
      { attribute: 'analytical', required: 70, weight: 0.35 },
      { attribute: 'hands_on', required: 65, weight: 0.35 },
      { attribute: 'empathy', required: 65, weight: 0.3 },
    ],
    interestTags: { helping: 1, active: 1, learning: 0.5 },
    workStyles: ['small_team'],
    quests: questsFor('a physiotherapist', 'empathy', {
      discover: {
        name: 'How muscles move you',
        instructions: 'Watch a free intro video on how muscles and joints work together. Then do five slow squats and name the main muscles working.',
        learn: 'Basic movement anatomy, the foundation of physio.',
        attributes: ['curiosity', 'physical'],
      },
      beginner: {
        name: 'Watch a movement',
        instructions: 'Film a friend (with permission) doing a squat or lunge and compare it with a guide on good form. Note one thing they could improve.',
        learn: 'Movement assessment: how physios spot problems.',
        attributes: ['analytical', 'detail'],
      },
      own: {
        name: 'Design a stretch routine',
        instructions: 'Make a 10-minute stretching routine for someone who sits all day, with why each stretch helps.',
        learn: 'Building an exercise program for one specific person.',
        attributes: ['creativity', 'empathy'],
      },
      real: {
        name: 'Coach it',
        instructions: 'Teach your routine to one person and check in after a week, or ask a physio one question about their work.',
        learn: 'Coaching patients, the part that makes treatment work.',
        attributes: ['communication', 'persistence'],
      },
    }),
    constellation: {
      name: 'The Spine',
      stars: [[50, 10], [44, 30], [53, 50], [45, 70], [50, 90]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5]],
    },
    nextSteps: {
      learn: ['Free intro anatomy courses (e.g. on Coursera or Khan Academy)', 'Info sessions for kinesiology and physiotherapy programs'],
      community: ['Sports clubs that need volunteer first aiders', 'r/physicaltherapy'],
      entryRoles: ['Physiotherapy assistant', 'Rehabilitation assistant', 'Clinic receptionist at a physio practice'],
      searchFor: ['physiotherapy assistant', 'rehab assistant', 'kinesiology student job'],
    },
  },

  athlete: {
    id: 'athlete',
    name: 'Professional athlete',
    worlds: ['sport'],
    className: 'Contender',
    item: 'laurel',
    oneLiner: 'Compete at the highest level in your sport and build a life around performance.',
    realityCheck:
      'Very few people become professional athletes, and careers are often short. This path keeps the dream open and also shows the careers around it: coaching, personal training, physiotherapy, sports analysis and PE teaching.',
    dayToDay: [
      'Training most days: skills, strength and conditioning',
      'Studying video of your own games and your opponents',
      'Recovery: sleep, nutrition and physio',
      'Matches, travel and media',
      'Working with coaches on a long-term plan',
    ],
    downsides: [
      'Very few reach pro level, and injuries can end careers early',
      'Little time for anything else, often from a young age',
      'Income is uncertain outside the top leagues',
    ],
    education:
      "There's no degree route. Players usually come through club academies, school or college teams and scholarships. Most athletes study something alongside, because careers are short.",
    requirements: [
      { attribute: 'physical', required: 85, weight: 0.4 },
      { attribute: 'persistence', required: 80, weight: 0.35 },
      { attribute: 'calm', required: 65, weight: 0.25 },
    ],
    interestTags: { active: 1, performing: 0.5 },
    workStyles: ['small_team', 'many'],
    quests: questsFor('a pro athlete', 'persistence', {
      discover: {
        name: 'Watch like a coach',
        instructions: 'Learn the three things coaches watch: positioning, decisions and effort without the ball. Watch 20 minutes of a match in your sport and note one example of each.',
        learn: 'Reading the game, the skill that separates good from great.',
        attributes: ['analytical', 'curiosity'],
      },
      beginner: {
        name: 'Train one skill',
        instructions: 'Pick one skill in your sport and practise it three times this week with a free drill video. Track your numbers (e.g. passes in a row).',
        learn: 'Deliberate practice: how athletes actually improve.',
        attributes: ['physical', 'persistence'],
      },
      own: {
        name: 'Your training week',
        instructions: 'Plan a balanced week of skill work, fitness, rest and sleep, then follow it for seven days.',
        learn: 'Training load and recovery, the side most people skip.',
        attributes: ['organization', 'physical'],
      },
      real: {
        name: 'Join a session',
        instructions: 'Join a local club training session or trial, and ask the coach what it takes to move up a level.',
        learn: 'Where you stand, and the real next step in your sport.',
        attributes: ['courage', 'teamwork'],
      },
    }),
    constellation: {
      name: 'The Laurel',
      stars: [[18, 72], [24, 42], [45, 20], [70, 28], [82, 60]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5]],
    },
    nextSteps: {
      learn: ["Your national sport federation's player pathway pages", 'Free sports science intros (e.g. on Coursera)'],
      community: ['Local clubs and community leagues', 'School and college teams'],
      entryRoles: ['Academy or club player', 'Assistant coach', 'Sports camp leader', 'Referee'],
      searchFor: ['club trials near me', 'youth assistant coach', 'sports camp counselor'],
    },
  },

  personal_trainer: {
    id: 'personal_trainer',
    name: 'Personal trainer',
    worlds: ['sport', 'health'],
    className: 'Drillmaster',
    item: 'kettlebell',
    oneLiner: 'Help people get fitter, stronger and more confident with training that fits their lives.',
    dayToDay: [
      'Running one-to-one and group sessions',
      "Assessing clients' fitness and goals",
      'Writing training plans and adjusting them',
      'Keeping clients motivated between sessions',
      'Promoting yourself to find new clients',
    ],
    downsides: [
      'Early mornings and evenings, when clients are free',
      'Income depends on how many clients you keep',
      'On your feet and "on" all day',
    ],
    education:
      'No degree needed. Trainers get certified through programs like ACE or NASM (US) or CSEP (Canada); a kinesiology degree opens more doors.',
    requirements: [
      { attribute: 'physical', required: 70, weight: 0.35 },
      { attribute: 'communication', required: 65, weight: 0.35 },
      { attribute: 'leadership', required: 60, weight: 0.3 },
    ],
    interestTags: { active: 1, helping: 1, leading: 0.5 },
    workStyles: ['solo', 'small_team'],
    quests: questsFor('a personal trainer', 'communication', {
      discover: {
        name: 'The FITT idea',
        instructions: 'Learn FITT (frequency, intensity, time, type), the simple framework trainers use for any plan. Describe your own current week of activity with it.',
        learn: 'How trainers think about any workout plan.',
        attributes: ['analytical', 'physical'],
      },
      beginner: {
        name: 'A beginner workout',
        instructions: 'Using a free beginner program as a guide, write a 30-minute bodyweight workout with a warm-up and cool-down, then do it yourself.',
        learn: 'Building a safe, balanced session.',
        attributes: ['organization', 'physical'],
      },
      own: {
        name: 'Make it fit someone',
        instructions: "Adapt your workout for a friend's goal (more energy, a first 5k, getting stronger) and explain each change.",
        learn: 'Personalizing training, the heart of the job.',
        attributes: ['empathy', 'creativity'],
      },
      real: {
        name: 'Train a friend',
        instructions: 'Run your session with one friend, cue their form, and ask how it felt.',
        learn: 'Coaching a real person through a workout.',
        attributes: ['leadership', 'communication'],
      },
    }),
    constellation: {
      name: 'The Kettlebell',
      stars: [[35, 32], [50, 15], [65, 32], [76, 68], [24, 68]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]],
    },
    nextSteps: {
      learn: ['ACE, NASM or CSEP certification guides', 'Free exercise science intros on Coursera'],
      community: ['Local gyms and community fitness classes', 'r/personaltraining'],
      entryRoles: ['Gym floor staff', 'Fitness instructor', 'Junior personal trainer', 'Recreation assistant'],
      searchFor: ['gym floor staff', 'fitness instructor', 'junior personal trainer'],
    },
  },

  vet_nurse: {
    id: 'vet_nurse',
    name: 'Vet nurse',
    worlds: ['nature', 'health'],
    className: 'Beastwarden',
    item: 'collar',
    oneLiner: 'Care for sick and injured animals and support vets in treatment, surgery and recovery.',
    dayToDay: [
      'Preparing animals for surgery and monitoring them under anesthetic',
      'Giving medicines and changing dressings',
      'Taking samples and running lab tests',
      'Comforting worried owners',
      'Cleaning, feeding and caring for animals in the clinic',
    ],
    downsides: [
      "You'll see animals in pain, and euthanasia is part of the job",
      'Physically demanding, with bites and scratches',
      'Pay is modest for the skill involved',
    ],
    education:
      'Veterinary technicians usually complete a 2–3 year veterinary technology program and pass a credential exam (the VTNE in the US and Canada). Kennel and vet assistant jobs need less training.',
    requirements: [
      { attribute: 'empathy', required: 70, weight: 0.35 },
      { attribute: 'calm', required: 70, weight: 0.35 },
      { attribute: 'hands_on', required: 60, weight: 0.3 },
    ],
    interestTags: { nature: 1, helping: 1 },
    workStyles: ['small_team'],
    quests: questsFor('a vet nurse', 'empathy', {
      discover: {
        name: 'Read an animal',
        instructions: 'Learn the signs an animal is stressed or in pain (posture, ears, tail, breathing). Watch a pet, or an animal video, and note three signals.',
        learn: 'Reading animal behavior, a daily skill in vet care.',
        attributes: ['empathy', 'detail'],
      },
      beginner: {
        name: 'A care routine',
        instructions: "Using a trusted pet care guide, write the daily care routine for one animal you know: food, water, exercise and warning signs.",
        learn: 'Everyday animal care, and what normal looks like.',
        attributes: ['organization', 'detail'],
      },
      own: {
        name: 'Take over for a weekend',
        instructions: "Look after a pet for a weekend (yours, a friend's or a neighbor's), following your routine.",
        learn: "Hands-on responsibility for an animal's wellbeing.",
        attributes: ['hands_on', 'persistence'],
      },
      real: {
        name: 'Shelter shift',
        instructions: 'Volunteer for a shift at an animal shelter, or ask a vet tech one question about their hardest day.',
        learn: 'What working with animals is really like.',
        attributes: ['calm', 'teamwork'],
      },
    }),
    constellation: {
      name: 'The Paw',
      stars: [[22, 40], [40, 22], [60, 22], [78, 40], [50, 70]],
      lines: [[1, 5], [2, 5], [3, 5], [4, 5]],
    },
    nextSteps: {
      learn: ['Info sessions for veterinary technology programs', 'Free animal care courses (e.g. on FutureLearn)'],
      community: ['Local animal shelters and rescues', 'r/VetTech'],
      entryRoles: ['Kennel attendant', 'Veterinary assistant', 'Animal shelter worker', 'Pet groomer assistant'],
      searchFor: ['kennel attendant', 'veterinary assistant', 'animal shelter volunteer'],
    },
  },

  landscape_gardener: {
    id: 'landscape_gardener',
    name: 'Landscape gardener',
    worlds: ['nature', 'build'],
    className: 'Druid',
    item: 'trowel',
    oneLiner: 'Design, build and care for gardens and green spaces people love to spend time in.',
    dayToDay: [
      'Planting, pruning and caring for gardens',
      'Building paths, walls and raised beds',
      'Reading designs and measuring spaces',
      'Choosing plants that suit the soil and light',
      'Working outside in every season',
    ],
    downsides: [
      'Outdoor work in heat, cold and rain',
      'Hard on your back and knees',
      'Work can be seasonal in colder places',
    ],
    education:
      'No degree needed. Many start as a laborer or apprentice; horticulture certificates and landscape design courses help you move up or start your own business.',
    requirements: [
      { attribute: 'hands_on', required: 70, weight: 0.35 },
      { attribute: 'aesthetic', required: 60, weight: 0.35 },
      { attribute: 'physical', required: 65, weight: 0.3 },
    ],
    interestTags: { nature: 1, building: 1, making: 0.5 },
    workStyles: ['solo', 'small_team'],
    quests: questsFor('a landscape gardener', 'physical', {
      discover: {
        name: 'Right plant, right place',
        instructions: 'Learn the golden rule of gardening: match plants to light, soil and water. Pick three plants near you and work out what conditions each needs.',
        learn: 'The thinking behind every garden.',
        attributes: ['curiosity', 'analytical'],
      },
      beginner: {
        name: 'Grow something',
        instructions: 'Plant seeds or a cutting in a pot following a beginner guide, and look after it for two weeks.',
        learn: 'Planting and plant care basics.',
        attributes: ['hands_on', 'persistence'],
      },
      own: {
        name: 'Design a small space',
        instructions: 'Sketch a plan for a balcony, yard corner or window box: what goes where, and why.',
        learn: 'Simple garden design: layout, color and seasons.',
        attributes: ['aesthetic', 'creativity'],
      },
      real: {
        name: 'Get your hands dirty',
        instructions: 'Help at a community garden or a volunteer planting day, and ask a gardener what the job is really like.',
        learn: 'Real outdoor work, alongside people who do it.',
        attributes: ['physical', 'teamwork'],
      },
    }),
    constellation: {
      name: 'The Oak',
      stars: [[50, 90], [50, 58], [24, 36], [50, 14], [76, 36]],
      lines: [[1, 2], [2, 3], [2, 4], [2, 5], [3, 4], [4, 5]],
    },
    nextSteps: {
      learn: ['Horticulture certificates at local colleges', 'Free plant and garden courses from botanical gardens'],
      community: ['Community gardens', 'r/landscaping'],
      entryRoles: ['Landscape laborer', 'Garden center assistant', 'Grounds maintenance worker', 'Apprentice landscaper'],
      searchFor: ['landscape laborer', 'grounds maintenance', 'garden center assistant'],
    },
  },

  electrician: {
    id: 'electrician',
    name: 'Electrician',
    worlds: ['build'],
    className: 'Sparkwright',
    item: 'voltage tester',
    oneLiner: 'Install, fix and keep safe the electrical systems that power homes, schools and businesses.',
    dayToDay: [
      'Installing wiring, lights, outlets and panels',
      'Finding and fixing faults',
      'Reading plans and following electrical codes',
      'Testing systems for safety',
      'Working on job sites with other trades',
    ],
    downsides: [
      'Working in attics, crawl spaces and on ladders',
      'Safety rules are strict for a reason: mistakes can be dangerous',
      'Early starts and travel between job sites',
    ],
    education:
      'Electricians train through an apprenticeship (usually 4–5 years) that combines paid work with classes, then get licensed (e.g. Red Seal in Canada, state licensing in the US). No university degree needed.',
    requirements: [
      { attribute: 'hands_on', required: 70, weight: 0.35 },
      { attribute: 'analytical', required: 65, weight: 0.35 },
      { attribute: 'detail', required: 65, weight: 0.3 },
    ],
    interestTags: { building: 1, puzzles: 0.5, tech: 0.5 },
    workStyles: ['solo', 'small_team'],
    quests: questsFor('an electrician', 'hands_on', {
      discover: {
        name: 'Follow the power',
        instructions: "Learn how electricity gets from the street to your outlets: service line, meter, panel, circuits. Find your home's electrical panel (look, don't open it) and read its labels.",
        learn: "How a building's electrical system fits together.",
        attributes: ['curiosity', 'analytical'],
      },
      beginner: {
        name: 'Light a bulb',
        instructions: 'With a cheap beginner kit (battery, wires and a small bulb or LED), build a simple circuit following its guide. Battery power only: never touch household wiring.',
        learn: 'Circuits, the basic idea behind every installation.',
        attributes: ['hands_on', 'analytical'],
      },
      own: {
        name: 'Add a switch',
        instructions: 'Extend your battery circuit with a switch or a second bulb, and draw a simple diagram of it.',
        learn: 'Series and parallel circuits, and reading diagrams.',
        attributes: ['detail', 'persistence'],
      },
      real: {
        name: 'Ask an electrician',
        instructions: 'Ask an electrician, or visit a trades college open day, and find out what an apprenticeship is really like and how to get one.',
        learn: 'The real route into the trade.',
        attributes: ['communication', 'courage'],
      },
    }),
    constellation: {
      name: 'The Bolt',
      stars: [[62, 10], [38, 46], [60, 50], [40, 90], [78, 22]],
      lines: [[5, 1], [1, 2], [2, 3], [3, 4]],
    },
    nextSteps: {
      learn: ['Pre-apprenticeship electrical programs at trade colleges', 'Free basic electronics courses (battery and low-voltage only)'],
      community: ['Local trades college open days', 'r/electricians'],
      entryRoles: ['Electrical apprentice', 'Electrician helper', 'Construction laborer'],
      searchFor: ['electrical apprentice', 'electrician helper', 'pre-apprenticeship electrical'],
    },
  },

  carpenter: {
    id: 'carpenter',
    name: 'Carpenter',
    worlds: ['build', 'create'],
    className: 'Artisan',
    item: 'chisel',
    oneLiner: 'Build and repair the wooden structures around us, from house frames to custom furniture.',
    dayToDay: [
      'Measuring, cutting and shaping wood',
      'Framing walls, floors and roofs',
      'Installing doors, windows, stairs and cabinets',
      'Reading drawings and building to code',
      'Working with other trades on site',
    ],
    downsides: [
      'Physically demanding, and outdoors on many jobs',
      'Noise, dust and sharp tools mean safety gear every day',
      'Work can depend on the building season',
    ],
    education:
      'Carpenters train through an apprenticeship (usually about 4 years) with paid work and classes, leading to certification (e.g. Red Seal in Canada). Furniture makers often learn in workshops and design programs.',
    requirements: [
      { attribute: 'hands_on', required: 75, weight: 0.4 },
      { attribute: 'detail', required: 65, weight: 0.3 },
      { attribute: 'physical', required: 60, weight: 0.3 },
    ],
    interestTags: { building: 1, making: 1 },
    workStyles: ['solo', 'small_team'],
    quests: questsFor('a carpenter', 'hands_on', {
      discover: {
        name: 'Measure twice',
        instructions: "Learn why carpenters say 'measure twice, cut once', and how to read a tape measure to 1 mm or 1/16 inch. Measure three pieces of furniture and sketch one with its dimensions.",
        learn: 'Measuring and reading dimensions, the first skill on any site.',
        attributes: ['detail', 'analytical'],
      },
      beginner: {
        name: 'First build',
        instructions: "Build a simple box or shelf from a beginner plan, with an experienced adult nearby if you're new to tools. Many hardware stores run free workshops.",
        learn: 'Basic tool use, cutting and joining.',
        attributes: ['hands_on', 'persistence'],
      },
      own: {
        name: 'Make it yours',
        instructions: 'Improve or customize your build: a better finish, a lid, or a new size you designed yourself.',
        learn: 'Planning your own design.',
        attributes: ['creativity', 'detail'],
      },
      real: {
        name: 'On the job',
        instructions: 'Help with a real build or repair (Habitat for Humanity or a family project), or ask a carpenter one question about the trade.',
        learn: 'Working on a real project alongside others.',
        attributes: ['teamwork', 'physical'],
      },
    }),
    constellation: {
      name: 'The Square',
      stars: [[25, 15], [25, 50], [25, 85], [58, 85], [90, 85]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5]],
    },
    nextSteps: {
      learn: ['Pre-apprenticeship carpentry programs at trade colleges', 'Free hardware store workshops'],
      community: ['Habitat for Humanity build days', 'r/Carpentry', 'r/woodworking'],
      entryRoles: ['Carpentry apprentice', 'Construction laborer', 'Cabinet shop helper'],
      searchFor: ['carpentry apprentice', 'construction laborer', 'cabinet maker helper'],
    },
  },

  chef: {
    id: 'chef',
    name: 'Chef',
    worlds: ['food', 'create'],
    className: 'Hearthmaster',
    item: "chef's knife",
    oneLiner: 'Cook food people remember, in kitchens that run on teamwork, timing and heat.',
    dayToDay: [
      'Prepping ingredients before service',
      'Cooking dishes to a standard, fast',
      'Tasting and adjusting',
      'Keeping the kitchen clean and food safe',
      'Working as a team under pressure at peak times',
    ],
    downsides: [
      'Evenings, weekends and holidays are the busiest shifts',
      'Hot, fast and physically tiring',
      'Entry-level pay is low while you build skills',
    ],
    education:
      'Culinary school is optional. Many chefs start as a prep or line cook and learn on the job; apprenticeships and certifications (e.g. Red Seal Cook in Canada) help you move up.',
    requirements: [
      { attribute: 'hands_on', required: 70, weight: 0.35 },
      { attribute: 'calm', required: 70, weight: 0.35 },
      { attribute: 'creativity', required: 60, weight: 0.3 },
    ],
    interestTags: { food: 1, making: 1 },
    workStyles: ['small_team', 'many'],
    quests: questsFor('a chef', 'calm', {
      discover: {
        name: 'Mise en place',
        instructions: "Learn 'mise en place' (everything in its place): prepping and organizing before you cook. Cook one simple meal with every ingredient measured and laid out first.",
        learn: 'How professional kitchens stay calm and fast.',
        attributes: ['organization', 'hands_on'],
      },
      beginner: {
        name: 'Knife skills',
        instructions: 'Follow a free beginner knife skills video and practise dicing an onion and slicing a carrot safely.',
        learn: 'Basic knife skills, the foundation of kitchen work.',
        attributes: ['hands_on', 'detail'],
      },
      own: {
        name: 'Your own dish',
        instructions: 'Take a basic recipe and make it your own: change one flavor and plate it like a restaurant would.',
        learn: 'Developing a dish: taste, balance and presentation.',
        attributes: ['creativity', 'aesthetic'],
      },
      real: {
        name: 'Cook for others',
        instructions: 'Cook your dish for four people and ask for honest feedback, or ask a cook what a real dinner service feels like.',
        learn: 'Cooking for real people under time pressure.',
        attributes: ['calm', 'communication'],
      },
    }),
    constellation: {
      name: 'The Flame',
      stars: [[50, 12], [30, 50], [40, 86], [60, 86], [70, 50]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]],
    },
    nextSteps: {
      learn: ['Culinary or cook apprenticeship programs', 'Food handler certification (required in many places)'],
      community: ['Community kitchens and food banks', 'r/KitchenConfidential'],
      entryRoles: ['Prep cook', 'Line cook', 'Kitchen assistant', 'Dishwasher (a common first step)'],
      searchFor: ['prep cook', 'line cook', 'kitchen assistant'],
    },
  },

  event_planner: {
    id: 'event_planner',
    name: 'Event planner',
    worlds: ['food', 'business'],
    className: 'Steward',
    item: 'clipboard',
    oneLiner: 'Make weddings, festivals and conferences happen, from the first idea to the last guest home.',
    dayToDay: [
      'Meeting clients to understand their vision and budget',
      'Finding venues, caterers and suppliers',
      'Building timelines and budgets',
      'Coordinating everyone on the day',
      'Solving problems when things go wrong',
    ],
    downsides: [
      'Long days and weekend work around events',
      "High pressure: there's no second chance on the day",
      'Lots of negotiating and phone calls',
    ],
    education:
      'No degree required, though event management or hospitality diplomas are common. Many planners start as assistants, coordinators or volunteers at events.',
    requirements: [
      { attribute: 'organization', required: 75, weight: 0.4 },
      { attribute: 'communication', required: 65, weight: 0.3 },
      { attribute: 'calm', required: 60, weight: 0.3 },
    ],
    interestTags: { organizing: 1, leading: 0.5, food: 0.5 },
    workStyles: ['many'],
    quests: questsFor('an event planner', 'organization', {
      discover: {
        name: 'Run of show',
        instructions: "Learn what a 'run of show' is: the minute-by-minute plan for an event. Write one for a birthday or party you've been to.",
        learn: 'The core planning document every event uses.',
        attributes: ['organization', 'detail'],
      },
      beginner: {
        name: 'Plan a small event',
        instructions: 'Use a free event planning template to plan a get-together for 6–10 people: date, budget, guest list, food and a timeline.',
        learn: 'Budgets and timelines for an event.',
        attributes: ['organization', 'analytical'],
      },
      own: {
        name: 'Plan B',
        instructions: 'List five things that could go wrong with your event and a backup for each.',
        learn: 'Contingency planning, what keeps planners calm on the day.',
        attributes: ['calm', 'analytical'],
      },
      real: {
        name: 'Host it',
        instructions: 'Run your event, then send a short thank-you and ask guests for one thing to improve.',
        learn: 'Running an event live and learning from feedback.',
        attributes: ['leadership', 'communication'],
      },
    }),
    constellation: {
      name: 'The Banner',
      stars: [[20, 20], [80, 20], [80, 62], [50, 46], [20, 62]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]],
    },
    nextSteps: {
      learn: ['Event management certificates at local colleges', 'Free event planning courses (e.g. on Coursera)'],
      community: ['Volunteer teams at local festivals and charity events', 'r/eventplanning'],
      entryRoles: ['Event assistant', 'Event coordinator', 'Banquet server', 'Festival volunteer'],
      searchFor: ['event assistant', 'event coordinator', 'banquet staff'],
    },
  },

  musician: {
    id: 'musician',
    name: 'Musician',
    worlds: ['arts'],
    className: 'Bard',
    item: 'lyre',
    oneLiner: 'Write, play and perform music, on stage, in the studio or online.',
    realityCheck:
      'Making a full-time living from performing is hard, and most musicians combine playing with teaching, session work, production or other jobs.',
    dayToDay: [
      'Practising every day',
      'Writing and arranging songs',
      'Rehearsing with other musicians',
      'Performing at gigs, events or online',
      'Promoting your music and managing bookings',
    ],
    downsides: [
      'Income is uneven, especially early on',
      'Late nights and lots of travel for gigs',
      'Competitive, and success often takes years',
    ],
    education:
      'No degree required. Many musicians take lessons and build skills through practice and performing; music college or a degree helps for teaching, theory and studio work.',
    requirements: [
      { attribute: 'creativity', required: 75, weight: 0.35 },
      { attribute: 'persistence', required: 75, weight: 0.35 },
      { attribute: 'aesthetic', required: 65, weight: 0.3 },
    ],
    interestTags: { performing: 1, making: 1 },
    workStyles: ['solo', 'small_team'],
    quests: questsFor('a musician', 'persistence', {
      discover: {
        name: 'Hear the parts',
        instructions: 'Learn the building blocks of a song: melody, harmony, rhythm and structure (verse, chorus, bridge). Listen to a favorite song and map its structure.',
        learn: 'How songs are built, the basis of writing and playing.',
        attributes: ['curiosity', 'aesthetic'],
      },
      beginner: {
        name: 'Learn one riff',
        instructions: 'Learn a simple riff, chord progression or beat with a free beginner tutorial: any instrument, your voice, or a free app like BandLab.',
        learn: 'How to practise: slow, repeat, then build up speed.',
        attributes: ['persistence', 'hands_on'],
      },
      own: {
        name: 'Make it yours',
        instructions: 'Turn your riff into something of your own, or write four lines of a song over it, and record it on your phone.',
        learn: 'Writing and recording your first idea.',
        attributes: ['creativity', 'courage'],
      },
      real: {
        name: 'Play for someone',
        instructions: 'Play your piece for two people or post it online, and ask what they felt.',
        learn: 'Performing, and how listeners react.',
        attributes: ['courage', 'communication'],
      },
    }),
    constellation: {
      name: 'The Lyre',
      stars: [[28, 18], [72, 18], [76, 60], [50, 86], [24, 60]],
      lines: [[1, 2], [1, 5], [5, 4], [4, 3], [3, 2]],
    },
    nextSteps: {
      learn: ['Free music theory lessons (e.g. musictheory.net)', 'Local music schools and community music programs'],
      community: ['Open mic nights', 'Local bands and choirs', 'r/WeAreTheMusicMakers'],
      entryRoles: ['Session or event musician', 'Music teacher assistant', 'Busker', 'Studio assistant'],
      searchFor: ['open mic near me', 'music teacher assistant', 'recording studio intern'],
    },
  },

  writer: {
    id: 'writer',
    name: 'Writer',
    worlds: ['arts'],
    className: 'Scribe',
    item: 'quill',
    oneLiner: 'Tell stories and explain ideas in words, for books, websites, brands, news or games.',
    dayToDay: [
      'Researching topics and interviewing people',
      'Drafting, editing and rewriting',
      'Working to briefs and deadlines',
      'Pitching ideas to editors or clients',
      'Adapting your voice for different audiences',
    ],
    downsides: [
      'Lots of rejection, especially at the start',
      'Income can be irregular for freelancers',
      'Long solo hours at a desk',
    ],
    education:
      'No specific degree required. English, journalism or communications degrees are common; a portfolio of published writing (even a blog) matters most.',
    requirements: [
      { attribute: 'creativity', required: 70, weight: 0.35 },
      { attribute: 'communication', required: 70, weight: 0.35 },
      { attribute: 'independence', required: 60, weight: 0.3 },
    ],
    interestTags: { making: 1, learning: 1 },
    workStyles: ['solo'],
    quests: questsFor('a writer', 'persistence', {
      discover: {
        name: 'Hook, story, point',
        instructions: 'Learn the shape most good writing follows: a hook to grab you, a story or example, and a clear point. Find all three in one article you enjoyed.',
        learn: 'The structure behind writing people actually read.',
        attributes: ['curiosity', 'analytical'],
      },
      beginner: {
        name: 'Write 300 words',
        instructions: 'Write a 300-word piece about something you know well, using hook, story, point.',
        learn: 'Drafting with a clear structure.',
        attributes: ['creativity', 'independence'],
      },
      own: {
        name: 'Edit it hard',
        instructions: 'Cut your piece to 200 words without losing the point, then read it aloud and fix anything awkward.',
        learn: 'Editing, where most of the writing really happens.',
        attributes: ['detail', 'persistence'],
      },
      real: {
        name: 'Publish it',
        instructions: 'Share it with two readers or post it online, and ask what stuck with them.',
        learn: 'Writing for real readers and taking feedback.',
        attributes: ['courage', 'communication'],
      },
    }),
    constellation: {
      name: 'The Quill',
      stars: [[78, 10], [62, 26], [56, 46], [40, 68], [26, 90]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5]],
    },
    nextSteps: {
      learn: ['Free writing courses (e.g. on Coursera or OpenLearn)', 'Your local library\'s writing workshops'],
      community: ['Local writing groups', 'School or community newspapers', 'r/writing'],
      entryRoles: ['Content writer', 'Copywriting assistant', 'Editorial assistant', 'Student journalist'],
      searchFor: ['junior content writer', 'editorial assistant', 'copywriter intern'],
    },
  },

  lab_scientist: {
    id: 'lab_scientist',
    name: 'Lab scientist',
    worlds: ['science'],
    className: 'Alchemist',
    item: 'flask',
    oneLiner: 'Run the experiments and tests behind new medicines, safer food and scientific discoveries.',
    dayToDay: [
      'Preparing samples and running tests',
      'Following exact procedures and safety rules',
      'Recording results carefully',
      'Analyzing data and spotting odd results',
      'Keeping equipment clean and calibrated',
    ],
    downsides: [
      'Repetitive procedures and long waits for results',
      'Precision matters: small mistakes mean starting over',
      'Research jobs can depend on short-term funding',
    ],
    education:
      "Lab technicians usually have a college diploma or bachelor's in a science like biology or chemistry. Research scientists typically go on to a master's or PhD.",
    requirements: [
      { attribute: 'analytical', required: 75, weight: 0.35 },
      { attribute: 'detail', required: 75, weight: 0.35 },
      { attribute: 'curiosity', required: 65, weight: 0.3 },
    ],
    interestTags: { learning: 1, puzzles: 1 },
    workStyles: ['solo', 'small_team'],
    quests: questsFor('a lab scientist', 'detail', {
      discover: {
        name: 'A fair test',
        instructions: "Learn what makes a 'fair test': change one thing, keep everything else the same, measure the result. Find a science news story and decide whether its test was fair.",
        learn: 'The scientific method, in one idea.',
        attributes: ['analytical', 'curiosity'],
      },
      beginner: {
        name: 'Kitchen experiment',
        instructions: 'Follow a safe kitchen experiment guide (e.g. which liquid dissolves sugar fastest) and record your method and results in a table.',
        learn: 'Running and recording an experiment properly.',
        attributes: ['detail', 'analytical'],
      },
      own: {
        name: 'Change one thing',
        instructions: 'Design your own follow-up: change one variable, predict what will happen, then test it.',
        learn: 'Forming a hypothesis and testing it.',
        attributes: ['curiosity', 'persistence'],
      },
      real: {
        name: 'Share your results',
        instructions: 'Explain your results to someone in three minutes, or ask a scientist one question at a university open day.',
        learn: 'Explaining science clearly.',
        attributes: ['communication', 'courage'],
      },
    }),
    constellation: {
      name: 'The Flask',
      stars: [[40, 14], [60, 14], [60, 42], [82, 86], [18, 86]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]],
    },
    nextSteps: {
      learn: ['Free intro biology and chemistry courses (Khan Academy, Coursera)', 'Info sessions for lab technician diplomas'],
      community: ['Science fairs and university open days', 'r/labrats'],
      entryRoles: ['Lab assistant', 'Lab technician', 'Quality control technician', 'Research assistant'],
      searchFor: ['lab assistant', 'lab technician entry level', 'quality control technician'],
    },
  },

  env_scientist: {
    id: 'env_scientist',
    name: 'Environmental scientist',
    worlds: ['science', 'nature'],
    className: 'Ranger',
    item: 'field compass',
    oneLiner: 'Study air, water, soil and wildlife to protect the environment and guide better decisions.',
    dayToDay: [
      'Fieldwork: collecting water, soil or wildlife samples',
      'Analyzing data in the lab or on a computer',
      'Writing reports for government or companies',
      'Advising on how projects affect nature',
      'Explaining findings to the public',
    ],
    downsides: [
      'Fieldwork can mean bad weather and remote places',
      'Lots of report writing',
      'Progress on environmental problems can feel slow',
    ],
    education:
      "Most roles need a bachelor's in environmental science, biology, geography or a related field. Field technician jobs are a common first step; senior roles often ask for a master's.",
    requirements: [
      { attribute: 'analytical', required: 70, weight: 0.4 },
      { attribute: 'curiosity', required: 70, weight: 0.35 },
      { attribute: 'physical', required: 55, weight: 0.25 },
    ],
    interestTags: { nature: 1, learning: 1, puzzles: 0.5 },
    workStyles: ['small_team'],
    quests: questsFor('an environmental scientist', 'physical', {
      discover: {
        name: 'Read your local nature',
        instructions: "Learn what an 'indicator species' is: a living thing that shows how healthy a place is. Look up one for your area and why it matters.",
        learn: 'How scientists judge the health of an environment.',
        attributes: ['curiosity', 'analytical'],
      },
      beginner: {
        name: 'Citizen science',
        instructions: 'Join a free citizen science project like iNaturalist and record five living things near you, following its beginner guide.',
        learn: 'Field observation and recording, like real survey work.',
        attributes: ['detail', 'physical'],
      },
      own: {
        name: 'Spot the pattern',
        instructions: 'Compare your records with others nearby on the map and write one pattern or question you notice.',
        learn: 'Turning observations into a scientific question.',
        attributes: ['analytical', 'curiosity'],
      },
      real: {
        name: 'Join a cleanup',
        instructions: 'Join a local cleanup, tree planting or stream survey and talk to the organizers about their work.',
        learn: 'Environmental work on the ground, with people who do it.',
        attributes: ['teamwork', 'physical'],
      },
    }),
    constellation: {
      name: 'The Fern',
      stars: [[20, 86], [44, 70], [34, 46], [60, 30], [54, 10]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5]],
    },
    nextSteps: {
      learn: ['iNaturalist and other citizen science projects', 'Free environmental science intros (e.g. on Coursera)'],
      community: ['Local conservation groups and park volunteer programs', 'r/environmental_science'],
      entryRoles: ['Field technician', 'Environmental technician', 'Park or conservation assistant', 'Lab assistant'],
      searchFor: ['environmental field technician', 'conservation assistant', 'environmental technician entry level'],
    },
  },

  firefighter: {
    id: 'firefighter',
    name: 'Firefighter',
    worlds: ['public', 'health'],
    className: 'Sentinel',
    item: 'helmet',
    oneLiner: 'Respond to fires, crashes and medical emergencies, and help keep your community safe.',
    dayToDay: [
      'Responding to fires, accidents and medical calls',
      'Checking and maintaining equipment',
      'Daily physical training and drills',
      'Fire safety visits to schools and homes',
      'Long shifts living and working as a crew',
    ],
    downsides: [
      'Dangerous work in stressful situations',
      "You'll see traumatic scenes",
      'Shifts include nights, weekends and holidays',
    ],
    education:
      "No degree required, but hiring is competitive. You'll typically need a high school diploma, firefighter certification, emergency medical training (often EMR or EMT), and to pass physical and written tests.",
    requirements: [
      { attribute: 'physical', required: 80, weight: 0.35 },
      { attribute: 'courage', required: 70, weight: 0.35 },
      { attribute: 'teamwork', required: 65, weight: 0.3 },
    ],
    interestTags: { active: 1, helping: 1 },
    workStyles: ['many'],
    quests: questsFor('a firefighter', 'teamwork', {
      discover: {
        name: 'The fire triangle',
        instructions: 'Learn the fire triangle (heat, fuel, oxygen) and how taking away one puts a fire out. Find two examples at home of how fires are prevented.',
        learn: 'The core science of firefighting.',
        attributes: ['curiosity', 'analytical'],
      },
      beginner: {
        name: 'Home safety check',
        instructions: "Using your local fire service's free checklist, check your home's smoke alarms (with permission) and spot fire risks.",
        learn: 'Fire prevention, a big part of the job.',
        attributes: ['detail', 'organization'],
      },
      own: {
        name: 'Escape plan',
        instructions: 'Draw a fire escape plan for your home with two ways out of every room and a meeting point, then walk it through with your household.',
        learn: 'Planning for emergencies before they happen.',
        attributes: ['calm', 'leadership'],
      },
      real: {
        name: 'Meet the crew',
        instructions: 'Visit a fire station open day or take a first aid and CPR course, and ask a firefighter what training is like.',
        learn: 'What the job demands, from people who do it.',
        attributes: ['courage', 'physical'],
      },
    }),
    constellation: {
      name: 'The Shield',
      stars: [[20, 20], [80, 20], [80, 56], [50, 88], [20, 56]],
      lines: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]],
    },
    nextSteps: {
      learn: ['First aid and CPR certification', 'Your local fire service\'s recruitment and fitness test pages'],
      community: ['Fire station open days', 'Volunteer or cadet firefighter programs', 'r/Firefighting'],
      entryRoles: ['Volunteer firefighter', 'Fire cadet', 'Emergency medical responder', 'Lifeguard'],
      searchFor: ['volunteer firefighter', 'fire cadet program', 'emergency medical responder course'],
    },
  },

  law: {
    id: 'law',
    name: 'Law',
    worlds: ['public', 'business'],
    className: 'Arbiter',
    item: 'gavel',
    oneLiner: 'Help people and organizations understand the law, settle disputes and stand up for their rights.',
    dayToDay: [
      'Researching laws and past cases',
      'Drafting contracts, letters and court documents',
      'Meeting clients and advising them',
      'Negotiating settlements',
      'Presenting arguments in court (for litigators)',
    ],
    downsides: [
      'A long and expensive route to becoming a lawyer',
      'Heavy reading and long hours, especially early on',
      'High pressure, and adversarial at times',
    ],
    education:
      'Lawyers need an undergraduate degree, law school (a JD in the US and Canada) and a bar exam. Paralegal and legal assistant programs take 1–2 years and are a faster way into the field.',
    requirements: [
      { attribute: 'analytical', required: 75, weight: 0.35 },
      { attribute: 'communication', required: 75, weight: 0.35 },
      { attribute: 'detail', required: 65, weight: 0.3 },
    ],
    interestTags: { puzzles: 1, leading: 1, learning: 0.5 },
    workStyles: ['small_team', 'many'],
    quests: questsFor('a lawyer', 'analytical', {
      discover: {
        name: 'Rule, facts, argument',
        instructions: 'Learn the basic shape of a legal argument: the rule, the facts, and how the rule applies to the facts. Try it on one rule at your school or workplace.',
        learn: 'How lawyers think through any problem.',
        attributes: ['analytical', 'communication'],
      },
      beginner: {
        name: 'Read a real case',
        instructions: "Read a short summary of a real small-claims or consumer case online and write each side's best argument.",
        learn: 'Seeing both sides, a core legal skill.',
        attributes: ['analytical', 'empathy'],
      },
      own: {
        name: 'Write your argument',
        instructions: 'Pick a side and write a one-page argument using the rule, the facts and how the rule applies.',
        learn: 'Persuasive legal writing.',
        attributes: ['communication', 'detail'],
      },
      real: {
        name: 'See a court',
        instructions: 'Watch a public court hearing (most courts allow visitors) or ask a lawyer or paralegal one question about their work.',
        learn: 'How law works in real life.',
        attributes: ['courage', 'curiosity'],
      },
    }),
    constellation: {
      name: 'The Scales',
      stars: [[50, 14], [18, 46], [82, 46], [50, 88], [50, 46]],
      lines: [[1, 5], [5, 2], [5, 3], [5, 4]],
    },
    nextSteps: {
      learn: ['Free intro law courses (e.g. on Coursera or OpenLearn)', 'Info sessions for paralegal programs and law schools'],
      community: ['Public court galleries', 'Mock trial and debate clubs', 'r/LawSchool'],
      entryRoles: ['Legal assistant', 'Paralegal', 'Law office receptionist', 'Court clerk'],
      searchFor: ['legal assistant', 'paralegal entry level', 'law office assistant'],
    },
  },
};

export function getQuest(careerId: CareerId, star: StarNumber): Quest {
  const quest = CAREERS[careerId].quests.find((q) => q.star === star);
  if (!quest) throw new Error(`No quest ${star} on ${careerId}`);
  return quest;
}

export function careersInWorld(world: WorldId): Career[] {
  return CAREER_IDS.map((id) => CAREERS[id]).filter((c) => c.worlds.includes(world));
}
