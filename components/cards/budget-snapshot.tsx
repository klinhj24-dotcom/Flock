"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Pencil, Check } from "lucide-react";
import {
  BUDGET_CATEGORIES,
  BUDGET_REMAINING,
  BUDGET_SPENT,
  BUDGET_TOTAL,
  type BudgetCategory,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { SpendingLine } from "@/components/charts/spending-line";

const LOCAL = {
  code: "JPY",
  rate: 150, // mock exchange rate
};

function Bar({
  label,
  spent,
  budgeted,
  color,
}: {
  label: string;
  spent: number;
  budgeted: number;
  color: string;
}) {
  const pct = Math.min(100, Math.round((spent / budgeted) * 100)) || 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-[12px]">
        <span className="text-text-muted">{label}</span>
        <span className="font-medium text-text-primary">
          {formatCurrency(spent)}{" "}
          <span className="text-text-muted">/ {formatCurrency(budgeted)}</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function BudgetSnapshot() {
  const [editing, setEditing] = useState(false);
  const [categories, setCategories] = useState<BudgetCategory[]>(
    BUDGET_CATEGORIES.map((c) => ({ ...c }))
  );
  const [draft, setDraft] = useState<Record<string, number>>(
    Object.fromEntries(BUDGET_CATEGORIES.map((c) => [c.name, c.budgeted]))
  );

  const totalBudget = categories.reduce((s, c) => s + c.budgeted, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const remaining = totalBudget - totalSpent;
  const overallPct = Math.round((totalSpent / totalBudget) * 100);

  const housing = categories.find((c) => c.name === "Housing")!;
  const trips = categories.find((c) => c.name === "Weekend Trips")!;
  const dailyFood = categories.find((c) => c.name === "Daily Food")!;
  const transport = categories.find((c) => c.name === "Transportation")!;

  const dailyLifeSpent = dailyFood.spent + transport.spent;
  const dailyLifeBudget = dailyFood.budgeted + transport.budgeted;

  const enterEdit = () => {
    setDraft(
      Object.fromEntries(categories.map((c) => [c.name, c.budgeted]))
    );
    setEditing(true);
  };

  const saveEdit = () => {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        budgeted: Number.isFinite(draft[c.name]) ? draft[c.name] : c.budgeted,
      }))
    );
    setEditing(false);
  };

  // Fallback starting values when not editing
  const displayRemaining = editing ? BUDGET_REMAINING : remaining;
  const displayTotal = editing ? BUDGET_TOTAL : totalBudget;
  const displaySpent = editing ? BUDGET_SPENT : totalSpent;
  const displayPct = editing
    ? Math.round((BUDGET_SPENT / BUDGET_TOTAL) * 100)
    : overallPct;

  return (
    <div className="card card-hover relative p-5 sm:p-7">
      <button
        onClick={editing ? saveEdit : enterEdit}
        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface-hover/40 text-text-muted transition hover:border-primary/40 hover:text-text-primary"
        title={editing ? "Save" : "Edit budget"}
      >
        {editing ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
        )}
      </button>

      <div className="mb-6 pr-10">
        <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
          Semester Budget
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <span className="font-display text-[40px] leading-none text-text-primary">
            {formatCurrency(displayRemaining)}
          </span>
          <span className="text-[13px] text-text-muted">
            remaining of {formatCurrency(displayTotal)}
          </span>
        </div>
        <div className="mt-1 text-[12px] text-text-muted">
          ≈ ¥{(displayRemaining * LOCAL.rate).toLocaleString()} {LOCAL.code}
        </div>
      </div>

      {/* Overall bar */}
      <div className="mb-2 flex items-baseline justify-between text-[12px]">
        <span className="text-text-muted">Total spent</span>
        <span className="font-medium text-text-primary">
          {formatCurrency(displaySpent)}{" "}
          <span className="text-text-muted">
            / {formatCurrency(displayTotal)}
          </span>{" "}
          <span className="text-text-muted">({displayPct}%)</span>
        </span>
      </div>
      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dim"
          style={{ width: `${displayPct}%` }}
        />
      </div>

      {/* Pace signal */}
      <div className="mb-6 text-[12px] text-primary">
        You're spending{" "}
        <span className="font-medium">$134/day</span>{" "}
        <span className="text-text-muted">·</span> budget is{" "}
        <span className="font-medium">$116/day</span>{" "}
        <span className="text-text-muted">·</span>{" "}
        <span>slightly over pace</span>
      </div>

      {editing ? (
        <div className="mb-6 space-y-2">
          {categories.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2"
            >
              <div className="flex items-center gap-2.5 text-[13px] text-text-primary">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ background: c.color }}
                />
                {c.name}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[13px] text-text-muted">$</span>
                <input
                  type="number"
                  value={draft[c.name] ?? c.budgeted}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      [c.name]: Number(e.target.value),
                    })
                  }
                  className="w-24 rounded-md border border-border bg-background px-2 py-1 text-right text-[13px] text-text-primary focus:border-primary/40 focus:outline-none"
                />
              </div>
            </div>
          ))}
          <button
            onClick={saveEdit}
            className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-[12px] font-medium text-background transition hover:bg-primary-dim"
          >
            Save
          </button>
        </div>
      ) : (
        /* Sub-bars */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          <Bar
            label="Housing"
            spent={housing.spent}
            budgeted={housing.budgeted}
            color="#E8D5A3"
          />
          <Bar
            label="Trips"
            spent={trips.spent}
            budgeted={trips.budgeted}
            color="#4A9EBF"
          />
          <Bar
            label="Daily Life"
            spent={dailyLifeSpent}
            budgeted={dailyLifeBudget}
            color="#B85C3C"
          />
        </div>
      )}

      {/* Trend */}
      <div className="mt-7 border-t border-border pt-5">
        <div className="mb-2 flex items-center justify-between text-[12px]">
          <span className="text-text-muted">Weekly spending</span>
          <span className="text-text-muted">Last 9 weeks</span>
        </div>
        <SpendingLine />
      </div>

      {/* View Details link */}
      <div className="mt-5 flex justify-end">
        <Link
          href="/budget"
          className="flex items-center gap-1 text-[12px] text-text-muted transition hover:text-primary"
        >
          View Details
          <ArrowRight className="h-[14px] w-[14px]" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}

