"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Header } from "@/components/header";
import { TripCard } from "@/components/cards/trip-card";
import { NewTripModal } from "@/components/modals/new-trip-modal";
import { TRIPS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type TripFilter = "Upcoming" | "Past" | "Planning";

export default function TripsPage() {
  const [filter, setFilter] = useState<TripFilter>("Upcoming");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = TRIPS.filter((t) => {
    if (filter === "Upcoming") return t.status !== "Completed";
    if (filter === "Past") return t.status === "Completed";
    if (filter === "Planning") return t.status === "Planning";
    return true;
  });

  return (
    <>
      <Header
        greeting="Your Trips"
        subtitle="Plan, track, and remember every weekend."
      />

      <div className="px-10 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
            {(["Upcoming", "Past", "Planning"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-[13px] font-medium transition",
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
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim"
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
          <div className="grid grid-cols-3 gap-5">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>

      <NewTripModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
