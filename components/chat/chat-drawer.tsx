"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Send, Sparkles, Plane, Wrench } from "lucide-react";
import type { Trip } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ChipBar,
  type ChipValues,
  deriveDefaultChipValues,
} from "@/components/chat/chip-bar";

type Role = "user" | "assistant";

type ContentBlock =
  | { type: "text"; text: string }
  | {
      type: "tool_use";
      id: string;
      name: string;
      input: unknown;
    }
  | {
      type: "tool_result";
      tool_use_id: string;
      content: unknown;
      is_error?: boolean;
    }
  | {
      type: "mcp_tool_use";
      id: string;
      name: string;
      input: unknown;
      server_name?: string;
    }
  | {
      type: "mcp_tool_result";
      tool_use_id: string;
      content: unknown;
      is_error?: boolean;
    }
  | { type: "thinking"; thinking?: string };

type UIMessage = {
  role: Role;
  content: string | ContentBlock[];
};

export function ChatDrawer({
  trip,
  open,
  onClose,
  onTurnComplete,
}: {
  trip: Trip;
  open: boolean;
  onClose: () => void;
  onTurnComplete?: () => void;
}) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Derive chip defaults from the trip at mount; the user can then override.
  // Keyed by trip.id so opening a different trip re-derives.
  const initialChips = useMemo(() => deriveDefaultChipValues(trip), [trip.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const [chipValues, setChipValues] = useState<ChipValues>(initialChips);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!open) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const next: UIMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const apiMessages = next.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: trip.id,
          messages: apiMessages,
          chipValues,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`${res.status} ${msg.slice(0, 200)}`);
      }
      const data = (await res.json()) as {
        content: ContentBlock[];
        stopReason?: string;
      };
      setMessages([
        ...next,
        { role: "assistant", content: data.content ?? [] },
      ]);
      onTurnComplete?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-border bg-surface shadow-2xl sm:w-[480px]">
        <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="text-[14px] font-medium text-text-primary">
              Plan with Flock
            </div>
            <div className="text-[12px] text-text-muted">
              · {trip.flag} {trip.city}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-muted transition hover:bg-surface-hover hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ChipBar value={chipValues} onChange={setChipValues} />

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 && (
            <div className="mt-6 text-center text-[13px] text-text-muted">
              Ask about flights, hotels, activities, or group expenses.
              <div className="mt-3 inline-block rounded-lg border border-border bg-background px-3 py-2 text-left text-[12px] text-text-primary">
                “Find flights from LHR to {trip.city} for {trip.people.length}{" "}
                adults next weekend.”
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <MessageRow key={i} message={m} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-[12px] text-text-muted">
              <Sparkles className="h-3 w-3 animate-pulse text-primary" />
              Thinking…
            </div>
          )}
          {error && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-[12px] text-red-500">
              {error}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="flex items-end gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={loading}
              placeholder={`Plan ${trip.city} with the crew…`}
              rows={1}
              className="flex-1 resize-none bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
              style={{ maxHeight: 120 }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="rounded p-1.5 text-primary transition hover:bg-primary/10 disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function MessageRow({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const blocks: ContentBlock[] =
    typeof message.content === "string"
      ? [{ type: "text", text: message.content }]
      : message.content;

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[92%] space-y-2",
          isUser ? "ml-auto" : "mr-auto w-full",
        )}
      >
        {blocks.map((b, i) => (
          <BlockRow key={i} block={b} isUser={isUser} />
        ))}
      </div>
    </div>
  );
}

function BlockRow({
  block,
  isUser,
}: {
  block: ContentBlock;
  isUser: boolean;
}) {
  if (block.type === "text") {
    return (
      <div
        className={cn(
          "whitespace-pre-wrap rounded-lg px-3 py-2 text-[13px]",
          isUser
            ? "bg-primary text-white"
            : "bg-surface-hover text-text-primary",
        )}
      >
        {block.text}
      </div>
    );
  }
  if (block.type === "tool_use" || block.type === "mcp_tool_use") {
    const isFlightish =
      block.name === "search_flights" || block.name === "search-flight";
    return (
      <div className="inline-flex items-center gap-1.5 self-start rounded-md border border-border bg-background px-2.5 py-1 text-[11px] text-text-muted">
        {isFlightish ? (
          <Plane className="h-3 w-3" />
        ) : (
          <Wrench className="h-3 w-3" />
        )}
        <span className="font-mono">{block.name}</span>
        {block.type === "mcp_tool_use" && (
          <span className="text-[10px] uppercase tracking-wide">· MCP</span>
        )}
      </div>
    );
  }
  if (block.type === "tool_result" || block.type === "mcp_tool_result") {
    return <ToolResultBlock block={block} />;
  }
  return null;
}

function ToolResultBlock({
  block,
}: {
  block: Extract<
    ContentBlock,
    { type: "tool_result" } | { type: "mcp_tool_result" }
  >;
}) {
  const raw = flattenToolContent(block.content);

  if (block.is_error) {
    return (
      <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-[12px] text-red-500">
        {raw.slice(0, 280)}
      </div>
    );
  }

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    /* not json, fall through */
  }

  const offers = extractFlightOffers(parsed);
  if (offers && offers.length > 0) return <FlightOffersList offers={offers} />;

  return (
    <details className="rounded-md border border-border bg-background px-3 py-2 text-[11px] text-text-muted">
      <summary className="cursor-pointer">tool result · {raw.length} chars</summary>
      <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-all text-[10px] font-mono">
        {raw.slice(0, 2000)}
      </pre>
    </details>
  );
}

function flattenToolContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return (content as Array<{ type?: string; text?: string }>)
      .map((p) => (p?.type === "text" ? (p.text ?? "") : ""))
      .join("");
  }
  try {
    return JSON.stringify(content);
  } catch {
    return String(content);
  }
}

type FlightOffer = {
  price: string;
  carrier?: string;
  from?: string;
  to?: string;
  departure?: string;
  arrival?: string;
  stops?: number;
  link?: string;
};

function extractFlightOffers(parsed: unknown): FlightOffer[] | null {
  if (!parsed || typeof parsed !== "object") return null;
  // search_flights (Duffel) shape: { offers: [{ price, carrier, slices: [...] }] }
  const obj = parsed as Record<string, unknown>;
  if (Array.isArray(obj.offers)) {
    return (obj.offers as Array<Record<string, unknown>>).map((o) => {
      const slice = Array.isArray(o.slices)
        ? (o.slices[0] as Record<string, unknown>)
        : undefined;
      return {
        price: String(o.price ?? ""),
        carrier: typeof o.carrier === "string" ? o.carrier : undefined,
        from: slice && typeof slice.from === "string" ? slice.from : undefined,
        to: slice && typeof slice.to === "string" ? slice.to : undefined,
        departure:
          slice && typeof slice.departure === "string"
            ? slice.departure
            : undefined,
        arrival:
          slice && typeof slice.arrival === "string"
            ? slice.arrival
            : undefined,
        stops:
          slice && typeof slice.stops === "number" ? slice.stops : undefined,
      };
    });
  }
  // Kiwi shape: array of offers with flyFrom/flyTo/price/departure.local/etc
  if (Array.isArray(parsed)) {
    return (parsed as Array<Record<string, unknown>>).slice(0, 5).map((o) => {
      const dep = o.departure as { local?: string } | undefined;
      const arr = o.arrival as { local?: string } | undefined;
      const layovers = Array.isArray(o.layovers) ? o.layovers.length : 0;
      const price =
        typeof o.price === "number"
          ? `${(o.currency as string) ?? "EUR"} ${o.price}`
          : String(o.price ?? "");
      return {
        price,
        from: typeof o.flyFrom === "string" ? o.flyFrom : undefined,
        to: typeof o.flyTo === "string" ? o.flyTo : undefined,
        departure: dep?.local,
        arrival: arr?.local,
        stops: layovers,
        link: typeof o.deepLink === "string" ? o.deepLink : undefined,
      };
    });
  }
  return null;
}

function FlightOffersList({ offers }: { offers: FlightOffer[] }) {
  return (
    <div className="space-y-2">
      {offers.slice(0, 5).map((o, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-background px-3 py-2"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[12px] text-text-primary">
              <Plane className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">
                {o.from ?? "?"} → {o.to ?? "?"}
              </span>
            </div>
            <span className="font-display text-[14px] text-text-primary">
              {o.price}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-text-muted">
            {formatTime(o.departure)} → {formatTime(o.arrival)}
            {o.carrier ? ` · ${o.carrier}` : ""}
            {typeof o.stops === "number"
              ? ` · ${o.stops === 0 ? "direct" : `${o.stops} stop${o.stops > 1 ? "s" : ""}`}`
              : ""}
          </div>
          {o.link && (
            <a
              href={o.link}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-[11px] text-primary hover:underline"
            >
              Open on Kiwi ↗
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function formatTime(iso?: string): string {
  if (!iso) return "?";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
