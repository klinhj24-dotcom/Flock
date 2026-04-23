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
    captain: "Henry",
    tripCaptain: "Henry",
    flightBooked: true,
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
  { name: "Henry", avatar: "HE", phone: "+15550000001" },
  { name: "Jake", avatar: "JK", phone: "+15550000002" },
  { name: "Maya", avatar: "MY", phone: "+15550000003" },
  { name: "Priya", avatar: "PR", phone: "+15550000004" },
  { name: "Sam", avatar: "SM", phone: "+15550000005" },
  { name: "Leo", avatar: "LE", phone: "+15550000006" },
  { name: "Nina", avatar: "NI", phone: "+15550000007" },
  { name: "Alex", avatar: "AL", phone: "+15550000008" },
  { name: "Chris", avatar: "CR", phone: "+15550000009" },
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
