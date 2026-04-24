"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Send,
  Sparkles,
  Plane,
  Wrench,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import type { Trip } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ChipBar,
  type ChipValues,
  deriveDefaultChipValues,
} from "@/components/chat/chip-bar";

type Role = "user" | "assistant";

// Wire-level shape for update_chip_values results piped back from /api/chat.
// Field names are snake_case (the tool's input_schema); we translate to
// ChipValues (camelCase) via applyChipUpdates below.
type ChipValuesUpdate = {
  budget_per_person?: number;
  currency?: "EUR" | "USD" | "GBP";
  dates_start?: string;
  dates_end?: string;
  dates_flex_days?: number;
  group_size?: number;
  home_airport?: string;
  stay_max_per_night?: number;
  stay_max_distance_km?: number;
  vibe?: string[];
  transport_mode?: Array<"fly" | "train" | "bus">;
  reason?: string;
};

function applyChipUpdates(prev: ChipValues, u: ChipValuesUpdate): ChipValues {
  const next: ChipValues = { ...prev };
  if (u.budget_per_person !== undefined) next.budgetPerPerson = u.budget_per_person;
  if (u.currency !== undefined) next.currency = u.currency;
  if (u.dates_start !== undefined || u.dates_end !== undefined || u.dates_flex_days !== undefined) {
    next.dates = {
      ...prev.dates,
      ...(u.dates_start !== undefined ? { start: u.dates_start } : {}),
      ...(u.dates_end !== undefined ? { end: u.dates_end } : {}),
      ...(u.dates_flex_days !== undefined ? { flexDays: u.dates_flex_days } : {}),
    };
  }
  if (u.group_size !== undefined) next.groupSize = u.group_size;
  if (u.home_airport !== undefined) next.homeAirport = u.home_airport;
  if (u.stay_max_per_night !== undefined) next.stayMaxPerNight = u.stay_max_per_night;
  if (u.stay_max_distance_km !== undefined) next.stayMaxDistanceKm = u.stay_max_distance_km;
  if (u.vibe !== undefined) next.vibe = u.vibe;
  if (u.transport_mode !== undefined) next.transportMode = u.transport_mode;
  return next;
}

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

  const drawerCtx: DrawerContext = {
    tripId: trip.id,
    currentVoter: trip.tripCaptain || trip.captain || trip.people[0] || "You",
  };

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
        chipUpdates?: ChipValuesUpdate;
      };
      setMessages([
        ...next,
        { role: "assistant", content: data.content ?? [] },
      ]);
      if (data.chipUpdates) {
        setChipValues((prev) => applyChipUpdates(prev, data.chipUpdates!));
      }
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
            <MessageRow key={i} message={m} ctx={drawerCtx} />
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

type DrawerContext = {
  tripId: string;
  currentVoter: string;
};

function MessageRow({
  message,
  ctx,
}: {
  message: UIMessage;
  ctx: DrawerContext;
}) {
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
          <BlockRow key={i} block={b} isUser={isUser} ctx={ctx} />
        ))}
      </div>
    </div>
  );
}

function BlockRow({
  block,
  isUser,
  ctx,
}: {
  block: ContentBlock;
  isUser: boolean;
  ctx: DrawerContext;
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
    return <ToolResultBlock block={block} ctx={ctx} />;
  }
  return null;
}

function ToolResultBlock({
  block,
  ctx,
}: {
  block: Extract<
    ContentBlock,
    { type: "tool_result" } | { type: "mcp_tool_result" }
  >;
  ctx: DrawerContext;
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

  const proposal = extractProposal(parsed);
  if (proposal) return <VotingCard proposal={proposal} ctx={ctx} />;

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

type Proposal = {
  id: string;
  slot: string;
  title: string;
  description?: string;
  votes: Record<string, "up" | "down">;
};

function extractProposal(parsed: unknown): Proposal | null {
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  const opt = obj.option as Record<string, unknown> | undefined;
  if (
    !opt ||
    typeof opt.id !== "string" ||
    typeof opt.slot !== "string" ||
    typeof opt.title !== "string"
  ) {
    return null;
  }
  return {
    id: opt.id,
    slot: opt.slot,
    title: opt.title,
    description:
      typeof opt.description === "string" ? opt.description : undefined,
    votes:
      typeof opt.votes === "object" && opt.votes !== null
        ? (opt.votes as Record<string, "up" | "down">)
        : {},
  };
}

function VotingCard({
  proposal,
  ctx,
}: {
  proposal: Proposal;
  ctx: DrawerContext;
}) {
  const [votes, setVotes] = useState<Record<string, "up" | "down">>(
    proposal.votes,
  );
  const [busy, setBusy] = useState(false);
  const myVote = votes[ctx.currentVoter];
  const upCount = Object.values(votes).filter((v) => v === "up").length;
  const downCount = Object.values(votes).filter((v) => v === "down").length;

  const cast = async (vote: "up" | "down") => {
    if (busy) return;
    setBusy(true);
    // Optimistic update
    setVotes((prev) => ({ ...prev, [ctx.currentVoter]: vote }));
    try {
      const res = await fetch(`/api/trips/${ctx.tripId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          option_id: proposal.id,
          voter: ctx.currentVoter,
          vote,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { option: { votes: Record<string, "up" | "down"> } };
      setVotes(data.option.votes);
    } catch {
      // revert
      setVotes(proposal.votes);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-primary">
          {proposal.slot}
        </span>
        <span className="text-[13px] font-medium text-text-primary">
          {proposal.title}
        </span>
      </div>
      {proposal.description && (
        <div className="mb-2 text-[12px] text-text-muted">
          {proposal.description}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => cast("up")}
          disabled={busy}
          className={cn(
            "flex items-center gap-1 rounded border px-2 py-1 text-[11px] transition",
            myVote === "up"
              ? "border-green-500/60 bg-green-500/10 text-green-500"
              : "border-border text-text-muted hover:border-green-500/40",
          )}
        >
          <ThumbsUp className="h-3 w-3" />
          {upCount}
        </button>
        <button
          onClick={() => cast("down")}
          disabled={busy}
          className={cn(
            "flex items-center gap-1 rounded border px-2 py-1 text-[11px] transition",
            myVote === "down"
              ? "border-red-500/60 bg-red-500/10 text-red-500"
              : "border-border text-text-muted hover:border-red-500/40",
          )}
        >
          <ThumbsDown className="h-3 w-3" />
          {downCount}
        </button>
        {myVote && (
          <span className="text-[10px] text-text-muted">
            you voted {myVote === "up" ? "👍" : "👎"}
          </span>
        )}
      </div>
    </div>
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
