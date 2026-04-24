import { z } from "zod";
import type { FlockTool } from "@/lib/flock-tools/types";
import { voteOnOption, getTrip } from "@/lib/server-store";

const InputSchema = z.object({
  option_id: z.string().min(1),
  voter: z.string().min(1),
  vote: z.enum(["up", "down"]),
});

export const voteOnOptionTool: FlockTool = {
  definition: {
    name: "vote_on_option",
    description:
      "Record a group member's up/down vote on a previously-proposed itinerary option. Use the option_id returned from propose_itinerary_option.",
    input_schema: {
      type: "object",
      properties: {
        option_id: { type: "string", description: "ID of the proposal." },
        voter: {
          type: "string",
          description:
            "Name of the person voting (must be a member of the trip).",
        },
        vote: {
          type: "string",
          enum: ["up", "down"],
          description: "up = yes, down = no.",
        },
      },
      required: ["option_id", "voter", "vote"],
    },
  },
  run: async (rawInput, ctx) => {
    if (!ctx.tripId) {
      throw new Error(
        "vote_on_option requires a trip context — open the chat from a specific trip.",
      );
    }
    const input = InputSchema.parse(rawInput);
    const trip = getTrip(ctx.tripId);
    if (!trip) throw new Error(`Unknown trip: ${ctx.tripId}`);
    if (!trip.people.includes(input.voter)) {
      throw new Error(
        `voter '${input.voter}' is not on this trip (members: ${trip.people.join(", ")}).`,
      );
    }
    const option = voteOnOption(
      ctx.tripId,
      input.option_id,
      input.voter,
      input.vote,
    );
    if (!option) {
      throw new Error(`Unknown option_id: ${input.option_id}`);
    }
    const upCount = Object.values(option.votes).filter((v) => v === "up").length;
    const downCount = Object.values(option.votes).filter((v) => v === "down").length;
    return {
      option,
      tally: { up: upCount, down: downCount, total: trip.people.length },
    };
  },
};
