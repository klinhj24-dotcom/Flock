"use client";

import Link from "next/link";
import { ArrowRight, Plus, Users, Plane } from "lucide-react";
import { Header } from "@/components/header";
import { BudgetSnapshot } from "@/components/cards/budget-snapshot";
import {
  TRIPS,
  DESTINATIONS,
  ACTIVITY,
} from "@/lib/mock-data";
import {
  formatCurrency,
  formatDateRange,
  initials,
  cn,
} from "@/lib/utils";

export default function HomePage() {
  const upcoming = TRIPS.filter((t) => t.status !== "Completed").slice(0, 3);
  const ideas = DESTINATIONS.slice(0, 3);

  return (
    <>
      <Header />
      <div className="px-10 py-8">
        <div className="grid grid-cols-3 gap-5">
          {/* Budget Snapshot - full width */}
          <div className="col-span-3">
            <BudgetSnapshot />
          </div>

          {/* Upcoming Trips - 2 cols */}
          <div className="col-span-2 card card-hover p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
                  Upcoming
                </div>
                <h2 className="mt-1 font-display text-[24px] leading-none text-text-primary">
                  Your next trips
                </h2>
              </div>
              <Link
                href="/trips"
                className="flex items-center gap-1 text-[12px] text-text-muted transition hover:text-text-primary"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcoming.map((trip) => (
                <div
                  key={trip.id}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-background/40 px-4 py-3.5 transition hover:border-primary/30 hover:bg-surface-hover/40"
                >
                  <div
                    className={cn(
                      "gradient-noise h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br",
                      trip.accent
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-text-primary">
                        {trip.city}
                      </span>
                      <span className="text-[12px] text-text-muted">
                        {trip.flag} {trip.country}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[12px] text-text-muted">
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
                    <Users className="h-3.5 w-3.5" />
                    {trip.people.length}
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[18px] text-text-primary">
                      {formatCurrency(trip.estimatedCost)}
                    </div>
                    <div className="text-[11px] text-text-muted">est.</div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/trips"
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim"
            >
              <Plus className="h-4 w-4" strokeWidth={2.25} />
              Plan a trip
            </Link>
          </div>

          {/* Friends Activity - 1 col */}
          <div className="card card-hover p-7">
            <div className="mb-5">
              <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
                The group
              </div>
              <h2 className="mt-1 font-display text-[24px] leading-none text-text-primary">
                Recent activity
              </h2>
            </div>

            <div className="space-y-4">
              {ACTIVITY.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-surface-hover text-[10px] font-medium text-text-primary">
                    {initials(a.who)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug text-text-primary">
                      <span className="font-medium">{a.who}</span>{" "}
                      <span className="text-text-muted">{a.action}</span>{" "}
                      <span>{a.target}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-muted">
                      {a.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trip Ideas - 3 col */}
          <div className="col-span-3 card card-hover p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
                  Discover
                </div>
                <h2 className="mt-1 font-display text-[24px] leading-none text-text-primary">
                  Trip ideas for this weekend
                </h2>
              </div>
              <Link
                href="/discover"
                className="flex items-center gap-1 text-[12px] text-text-muted transition hover:text-text-primary"
              >
                Explore more <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {ideas.map((d) => (
                <div
                  key={d.id}
                  className="group overflow-hidden rounded-xl border border-border bg-background/40 transition hover:border-primary/30"
                >
                  <div
                    className={cn(
                      "gradient-noise relative h-24 bg-gradient-to-br",
                      d.accent
                    )}
                  >
                    <div className="absolute inset-0 flex items-end p-4">
                      <span className="font-display text-[20px] leading-none text-white">
                        {d.city}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="text-[12px] text-text-muted">
                        {d.flag} {d.country}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-text-muted">
                        <Plane className="h-3 w-3" />
                        {d.flightTime}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-[18px] text-text-primary">
                        {formatCurrency(d.weekendCost)}
                      </div>
                      <div className="text-[10px] text-text-muted">weekend</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
