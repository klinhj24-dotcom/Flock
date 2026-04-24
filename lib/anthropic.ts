import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Copy .env.local.example to .env.local and fill it in.",
    );
  }
  _client = new Anthropic({ apiKey });
  return _client;
}

export const MODELS = {
  chat: "claude-opus-4-7",
  utility: "claude-haiku-4-5",
} as const;

export type BuildMessageParams = {
  model?: string;
  system?: string;
  messages: Anthropic.MessageParam[];
  tools?: Anthropic.Tool[];
  maxTokens?: number;
  cacheable?: boolean;
};

// Builds a Messages API param object with Flock defaults.
// System content comes first in the cache prefix; passing cacheable: true attaches
// ephemeral cache_control so shared trip context reuses the cached prefix once it
// crosses the model's minimum cacheable size (4096 tokens on Opus 4.7).
export function buildCreateParams(
  p: BuildMessageParams,
): Anthropic.MessageCreateParamsNonStreaming {
  const system: Anthropic.MessageCreateParamsNonStreaming["system"] = p.system
    ? p.cacheable
      ? [
          {
            type: "text",
            text: p.system,
            cache_control: { type: "ephemeral" },
          },
        ]
      : p.system
    : undefined;

  const tools = p.tools && p.tools.length > 0 ? sortTools(p.tools) : undefined;

  return {
    model: p.model ?? MODELS.chat,
    max_tokens: p.maxTokens ?? 16000,
    ...(system !== undefined ? { system } : {}),
    ...(tools !== undefined ? { tools } : {}),
    messages: p.messages,
  };
}

// Deterministic tool ordering — tool list reorders silently invalidate the cache.
function sortTools(tools: Anthropic.Tool[]): Anthropic.Tool[] {
  return [...tools].sort((a, b) => a.name.localeCompare(b.name));
}
