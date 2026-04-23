"use client";

import { useState } from "react";
import { X, Sparkles, MapPin } from "lucide-react";
import type { FriendTrip } from "@/lib/mock-data";

export function FriendTripCard({ trip }: { trip: FriendTrip }) {
  const [recsOpen, setRecsOpen] = useState(false);

  return (
    <>
      <div className="snap-start flex w-[280px] flex-shrink-0 flex-col rounded-xl border border-border bg-surface p-5 transition hover:border-primary/30">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-hover text-[11px] font-medium text-text-primary ring-1 ring-border">
            {trip.avatar}
          </div>
          <div>
            <div className="text-[13px] font-medium text-text-primary">
              {trip.friend}
            </div>
            <div className="text-[11px] text-text-muted">went to</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-[12px] text-text-muted">
            <MapPin className="h-3 w-3" />
            <span>{trip.flag}</span>
            <span>{trip.dates}</span>
          </div>
          <h3 className="mt-1 font-display text-[24px] leading-tight text-text-primary">
            {trip.destination}
          </h3>
        </div>

        <button
          onClick={() => setRecsOpen(true)}
          className="mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-primary/15 px-3 py-2 text-[12px] font-medium text-primary transition hover:bg-primary/25"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Get Recs
        </button>
      </div>

      {recsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setRecsOpen(false)}
        >
          <div
            className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-text-muted">
                  {trip.friend}'s tips
                </div>
                <h3 className="mt-1 font-display text-[22px] leading-none text-text-primary">
                  {trip.destination} {trip.flag}
                </h3>
              </div>
              <button
                onClick={() => setRecsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition hover:border-primary/40 hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5">
              <ul className="space-y-3">
                {trip.recs.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-border bg-background/40 px-4 py-3 text-[13px] text-text-primary"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-medium text-primary">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
