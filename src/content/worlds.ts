// Career worlds an 18-year-old can browse (Pilot Content §1).

export const WORLD_IDS = [
  'create',
  'tech',
  'business',
  'people',
  'health',
  'sport',
  'nature',
  'build',
  'food',
  'arts',
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

export const WORLDS: Record<WorldId, World> = {
  create: { id: 'create', emoji: '🎨', name: 'Create & Design', blurb: 'Make things look, feel and work beautifully' },
  tech: { id: 'tech', emoji: '💻', name: 'Tech & Digital', blurb: 'Build and run the software and data behind everything' },
  business: { id: 'business', emoji: '📈', name: 'Business & Money', blurb: 'Grow ideas, products and teams' },
  people: { id: 'people', emoji: '🤝', name: 'People & Care', blurb: 'Teach, support and stand by people' },
  health: { id: 'health', emoji: '🩺', name: 'Health', blurb: 'Keep people well and help them recover' },
  sport: { id: 'sport', emoji: '⚽', name: 'Sport & Movement', blurb: 'Compete, train and help others move' },
  nature: { id: 'nature', emoji: '🌍', name: 'Nature, Animals & Outdoors', blurb: 'Work with plants, animals and the outdoors' },
  build: { id: 'build', emoji: '🔧', name: 'Build, Fix & Make', blurb: 'Build and repair the world with your hands' },
  food: { id: 'food', emoji: '🍳', name: 'Food & Hospitality', blurb: 'Feed people and make great moments happen' },
  arts: { id: 'arts', emoji: '🎭', name: 'Arts, Media & Performance', blurb: 'Tell stories, perform and create culture' },
  science: { id: 'science', emoji: '🔬', name: 'Science & Research', blurb: 'Discover how the world works' },
  public: { id: 'public', emoji: '🛡️', name: 'Public Service & Law', blurb: 'Protect people and keep things fair' },
};
