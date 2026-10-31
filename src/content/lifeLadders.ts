// Per-career data for template lives (careers without a hand-written life): the life's name, the
// role ladder from first job to the top, and what "your own" business looks like. Everything else
// in a template life comes from the career's existing content.

import type { CareerId } from './careerKit';

export interface LifeLadder {
  /** "Electrician": the life's name, also used in text. */
  lifeName: string;
  /** Entry → mid → senior → lead, for "Role reached". */
  roles: readonly [string, string, string, string];
  /** The role on the "Struck out on your own" ending, e.g. "Ran your own electrical business". */
  ownRole: string;
  /** What you'd open: "electrical business", "salon", "channel". */
  ownNoun: string;
}

type L = [string, [string, string, string, string], string, string];

const DATA: Record<Exclude<CareerId, 'ux_design'>, L> = {
  florist: ['Florist', ['Shop assistant', 'Florist', 'Senior florist', 'Head florist'], 'Ran your own flower studio', 'flower studio'],
  software_dev: ['Developer', ['Junior developer', 'Software developer', 'Senior developer', 'Tech lead'], 'Founded your own software company', 'software company'],
  data_analysis: ['Data analyst', ['Junior analyst', 'Data analyst', 'Senior analyst', 'Analytics lead'], 'Ran your own data consultancy', 'data consultancy'],
  marketing: ['Marketer', ['Marketing assistant', 'Marketing specialist', 'Marketing manager', 'Head of marketing'], 'Ran your own marketing agency', 'marketing agency'],
  project_coord: ['Project coordinator', ['Project assistant', 'Project coordinator', 'Project manager', 'Program manager'], 'Ran your own project consultancy', 'consultancy'],
  teaching: ['Teacher', ['Student teacher', 'Teacher', 'Senior teacher', 'Head of department'], 'Opened your own tutoring school', 'tutoring school'],
  social_work: ['Social worker', ['Support worker', 'Social worker', 'Senior social worker', 'Team supervisor'], 'Founded your own community organization', 'community organization'],
  nursing: ['Nurse', ['Nursing assistant', 'Registered nurse', 'Senior nurse', 'Charge nurse'], 'Ran your own home-care practice', 'home-care practice'],
  physio: ['Physiotherapist', ['Physio assistant', 'Physiotherapist', 'Senior physiotherapist', 'Clinic lead'], 'Opened your own physio clinic', 'physio clinic'],
  athlete: ['Athlete', ['Academy player', 'Semi-pro athlete', 'Professional athlete', 'Team captain'], 'Started your own sports academy', 'sports academy'],
  personal_trainer: ['Personal trainer', ['Gym floor trainer', 'Personal trainer', 'Senior trainer', 'Head coach'], 'Opened your own training studio', 'training studio'],
  vet_nurse: ['Vet nurse', ['Vet assistant', 'Veterinary technician', 'Senior vet tech', 'Head nurse'], 'Ran your own pet-care business', 'pet-care business'],
  landscape_gardener: ['Landscaper', ['Garden labourer', 'Landscape gardener', 'Senior landscaper', 'Crew lead'], 'Ran your own landscaping business', 'landscaping business'],
  electrician: ['Electrician', ['Apprentice electrician', 'Electrician', 'Master electrician', 'Site supervisor'], 'Ran your own electrical business', 'electrical business'],
  carpenter: ['Carpenter', ['Apprentice carpenter', 'Carpenter', 'Master carpenter', 'Site foreman'], 'Ran your own carpentry workshop', 'carpentry workshop'],
  chef: ['Chef', ['Prep cook', 'Line cook', 'Sous chef', 'Head chef'], 'Opened your own restaurant', 'restaurant'],
  event_planner: ['Event planner', ['Event assistant', 'Event coordinator', 'Event planner', 'Head of events'], 'Ran your own events company', 'events company'],
  musician: ['Musician', ['Open-mic regular', 'Gigging musician', 'Session musician', 'Band leader'], 'Ran your own music label', 'music label'],
  writer: ['Writer', ['Freelance writer', 'Staff writer', 'Published author', 'Senior editor'], 'Ran your own small press', 'small press'],
  lab_scientist: ['Lab scientist', ['Lab assistant', 'Lab technician', 'Research scientist', 'Lab manager'], 'Founded your own lab startup', 'lab startup'],
  env_scientist: ['Environmental scientist', ['Field technician', 'Environmental scientist', 'Senior scientist', 'Project lead'], 'Ran your own environmental consultancy', 'environmental consultancy'],
  firefighter: ['Firefighter', ['Recruit', 'Firefighter', 'Senior firefighter', 'Captain'], 'Ran your own fire-safety training business', 'fire-safety training business'],
  law: ['Lawyer', ['Paralegal', 'Associate lawyer', 'Senior associate', 'Partner'], 'Opened your own law practice', 'law practice'],
  entrepreneur: ['Founder', ['Side-project founder', 'Founder', 'Funded founder', 'CEO'], 'Built your own company', 'company'],
  ecommerce_owner: ['Online store owner', ['Hobby seller', 'Store owner', 'Growing brand owner', 'Brand founder'], 'Turned your shop into a brand', 'brand'],
  sales: ['Salesperson', ['Sales associate', 'Sales rep', 'Senior account executive', 'Sales manager'], 'Ran your own sales agency', 'sales agency'],
  recruiter: ['Recruiter', ['Recruitment coordinator', 'Recruiter', 'Senior recruiter', 'Talent lead'], 'Ran your own recruiting agency', 'recruiting agency'],
  accountant: ['Accountant', ['Bookkeeper', 'Accountant', 'Senior accountant', 'Finance manager'], 'Opened your own accounting practice', 'accounting practice'],
  real_estate: ['Real estate agent', ['Licensed agent', 'Real estate agent', 'Top producer', 'Team lead'], 'Opened your own brokerage', 'brokerage'],
  fashion_designer: ['Fashion designer', ['Design assistant', 'Junior designer', 'Fashion designer', 'Creative director'], 'Launched your own fashion label', 'fashion label'],
  stylist: ['Stylist', ['Stylist’s assistant', 'Stylist', 'Senior stylist', 'Fashion director'], 'Ran your own styling studio', 'styling studio'],
  makeup_artist: ['Makeup artist', ['Makeup assistant', 'Makeup artist', 'Senior makeup artist', 'Makeup department head'], 'Ran your own beauty studio', 'beauty studio'],
  hairdresser: ['Hairdresser', ['Salon apprentice', 'Hairstylist', 'Senior stylist', 'Salon manager'], 'Opened your own salon', 'salon'],
  fashion_buyer: ['Fashion buyer', ['Buying assistant', 'Assistant buyer', 'Buyer', 'Head of buying'], 'Ran your own boutique', 'boutique'],
  nail_artist: ['Nail artist', ['Nail technician', 'Nail artist', 'Senior nail artist', 'Salon lead'], 'Opened your own nail studio', 'nail studio'],
  model: ['Model', ['New face', 'Working model', 'Signed model', 'Campaign model'], 'Ran your own creative agency', 'creative agency'],
  youtuber: ['YouTuber', ['New channel', 'Growing creator', 'Full-time creator', 'Creator with a team'], 'Built your own media company', 'media company'],
  streamer: ['Streamer', ['New streamer', 'Affiliate streamer', 'Partnered streamer', 'Streamer with a team'], 'Built your own streaming brand', 'streaming brand'],
  influencer: ['Influencer', ['New creator', 'Micro-influencer', 'Full-time influencer', 'Creator with a team'], 'Built your own brand', 'brand'],
  podcaster: ['Podcaster', ['New podcaster', 'Podcast host', 'Network host', 'Podcast producer'], 'Ran your own podcast network', 'podcast network'],
  social_media_manager: ['Social media manager', ['Social media assistant', 'Social media coordinator', 'Social media manager', 'Head of social'], 'Ran your own social media agency', 'social media agency'],
  video_editor: ['Video editor', ['Assistant editor', 'Video editor', 'Senior editor', 'Post-production lead'], 'Ran your own editing studio', 'editing studio'],
  photographer: ['Photographer', ['Photographer’s assistant', 'Photographer', 'Senior photographer', 'Studio lead'], 'Opened your own photo studio', 'photo studio'],
  game_developer: ['Game developer', ['Junior game developer', 'Game developer', 'Senior game developer', 'Lead developer'], 'Founded your own game studio', 'game studio'],
  game_designer: ['Game designer', ['Junior game designer', 'Game designer', 'Senior game designer', 'Lead designer'], 'Founded your own indie studio', 'indie studio'],
  game_artist: ['Game artist', ['Junior game artist', 'Game artist', 'Senior game artist', 'Art director'], 'Founded your own art studio', 'art studio'],
  esports_player: ['Esports player', ['Ranked grinder', 'Amateur team player', 'Pro player', 'Team captain'], 'Built your own esports team', 'esports team'],
  esports_caster: ['Esports caster', ['Community caster', 'Tournament caster', 'Pro caster', 'Lead caster'], 'Ran your own broadcast crew', 'broadcast crew'],
  qa_tester: ['QA tester', ['QA tester', 'QA analyst', 'Senior QA analyst', 'QA lead'], 'Ran your own testing company', 'testing company'],
  graphic_designer: ['Graphic designer', ['Junior designer', 'Graphic designer', 'Senior designer', 'Art director'], 'Opened your own design studio', 'design studio'],
  illustrator: ['Illustrator', ['Freelance illustrator', 'Illustrator', 'Senior illustrator', 'Art lead'], 'Opened your own illustration studio', 'illustration studio'],
  animator: ['Animator', ['Junior animator', 'Animator', 'Senior animator', 'Animation director'], 'Founded your own animation studio', 'animation studio'],
  tattoo_artist: ['Tattoo artist', ['Tattoo apprentice', 'Tattoo artist', 'Senior tattoo artist', 'Lead artist'], 'Opened your own tattoo shop', 'tattoo shop'],
  interior_designer: ['Interior designer', ['Design assistant', 'Junior interior designer', 'Interior designer', 'Lead designer'], 'Opened your own interiors studio', 'interiors studio'],
  architect: ['Architect', ['Architectural assistant', 'Intern architect', 'Architect', 'Project architect'], 'Opened your own architecture practice', 'architecture practice'],
  music_producer: ['Music producer', ['Bedroom producer', 'Producer', 'Studio producer', 'Head producer'], 'Ran your own studio and label', 'recording studio'],
  actor: ['Actor', ['Student actor', 'Working actor', 'Recurring cast member', 'Lead actor'], 'Ran your own theater company', 'theater company'],
  dancer: ['Dancer', ['Student dancer', 'Company dancer', 'Soloist', 'Principal dancer'], 'Opened your own dance school', 'dance school'],
  sound_engineer: ['Sound engineer', ['Assistant engineer', 'Sound engineer', 'Senior sound engineer', 'Head engineer'], 'Opened your own recording studio', 'recording studio'],
  journalist: ['Journalist', ['Intern reporter', 'Reporter', 'Senior reporter', 'Editor'], 'Ran your own news outlet', 'news outlet'],
  copywriter: ['Copywriter', ['Junior copywriter', 'Copywriter', 'Senior copywriter', 'Creative director'], 'Ran your own copywriting studio', 'copywriting studio'],
  screenwriter: ['Screenwriter', ['Writers’ assistant', 'Staff writer', 'Screenwriter', 'Showrunner'], 'Ran your own production company', 'production company'],
  ai_engineer: ['AI engineer', ['Junior ML engineer', 'AI engineer', 'Senior AI engineer', 'AI lead'], 'Founded your own AI startup', 'AI startup'],
  cybersecurity: ['Security analyst', ['IT support tech', 'Security analyst', 'Senior security engineer', 'Security lead'], 'Ran your own security firm', 'security firm'],
  app_developer: ['App developer', ['Junior app developer', 'App developer', 'Senior app developer', 'Mobile lead'], 'Ran your own app studio', 'app studio'],
  it_support: ['IT support', ['Help desk tech', 'IT support specialist', 'Systems administrator', 'IT manager'], 'Ran your own IT services company', 'IT services company'],
  sports_coach: ['Coach', ['Assistant coach', 'Coach', 'Head coach', 'Director of coaching'], 'Ran your own coaching academy', 'coaching academy'],
  sports_analyst: ['Sports analyst', ['Analytics intern', 'Sports analyst', 'Senior analyst', 'Head of analysis'], 'Ran your own analysis company', 'analysis company'],
  yoga_instructor: ['Yoga instructor', ['New instructor', 'Yoga instructor', 'Senior teacher', 'Lead teacher'], 'Opened your own yoga studio', 'yoga studio'],
  doctor: ['Doctor', ['Medical student', 'Resident', 'Doctor', 'Senior physician'], 'Opened your own clinic', 'clinic'],
  paramedic: ['Paramedic', ['EMT', 'Paramedic', 'Advanced paramedic', 'Paramedic supervisor'], 'Ran your own first-aid training company', 'first-aid training company'],
  psychologist: ['Psychologist', ['Mental health worker', 'Psychologist in training', 'Psychologist', 'Clinical lead'], 'Opened your own practice', 'practice'],
  pharmacist: ['Pharmacist', ['Pharmacy technician', 'Pharmacist', 'Senior pharmacist', 'Pharmacy manager'], 'Opened your own pharmacy', 'pharmacy'],
  nutritionist: ['Nutritionist', ['Nutrition assistant', 'Dietitian', 'Senior dietitian', 'Lead dietitian'], 'Opened your own nutrition practice', 'nutrition practice'],
  early_childhood: ['Early childhood educator', ['Childcare assistant', 'Early childhood educator', 'Room lead', 'Centre director'], 'Opened your own childcare centre', 'childcare centre'],
  counsellor: ['Counsellor', ['Support worker', 'Counsellor in training', 'Counsellor', 'Senior counsellor'], 'Opened your own counselling practice', 'counselling practice'],
  youth_worker: ['Youth worker', ['Volunteer', 'Youth worker', 'Senior youth worker', 'Program lead'], 'Founded your own youth program', 'youth program'],
  veterinarian: ['Veterinarian', ['Vet student', 'Associate vet', 'Veterinarian', 'Lead vet'], 'Opened your own vet clinic', 'vet clinic'],
  marine_biologist: ['Marine biologist', ['Field assistant', 'Research technician', 'Marine biologist', 'Lead researcher'], 'Ran your own ocean research charity', 'research charity'],
  park_ranger: ['Park ranger', ['Seasonal ranger', 'Park ranger', 'Senior ranger', 'Chief ranger'], 'Ran your own outdoor guiding business', 'guiding business'],
  farmer: ['Farmer', ['Farm hand', 'Farm manager', 'Farmer', 'Farm owner'], 'Ran your own farm business', 'farm business'],
  pastry_chef: ['Pastry chef', ['Bakery assistant', 'Pastry cook', 'Pastry chef', 'Head pastry chef'], 'Opened your own bakery', 'bakery'],
  barista: ['Barista', ['Trainee barista', 'Barista', 'Head barista', 'Café manager'], 'Opened your own café', 'café'],
  bartender: ['Bartender', ['Barback', 'Bartender', 'Head bartender', 'Bar manager'], 'Opened your own bar', 'bar'],
  hotel_manager: ['Hotel manager', ['Front desk agent', 'Shift supervisor', 'Assistant manager', 'Hotel manager'], 'Ran your own guesthouse', 'guesthouse'],
  mechanic: ['Mechanic', ['Apprentice mechanic', 'Mechanic', 'Senior mechanic', 'Shop foreman'], 'Opened your own garage', 'garage'],
  plumber: ['Plumber', ['Apprentice plumber', 'Plumber', 'Master plumber', 'Site supervisor'], 'Ran your own plumbing business', 'plumbing business'],
  welder: ['Welder', ['Welding helper', 'Welder', 'Certified welder', 'Welding supervisor'], 'Ran your own fabrication shop', 'fabrication shop'],
  drone_pilot: ['Drone pilot', ['Hobby flyer', 'Drone pilot', 'Senior drone pilot', 'Operations lead'], 'Ran your own drone services company', 'drone services company'],
  pilot: ['Pilot', ['Student pilot', 'First officer', 'Senior first officer', 'Captain'], 'Ran your own flight school', 'flight school'],
  flight_attendant: ['Flight attendant', ['Trainee', 'Flight attendant', 'Senior flight attendant', 'Purser'], 'Ran your own travel business', 'travel business'],
  tour_guide: ['Tour guide', ['Trainee guide', 'Tour guide', 'Senior guide', 'Tour manager'], 'Ran your own tour company', 'tour company'],
  travel_creator: ['Travel creator', ['Travel blogger', 'Travel creator', 'Full-time creator', 'Creator with a team'], 'Built your own travel brand', 'travel brand'],
  astronomer: ['Astronomer', ['Physics student', 'Research assistant', 'Astronomer', 'Principal investigator'], 'Ran your own science outreach company', 'science outreach company'],
  chemist: ['Chemist', ['Lab technician', 'Chemist', 'Senior chemist', 'Lab lead'], 'Founded your own chemistry startup', 'chemistry startup'],
  police_officer: ['Police officer', ['Cadet', 'Police officer', 'Senior officer', 'Sergeant'], 'Ran your own security consultancy', 'security consultancy'],
  diplomat: ['Diplomat', ['Policy intern', 'Foreign service officer', 'Diplomat', 'Senior diplomat'], 'Ran your own international consultancy', 'international consultancy'],
  policy_advisor: ['Policy advisor', ['Policy intern', 'Policy analyst', 'Policy advisor', 'Senior policy advisor'], 'Ran your own policy consultancy', 'policy consultancy'],
};

export function ladderFor(id: CareerId): LifeLadder | null {
  if (id === 'ux_design') return null;
  const [lifeName, roles, ownRole, ownNoun] = DATA[id];
  return { lifeName, roles, ownRole, ownNoun };
}
