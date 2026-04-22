"use client";

import { ArrowUpRight } from "lucide-react";
import {
  BUDGET_CATEGORIES,
  BUDGET_REMAINING,
  BUDGET_SPENT,
  BUDGET_TOTAL,
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
  const overallPct = Math.round((BUDGET_SPENT / BUDGET_TOTAL) * 100);

  const housing = BUDGET_CATEGORIES.find((c) => c.name === "Housing")!;
  const trips = BUDGET_CATEGORIES.find((c) => c.name === "Weekend Trips")!;
  const dailyFood = BUDGET_CATEGORIES.find((c) => c.name === "Daily Food")!;
  const transport = BUDGET_CATEGORIES.find(
    (c) => c.name === "Transportation"
  )!;

  const dailyLifeSpent = dailyFood.spent + transport.spent;
  const dailyLifeBudget = dailyFood.budgeted + transport.budgeted;

  return (
    <div className="card card-hover p-7">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
            Semester Budget
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-[40px] leading-none text-text-primary">
              {formatCurrency(BUDGET_REMAINING)}
            </span>
            <span className="text-[13px] text-text-muted">
              remaining of {formatCurrency(BUDGET_TOTAL)}
            </span>
          </div>
          <div className="mt-1 text-[12px] text-text-muted">
            ≈ ¥{(BUDGET_REMAINING * LOCAL.rate).toLocaleString()} {LOCAL.code}
          </div>
        </div>
        <a
          href="/budget"
          className="flex items-center gap-1 rounded-full border border-border bg-surface-hover/40 px-3 py-1.5 text-[12px] text-text-primary transition hover:border-primary/40"
        >
          View details <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>

      {/* Overall bar */}
      <div className="mb-2 flex items-baseline justify-between text-[12px]">
        <span className="text-text-muted">Total spent</span>
        <span className="font-medium text-text-primary">
          {formatCurrency(BUDGET_SPENT)}{" "}
          <span className="text-text-muted">
            / {formatCurrency(BUDGET_TOTAL)}
          </span>{" "}
          <span className="text-text-muted">({overallPct}%)</span>
        </span>
      </div>
      <div className="mb-7 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dim"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      {/* Sub-bars */}
      <div className="grid grid-cols-3 gap-6">
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

      {/* Trend */}
      <div className="mt-7 border-t border-border pt-5">
        <div className="mb-2 flex items-center justify-between text-[12px]">
          <span className="text-text-muted">Weekly spending</span>
          <span className="text-text-muted">Last 9 weeks</span>
        </div>
        <SpendingLine />
      </div>
    </div>
  );
}
