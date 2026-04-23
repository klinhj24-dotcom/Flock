"use client";

import { useState } from "react";
import { Sparkles, Plus, X, Repeat, CircleDollarSign } from "lucide-react";
import { Header } from "@/components/header";
import { BudgetDonut } from "@/components/charts/budget-donut";
import { BankConnect } from "@/components/cards/bank-connect";
import {
  BUDGET_CATEGORIES,
  BUDGET_SPENT,
  BUDGET_PRESETS,
  HOME_CITIES,
  LIFESTYLE_MULTIPLIER,
  FUNDING_SOURCES,
  USER,
  type FundingSource,
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

  const [sources, setSources] = useState<FundingSource[]>(FUNDING_SOURCES);
  const [addingSource, setAddingSource] = useState(false);
  const [sourceLabel, setSourceLabel] = useState("");
  const [sourceAmount, setSourceAmount] = useState("");
  const [sourceRecurring, setSourceRecurring] = useState(false);

  const totalFunding = sources.reduce((s, f) => s + f.amount, 0);
  const netRemaining = totalFunding - BUDGET_SPENT;

  const addSource = () => {
    const amt = Number(sourceAmount);
    if (!sourceLabel.trim() || !Number.isFinite(amt) || amt <= 0) return;
    setSources([
      ...sources,
      {
        id: String(Date.now()),
        label: sourceLabel.trim(),
        amount: amt,
        recurring: sourceRecurring,
      },
    ]);
    setSourceLabel("");
    setSourceAmount("");
    setSourceRecurring(false);
    setAddingSource(false);
  };

  const removeSource = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
  };

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

      <div className="px-4 py-6 sm:px-10 sm:py-8">
        {/* Big remaining number — now driven by funding sources */}
        <div className="card card-hover mb-5 flex flex-col gap-4 p-6 sm:flex-row sm:items-baseline sm:justify-between sm:p-8">
          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
              Net Budget
            </div>
            <div className="mt-2">
              <span className="font-display text-[40px] leading-none text-text-primary sm:text-[56px]">
                {formatCurrency(netRemaining)}
              </span>
              <span className="ml-3 text-[13px] text-text-muted sm:text-[16px]">
                remaining of {formatCurrency(totalFunding)}
              </span>
            </div>
            <div className="mt-1 text-[11px] text-text-muted sm:text-[12px]">
              Funding sources · {formatCurrency(totalFunding)} − Spent{" "}
              {formatCurrency(BUDGET_SPENT)}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
              Daily avg
            </div>
            <div className="mt-2 font-display text-[24px] leading-none text-text-primary sm:text-[28px]">
              {formatCurrency(Math.round(Math.max(0, netRemaining) / USER.daysLeft))}
              <span className="ml-1 text-[13px] text-text-muted">/day</span>
            </div>
          </div>
        </div>

        {/* Bank connect */}
        <div className="mb-5">
          <BankConnect />
        </div>

        {/* Funding Sources panel */}
        <div className="card card-hover mb-5 p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-text-muted">
                <CircleDollarSign className="h-3.5 w-3.5" />
                Funding Sources
              </div>
              <h2 className="mt-1 font-display text-[22px] leading-none text-text-primary sm:text-[24px]">
                Money coming in
              </h2>
            </div>
            <button
              onClick={() => setAddingSource((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-hover px-3 py-2 text-[12px] font-medium text-text-primary transition hover:border-primary/40"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Source
            </button>
          </div>

          <div className="space-y-2">
            {sources.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[14px] font-medium text-text-primary">
                      {s.label}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        s.recurring
                          ? "bg-secondary/15 text-secondary"
                          : "bg-primary/15 text-primary"
                      )}
                    >
                      {s.recurring ? (
                        <span className="flex items-center gap-1">
                          <Repeat className="h-2.5 w-2.5" /> recurring
                        </span>
                      ) : (
                        "one-time"
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-[18px] text-text-primary">
                    {formatCurrency(s.amount)}
                  </span>
                  <button
                    onClick={() => removeSource(s.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted transition hover:border-primary/40 hover:text-text-primary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {addingSource && (
            <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="grid gap-3 sm:grid-cols-[1.5fr_1fr_auto]">
                <div>
                  <label className="mb-1 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                    Source name
                  </label>
                  <input
                    type="text"
                    value={sourceLabel}
                    onChange={(e) => setSourceLabel(e.target.value)}
                    placeholder="Scholarship"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-muted">
                      $
                    </span>
                    <input
                      type="number"
                      value={sourceAmount}
                      onChange={(e) => setSourceAmount(e.target.value)}
                      placeholder="500"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 pl-6 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                    Type
                  </label>
                  <div className="flex h-[38px] gap-1 rounded-lg border border-border bg-background p-1">
                    <button
                      onClick={() => setSourceRecurring(false)}
                      className={cn(
                        "flex-1 rounded-md px-3 text-[11px] font-medium transition",
                        !sourceRecurring
                          ? "bg-primary/20 text-primary"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      One-time
                    </button>
                    <button
                      onClick={() => setSourceRecurring(true)}
                      className={cn(
                        "flex-1 rounded-md px-3 text-[11px] font-medium transition",
                        sourceRecurring
                          ? "bg-secondary/20 text-secondary"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      Recurring
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setAddingSource(false);
                    setSourceLabel("");
                    setSourceAmount("");
                    setSourceRecurring(false);
                  }}
                  className="rounded-lg px-3 py-1.5 text-[12px] text-text-muted transition hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  onClick={addSource}
                  className="rounded-lg bg-primary px-3 py-1.5 text-[12px] font-medium text-background transition hover:bg-primary-dim"
                >
                  Add Source
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Breakdown + Chart */}
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="col-span-1 card card-hover p-5 sm:p-7 lg:col-span-2">
            <div className="mb-5">
              <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
                Breakdown
              </div>
              <h2 className="mt-1 font-display text-[22px] leading-none text-text-primary sm:text-[24px]">
                Where it's going
              </h2>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[560px] overflow-hidden rounded-lg border border-border">
                <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr_1.3fr] gap-3 border-b border-border bg-background/40 px-4 py-3 text-[11px] uppercase tracking-[0.1em] text-text-muted sm:grid-cols-[1.5fr_1fr_1fr_1.3fr] sm:gap-4 sm:px-5">
                  <span>Category</span>
                  <span className="text-right">Budgeted</span>
                  <span className="text-right">Spent</span>
                  <span className="text-right">Remaining</span>
                </div>
                {BUDGET_CATEGORIES.map((c, i) => {
                  const remaining = c.budgeted - c.spent;
                  const pct = (c.spent / c.budgeted) * 100;
                  const ratio = c.spent / c.budgeted;
                  const onTrack = ratio < 0.7;
                  const over = ratio > 1.0;
                  return (
                    <div
                      key={c.name}
                      className={cn(
                        "grid grid-cols-[1.2fr_0.9fr_0.9fr_1.3fr] items-center gap-3 px-4 py-3.5 text-[13px] sm:grid-cols-[1.5fr_1fr_1fr_1.3fr] sm:gap-4 sm:px-5",
                        i !== BUDGET_CATEGORIES.length - 1 &&
                          "border-b border-border"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                          style={{ background: c.color }}
                        />
                        <span className="truncate font-medium text-text-primary">
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
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={cn(
                            "font-medium",
                            remaining === 0
                              ? "text-text-muted"
                              : "text-text-primary"
                          )}
                        >
                          {formatCurrency(remaining)}
                        </span>
                        {onTrack && (
                          <span className="whitespace-nowrap rounded-full bg-[#6BCB77]/15 px-2 py-0.5 text-[10px] font-medium text-[#6BCB77]">
                            🎉 On track
                          </span>
                        )}
                        {over && (
                          <span className="whitespace-nowrap rounded-full bg-[#E85C5C]/15 px-2 py-0.5 text-[10px] font-medium text-[#E85C5C]">
                            ⚠️ Over budget
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Donut */}
          <div className="card card-hover p-5 sm:p-7">
            <div className="mb-5">
              <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
                Allocation
              </div>
              <h2 className="mt-1 font-display text-[22px] leading-none text-text-primary sm:text-[24px]">
                Mix
              </h2>
            </div>
            <BudgetDonut />
          </div>
        </div>

        {/* Pre-Departure Budget Builder */}
        <div className="card p-5 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Pre-Departure
              </div>
              <h2 className="mt-1 font-display text-[22px] leading-tight text-text-primary sm:text-[28px]">
                Haven't set your budget yet? Build it here.
              </h2>
              <p className="mt-2 max-w-xl text-[13px] text-text-muted">
                Answer a few questions and we'll model a realistic semester
                budget based on your destination and lifestyle.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="mt-7 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.1em] text-primary">
                    Your estimated semester budget
                  </div>
                  <div className="mt-1 font-display text-[36px] leading-none text-text-primary sm:text-[44px]">
                    {formatCurrency(estimate.total)}
                  </div>
                </div>
                <div className="text-left text-[12px] text-text-muted sm:text-right">
                  {city} · {months} months · {trips} trips · {lifestyle}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
