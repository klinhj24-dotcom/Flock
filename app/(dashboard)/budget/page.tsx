"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { BudgetDonut } from "@/components/charts/budget-donut";
import {
  BUDGET_CATEGORIES,
  BUDGET_REMAINING,
  BUDGET_TOTAL,
  BUDGET_PRESETS,
  HOME_CITIES,
  LIFESTYLE_MULTIPLIER,
  USER,
} from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

export default function BudgetPage() {
  const [city, setCity] = useState(USER.homeCity);
  const [months, setMonths] = useState(4);
  const [trips, setTrips] = useState(8);
  const [lifestyle, setLifestyle] =
    useState<keyof typeof LIFESTYLE_MULTIPLIER>("Mid-range");
  const [estimate, setEstimate] = useState<{
    total: number;
    housing: number;
    food: number;
    trips: number;
    transport: number;
    activities: number;
    misc: number;
  } | null>(null);

  const generate = () => {
    const preset = BUDGET_PRESETS[city] ?? BUDGET_PRESETS.Tokyo;
    const mult = LIFESTYLE_MULTIPLIER[lifestyle];
    const monthly = preset.monthly * mult;

    const housing = Math.round(monthly * 0.4 * months);
    const food = Math.round(monthly * 0.3 * months);
    const transport = Math.round(monthly * 0.08 * months);
    const activities = Math.round(monthly * 0.06 * months);
    const misc = Math.round(monthly * 0.05 * months);
    const tripsBudget = Math.round(preset.weekendTrip * mult * trips);
    const total = housing + food + transport + activities + misc + tripsBudget;

    setEstimate({
      total,
      housing,
      food,
      trips: tripsBudget,
      transport,
      activities,
      misc,
    });
  };

  return (
    <>
      <Header
        greeting="Budget"
        subtitle={`Updated today · ${USER.daysLeft} days left in semester`}
      />

      <div className="px-10 py-8">
        {/* Big remaining number */}
        <div className="card card-hover mb-5 flex items-baseline justify-between p-8">
          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
              Semester total
            </div>
            <div className="mt-2">
              <span className="font-display text-[56px] leading-none text-text-primary">
                {formatCurrency(BUDGET_REMAINING)}
              </span>
              <span className="ml-3 text-[16px] text-text-muted">
                remaining of {formatCurrency(BUDGET_TOTAL)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
              Daily avg
            </div>
            <div className="mt-2 font-display text-[28px] leading-none text-text-primary">
              {formatCurrency(Math.round(BUDGET_REMAINING / USER.daysLeft))}
              <span className="ml-1 text-[13px] text-text-muted">/day</span>
            </div>
          </div>
        </div>

        {/* Breakdown + Chart */}
        <div className="mb-5 grid grid-cols-3 gap-5">
          <div className="col-span-2 card card-hover p-7">
            <div className="mb-5">
              <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
                Breakdown
              </div>
              <h2 className="mt-1 font-display text-[24px] leading-none text-text-primary">
                Where it's going
              </h2>
            </div>

            <div className="overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-border bg-background/40 px-5 py-3 text-[11px] uppercase tracking-[0.1em] text-text-muted">
                <span>Category</span>
                <span className="text-right">Budgeted</span>
                <span className="text-right">Spent</span>
                <span className="text-right">Remaining</span>
              </div>
              {BUDGET_CATEGORIES.map((c, i) => {
                const remaining = c.budgeted - c.spent;
                const pct = (c.spent / c.budgeted) * 100;
                return (
                  <div
                    key={c.name}
                    className={cn(
                      "grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center gap-4 px-5 py-3.5 text-[13px]",
                      i !== BUDGET_CATEGORIES.length - 1 &&
                        "border-b border-border"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ background: c.color }}
                      />
                      <span className="font-medium text-text-primary">
                        {c.name}
                      </span>
                    </div>
                    <span className="text-right font-medium text-text-primary">
                      {formatCurrency(c.budgeted)}
                    </span>
                    <div className="text-right">
                      <div className="font-medium text-text-primary">
                        {formatCurrency(c.spent)}
                      </div>
                      <div className="text-[10px] text-text-muted">
                        {Math.round(pct)}%
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-right font-medium",
                        remaining === 0
                          ? "text-text-muted"
                          : "text-text-primary"
                      )}
                    >
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Donut */}
          <div className="card card-hover p-7">
            <div className="mb-5">
              <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
                Allocation
              </div>
              <h2 className="mt-1 font-display text-[24px] leading-none text-text-primary">
                Mix
              </h2>
            </div>
            <BudgetDonut />
          </div>
        </div>

        {/* Pre-Departure Budget Builder */}
        <div className="card p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Pre-Departure
              </div>
              <h2 className="mt-1 font-display text-[28px] leading-none text-text-primary">
                Haven't set your budget yet? Build it here.
              </h2>
              <p className="mt-2 max-w-xl text-[13px] text-text-muted">
                Answer a few questions and we'll model a realistic semester
                budget based on your destination and lifestyle.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Home base
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-text-primary focus:border-primary/40 focus:outline-none"
              >
                {HOME_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Semester length
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-text-primary focus:border-primary/40 focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-text-muted">
                  months
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Weekend trips
              </label>
              <div className="flex h-[42px] items-center gap-3 rounded-lg border border-border bg-background px-3">
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={trips}
                  onChange={(e) => setTrips(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="w-6 text-right text-[13px] font-medium text-text-primary">
                  {trips}
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Lifestyle
              </label>
              <select
                value={lifestyle}
                onChange={(e) =>
                  setLifestyle(
                    e.target.value as keyof typeof LIFESTYLE_MULTIPLIER
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-text-primary focus:border-primary/40 focus:outline-none"
              >
                {Object.keys(LIFESTYLE_MULTIPLIER).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generate}
            className="mt-6 flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Budget Estimate
          </button>

          {estimate && (
            <div className="mt-7 rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="mb-5 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.1em] text-primary">
                    Your estimated semester budget
                  </div>
                  <div className="mt-1 font-display text-[44px] leading-none text-text-primary">
                    {formatCurrency(estimate.total)}
                  </div>
                </div>
                <div className="text-right text-[12px] text-text-muted">
                  {city} · {months} months · {trips} trips · {lifestyle}
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {[
                  { label: "Housing", v: estimate.housing },
                  { label: "Food", v: estimate.food },
                  { label: "Trips", v: estimate.trips },
                  { label: "Transport", v: estimate.transport },
                  { label: "Activities", v: estimate.activities },
                  { label: "Misc", v: estimate.misc },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="rounded-lg border border-border bg-background/60 px-3 py-3"
                  >
                    <div className="text-[11px] uppercase tracking-[0.08em] text-text-muted">
                      {row.label}
                    </div>
                    <div className="mt-1 font-display text-[20px] text-text-primary">
                      {formatCurrency(row.v)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
