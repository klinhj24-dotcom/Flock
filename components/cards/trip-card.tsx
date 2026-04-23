"use client";

import Link from "next/link";
import { Users, Split, Plus, ArrowUpRight, Zap, AlertTriangle } from "lucide-react";
import type { Trip, BookingItem } from "@/lib/mock-data";
import { formatCurrency, formatDateRange, initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  Trip["status"],
  { bg: string; text: string; dot: string }
> = {
  Planning: {
    bg: "bg-secondary/10",
    text: "text-secondary",
    dot: "bg-secondary",
  },
  Confirmed: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
  },
  Completed: {
    bg: "bg-text-muted/10",
    text: "text-text-muted",
    dot: "bg-text-muted",
  },
};

const BOOKING_DOT: Record<BookingItem["status"], string> = {
  booked: "bg-[#6BCB77]",
  book_now: "bg-primary pulse-amber",
  book_soon: "bg-text-muted/60",
  pending: "bg-transparent border border-border",
};

const BOOKING_LABEL: Record<BookingItem["status"], string> = {
  booked: "booked",
  book_now: "book now",
  book_soon: "book soon",
  pending: "pending",
};

function BookingChip({ item }: { item: BookingItem }) {
  return (
    <div className="flex-1 rounded-lg border border-border bg-background/40 px-2.5 py-1.5">
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "h-1.5 w-1.5 flex-shrink-0 rounded-full",
            BOOKING_DOT[item.status]
          )}
        />
        <span className="text-[11px] text-text-primary">
          {item.item}{" "}
          <span className="text-text-muted">{BOOKING_LABEL[item.status]}</span>
        </span>
      </div>
      {item.note && (
        <div className="ml-3 mt-0.5 text-[10px] leading-tight text-text-muted">
          {item.note}
        </div>
      )}
    </div>
  );
}

function daysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  const ms = d.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function TripCard({ trip }: { trip: Trip }) {
  const status = STATUS_STYLES[trip.status];
  const showingCost = trip.actualCost ?? trip.estimatedCost;
  const costLabel = trip.actualCost ? "actual" : "est.";
  const urgent = trip.bookingStatus.find(
    (b) => b.status === "book_now" && b.item === "Flights"
  );
  const isCaptain = trip.tripCaptain === "Henry" || trip.captain === "Henry";

  const daysAway = daysUntil(trip.startDate);
  const showBookEarly =
    (trip.status === "Planning" || trip.status === "Confirmed") &&
    daysAway > 21 &&
    !trip.flightBooked;

  const captainName = trip.tripCaptain ?? trip.captain;

  return (
    <div className="card card-hover overflow-hidden">
      {/* Urgent banner */}
      {urgent && (
        <div className="flex items-center gap-1.5 border-l-2 border-primary bg-primary/8 px-4 py-2 text-[11px] text-primary">
          <Zap className="h-3 w-3 flex-shrink-0" strokeWidth={2.25} />
          <span>
            Book flights now
            {urgent.note ? ` — ${urgent.note.toLowerCase()}` : ""}
          </span>
        </div>
      )}

      {/* Hero */}
      <div
        className={cn(
          "gradient-noise relative h-[180px] bg-gradient-to-br p-6",
          trip.accent
        )}
      >
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
          {trip.status}
        </div>
        {showBookEarly && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#E8B572]/90 px-2.5 py-1 text-[11px] font-medium text-[#1a1a0a]">
            <AlertTriangle className="h-3 w-3" strokeWidth={2.25} />
            Book flights soon
          </div>
        )}
        <div className="absolute bottom-5 left-6 right-6">
          <div className="mb-1 flex items-center gap-2 text-[12px] text-white/80">
            <span>{trip.flag}</span>
            <span>{trip.country}</span>
          </div>
          <h3 className="font-display text-[34px] leading-none tracking-tight text-white">
            {trip.city}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between text-[13px]">
          <span className="text-text-primary">
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          <span className="flex items-center gap-1.5 text-text-muted">
            <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
            {trip.people.length}
          </span>
        </div>

        {/* Avatar stack */}
        <div className="mb-2 flex items-center">
          <div className="flex -space-x-2">
            {trip.people.slice(0, 5).map((p, i) => {
              const isTripCaptain = p === captainName;
              return (
                <div
                  key={i}
                  className={cn(
                    "group/avatar relative flex h-8 items-center gap-1 rounded-full border-2 border-surface bg-surface-hover text-[10px] font-medium text-text-primary",
                    isTripCaptain
                      ? "w-auto px-1.5 ring-1 ring-primary/50"
                      : "w-8 justify-center"
                  )}
                  title={isTripCaptain ? `${p} is Trip Captain` : p}
                >
                  {isTripCaptain && <span className="text-[12px]">👑</span>}
                  <span>{initials(p)}</span>
                  {isTripCaptain && (
                    <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-background px-2 py-1 text-[10px] text-text-primary opacity-0 shadow-lg ring-1 ring-border transition group-hover/avatar:opacity-100">
                      {p} is Trip Captain
                    </span>
                  )}
                </div>
              );
            })}
            {trip.people.length > 5 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-surface-hover text-[10px] font-medium text-text-muted">
                +{trip.people.length - 5}
              </div>
            )}
            {trip.waitlist?.map((p, i) => (
              <div
                key={`w-${i}`}
                className="flex h-8 items-center gap-1 rounded-full border-2 border-dashed border-border bg-background/60 px-2 text-[10px] font-medium text-text-muted"
                title={`${p} (waitlisted)`}
              >
                <span>⏱</span>
                <span>{initials(p)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Captain line */}
        <div
          className={cn(
            "mb-5 text-[12px]",
            isCaptain ? "text-primary" : "text-text-muted"
          )}
        >
          {isCaptain ? "You're running this" : `${captainName} is running this`}
        </div>

        {/* Cost */}
        <div className="mb-4 flex items-baseline justify-between border-t border-border pt-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">
              Budget ({costLabel})
            </div>
            <div className="mt-0.5 font-display text-[22px] text-text-primary">
              {formatCurrency(showingCost)}
            </div>
          </div>
          <div
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium",
              status.bg,
              status.text
            )}
          >
            {trip.status}
          </div>
        </div>

        {/* Booking status chips */}
        <div className="mb-5 flex items-stretch gap-2">
          {trip.bookingStatus.map((b) => (
            <BookingChip key={b.item} item={b} />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/trips/${trip.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-surface-hover px-3 py-2 text-[12px] font-medium text-text-primary transition hover:bg-surface-hover/70"
          >
            View Details
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition hover:border-primary/40 hover:text-text-primary"
            title="Add Person"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <Link
            href={`/trips/${trip.id}#expenses`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition hover:border-primary/40 hover:text-text-primary"
            title="Split Costs"
          >
            <Split className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
