import type Anthropic from "@anthropic-ai/sdk";
import type { FlockTool, ToolContext, ToolHandler } from "@/lib/flock-tools/types";
import { searchFlightsTool } from "@/lib/flock-tools/search-flights";
import { addExpenseTool } from "@/lib/flock-tools/add-expense";
import { getGroupBudgetTool } from "@/lib/flock-tools/get-group-budget";

// Registry. Add a new tool here and the /api/chat loop picks it up.
const TOOLS: FlockTool[] = [
  searchFlightsTool,
  addExpenseTool,
  getGroupBudgetTool,
];

export const FLOCK_TOOL_DEFINITIONS: Anthropic.Tool[] = TOOLS.map(
  (t) => t.definition,
);

export const FLOCK_TOOL_HANDLERS: Record<string, ToolHandler> =
  Object.fromEntries(TOOLS.map((t) => [t.definition.name, t.run]));

export type { ToolContext };
