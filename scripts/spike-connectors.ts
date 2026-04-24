// scripts/spike-connectors.ts
//
// One-shot spike against Anthropic's Messages API `mcp_servers` param.
// Goal: for each Apr 22 2026 consumer connector, verify whether there's a
// callable public MCP URL we can use from Flock's backend.
//
// Run:
//   cp .env.local.example .env.local  # fill in ANTHROPIC_API_KEY
//   npm run spike
//
// Current state per URL research (2026-04-24):
// - Kiwi.com:    public Streamable-HTTP MCP at https://mcp.kiwi.com
// - Everything else: no public URL — gated through Anthropic's claude.ai
//   first-party OAuth broker, not addressable from third-party code.
//
// The `null` URL entries below are kept intentionally so this script doubles
// as a documented record of what we tested.

import Anthropic from "@anthropic-ai/sdk";

type Connector = {
  name: string;
  url: string | null;
  prompt: string;
  notes?: string;
};

const CONNECTORS: Connector[] = [
  {
    name: "kiwi",
    url: "https://mcp.kiwi.com",
    prompt:
      "Find the two cheapest flights from London to Berlin for the first weekend of next month. Use available tools. Just list the options — don't book.",
    notes: "Alpic-built public MCP, Streamable HTTP, no auth for search-flight",
  },
  {
    name: "booking",
    url: null,
    prompt: "",
    notes: "Apr 22 2026 launch — claude.ai first-party OAuth only, no public MCP URL",
  },
  {
    name: "viator",
    url: null,
    prompt: "",
    notes: "Apr 22 2026 launch — claude.ai first-party OAuth only, no public MCP URL",
  },
  {
    name: "tripadvisor",
    url: null,
    prompt: "",
    notes: "Apr 22 2026 launch — claude.ai first-party OAuth only, no public MCP URL",
  },
  {
    name: "alltrails",
    url: null,
    prompt: "",
    notes: "Apr 22 2026 launch — claude.ai first-party OAuth only, no public MCP URL",
  },
  {
    name: "stubhub",
    url: null,
    prompt: "",
    notes: "Apr 23 2026 launch — claude.ai first-party OAuth only, no public MCP URL",
  },
];

const BETA_HEADER = "mcp-client-2025-11-20";
const MODEL = "claude-haiku-4-5";

type Block = { type: string; [k: string]: unknown };

type RunResult = {
  name: string;
  status: "ok" | "reached_but_no_calls" | "error" | "skipped";
  detail?: string;
};

async function runOne(client: Anthropic, c: Connector): Promise<RunResult> {
  if (!c.url) {
    console.log(`[${c.name.padEnd(12)}] SKIP  ${c.notes ?? "no URL"}`);
    return { name: c.name, status: "skipped", detail: c.notes };
  }

  const params: Record<string, unknown> = {
    model: MODEL,
    max_tokens: 2048,
    mcp_servers: [
      {
        type: "url",
        url: c.url,
        name: c.name,
      },
    ],
    // mcp-client-2025-11-20 requires an mcp_toolset entry per server to expose its tools
    tools: [
      {
        type: "mcp_toolset",
        mcp_server_name: c.name,
      },
    ],
    messages: [{ role: "user", content: c.prompt }],
    betas: [BETA_HEADER],
  };

  try {
    // The SDK's typed `mcp_servers` binding lags this beta — cast through.
    const create = client.beta.messages.create.bind(
      client.beta.messages,
    ) as unknown as (
      p: Record<string, unknown>,
    ) => Promise<{ content: unknown }>;
    const res = await create(params);

    const blocks = (res.content ?? []) as Block[];
    const mcpUses = blocks.filter((b) => b.type === "mcp_tool_use") as Array<
      Block & { name: string; input: unknown }
    >;
    const mcpResults = blocks.filter(
      (b) => b.type === "mcp_tool_result",
    ) as Array<Block & { is_error?: boolean }>;
    const textBlocks = blocks.filter((b) => b.type === "text") as Array<
      Block & { text: string }
    >;
    const text = textBlocks
      .map((b) => b.text)
      .join(" ")
      .slice(0, 220);
    const toolErrors = mcpResults.filter((r) => r.is_error === true).length;

    console.log(
      `[${c.name.padEnd(12)}] OK    tool_calls=${mcpUses.length}  tool_results=${mcpResults.length}  tool_errors=${toolErrors}`,
    );
    for (const u of mcpUses) {
      console.log(`    → ${u.name}(${JSON.stringify(u.input).slice(0, 180)})`);
    }
    if (text) console.log(`    text: ${text}${text.length >= 220 ? "…" : ""}`);

    // "ok" if at least one tool call came back clean; all-failed or zero-calls → reached_but_no_calls
    return {
      name: c.name,
      status:
        mcpUses.length > 0 && toolErrors < mcpUses.length
          ? "ok"
          : "reached_but_no_calls",
    };
  } catch (e) {
    const err = e as {
      status?: number;
      message?: string;
      error?: { message?: string };
    };
    const httpStatus = err.status ?? "?";
    const msg = (err.error?.message ?? err.message ?? String(e)).slice(0, 280);
    console.log(`[${c.name.padEnd(12)}] FAIL  status=${httpStatus}  ${msg}`);
    return { name: c.name, status: "error", detail: msg };
  }
}

async function main(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set.");
    console.error(
      "  cp .env.local.example .env.local   # then fill in the key",
    );
    console.error(
      '  env $(grep -v "^#" .env.local | xargs) npm run spike',
    );
    process.exit(1);
  }

  const configured = CONNECTORS.filter((c) => c.url).length;
  console.log(
    `Spike: ${configured} live / ${CONNECTORS.length - configured} skipped via /v1/messages + mcp_servers (beta: ${BETA_HEADER}, model: ${MODEL})\n`,
  );

  const client = new Anthropic();
  const results: RunResult[] = [];
  for (const c of CONNECTORS) {
    results.push(await runOne(client, c));
    console.log();
  }

  console.log("─".repeat(64));
  console.log("Summary:");
  for (const r of results) {
    const label = r.name.padEnd(12);
    const status = r.status.padEnd(22);
    const detail = r.detail ? ` — ${r.detail}` : "";
    console.log(`  ${label} ${status}${detail}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
