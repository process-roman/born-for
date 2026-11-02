// Generated from the app on main. Refresh with npm run sync:app.

// ../src/content/attributes.ts
var ATTRIBUTE_IDS = [
  // Mind
  "analytical",
  "curiosity",
  "detail",
  "organization",
  // Spark
  "creativity",
  "aesthetic",
  "courage",
  "independence",
  // Heart
  "empathy",
  "communication",
  "teamwork",
  "leadership",
  // Body
  "hands_on",
  "physical",
  "persistence",
  "calm"
];

// ../src/content/signs.ts
var SIGN_IDS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces"
];
var SIGNATURE_LADDER = [85, 80, 75, 70, 70, 65, 65, 60];
var BACKGROUND_LADDER = [55, 50, 50, 45, 45, 40, 40, 35];
var SIGN_STAT_BUDGET = [...SIGNATURE_LADDER, ...BACKGROUND_LADDER].reduce((a, b) => a + b, 0);
function withStats(def) {
  const values = /* @__PURE__ */ new Map();
  def.signature.forEach((a, i) => values.set(a, SIGNATURE_LADDER[i]));
  def.background.forEach((a, i) => values.set(a, BACKGROUND_LADDER[i]));
  const stats = Object.fromEntries(ATTRIBUTE_IDS.map((a) => [a, values.get(a) ?? 0]));
  return { ...def, stats };
}
var DEFS = {
  aries: {
    name: "Aries",
    archetype: "The Trailblazer",
    revealLine: "You go first, act fast and figure it out on the way.",
    adjective: "Bold",
    element: "fire",
    signature: ["courage", "leadership", "independence", "physical", "communication", "curiosity", "creativity", "hands_on"],
    background: ["persistence", "teamwork", "calm", "analytical", "aesthetic", "empathy", "organization", "detail"]
  },
  taurus: {
    name: "Taurus",
    archetype: "The Builder",
    revealLine: "You make things that last, one steady step at a time.",
    adjective: "Steady",
    element: "earth",
    signature: ["persistence", "hands_on", "aesthetic", "calm", "organization", "creativity", "detail", "physical"],
    background: ["empathy", "teamwork", "analytical", "independence", "communication", "leadership", "courage", "curiosity"]
  },
  gemini: {
    name: "Gemini",
    archetype: "The Messenger",
    revealLine: "Ideas move through you, and you love passing them on.",
    adjective: "Quick",
    element: "air",
    signature: ["communication", "curiosity", "creativity", "analytical", "teamwork", "courage", "independence", "aesthetic"],
    background: ["empathy", "leadership", "hands_on", "physical", "calm", "organization", "detail", "persistence"]
  },
  cancer: {
    name: "Cancer",
    archetype: "The Guardian",
    revealLine: "You look after people and the things that matter to them.",
    adjective: "Gentle",
    element: "water",
    signature: ["empathy", "persistence", "organization", "teamwork", "communication", "creativity", "detail", "hands_on"],
    background: ["calm", "aesthetic", "analytical", "leadership", "curiosity", "courage", "physical", "independence"]
  },
  leo: {
    name: "Leo",
    archetype: "The Champion",
    revealLine: "You create, you lead, and people notice when you walk in.",
    adjective: "Radiant",
    element: "fire",
    signature: ["leadership", "creativity", "communication", "courage", "aesthetic", "independence", "persistence", "teamwork"],
    background: ["physical", "empathy", "calm", "curiosity", "hands_on", "analytical", "organization", "detail"]
  },
  virgo: {
    name: "Virgo",
    archetype: "The Analyst",
    revealLine: "You see the details others miss and make things work better.",
    adjective: "Precise",
    element: "earth",
    signature: ["analytical", "detail", "organization", "persistence", "hands_on", "calm", "empathy", "curiosity"],
    background: ["teamwork", "communication", "independence", "aesthetic", "creativity", "leadership", "physical", "courage"]
  },
  libra: {
    name: "Libra",
    archetype: "The Diplomat",
    revealLine: "You bring people together and find the balance in any room.",
    adjective: "Graceful",
    element: "air",
    signature: ["communication", "empathy", "aesthetic", "teamwork", "creativity", "analytical", "calm", "curiosity"],
    background: ["organization", "leadership", "detail", "persistence", "hands_on", "physical", "courage", "independence"]
  },
  scorpio: {
    name: "Scorpio",
    archetype: "The Investigator",
    revealLine: "You dig deep and don't stop until you find the truth.",
    adjective: "Relentless",
    element: "water",
    signature: ["persistence", "analytical", "independence", "courage", "calm", "empathy", "detail", "leadership"],
    background: ["curiosity", "creativity", "organization", "physical", "aesthetic", "hands_on", "teamwork", "communication"]
  },
  sagittarius: {
    name: "Sagittarius",
    archetype: "The Explorer",
    revealLine: "You chase new places, new ideas and the big picture.",
    adjective: "Wandering",
    element: "fire",
    signature: ["curiosity", "independence", "courage", "communication", "physical", "creativity", "analytical", "leadership"],
    background: ["teamwork", "empathy", "hands_on", "aesthetic", "calm", "persistence", "organization", "detail"]
  },
  capricorn: {
    name: "Capricorn",
    archetype: "The Architect",
    revealLine: "You plan the climb and you finish what you start.",
    adjective: "Unshakable",
    element: "earth",
    signature: ["organization", "persistence", "leadership", "analytical", "calm", "detail", "independence", "hands_on"],
    background: ["physical", "teamwork", "communication", "curiosity", "empathy", "courage", "creativity", "aesthetic"]
  },
  aquarius: {
    name: "Aquarius",
    archetype: "The Inventor",
    revealLine: "You imagine what doesn't exist yet and go build it.",
    adjective: "Visionary",
    element: "air",
    signature: ["creativity", "independence", "curiosity", "analytical", "courage", "teamwork", "communication", "hands_on"],
    background: ["empathy", "leadership", "aesthetic", "detail", "physical", "calm", "persistence", "organization"]
  },
  pisces: {
    name: "Pisces",
    archetype: "The Dreamer",
    revealLine: "You feel deeply and turn imagination into something real.",
    adjective: "Dreaming",
    element: "water",
    signature: ["creativity", "empathy", "aesthetic", "curiosity", "teamwork", "communication", "hands_on", "independence"],
    background: ["calm", "analytical", "persistence", "physical", "courage", "detail", "leadership", "organization"]
  }
};
var SIGNS = Object.fromEntries(
  SIGN_IDS.map((id) => [id, withStats(DEFS[id])])
);

// ../src/logic/birthday.ts
var HOUR_MS = 36e5;
var DAY_MS = 24 * HOUR_MS;
var MAX_AHEAD_OF_UTC_MS = 14 * HOUR_MS;
var MAX_BEHIND_UTC_MS = 12 * HOUR_MS;
var ZODIAC_ORDER = SIGN_IDS;
var toRad = (deg) => deg * Math.PI / 180;
function julianDay(utcMs) {
  return utcMs / DAY_MS + 24405875e-1;
}
function sunLongitude(utcMs) {
  const t = (julianDay(utcMs) - 2451545) / 36525;
  const l0 = 280.46646 + 36000.76983 * t + 3032e-7 * t * t;
  const m = toRad(357.52911 + 35999.05029 * t - 1537e-7 * t * t);
  const c = (1.914602 - 4817e-6 * t - 14e-6 * t * t) * Math.sin(m) + (0.019993 - 101e-6 * t) * Math.sin(2 * m) + 289e-6 * Math.sin(3 * m);
  const omega = toRad(125.04 - 1934.136 * t);
  const apparent = l0 + c - 569e-5 - 478e-5 * Math.sin(omega);
  return (apparent % 360 + 360) % 360;
}
function signAt(utcMs) {
  return ZODIAC_ORDER[Math.floor(sunLongitude(utcMs) / 30)];
}
function isValidBirthDate({ year, month, day }) {
  if (![year, month, day].every(Number.isInteger)) return false;
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}
function signFromBirthday(date) {
  if (!isValidBirthDate(date)) throw new RangeError(`Invalid date ${date.year}-${date.month}-${date.day}`);
  const dayStart = Date.UTC(date.year, date.month - 1, date.day);
  const first = signAt(dayStart - MAX_AHEAD_OF_UTC_MS);
  const last = signAt(dayStart + DAY_MS + MAX_BEHIND_UTC_MS);
  return first === last ? { kind: "sign", sign: first } : { kind: "cusp", signs: [first, last] };
}
export {
  isValidBirthDate,
  signAt,
  signFromBirthday,
  sunLongitude
};
