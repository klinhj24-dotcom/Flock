"use client";

import { useMemo, useState } from "react";
import { Plus, X, PartyPopper } from "lucide-react";
import { Header } from "@/components/header";
import { TripCard } from "@/components/cards/trip-card";
import { NewTripModal } from "@/components/modals/new-trip-modal";
import { CalendarConnect } from "@/components/cards/calendar-connect";
import { FriendTripCard } from "@/components/cards/friend-trip-card";
import { TRIPS, FRIEND_TRIPS, type Trip } from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";

type TripFilter = "Upcoming" | "Past" | "Planning";

export default function TripsPage() {
  const [filter, setFilter] = useState<TripFilter>("Upcoming");
  const [modalOpen, setModalOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>(TRIPS);
  const [dismissedSavings, setDismissedSavings] = useState<string[]>([]);

  const filtered = trips.filter((t) => {
    if (filter === "Upcoming") return t.status !== "Completed";
    if (filter === "Past") return t.status === "Completed";
    if (filter === "Planning") return t.status === "Planning";
    return true;
  });

  // Find first completed trip that came in under estimate and hasn't been dismissed
  const savingsTrip = useMemo(
    () =>
      trips.find(
        (t) =>
          t.status === "Completed" &&
          typeof t.actualCost === "number" &&
          t.actualCost < t.estimatedCost &&
          !dismissedSavings.includes(t.id)
      ),
    [trips, dismissedSavings]
  );

  const savedAmount = savingsTrip
    ? savingsTrip.estimatedCost - (savingsTrip.actualCost ?? 0)
    : 0;

  const addTrip = (trip: Trip) => {
    setTrips([trip, ...trips]);
  };

  return (
    <>
      <Header
        greeting="Your Trips"
        subtitle="Plan, track, and remember every weekend."
      />

      <div className="px-4 py-6 sm:px-10 sm:py-8">
        {/* Savings banner */}
        {savingsTrip && (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-[#6BCB77]/30 bg-[#6BCB77]/10 px-5 py-4">
            <div className="flex items-start gap-3">
              <PartyPopper className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#6BCB77]" />
              <div>
                <div className="text-[14px] font-medium text-text-primary">
                  You saved {formatCurrency(savedAmount)} on {savingsTrip.city} 🎉
                </div>
                <div className="text-[12px] text-text-muted">
                  Added back to your semester budget
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                setDismissedSavings([...dismissedSavings, savingsTrip.id])
              }
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#6BCB77]/30 text-[#6BCB77] transition hover:bg-[#6BCB77]/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Calendar Connect */}
        <div className="mb-5">
          <CalendarConnect />
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
            {(["Upcoming", "Past", "Planning"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-1 rounded-md px-4 py-1.5 text-[13px] font-medium transition sm:flex-none",
                  filter === f
                    ? "bg-surface-hover text-text-primary"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
            New Trip
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center p-16 text-center">
            <h3 className="font-display text-[22px] text-text-primary">
              Nothing here yet
            </h3>
            <p className="mt-1 text-[13px] text-text-muted">
              Start planning your next adventure.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-5 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim"
            >
              <Plus className="h-4 w-4" strokeWidth={2.25} />
              New Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}

        {/* Friends' past trips */}
        <div className="mt-10">
          <div className="mb-4">
            <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
              Inspiration
            </div>
            <h2 className="mt-1 font-display text-[24px] leading-none text-text-primary">
              What Your Friends Have Done
            </h2>
          </div>
          <div className="-mx-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0">
            <div className="flex gap-4">
              {FRIEND_TRIPS.map((t, i) => (
                <FriendTripCard key={i} trip={t} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <NewTripModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={addTrip}
      />
    </>
  );
}
