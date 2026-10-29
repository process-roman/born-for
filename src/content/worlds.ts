// Career worlds: what users pick first on "Which worlds pull you?" (Pilot Content §1).

export const WORLD_IDS = [
  'business',
  'fashion',
  'creators',
  'gaming',
  'art',
  'music',
  'writing',
  'tech',
  'sport',
  'health',
  'people',
  'nature',
  'food',
  'build',
  'travel',
  'science',
  'public',
] as const;

export type WorldId = (typeof WORLD_IDS)[number];

export interface World {
  id: WorldId;
  emoji: string;
  name: string;
  blurb: string;
}

export const MAX_WORLDS = 3;

export const WORLDS: Record<WorldId, World> = {
  business: { id: 'business', emoji: '📈', name: 'Business & Entrepreneurship', blurb: 'Start, sell, grow and run things' },
  fashion: { id: 'fashion', emoji: '👗', name: 'Fashion & Beauty', blurb: 'Clothes, style, hair, makeup and looks' },
  creators: { id: 'creators', emoji: '📱', name: 'Creators & Media', blurb: 'Videos, streams, podcasts and social media' },
  gaming: { id: 'gaming', emoji: '🎮', name: 'Gaming & Esports', blurb: 'Make games, test them or compete' },
  art: { id: 'art', emoji: '🎨', name: 'Art & Design', blurb: 'Draw, design and make things beautiful' },
  music: { id: 'music', emoji: '🎵', name: 'Music & Performance', blurb: 'Play, produce, act and dance' },
  writing: { id: 'writing', emoji: '✍️', name: 'Writing & Journalism', blurb: 'Stories, news and words that work' },
  tech: { id: 'tech', emoji: '💻', name: 'Tech & AI', blurb: 'Build software, AI and keep systems safe' },
  sport: { id: 'sport', emoji: '⚽', name: 'Sport & Fitness', blurb: 'Compete, coach and help people move' },
  health: { id: 'health', emoji: '🩺', name: 'Health & Mind', blurb: 'Care for bodies and minds' },
  people: { id: 'people', emoji: '🤝', name: 'People & Education', blurb: 'Teach, support and stand by people' },
  nature: { id: 'nature', emoji: '🌍', name: 'Nature & Animals', blurb: 'Plants, animals, oceans and the outdoors' },
  food: { id: 'food', emoji: '🍳', name: 'Food & Hospitality', blurb: 'Cook, serve and host great moments' },
  build: { id: 'build', emoji: '🔧', name: 'Build & Fix', blurb: 'Build, repair and work with your hands' },
  travel: { id: 'travel', emoji: '✈️', name: 'Travel & Adventure', blurb: 'Work that takes you places' },
  science: { id: 'science', emoji: '🔬', name: 'Science & Space', blurb: 'Discover how the world and universe work' },
  public: { id: 'public', emoji: '🛡️', name: 'Law & Public Service', blurb: 'Protect people and keep things fair' },
};
