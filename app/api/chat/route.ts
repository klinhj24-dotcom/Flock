import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropic, MODELS } from "@/lib/anthropic";
import {
  FLOCK_TOOL_DEFINITIONS,
  FLOCK_TOOL_HANDLERS,
  type ToolContext,
} from "@/lib/flock-tools";
import { buildSystemPrompt, type ChipValues } from "@/lib/chat-prompt";
import { TRIPS } from "@/lib/mock-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MCP_BETA = "mcp-client-2025-11-20";
const MAX_TOOL_ITERATIONS = 6;

type ChatRequestBody = {
  tripId?: string;
  messages: Anthropic.MessageParam[];
  chipValues?: ChipValues;
};

type Block = { type: string; [k: string]: unknown };

export async function POST(req: Request) {
  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const { tripId, messages, chipValues } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages must be a non-empty array" },
      { status: 400 },
    );
  }

  const trip = tripId ? TRIPS.find((t) => t.id === tripId) : undefined;
  const system = buildSystemPrompt({ trip, chipValues });
  const toolCtx: ToolContext = { tripId };

  const client = getAnthropic();

  // Tool registry combining local (run in-process) + MCP toolsets (run by Anthropic).
  const tools: unknown[] = [
    ...FLOCK_TOOL_DEFINITIONS,
    { type: "mcp_toolset", mcp_server_name: "kiwi" },
  ];
  const mcpServers = [
    { type: "url", url: "https://mcp.kiwi.com", name: "kiwi" },
  ];

  const workingMessages: Anthropic.MessageParam[] = [...messages];
  let lastContent: Block[] = [];
  let stopReason: string | undefined;
  // Merged update_chip_values inputs from any iteration; piped back to the UI.
  const chipUpdates: Record<string, unknown> = {};

  for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
    const params: Record<string, unknown> = {
      model: MODELS.chat,
      max_tokens: 4096,
      system,
      tools,
      mcp_servers: mcpServers,
      messages: workingMessages,
      betas: [MCP_BETA],
      output_config: { effort: "medium" },
    };

    // SDK types for mcp_servers/mcp_toolset lag the beta — cast through unknown.
    const create = client.beta.messages.create.bind(
      client.beta.messages,
    ) as unknown as (
      p: Record<string, unknown>,
    ) => Promise<{ content: unknown; stop_reason?: string | null }>;

    const res = await create(params);
    lastContent = (res.content ?? []) as Block[];
    stopReason = res.stop_reason ?? undefined;

    // Find local tool calls that we need to execute. MCP tool calls are
    // resolved by Anthropic server-side and appear in the same response.
    const localToolUses = lastContent.filter(
      (b) => b.type === "tool_use",
    ) as Array<Block & { id: string; name: string; input: unknown }>;

    // pause_turn: Anthropic's server-side MCP loop hit its iteration cap
    // with work still pending. Append the assistant content unchanged and
    // re-request — the server detects the trailing server_tool_use and
    // resumes where it left off. No user message to add.
    if (localToolUses.length === 0 && stopReason === "pause_turn") {
      workingMessages.push({
        role: "assistant",
        content: lastContent as unknown as Anthropic.MessageParam["content"],
      });
      continue;
    }

    if (localToolUses.length === 0) break;

    workingMessages.push({
      role: "assistant",
      content: lastContent as unknown as Anthropic.MessageParam["content"],
    });

    const toolResults = await Promise.all(
      localToolUses.map(async (tu) => {
        const handler = FLOCK_TOOL_HANDLERS[tu.name];
        if (!handler) {
          return {
            type: "tool_result" as const,
            tool_use_id: tu.id,
            content: `Unknown tool: ${tu.name}`,
            is_error: true,
          };
        }
        try {
          const out = await handler(tu.input, toolCtx);
          // update_chip_values is a pure signal tool — merge its validated
          // input into the response envelope so the drawer can reflect it.
          if (tu.name === "update_chip_values" && out && typeof out === "object") {
            const applied = (out as { applied?: Record<string, unknown> }).applied;
            if (applied) Object.assign(chipUpdates, applied);
          }
          return {
            type: "tool_result" as const,
            tool_use_id: tu.id,
            content: JSON.stringify(out),
          };
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return {
            type: "tool_result" as const,
            tool_use_id: tu.id,
            content: msg,
            is_error: true,
          };
        }
      }),
    );

    workingMessages.push({
      role: "user",
      content: toolResults as unknown as Anthropic.MessageParam["content"],
    });
  }

  return NextResponse.json({
    content: lastContent,
    messages: workingMessages,
    stopReason,
    chipUpdates: Object.keys(chipUpdates).length > 0 ? chipUpdates : undefined,
  });
}
