import { z } from "zod";
import type { FlockTool } from "@/lib/flock-tools/types";
import { proposeOption } from "@/lib/server-store";

const InputSchema = z.object({
  slot: z
    .string()
    .min(1)
    .max(60)
    .describe(
      "When the option fits in the trip, e.g. 'Fri dinner', 'Sat afternoon', 'Sun morning hike'.",
    ),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  source_tool_use_id: z
    .string()
    .optional()
    .describe(
      "Optional: the id of a search_flights / hotel / activity tool_use block this proposal came from, so voters can trace it back.",
    ),
});

export const proposeItineraryOptionTool: FlockTool = {
  definition: {
    name: "propose_itinerary_option",
    description:
      "Propose an itinerary option for the group to vote on. Use this when the user (or the group) hasn't committed yet and wants to surface choices — e.g. 'Sat dinner: Prater Garten' or 'Sun morning: Spreewald hike'. Each proposal is scoped to a time slot and gets a vote card in chat. Don't use for flights/hotels you're going to book — use for activity/food/experience choices that the group needs to pick between.",
    input_schema: {
      type: "object",
      properties: {
        slot: {
          type: "string",
          description:
            "When the option fits, e.g. 'Fri dinner', 'Sat afternoon'.",
        },
        title: {
          type: "string",
          description: "Short name of the option, e.g. 'Prater Garten biergarten'.",
        },
        description: {
          type: "string",
          description:
            "One-sentence context: why it fits, price ballpark, vibe, link if you have one.",
        },
        source_tool_use_id: {
          type: "string",
          description:
            "If this came from a specific tool_use result, the tool_use id (for traceability).",
        },
      },
      required: ["slot", "title"],
    },
  },
  run: async (rawInput, ctx) => {
    if (!ctx.tripId) {
      throw new Error(
        "propose_itinerary_option requires a trip context — open the chat from a specific trip.",
      );
    }
    const input = InputSchema.parse(rawInput);
    const option = proposeOption(ctx.tripId, {
      slot: input.slot,
      title: input.title,
      description: input.description,
      sourceToolUseId: input.source_tool_use_id,
    });
    return { option };
  },
};
