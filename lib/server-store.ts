import { TRIPS, type Trip, type TripExpense } from "@/lib/mock-data";

// Simple in-memory overlay on top of the static TRIPS mock. Seeded lazily per
// tripId; only stores additions, so the base trip data stays untouched.
//
// Caveats (fine for M1 demo, plan to replace in M3 when we add a real DB):
// - Resets on server restart and on dev-server reload.
// - Not safe across multiple Node worker processes (in prod each worker has
//   its own map; reads/writes won't agree). Single process during dev is fine.

export type ItineraryOption = {
  id: string;
  slot: string; // "Fri-dinner", "Sat-afternoon", etc.
  title: string;
  description?: string;
  sourceToolUseId?: string;
  votes: Record<string, "up" | "down">; // person name -> vote
  createdAt: string;
};

type TripOverlay = {
  addedExpenses: TripExpense[];
  proposals: ItineraryOption[];
};

const overlays = new Map<string, TripOverlay>();

function getOverlay(tripId: string): TripOverlay {
  let o = overlays.get(tripId);
  if (!o) {
    o = { addedExpenses: [], proposals: [] };
    overlays.set(tripId, o);
  }
  return o;
}

function baseTrip(tripId: string): Trip | undefined {
  return TRIPS.find((t) => t.id === tripId);
}

export type TripWithProposals = Trip & { proposals: ItineraryOption[] };

export function getTrip(tripId: string): TripWithProposals | undefined {
  const base = baseTrip(tripId);
  if (!base) return undefined;
  const o = getOverlay(tripId);
  return {
    ...base,
    expenses: [...(base.expenses ?? []), ...o.addedExpenses],
    proposals: [...o.proposals],
  };
}

export function addExpense(
  tripId: string,
  expense: Omit<TripExpense, "id">,
): TripExpense {
  if (!baseTrip(tripId)) throw new Error(`Unknown trip: ${tripId}`);
  const o = getOverlay(tripId);
  const id = `e-added-${Date.now().toString(36)}-${o.addedExpenses.length}`;
  const record: TripExpense = { ...expense, id };
  o.addedExpenses.push(record);
  return record;
}

export function proposeOption(
  tripId: string,
  input: Omit<ItineraryOption, "id" | "votes" | "createdAt">,
): ItineraryOption {
  if (!baseTrip(tripId)) throw new Error(`Unknown trip: ${tripId}`);
  const o = getOverlay(tripId);
  const id = `prop-${Date.now().toString(36)}-${o.proposals.length}`;
  const option: ItineraryOption = {
    ...input,
    id,
    votes: {},
    createdAt: new Date().toISOString(),
  };
  o.proposals.push(option);
  return option;
}

export function voteOnOption(
  tripId: string,
  optionId: string,
  voter: string,
  vote: "up" | "down",
): ItineraryOption | undefined {
  const o = getOverlay(tripId);
  const option = o.proposals.find((p) => p.id === optionId);
  if (!option) return undefined;
  option.votes[voter] = vote;
  return option;
}

export type BudgetStatus = {
  totalBudget: number;
  currency: string;
  groupSize: number;
  perPersonCap: number;
  spentTotal: number;
  remainingTotal: number;
  perPersonOwed: Record<string, number>;
  balances: Array<{ person: string; net: number }>;
};

// Computes split/balance math off the merged expense list.
// net > 0 means the group owes this person; net < 0 means they owe the group.
export function getBudgetStatus(tripId: string): BudgetStatus | undefined {
  const trip = getTrip(tripId);
  if (!trip) return undefined;

  const groupSize = trip.people.length;
  const totalBudget = trip.estimatedCost;
  const perPersonCap = groupSize > 0 ? totalBudget / groupSize : totalBudget;
  const expenses = trip.expenses ?? [];
  const spentTotal = expenses.reduce((s, e) => s + e.amount, 0);

  const perPersonOwed: Record<string, number> = Object.fromEntries(
    trip.people.map((p) => [p, 0]),
  );
  for (const e of expenses) {
    if (e.splitBetween.length === 0) continue;
    const share = e.amount / e.splitBetween.length;
    for (const p of e.splitBetween) {
      perPersonOwed[p] = (perPersonOwed[p] ?? 0) + share;
    }
  }

  const balances = trip.people.map((p) => {
    const paid = expenses
      .filter((e) => e.paidBy === p)
      .reduce((s, e) => s + e.amount, 0);
    const owed = perPersonOwed[p] ?? 0;
    return { person: p, net: Number((paid - owed).toFixed(2)) };
  });

  return {
    totalBudget,
    currency: "EUR",
    groupSize,
    perPersonCap: Number(perPersonCap.toFixed(2)),
    spentTotal: Number(spentTotal.toFixed(2)),
    remainingTotal: Number((totalBudget - spentTotal).toFixed(2)),
    perPersonOwed: Object.fromEntries(
      Object.entries(perPersonOwed).map(([k, v]) => [k, Number(v.toFixed(2))]),
    ),
    balances,
  };
}
