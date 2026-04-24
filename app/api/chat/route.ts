import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropic, MODELS } from "@/lib/anthropic";
import {
  FLOCK_TOOL_DEFINITIONS,
  FLOCK_TOOL_HANDLERS,
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
          const out = await handler(tu.input);
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
  });
}
