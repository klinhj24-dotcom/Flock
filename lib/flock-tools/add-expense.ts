import { z } from "zod";
import type { FlockTool } from "@/lib/flock-tools/types";
import { addExpense, getBudgetStatus } from "@/lib/server-store";
import { TRIPS } from "@/lib/mock-data";

const InputSchema = z.object({
  description: z.string().min(1).max(200),
  amount: z.number().positive(),
  paid_by: z.string().min(1),
  split_between: z
    .array(z.string().min(1))
    .min(1)
    .describe(
      'Names to split between, or ["all"] to split across every trip member.',
    ),
});

export const addExpenseTool: FlockTool = {
  definition: {
    name: "add_expense",
    description:
      "Add a shared group expense to the current trip. Returns the created expense plus updated group balances. The amount should be in the trip's currency (EUR by default). If the user says 'split across everyone' or similar, pass split_between: ['all'].",
    input_schema: {
      type: "object",
      properties: {
        description: {
          type: "string",
          description:
            "Human-readable label, e.g. 'Group dinner at Prater Garten'.",
        },
        amount: {
          type: "number",
          description: "Total amount paid, in the trip's currency (EUR).",
        },
        paid_by: {
          type: "string",
          description: "Name of the person who paid (must be on the trip).",
        },
        split_between: {
          type: "array",
          items: { type: "string" },
          description:
            'Names of people splitting the cost, or ["all"] for everyone on the trip.',
        },
      },
      required: ["description", "amount", "paid_by", "split_between"],
    },
  },
  run: async (rawInput, ctx) => {
    if (!ctx.tripId) {
      throw new Error(
        "add_expense requires a trip context — open the chat from a specific trip.",
      );
    }
    const input = InputSchema.parse(rawInput);
    const trip = TRIPS.find((t) => t.id === ctx.tripId);
    if (!trip) throw new Error(`Unknown trip: ${ctx.tripId}`);

    const members = new Set(trip.people);
    if (!members.has(input.paid_by)) {
      throw new Error(
        `paid_by '${input.paid_by}' is not a member of this trip (members: ${trip.people.join(", ")}).`,
      );
    }
    const split =
      input.split_between.length === 1 &&
      input.split_between[0]?.toLowerCase() === "all"
        ? [...trip.people]
        : input.split_between;
    for (const p of split) {
      if (!members.has(p)) {
        throw new Error(
          `split_between contains '${p}', who is not on this trip.`,
        );
      }
    }

    const expense = addExpense(ctx.tripId, {
      description: input.description,
      amount: input.amount,
      paidBy: input.paid_by,
      splitBetween: split,
    });
    const budget = getBudgetStatus(ctx.tripId);

    return {
      expense,
      budget_summary: budget
        ? {
            spent_total: budget.spentTotal,
            remaining_total: budget.remainingTotal,
            per_person_cap: budget.perPersonCap,
            balances: budget.balances,
          }
        : null,
    };
  },
};
