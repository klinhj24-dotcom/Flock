"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/header";
import { DestinationCard } from "@/components/cards/destination-card";
import { DESTINATIONS, VIBES, USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const BUDGET_RANGES = [
  { label: "Under $200", min: 0, max: 199 },
  { label: "$200–400", min: 200, max: 400 },
  { label: "$400–600", min: 401, max: 600 },
  { label: "$600+", min: 601, max: Infinity },
] as const;

const TIME_RANGES = [
  { label: "Under 2hr", min: 0, max: 2 },
  { label: "2–4hr", min: 2, max: 4 },
  { label: "4hr+", min: 4, max: Infinity },
] as const;

type Vibe = (typeof VIBES)[number];

export default function DiscoverPage() {
  const [budgetIdx, setBudgetIdx] = useState<number | null>(null);
  const [timeIdx, setTimeIdx] = useState<number | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      if (budgetIdx !== null) {
        const range = BUDGET_RANGES[budgetIdx];
        if (d.weekendCost < range.min || d.weekendCost > range.max) return false;
      }
      if (timeIdx !== null) {
        const range = TIME_RANGES[timeIdx];
        if (d.flightHours < range.min || d.flightHours >= range.max) return false;
      }
      if (vibe && !d.vibes.includes(vibe)) return false;
      return true;
    });
  }, [budgetIdx, timeIdx, vibe]);

  const toggleWish = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <Header
        greeting="Where to next?"
        subtitle={`Based on your home base in ${USER.homeCity} · ${USER.daysLeft} days left`}
      />

      <div className="px-10 py-8">
        {/* Filters */}
        <div className="mb-7 space-y-4">
          <FilterRow label="Budget">
            {BUDGET_RANGES.map((r, i) => (
              <Chip
                key={r.label}
                active={budgetIdx === i}
                onClick={() => setBudgetIdx(budgetIdx === i ? null : i)}
              >
                {r.label}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Travel time">
            {TIME_RANGES.map((r, i) => (
              <Chip
                key={r.label}
                active={timeIdx === i}
                onClick={() => setTimeIdx(timeIdx === i ? null : i)}
              >
                {r.label}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Vibe">
            {VIBES.map((v) => (
              <Chip
                key={v}
                active={vibe === v}
                onClick={() => setVibe(vibe === v ? null : v)}
              >
                {v}
              </Chip>
            ))}
          </FilterRow>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div className="text-[13px] text-text-muted">
            {filtered.length} destination{filtered.length === 1 ? "" : "s"}
          </div>
          {(budgetIdx !== null || timeIdx !== null || vibe !== null) && (
            <button
              onClick={() => {
                setBudgetIdx(null);
                setTimeIdx(null);
                setVibe(null);
              }}
              className="text-[12px] text-text-muted transition hover:text-text-primary"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center p-16 text-center">
            <h3 className="font-display text-[22px] text-text-primary">
              No destinations match
            </h3>
            <p className="mt-1 text-[13px] text-text-muted">
              Try loosening your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {filtered.map((d) => (
              <DestinationCard
                key={d.id}
                destination={d}
                wishlisted={wishlist.has(d.id)}
                onToggleWishlist={() => toggleWish(d.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[100px] text-[11px] uppercase tracking-[0.1em] text-text-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition",
        active
          ? "border-primary/50 bg-primary/15 text-primary"
          : "border-border bg-surface text-text-muted hover:border-primary/30 hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}
