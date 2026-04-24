import type { Trip } from "@/lib/mock-data";

export type ChipValues = {
  budgetPerPerson?: number;
  currency?: string;
  dates?: { start?: string; end?: string; flexDays?: number };
  groupSize?: number;
  homeAirport?: string;
  stayMaxPerNight?: number;
  stayMaxDistanceKm?: number;
  vibe?: string[];
  transportMode?: Array<"fly" | "train" | "bus">;
};

export function buildSystemPrompt(opts: {
  trip?: Trip;
  chipValues?: ChipValues;
}): string {
  const lines: string[] = [];

  lines.push(
    "You are Flock's trip-planning assistant for a small group of study-abroad students (usually 2-8 people) planning short weekend trips within Europe.",
    "Be terse and practical. Present options, never essays. Default to lists over prose.",
    "Never auto-book anything — always present options and wait for explicit user confirmation.",
    "",
  );

  if (opts.trip) {
    lines.push("# Current trip");
    lines.push(
      `- Destination: ${opts.trip.city}, ${opts.trip.country} ${opts.trip.flag}`,
    );
    lines.push(`- Dates: ${opts.trip.startDate} → ${opts.trip.endDate}`);
    lines.push(
      `- Group (${opts.trip.people.length}): ${opts.trip.people.join(", ")}`,
    );
    lines.push(`- Estimated budget: €${opts.trip.estimatedCost} total`);
    lines.push(`- Status: ${opts.trip.status}`);
    lines.push("");
  }

  if (opts.chipValues && Object.keys(opts.chipValues).length > 0) {
    lines.push(
      "# User preferences (chip values — soft defaults; user may override in chat)",
    );
    for (const [k, v] of Object.entries(opts.chipValues)) {
      if (v === undefined || v === null) continue;
      lines.push(`- ${k}: ${JSON.stringify(v)}`);
    }
    lines.push("");
  }

  lines.push("# Tool usage");
  lines.push(
    "- search_flights (Duffel): primary flight search. Use IATA codes. Convert city names to IATA yourself (Berlin → BER; London → LHR; Paris → CDG; Barcelona → BCN; Rome → FCO; Amsterdam → AMS; Prague → PRG; Vienna → VIE; Budapest → BUD; Zurich → ZRH).",
    "- kiwi (MCP): secondary flight search, useful when Duffel returns nothing.",
    "- When showing flight results, list at most 3 options per message: carrier · dep time → arr time · stops · price.",
  );

  return lines.join("\n");
}
