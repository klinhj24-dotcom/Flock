import type { FlockTool } from "@/lib/flock-tools/types";
import { getBudgetStatus } from "@/lib/server-store";

export const getGroupBudgetTool: FlockTool = {
  definition: {
    name: "get_group_budget",
    description:
      "Report the group's budget for the current trip: total cap, per-person share, spent so far, remaining, and the net balance per person (positive = group owes them; negative = they owe the group).",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  run: async (_input, ctx) => {
    if (!ctx.tripId) {
      throw new Error(
        "get_group_budget requires a trip context — open the chat from a specific trip.",
      );
    }
    const budget = getBudgetStatus(ctx.tripId);
    if (!budget) throw new Error(`Unknown trip: ${ctx.tripId}`);
    return budget;
  },
};
