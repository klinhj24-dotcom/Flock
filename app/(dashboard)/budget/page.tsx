"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  Plus,
  X,
  Repeat,
  CircleDollarSign,
  Pencil,
  Check,
  Plane,
  Home as HomeIcon,
  Utensils,
  Bus,
  Ticket,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Header } from "@/components/header";
import { BankConnect } from "@/components/cards/bank-connect";
import {
  BUDGET_LINE_ITEMS,
  BUDGET_PRESETS,
  HOME_CITIES,
  LIFESTYLE_MULTIPLIER,
  FUNDING_SOURCES,
  USER,
  type FundingSource,
  type BudgetLineItem,
} from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

const CATEGORY_ORDER = [
  "Pre-departure",
  "Housing",
  "Daily Food",
  "Weekend Trips",
  "Transportation",
  "Activities",
  "Emergency Fund",
  "Miscellaneous",
] as const;

const CATEGORY_ICON: Record<string, typeof Plane> = {
  "Pre-departure": Plane,
  Housing: HomeIcon,
  "Daily Food": Utensils,
  "Weekend Trips": Ticket,
  Transportation: Bus,
  Activities: Sparkles,
  "Emergency Fund": ShieldCheck,
  Miscellaneous: Package,
};

const CATEGORY_COLOR: Record<string, string> = {
  "Pre-departure": "#6E5A8F",
  Housing: "#E8D5A3",
  "Daily Food": "#B85C3C",
  "Weekend Trips": "#4A9EBF",
  Transportation: "#9FD4C5",
  Activities: "#C8B7DE",
  "Emergency Fund": "#6E5A8F",
  Miscellaneous: "#E8A4A4",
};

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetLineItem[]>(BUDGET_LINE_ITEMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newPlanned, setNewPlanned] = useState("");

  // Funding sources
  const [sources, setSources] = useState<FundingSource[]>(FUNDING_SOURCES);
  const [addingSource, setAddingSource] = useState(false);
  const [sourceLabel, setSourceLabel] = useState("");
  const [sourceAmount, setSourceAmount] = useState("");
  const [sourceRecurring, setSourceRecurring] = useState(false);

  // Budget estimator
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

  const totalPlanned = items.reduce((s, i) => s + i.planned, 0);
  const totalSpent = items.reduce((s, i) => s + i.spent, 0);
  const totalFunding = sources.reduce((s, f) => s + f.amount, 0);
  const remaining = Math.max(totalFunding, totalPlanned) - totalSpent;

  const grouped = useMemo(() => {
    const m = new Map<string, BudgetLineItem[]>();
    for (const cat of CATEGORY_ORDER) m.set(cat, []);
    for (const it of items) {
      if (!m.has(it.category)) m.set(it.category, []);
      m.get(it.category)!.push(it);
    }
    return m;
  }, [items]);

  const updateItem = (id: string, patch: Partial<BudgetLineItem>) => {
    setItems(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };
  const deleteItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };
  const addItem = (category: string) => {
    const p = Number(newPlanned);
    if (!newLabel.trim() || !Number.isFinite(p) || p <= 0) return;
    const newItem: BudgetLineItem = {
      id: `l-${Date.now()}`,
      category,
      label: newLabel.trim(),
      planned: p,
      spent: 0,
      preDeparture: category === "Pre-departure",
    };
    setItems([...items, newItem]);
    setNewLabel("");
    setNewPlanned("");
    setAddingToCategory(null);
  };

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
  const removeSource = (id: string) =>
    setSources(sources.filter((s) => s.id !== id));

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
    setEstimate({
      total: housing + food + transport + activities + misc + tripsBudget,
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
        greeting="Budget Builder"
        subtitle={`Line items for the whole semester · ${USER.daysLeft} days left`}
      />

      <div className="px-4 py-6 sm:px-10 sm:py-8">
        {/* Summary strip */}
        <div className="card card-hover mb-5 grid grid-cols-1 gap-4 p-6 sm:grid-cols-4 sm:p-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">
              Funding
            </div>
            <div className="mt-1 font-display text-[28px] leading-none text-text-primary sm:text-[32px]">
              {formatCurrency(totalFunding)}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">
              Planned
            </div>
            <div className="mt-1 font-display text-[28px] leading-none text-text-primary sm:text-[32px]">
              {formatCurrency(totalPlanned)}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">
              Spent
            </div>
            <div className="mt-1 font-display text-[28px] leading-none text-text-primary sm:text-[32px]">
              {formatCurrency(totalSpent)}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">
              Remaining
            </div>
            <div
              className={cn(
                "mt-1 font-display text-[28px] leading-none sm:text-[32px]",
                remaining < 0 ? "text-[#E85C5C]" : "text-text-primary"
              )}
            >
              {formatCurrency(remaining)}
            </div>
          </div>
        </div>

        {/* Bank connect */}
        <div className="mb-5">
          <BankConnect />
        </div>

        {/* Funding Sources */}
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
                <input
                  type="text"
                  value={sourceLabel}
                  onChange={(e) => setSourceLabel(e.target.value)}
                  placeholder="Scholarship"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                />
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
                <div className="flex h-[38px] gap-1 rounded-lg border border-border bg-background p-1">
                  <button
                    onClick={() => setSourceRecurring(false)}
                    className={cn(
                      "flex-1 rounded-md px-3 text-[11px] font-medium transition",
                      !sourceRecurring
                        ? "bg-primary/20 text-primary"
                        : "text-text-muted"
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
                        : "text-text-muted"
                    )}
                  >
                    Recurring
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setAddingSource(false);
                    setSourceLabel("");
                    setSourceAmount("");
                  }}
                  className="rounded-lg px-3 py-1.5 text-[12px] text-text-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={addSource}
                  className="rounded-lg bg-primary px-3 py-1.5 text-[12px] font-medium text-background"
                >
                  Add Source
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Line items by category */}
        <div className="space-y-4">
          {CATEGORY_ORDER.map((cat) => {
            const catItems = grouped.get(cat) ?? [];
            const catPlanned = catItems.reduce((s, i) => s + i.planned, 0);
            const catSpent = catItems.reduce((s, i) => s + i.spent, 0);
            const catRatio = catPlanned > 0 ? catSpent / catPlanned : 0;
            const Icon = CATEGORY_ICON[cat] ?? Package;
            const color = CATEGORY_COLOR[cat];
            const onTrack = catRatio < 0.7;
            const over = catRatio > 1.0;

            return (
              <div key={cat} className="card p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{ background: `${color}25` }}
                    >
                      <Icon
                        className="h-4 w-4"
                        style={{ color }}
                        strokeWidth={1.75}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-[18px] leading-none text-text-primary">
                          {cat}
                        </h3>
                        {onTrack && catPlanned > 0 && (
                          <span className="rounded-full bg-[#6BCB77]/15 px-2 py-0.5 text-[10px] font-medium text-[#6BCB77]">
                            🎉 On track
                          </span>
                        )}
                        {over && (
                          <span className="rounded-full bg-[#E85C5C]/15 px-2 py-0.5 text-[10px] font-medium text-[#E85C5C]">
                            ⚠️ Over
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[12px] text-text-muted">
                        {formatCurrency(catSpent)} of{" "}
                        {formatCurrency(catPlanned)}{" "}
                        <span className="text-text-muted/70">
                          ({Math.round(catRatio * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setAddingToCategory(
                        addingToCategory === cat ? null : cat
                      )
                    }
                    className="flex items-center gap-1 rounded-lg border border-border bg-surface-hover px-2.5 py-1.5 text-[11px] font-medium text-text-primary transition hover:border-primary/40"
                  >
                    <Plus className="h-3 w-3" />
                    Add line
                  </button>
                </div>

                {/* Progress bar */}
                {catPlanned > 0 && (
                  <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, catRatio * 100)}%`,
                        background: color,
                      }}
                    />
                  </div>
                )}

                {/* Items */}
                <div className="space-y-1.5">
                  {catItems.length === 0 && addingToCategory !== cat && (
                    <div className="rounded-lg border border-dashed border-border px-4 py-3 text-center text-[12px] text-text-muted">
                      No line items yet. Click Add line.
                    </div>
                  )}

                  {catItems.map((it) => (
                    <LineRow
                      key={it.id}
                      item={it}
                      editing={editingId === it.id}
                      onStartEdit={() => setEditingId(it.id)}
                      onStopEdit={() => setEditingId(null)}
                      onPatch={(p) => updateItem(it.id, p)}
                      onDelete={() => deleteItem(it.id)}
                    />
                  ))}

                  {addingToCategory === cat && (
                    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
                      <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="Line item label"
                        autoFocus
                        className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                      />
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-text-muted">
                          $
                        </span>
                        <input
                          type="number"
                          value={newPlanned}
                          onChange={(e) => setNewPlanned(e.target.value)}
                          placeholder="Planned"
                          className="w-24 rounded-md border border-border bg-background py-1.5 pl-5 pr-2 text-right text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => addItem(cat)}
                        className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-background transition hover:bg-primary-dim"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setAddingToCategory(null);
                          setNewLabel("");
                          setNewPlanned("");
                        }}
                        className="rounded-md border border-border px-2 py-1.5 text-[12px] text-text-muted transition hover:text-text-primary"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pre-Departure Estimator (still useful) */}
        <div className="card mt-5 p-5 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Helper
              </div>
              <h2 className="mt-1 font-display text-[22px] leading-tight text-text-primary sm:text-[28px]">
                Not sure where to start? Generate an estimate.
              </h2>
              <p className="mt-2 max-w-xl text-[13px] text-text-muted">
                Quick baseline based on your destination and lifestyle. Use the
                numbers to fill in line items above.
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
            Generate Estimate
          </button>

          {estimate && (
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
              <div className="mb-4 font-display text-[28px] leading-none text-text-primary">
                {formatCurrency(estimate.total)}
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
                    <div className="mt-1 font-display text-[18px] text-text-primary">
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

function LineRow({
  item,
  editing,
  onStartEdit,
  onStopEdit,
  onPatch,
  onDelete,
}: {
  item: BudgetLineItem;
  editing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onPatch: (patch: Partial<BudgetLineItem>) => void;
  onDelete: () => void;
}) {
  const ratio = item.planned > 0 ? item.spent / item.planned : 0;
  const onTrack = ratio < 0.7;
  const over = ratio > 1.0;

  if (editing) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
        <input
          type="text"
          value={item.label}
          onChange={(e) => onPatch({ label: e.target.value })}
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-[13px] text-text-primary focus:border-primary/40 focus:outline-none"
        />
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-text-muted">
            $
          </span>
          <input
            type="number"
            value={item.planned}
            onChange={(e) => onPatch({ planned: Number(e.target.value) || 0 })}
            className="w-24 rounded-md border border-border bg-background py-1.5 pl-5 pr-2 text-right text-[13px] text-text-primary focus:border-primary/40 focus:outline-none"
          />
        </div>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-text-muted">
            $
          </span>
          <input
            type="number"
            value={item.spent}
            onChange={(e) => onPatch({ spent: Number(e.target.value) || 0 })}
            className="w-24 rounded-md border border-border bg-background py-1.5 pl-5 pr-2 text-right text-[13px] text-text-primary focus:border-primary/40 focus:outline-none"
          />
        </div>
        <button
          onClick={onStopEdit}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-background transition hover:bg-primary-dim"
          title="Done"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-muted transition hover:border-[#E85C5C] hover:text-[#E85C5C]"
          title="Delete"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-background/40 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13px] font-medium text-text-primary">
            {item.label}
          </span>
          {onTrack && item.planned > 0 && (
            <span className="text-[10px] text-[#6BCB77]">●</span>
          )}
          {over && <span className="text-[10px] text-[#E85C5C]">●</span>}
          {item.preDeparture && (
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-primary">
              Pre-departure
            </span>
          )}
        </div>
        {item.note && (
          <div className="mt-0.5 text-[11px] text-text-muted">{item.note}</div>
        )}
      </div>
      <div className="text-right text-[12px]">
        <div className="font-medium text-text-primary">
          {formatCurrency(item.spent)}{" "}
          <span className="text-text-muted">/ {formatCurrency(item.planned)}</span>
        </div>
      </div>
      <button
        onClick={onStartEdit}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-text-muted opacity-0 transition hover:border-border hover:text-text-primary group-hover:opacity-100"
        title="Edit"
      >
        <Pencil className="h-3 w-3" strokeWidth={1.75} />
      </button>
    </div>
  );
}
