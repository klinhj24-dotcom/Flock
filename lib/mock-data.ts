export type TripStatus = "Planning" | "Confirmed" | "Completed";

export type BookingItemStatus =
  | "booked"
  | "book_now"
  | "book_soon"
  | "pending";

export type BookingItem = {
  item: string;
  status: BookingItemStatus;
  note?: string;
};

export type TripExpense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  settled?: Record<string, boolean>;
};

export type Trip = {
  id: string;
  city: string;
  country: string;
  flag: string;
  startDate: string;
  endDate: string;
  people: string[];
  estimatedCost: number;
  actualCost?: number;
  status: TripStatus;
  accent: string; // tailwind gradient classes
  captain: string;
  tripCaptain: string;
  flightBooked: boolean;
  waitlist?: string[];
  bookingStatus: BookingItem[];
  expenses?: TripExpense[];
  photoSeed?: string;
};

export type FundingSource = {
  id: string;
  label: string;
  amount: number;
  recurring: boolean;
};

export type FriendTrip = {
  friend: string;
  avatar: string;
  destination: string;
  flag: string;
  dates: string;
  recs: string[];
};

export type Friend = {
  name: string;
  avatar: string;
  phone: string;
  venmo?: string;
  email?: string;
};

export type BudgetLineItem = {
  id: string;
  category: string;
  label: string;
  planned: number;
  spent: number;
  note?: string;
  preDeparture?: boolean;
};

export type Destination = {
  id: string;
  city: string;
  country: string;
  flag: string;
  flightTime: string;
  flightHours: number;
  weekendCost: number;
  bestMonths: string;
  vibes: string[];
  accent: string;
  photoSeed?: string;
};

export type BudgetCategory = {
  name: string;
  budgeted: number;
  spent: number;
  color: string;
};

export type ActivityItem = {
  id: string;
  who: string;
  action: string;
  target: string;
  timeAgo: string;
};

export const USER = {
  name: "Henry",
  firstName: "Henry",
  homeCity: "Tokyo",
  homeCountry: "Japan",
  homeFlag: "🇯🇵",
  program: "Fall 2025 · Wake Forest",
  semesterStart: "2025-09-01",
  semesterEnd: "2025-12-20",
  daysLeft: 87,
};

export const TRIPS: Trip[] = [
  {
    id: "t0",
    city: "Osaka",
    country: "Japan",
    flag: "🇯🇵",
    startDate: "2026-04-22",
    endDate: "2026-04-25",
    people: ["Henry", "Jake", "Maya", "Leo"],
    estimatedCost: 380,
    status: "Confirmed",
    accent: "from-[#4A3518] via-[#8B6B3F] to-[#E8D5A3]",
    captain: "Henry",
    tripCaptain: "Henry",
    flightBooked: true,
    photoSeed: "osaka-neon",
    bookingStatus: [
      { item: "Flights", status: "booked", note: "Round-trip confirmed" },
      { item: "Accommodation", status: "booked", note: "Hostel in Namba" },
    ],
    expenses: [
      {
        id: "e1",
        description: "Hostel (3 nights)",
        amount: 240,
        paidBy: "Henry",
        splitBetween: ["Henry", "Jake", "Maya", "Leo"],
      },
      {
        id: "e2",
        description: "Shinkansen tickets",
        amount: 180,
        paidBy: "Jake",
        splitBetween: ["Henry", "Jake", "Maya", "Leo"],
      },
    ],
  },
  {
    id: "t1",
    city: "Kyoto",
    country: "Japan",
    flag: "🇯🇵",
    startDate: "2025-11-08",
    endDate: "2025-11-10",
    people: ["Henry", "Jake", "Maya", "Priya"],
    estimatedCost: 320,
    status: "Confirmed",
    accent: "from-[#6B4423] via-[#8B5A2B] to-[#E8D5A3]",
    captain: "Henry",
    tripCaptain: "Henry",
    flightBooked: true,
    photoSeed: "kyoto-temple",
    bookingStatus: [
      { item: "Flights", status: "booked", note: "¥12,400 RT" },
      { item: "Accommodation", status: "booked", note: "Hostel confirmed" },
    ],
    expenses: [
      {
        id: "e1",
        description: "Hostel (2 nights)",
        amount: 280,
        paidBy: "Henry",
        splitBetween: ["Henry", "Jake", "Maya", "Priya"],
      },
      {
        id: "e2",
        description: "Train to Kyoto",
        amount: 160,
        paidBy: "Maya",
        splitBetween: ["Henry", "Jake", "Maya", "Priya"],
      },
      {
        id: "e3",
        description: "Group dinner",
        amount: 92,
        paidBy: "Jake",
        splitBetween: ["Henry", "Jake", "Priya"],
      },
    ],
  },
  {
    id: "t2",
    city: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    startDate: "2025-11-22",
    endDate: "2025-11-24",
    people: ["Henry", "Jake", "Sam"],
    estimatedCost: 280,
    status: "Planning",
    accent: "from-[#7A2E2E] via-[#B85C3C] to-[#E8B572]",
    captain: "Jake",
    tripCaptain: "Jake",
    flightBooked: false,
    photoSeed: "bangkok-street",
    bookingStatus: [
      { item: "Flights", status: "book_now", note: "Prices up 18% this week" },
      { item: "Accommodation", status: "book_soon" },
    ],
    expenses: [
      {
        id: "e1",
        description: "Airbnb deposit",
        amount: 180,
        paidBy: "Jake",
        splitBetween: ["Henry", "Jake", "Sam"],
      },
      {
        id: "e2",
        description: "Airport transfer",
        amount: 45,
        paidBy: "Sam",
        splitBetween: ["Henry", "Jake", "Sam"],
      },
    ],
  },
  {
    id: "t3",
    city: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    startDate: "2025-12-06",
    endDate: "2025-12-09",
    people: ["Henry", "Maya", "Priya", "Sam", "Leo", "Nina"],
    estimatedCost: 450,
    status: "Planning",
    accent: "from-[#1F5F5B] via-[#4A9EBF] to-[#9FD4C5]",
    captain: "TBD",
    tripCaptain: "Maya",
    flightBooked: false,
    waitlist: ["Alex"],
    photoSeed: "bali-rice",
    bookingStatus: [
      { item: "Flights", status: "book_soon" },
      { item: "Accommodation", status: "book_now", note: "Dec fills fast" },
    ],
    expenses: [
      {
        id: "e1",
        description: "Villa reservation",
        amount: 620,
        paidBy: "Maya",
        splitBetween: ["Henry", "Maya", "Priya", "Sam", "Leo", "Nina"],
      },
      {
        id: "e2",
        description: "Scooter rentals",
        amount: 120,
        paidBy: "Leo",
        splitBetween: ["Henry", "Maya", "Leo", "Nina"],
      },
    ],
  },
  {
    id: "t4",
    city: "Seoul",
    country: "South Korea",
    flag: "🇰🇷",
    startDate: "2025-10-18",
    endDate: "2025-10-20",
    people: ["Henry", "Jake", "Maya", "Leo", "Nina"],
    estimatedCost: 310,
    actualCost: 268,
    status: "Completed",
    accent: "from-[#2E3A5F] via-[#5B6EA8] to-[#A9B5D9]",
    captain: "Marcus",
    tripCaptain: "Leo",
    flightBooked: true,
    photoSeed: "seoul-night",
    bookingStatus: [
      { item: "Flights", status: "booked" },
      { item: "Accommodation", status: "booked" },
    ],
    expenses: [
      {
        id: "e1",
        description: "Hostel",
        amount: 240,
        paidBy: "Leo",
        splitBetween: ["Henry", "Jake", "Maya", "Leo", "Nina"],
      },
      {
        id: "e2",
        description: "Karaoke night",
        amount: 85,
        paidBy: "Nina",
        splitBetween: ["Henry", "Jake", "Maya", "Leo", "Nina"],
      },
      {
        id: "e3",
        description: "BBQ dinner",
        amount: 140,
        paidBy: "Henry",
        splitBetween: ["Henry", "Jake", "Maya", "Leo", "Nina"],
      },
    ],
  },
];

export const FRIENDS: Friend[] = [
  { name: "Henry", avatar: "HE", phone: "+15550000001", venmo: "henry-flock", email: "henry@flock.app" },
  { name: "Jake", avatar: "JK", phone: "+15550000002", venmo: "jake-flock", email: "jake@flock.app" },
  { name: "Maya", avatar: "MY", phone: "+15550000003", venmo: "maya-flock", email: "maya@flock.app" },
  { name: "Priya", avatar: "PR", phone: "+15550000004", venmo: "priya-flock", email: "priya@flock.app" },
  { name: "Sam", avatar: "SM", phone: "+15550000005", venmo: "sam-flock", email: "sam@flock.app" },
  { name: "Leo", avatar: "LE", phone: "+15550000006", venmo: "leo-flock", email: "leo@flock.app" },
  { name: "Nina", avatar: "NI", phone: "+15550000007", venmo: "nina-flock", email: "nina@flock.app" },
  { name: "Alex", avatar: "AL", phone: "+15550000008", venmo: "alex-flock", email: "alex@flock.app" },
  { name: "Chris", avatar: "CR", phone: "+15550000009", venmo: "chris-flock", email: "chris@flock.app" },
];

// Rotating hero photos (Picsum seeds give deterministic picturesque images)
export const HERO_PHOTOS: { seed: string; caption: string }[] = [
  { seed: "kyoto-lanterns", caption: "A quiet morning in Kyoto" },
  { seed: "lisbon-tram", caption: "Lisbon's yellow trams" },
  { seed: "bali-beach", caption: "Bali shoreline" },
  { seed: "bangkok-night", caption: "Bangkok after dark" },
  { seed: "prague-bridge", caption: "Charles Bridge at dawn" },
  { seed: "seoul-street", caption: "Seoul side streets" },
];

export const BUDGET_LINE_ITEMS: BudgetLineItem[] = [
  // Pre-departure
  { id: "l1", category: "Pre-departure", label: "Flight into country", planned: 1200, spent: 1180, preDeparture: true, note: "Round-trip, ORD → HND" },
  { id: "l2", category: "Pre-departure", label: "Student visa", planned: 180, spent: 180, preDeparture: true },
  { id: "l3", category: "Pre-departure", label: "Travel insurance", planned: 240, spent: 240, preDeparture: true },
  { id: "l4", category: "Pre-departure", label: "Vaccinations", planned: 120, spent: 90, preDeparture: true },
  // Housing
  { id: "l5", category: "Housing", label: "Dorm / Apartment", planned: 3200, spent: 3200, note: "4 months" },
  { id: "l6", category: "Housing", label: "Security deposit", planned: 400, spent: 400 },
  // Meals
  { id: "l7", category: "Daily Food", label: "Groceries", planned: 1600, spent: 620 },
  { id: "l8", category: "Daily Food", label: "Eating out", planned: 800, spent: 270 },
  // Weekend Trips
  { id: "l9", category: "Weekend Trips", label: "Flights / trains", planned: 2200, spent: 980 },
  { id: "l10", category: "Weekend Trips", label: "Lodging", planned: 1400, spent: 620 },
  { id: "l11", category: "Weekend Trips", label: "Food on trips", planned: 400, spent: 240 },
  // Transportation
  { id: "l12", category: "Transportation", label: "Metro pass", planned: 600, spent: 180 },
  { id: "l13", category: "Transportation", label: "Taxis / Uber", planned: 200, spent: 30 },
  // Activities
  { id: "l14", category: "Activities", label: "Museums, events", planned: 400, spent: 120 },
  { id: "l15", category: "Activities", label: "Classes / workshops", planned: 200, spent: 60 },
  // Emergency Fund
  { id: "l16", category: "Emergency Fund", label: "Rainy day buffer", planned: 1000, spent: 0 },
  // Miscellaneous
  { id: "l17", category: "Miscellaneous", label: "Shopping / gifts", planned: 400, spent: 180 },
  { id: "l18", category: "Miscellaneous", label: "Toiletries / supplies", planned: 200, spent: 60 },
];

export const FRIEND_TRIPS: FriendTrip[] = [
  {
    friend: "Jake",
    avatar: "JK",
    destination: "Kyoto",
    flag: "🇯🇵",
    dates: "Oct 18-20",
    recs: [
      "Visit Fushimi Inari at 6am",
      "Stay in Gion district",
      "Book ryokan 3+ weeks out",
    ],
  },
  {
    friend: "Maya",
    avatar: "MY",
    destination: "Lisbon",
    flag: "🇵🇹",
    dates: "Nov 1-3",
    recs: [
      "Take the 28 tram",
      "Pasteis de Belem for breakfast",
      "Airbnb in Alfama",
    ],
  },
  {
    friend: "Chris",
    avatar: "CR",
    destination: "Prague",
    flag: "🇨🇿",
    dates: "Sep 27-29",
    recs: [
      "Book hostel bar crawl night 1",
      "Day trip to Cesky Krumlov",
      "Avoid Old Town Square restaurants",
    ],
  },
];

export const FUNDING_SOURCES: FundingSource[] = [
  { id: "1", label: "Parent Contribution", amount: 3000, recurring: false },
  { id: "2", label: "Personal Savings", amount: 2000, recurring: false },
];

export const DESTINATIONS: Destination[] = [
  {
    id: "d1",
    city: "Kyoto",
    country: "Japan",
    flag: "🇯🇵",
    flightTime: "2h 30m",
    flightHours: 2.5,
    weekendCost: 280,
    bestMonths: "Oct – Nov",
    vibes: ["Culture"],
    accent: "from-[#6B4423] via-[#8B5A2B] to-[#E8D5A3]",
  },
  {
    id: "d2",
    city: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    flightTime: "5h 30m",
    flightHours: 5.5,
    weekendCost: 260,
    bestMonths: "Nov – Feb",
    vibes: ["City", "Party"],
    accent: "from-[#7A2E2E] via-[#B85C3C] to-[#E8B572]",
  },
  {
    id: "d3",
    city: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    flightTime: "7h",
    flightHours: 7,
    weekendCost: 380,
    bestMonths: "Apr – Oct",
    vibes: ["Beach", "Nature"],
    accent: "from-[#1F5F5B] via-[#4A9EBF] to-[#9FD4C5]",
  },
  {
    id: "d4",
    city: "Seoul",
    country: "South Korea",
    flag: "🇰🇷",
    flightTime: "2h",
    flightHours: 2,
    weekendCost: 320,
    bestMonths: "Sep – Nov",
    vibes: ["City", "Culture"],
    accent: "from-[#2E3A5F] via-[#5B6EA8] to-[#A9B5D9]",
  },
  {
    id: "d5",
    city: "Taipei",
    country: "Taiwan",
    flag: "🇹🇼",
    flightTime: "3h",
    flightHours: 3,
    weekendCost: 290,
    bestMonths: "Oct – Apr",
    vibes: ["City", "Culture"],
    accent: "from-[#3B2F52] via-[#6E5A8F] to-[#C8B7DE]",
  },
  {
    id: "d6",
    city: "Hong Kong",
    country: "Hong Kong",
    flag: "🇭🇰",
    flightTime: "4h",
    flightHours: 4,
    weekendCost: 340,
    bestMonths: "Oct – Dec",
    vibes: ["City"],
    accent: "from-[#5A1F2A] via-[#A53F4F] to-[#E8A4A4]",
  },
  {
    id: "d7",
    city: "Osaka",
    country: "Japan",
    flag: "🇯🇵",
    flightTime: "1h 30m",
    flightHours: 1.5,
    weekendCost: 240,
    bestMonths: "Any",
    vibes: ["Culture"],
    accent: "from-[#4A3518] via-[#8B6B3F] to-[#E8D5A3]",
  },
  {
    id: "d8",
    city: "Chiang Mai",
    country: "Thailand",
    flag: "🇹🇭",
    flightTime: "6h",
    flightHours: 6,
    weekendCost: 220,
    bestMonths: "Nov – Feb",
    vibes: ["Nature"],
    accent: "from-[#2F4A2B] via-[#5E7D4C] to-[#B5C99A]",
  },
  {
    id: "d9",
    city: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    flightTime: "2h 30m",
    flightHours: 2.5,
    weekendCost: 240,
    bestMonths: "Sep – Nov",
    vibes: ["Culture"],
    accent: "from-[#2E4B6B] via-[#6EA8B8] to-[#F2D4A7]",
  },
  {
    id: "d10",
    city: "Prague",
    country: "Czech Republic",
    flag: "🇨🇿",
    flightTime: "varies",
    flightHours: 3,
    weekendCost: 210,
    bestMonths: "Oct – Nov",
    vibes: ["City", "Culture"],
    accent: "from-[#3F2F4A] via-[#7A5E8A] to-[#D4B5C9]",
  },
  {
    id: "d11",
    city: "Budapest",
    country: "Hungary",
    flag: "🇭🇺",
    flightTime: "varies",
    flightHours: 3,
    weekendCost: 190,
    bestMonths: "Sep – Nov",
    vibes: ["Party", "Culture"],
    accent: "from-[#5A3A2E] via-[#A86B4F] to-[#E8C99A]",
  },
];

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { name: "Housing", budgeted: 3200, spent: 3200, color: "#E8D5A3" },
  { name: "Weekend Trips", budgeted: 4000, spent: 1840, color: "#4A9EBF" },
  { name: "Daily Food", budgeted: 2400, spent: 890, color: "#B85C3C" },
  { name: "Transportation", budgeted: 800, spent: 210, color: "#9FD4C5" },
  { name: "Activities", budgeted: 600, spent: 180, color: "#C8B7DE" },
  { name: "Emergency Fund", budgeted: 1000, spent: 0, color: "#6E5A8F" },
  { name: "Miscellaneous", budgeted: 600, spent: 240, color: "#E8A4A4" },
];

export const BUDGET_TOTAL = BUDGET_CATEGORIES.reduce(
  (s, c) => s + c.budgeted,
  0
);
export const BUDGET_SPENT = BUDGET_CATEGORIES.reduce((s, c) => s + c.spent, 0);
export const BUDGET_REMAINING = BUDGET_TOTAL - BUDGET_SPENT;

export const SPENDING_TREND = [
  { week: "W1", spent: 420 },
  { week: "W2", spent: 380 },
  { week: "W3", spent: 510 },
  { week: "W4", spent: 640 },
  { week: "W5", spent: 490 },
  { week: "W6", spent: 720 },
  { week: "W7", spent: 580 },
  { week: "W8", spent: 820 },
  { week: "W9", spent: 610 },
];

export const ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    who: "Jake",
    action: "added",
    target: "Kyoto to trips",
    timeAgo: "2h ago",
  },
  {
    id: "a2",
    who: "Maya",
    action: "split",
    target: "$340 from Osaka weekend",
    timeAgo: "5h ago",
  },
  {
    id: "a3",
    who: "Priya",
    action: "joined",
    target: "Bali trip",
    timeAgo: "yesterday",
  },
  {
    id: "a4",
    who: "Sam",
    action: "updated budget for",
    target: "Bangkok trip",
    timeAgo: "yesterday",
  },
  {
    id: "a5",
    who: "Leo",
    action: "wishlisted",
    target: "Chiang Mai",
    timeAgo: "2d ago",
  },
];

export const HOME_CITIES = [
  "Tokyo",
  "London",
  "Barcelona",
  "Paris",
  "Rome",
  "Florence",
  "Copenhagen",
  "Prague",
  "Dublin",
  "Sydney",
];

export const BUDGET_PRESETS: Record<
  string,
  { monthly: number; weekendTrip: number }
> = {
  Tokyo: { monthly: 2200, weekendTrip: 340 },
  London: { monthly: 2600, weekendTrip: 260 },
  Barcelona: { monthly: 1800, weekendTrip: 200 },
  Paris: { monthly: 2400, weekendTrip: 240 },
  Rome: { monthly: 1900, weekendTrip: 220 },
  Florence: { monthly: 1700, weekendTrip: 210 },
  Copenhagen: { monthly: 2500, weekendTrip: 280 },
  Prague: { monthly: 1500, weekendTrip: 180 },
  Dublin: { monthly: 2000, weekendTrip: 230 },
  Sydney: { monthly: 2300, weekendTrip: 320 },
};

export const LIFESTYLE_MULTIPLIER: Record<string, number> = {
  Budget: 0.8,
  "Mid-range": 1.0,
  Comfortable: 1.3,
};

export const VIBES = ["Beach", "City", "Nature", "Culture", "Party"] as const;

/** Picsum seed → 1600x900 cover photo URL */
export function coverPhoto(seed: string, w = 1600, h = 900): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

/** Today falls within the trip's date range (inclusive). */
export function isTripActive(trip: Trip, now: Date = new Date()): boolean {
  const start = new Date(trip.startDate).getTime();
  const end = new Date(trip.endDate).getTime() + 24 * 60 * 60 * 1000 - 1;
  const t = now.getTime();
  return t >= start && t <= end;
}

/** Returns the trip currently happening, else the next upcoming non-completed trip, else null. */
export function pickCurrentOrNextTrip(trips: Trip[], now: Date = new Date()): Trip | null {
  const active = trips.find((t) => isTripActive(t, now));
  if (active) return active;
  const upcoming = trips
    .filter((t) => t.status !== "Completed" && new Date(t.startDate).getTime() > now.getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return upcoming[0] ?? null;
}

// Per-destination photo seeds (for Discover + trip cards)
export const DESTINATION_PHOTO_SEEDS: Record<string, string> = {
  Kyoto: "kyoto-temple",
  Bangkok: "bangkok-street",
  Bali: "bali-rice",
  Seoul: "seoul-night",
  Taipei: "taipei-market",
  "Hong Kong": "hongkong-skyline",
  Osaka: "osaka-neon",
  "Chiang Mai": "chiangmai-temple",
  Lisbon: "lisbon-tram",
  Prague: "prague-bridge",
  Budapest: "budapest-bath",
};
