"use client";

import { Heart, Plane, Calendar } from "lucide-react";
import type { Destination } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

export function DestinationCard({
  destination,
  wishlisted,
  onToggleWishlist,
}: {
  destination: Destination;
  wishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  return (
    <div className="card card-hover overflow-hidden">
      {/* Hero */}
      <div
        className={cn(
          "gradient-noise relative h-[200px] bg-gradient-to-br p-6",
          destination.accent
        )}
      >
        <button
          onClick={onToggleWishlist}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur transition hover:bg-black/50"
          aria-label="Add to wishlist"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition",
              wishlisted
                ? "fill-primary text-primary"
                : "text-white"
            )}
            strokeWidth={1.75}
          />
        </button>
        <div className="absolute bottom-5 left-6 right-6">
          <div className="mb-1 flex items-center gap-2 text-[12px] text-white/80">
            <span>{destination.flag}</span>
            <span>{destination.country}</span>
          </div>
          <h3 className="font-display text-[32px] leading-none tracking-tight text-white">
            {destination.city}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between text-[12px]">
          <span className="flex items-center gap-1.5 text-text-muted">
            <Plane className="h-3.5 w-3.5" strokeWidth={1.75} />
            {destination.flightTime}
          </span>
          <span className="flex items-center gap-1.5 text-text-muted">
            <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
            {destination.bestMonths}
          </span>
        </div>

        <div className="mb-4 border-t border-border pt-4">
          <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">
            Weekend cost
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="font-display text-[24px] text-text-primary">
              {formatCurrency(destination.weekendCost)}
            </span>
            <span className="text-[11px] text-text-muted">
              flights + 2 nights + food
            </span>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {destination.vibes.map((v) => (
            <span
              key={v}
              className="rounded-full border border-border bg-surface-hover/30 px-2.5 py-1 text-[11px] text-text-muted"
            >
              {v}
            </span>
          ))}
        </div>

        <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim">
          Plan This Trip
        </button>
      </div>
    </div>
  );
}
