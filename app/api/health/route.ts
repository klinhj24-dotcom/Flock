import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropic, MODELS } from "@/lib/anthropic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shouldPing = url.searchParams.get("ping") === "1";
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);

  if (!shouldPing) {
    return NextResponse.json({ ok: true, anthropicKey: hasKey });
  }

  if (!hasKey) {
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY not set" },
      { status: 500 },
    );
  }

  try {
    const client = getAnthropic();
    const res = await client.messages.create({
      model: MODELS.utility,
      max_tokens: 32,
      messages: [{ role: "user", content: "Reply with the single word: ok" }],
    });
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    return NextResponse.json({
      ok: true,
      anthropicKey: true,
      model: res.model,
      text,
      usage: res.usage,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
