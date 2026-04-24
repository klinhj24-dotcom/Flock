import { z } from "zod";
import type { FlockTool } from "@/lib/flock-tools/types";

// The actual chip state lives on the client. This tool is a signal: when
// Claude infers a constraint from natural language (e.g. user said
// "walkable to old town" → distance=1km), it calls this and the /api/chat
// route pipes the delta back in the response so the drawer can update the
// chip UI. This is the "show your work" UX move — users see chips move
// when Claude parses their sentence, and can correct them inline.

const InputSchema = z.object({
  budget_per_person: z.number().positive().optional(),
  currency: z.enum(["EUR", "USD", "GBP"]).optional(),
  dates_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dates_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dates_flex_days: z.number().int().min(0).max(14).optional(),
  group_size: z.number().int().positive().optional(),
  home_airport: z.string().length(3).optional(),
  stay_max_per_night: z.number().positive().optional(),
  stay_max_distance_km: z.number().positive().optional(),
  vibe: z.array(z.string()).optional(),
  transport_mode: z.array(z.enum(["fly", "train", "bus"])).optional(),
  reason: z
    .string()
    .max(160)
    .optional()
    .describe(
      "Short explanation of why you're setting these, so the user knows what you heard.",
    ),
});

export type ChipValuesUpdate = z.infer<typeof InputSchema>;

export const updateChipValuesTool: FlockTool = {
  definition: {
    name: "update_chip_values",
    description:
      "Reflect user-inferred constraints back into the visible trip parameter chips. Use this when you've understood something from free-form chat that belongs in a chip — e.g. the user says 'walkable to old town', you call this with stay_max_distance_km: 1 and a brief reason. Only set fields the user actually implied. Do NOT use this to silently invent constraints the user didn't mention.",
    input_schema: {
      type: "object",
      properties: {
        budget_per_person: { type: "number" },
        currency: { type: "string", enum: ["EUR", "USD", "GBP"] },
        dates_start: {
          type: "string",
          description: "YYYY-MM-DD",
        },
        dates_end: { type: "string", description: "YYYY-MM-DD" },
        dates_flex_days: { type: "integer" },
        group_size: { type: "integer" },
        home_airport: {
          type: "string",
          description: "3-letter IATA",
        },
        stay_max_per_night: { type: "number" },
        stay_max_distance_km: { type: "number" },
        vibe: {
          type: "array",
          items: {
            type: "string",
            enum: ["party", "chill", "culture", "outdoors"],
          },
        },
        transport_mode: {
          type: "array",
          items: { type: "string", enum: ["fly", "train", "bus"] },
        },
        reason: {
          type: "string",
          description:
            "Brief 1-sentence note on what you heard (<=160 chars).",
        },
      },
    },
  },
  run: async (rawInput) => {
    // No server-side effect; the route captures the input and pipes it
    // back to the client in the response envelope (chipUpdates field).
    const parsed = InputSchema.parse(rawInput);
    return { applied: parsed };
  },
};
