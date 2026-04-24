import { z } from "zod";
import type { FlockTool } from "@/lib/flock-tools/types";
import { searchFlights } from "@/lib/duffel";

const InputSchema = z.object({
  origin_iata: z
    .string()
    .length(3)
    .transform((s) => s.toUpperCase()),
  destination_iata: z
    .string()
    .length(3)
    .transform((s) => s.toUpperCase()),
  departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  return_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  adults: z.number().int().min(1).max(9),
  cabin_class: z
    .enum(["economy", "premium_economy", "business", "first"])
    .optional(),
});

export const searchFlightsTool: FlockTool = {
  definition: {
    name: "search_flights",
    description:
      "Search real flight offers via Duffel. Returns up to 5 cheapest options. Uses IATA airport codes. Always convert city names to IATA before calling (e.g. Berlin → BER, London → LHR). Never auto-book — just return options.",
    input_schema: {
      type: "object",
      properties: {
        origin_iata: {
          type: "string",
          description:
            "Origin airport IATA code, 3 letters (e.g. LHR, JFK, FCO).",
        },
        destination_iata: {
          type: "string",
          description:
            "Destination airport IATA code, 3 letters (e.g. BER, CDG, BCN).",
        },
        departure_date: {
          type: "string",
          description: "Departure date, YYYY-MM-DD.",
        },
        return_date: {
          type: "string",
          description: "Return date, YYYY-MM-DD. Omit for one-way.",
        },
        adults: {
          type: "integer",
          description: "Number of adult passengers (1-9).",
          minimum: 1,
          maximum: 9,
        },
        cabin_class: {
          type: "string",
          enum: ["economy", "premium_economy", "business", "first"],
          description: "Defaults to economy.",
        },
      },
      required: ["origin_iata", "destination_iata", "departure_date", "adults"],
    },
  },
  run: async (rawInput) => {
    const input = InputSchema.parse(rawInput);

    const offers = await searchFlights({
      origin: input.origin_iata,
      destination: input.destination_iata,
      departureDate: input.departure_date,
      returnDate: input.return_date,
      adults: input.adults,
      cabinClass: input.cabin_class,
    });

    const top = [...offers]
      .sort((a, b) => Number(a.total_amount) - Number(b.total_amount))
      .slice(0, 5);

    return {
      count: offers.length,
      returned: top.length,
      offers: top.map((o) => ({
        id: o.id,
        price: `${o.total_currency} ${o.total_amount}`,
        carrier: o.owner.name,
        slices: o.slices.map((s) => {
          const first = s.segments[0];
          const last = s.segments[s.segments.length - 1];
          return {
            from: s.origin.iata_code,
            to: s.destination.iata_code,
            duration: s.duration,
            stops: s.segments.length - 1,
            departure: first?.departing_at,
            arrival: last?.arriving_at,
          };
        }),
      })),
    };
  },
};
