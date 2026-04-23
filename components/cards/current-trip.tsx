"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  MapPin,
  Users,
  Plus,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";
import {
  coverPhoto,
  DESTINATION_PHOTO_SEEDS,
  isTripActive,
  type Trip,
  type TripExpense,
} from "@/lib/mock-data";
import { formatCurrency, formatDateRange, initials, cn } from "@/lib/utils";

export function CurrentTripCard({ trip }: { trip: Trip }) {
  const active = isTripActive(trip);
  const [expenses, setExpenses] = useState<TripExpense[]>(trip.expenses ?? []);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(trip.people[0]);
  const [expanded, setExpanded] = useState(false);

  const totalSpent = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  const logExpense = () => {
    const a = Number(amount);
    if (!desc.trim() || !Number.isFinite(a) || a <= 0) return;
    setExpenses([
      ...expenses,
      {
        id: `qe-${Date.now()}`,
        description: desc.trim(),
        amount: a,
        paidBy,
        splitBetween: [...trip.people],
      },
    ]);
    setDesc("");
    setAmount("");
  };

  const photoUrl = coverPhoto(
    trip.photoSeed ?? DESTINATION_PHOTO_SEEDS[trip.city] ?? trip.city.toLowerCase(),
    1600,
    700
  );

  return (
    <div className="card card-hover relative overflow-hidden">
      {/* Hero image header */}
      <div
        className="relative h-[200px] sm:h-[240px]"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.35) 100%), url(${photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {active ? (
          <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-[#6BCB77]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0a2410] backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            On this trip now
          </div>
        ) : (
          <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-background backdrop-blur">
            <Sparkles className="h-3 w-3" />
            Up next
          </div>
        )}

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[12px] text-white/80">
              <span>{trip.flag}</span>
              <span>{trip.country}</span>
              <span>·</span>
              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            </div>
            <h2 className="font-display text-[36px] leading-none tracking-tight text-white sm:text-[44px]">
              {trip.city}
            </h2>
          </div>
          <Link
            href={`/trips/${trip.id}`}
            className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-medium text-background backdrop-blur transition hover:bg-white"
          >
            Open
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex -space-x-2">
            {trip.people.slice(0, 5).map((p) => (
              <div
                key={p}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-surface-hover text-[9px] font-medium text-text-primary"
                title={p}
              >
                {initials(p)}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[12px] text-text-muted">
            <Users className="h-3.5 w-3.5" />
            {trip.people.length}
          </div>
          <div className="ml-auto text-right">
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">
              Spent so far
            </div>
            <div className="font-display text-[22px] leading-none text-text-primary">
              {formatCurrency(totalSpent)}
            </div>
          </div>
        </div>

        {/* Quick log */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-primary">
            <Zap className="h-3 w-3" />
            Quick log expense
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1.5fr_1fr_auto]">
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Ramen for the crew..."
              className="rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-muted">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="24"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 pl-6 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                />
              </div>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="rounded-lg border border-border bg-background px-2 py-2 text-[12px] text-text-primary focus:border-primary/40 focus:outline-none"
              >
                {trip.people.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={logExpense}
              disabled={!desc.trim() || !Number(amount)}
              className="flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-background transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
              Log
            </button>
          </div>
          <div className="mt-2 text-[10px] text-text-muted">
            Split evenly across {trip.people.length} people · $
            {Number(amount)
              ? (Number(amount) / trip.people.length).toFixed(2)
              : "0.00"}{" "}
            per person
          </div>
        </div>

        {/* Recent expenses */}
        {expenses.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex w-full items-center justify-between text-[11px] uppercase tracking-[0.1em] text-text-muted transition hover:text-text-primary"
            >
              <span>Recent ({expenses.length})</span>
              <span>{expanded ? "Hide" : "Show all"}</span>
            </button>
            <div className="mt-2 space-y-1.5">
              {(expanded ? expenses : expenses.slice(-3))
                .slice()
                .reverse()
                .map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2 text-[12px]"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-text-muted" />
                      <span className="text-text-primary">{e.description}</span>
                      <span className="text-text-muted">· {e.paidBy}</span>
                    </div>
                    <span className="font-medium text-text-primary">
                      {formatCurrency(e.amount)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyCurrentTrip() {
  return (
    <div className="card p-7 text-center">
      <div className="mb-2 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.12em] text-text-muted">
        <Sparkles className="h-3 w-3" />
        Nothing scheduled
      </div>
      <h2 className="font-display text-[24px] leading-none text-text-primary">
        No trip today.
      </h2>
      <p className="mt-1 text-[13px] text-text-muted">
        Plan your next adventure — it's weekend somewhere.
      </p>
      <Link
        href="/trips"
        className={cn(
          "mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim"
        )}
      >
        <Plus className="h-4 w-4" strokeWidth={2.25} />
        Plan a trip
      </Link>
    </div>
  );
}
