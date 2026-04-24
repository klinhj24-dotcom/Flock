import type Anthropic from "@anthropic-ai/sdk";
import {
  searchFlightsTool,
  runSearchFlights,
} from "@/lib/flock-tools/search-flights";

// Registry of local tools. Add new tools here; the /api/chat loop
// picks them up automatically via name → handler.

export const FLOCK_TOOL_DEFINITIONS: Anthropic.Tool[] = [searchFlightsTool];

export const FLOCK_TOOL_HANDLERS: Record<
  string,
  (input: unknown) => Promise<unknown>
> = {
  search_flights: runSearchFlights,
};
