export type TripStatus = "Planning" | "Confirmed" | "Completed";

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
    actualCost: 310,
    status: "Completed",
    accent: "from-[#2E3A5F] via-[#5B6EA8] to-[#A9B5D9]",
  },
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
