import type Anthropic from "@anthropic-ai/sdk";

// Context passed to tool handlers. Populated per-request by /api/chat.
export type ToolContext = {
  tripId?: string;
};

export type ToolHandler = (
  input: unknown,
  ctx: ToolContext,
) => Promise<unknown>;

export type FlockTool = {
  definition: Anthropic.Tool;
  run: ToolHandler;
};
