"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import {
  BUDGET_LINE_ITEMS,
  FUNDING_SOURCES,
  USER,
} from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

export function BudgetBriefing() {
  const planned = BUDGET_LINE_ITEMS.reduce((s, l) => s + l.planned, 0);
  const spent = BUDGET_LINE_ITEMS.reduce((s, l) => s + l.spent, 0);
  const funding = FUNDING_SOURCES.reduce((s, f) => s + f.amount, 0);
  const available = Math.max(funding, planned);
  const remaining = available - spent;
  const pct = Math.min(100, Math.round((spent / available) * 100));

  // Pace: how far through semester vs how much spent
  // Semester length approximation: USER.daysLeft counts down
  const semesterDays = 120;
  const elapsedPct = Math.min(
    100,
    Math.round(((semesterDays - USER.daysLeft) / semesterDays) * 100)
  );
  const onPace = pct <= elapsedPct + 5;

  return (
    <div className="card card-hover p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-text-muted">
            Semester briefing
          </div>
          <h2 className="mt-1 font-display text-[22px] leading-none text-text-primary sm:text-[24px]">
            You're at{" "}
            <span className={onPace ? "text-[#6BCB77]" : "text-[#E8B572]"}>
              {pct}%
            </span>{" "}
            spent
          </h2>
        </div>
        <Link
          href="/budget"
          className="flex items-center gap-1 rounded-full border border-border bg-surface-hover px-3 py-1.5 text-[12px] font-medium text-text-primary transition hover:border-primary/40"
        >
          Open budget <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Three big numbers */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.1em] text-text-muted">
            Planned
          </div>
          <div className="mt-0.5 font-display text-[22px] leading-none text-text-primary sm:text-[28px]">
            {formatCurrency(planned)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.1em] text-text-muted">
            Spent
          </div>
          <div className="mt-0.5 font-display text-[22px] leading-none text-text-primary sm:text-[28px]">
            {formatCurrency(spent)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.1em] text-text-muted">
            Remaining
          </div>
          <div
            className={cn(
              "mt-0.5 font-display text-[22px] leading-none sm:text-[28px]",
              remaining < 0 ? "text-[#E85C5C]" : "text-text-primary"
            )}
          >
            {formatCurrency(remaining)}
          </div>
        </div>
      </div>

      {/* Dual progress bar (spent vs elapsed) */}
      <div className="mt-5">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-border">
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-primary to-primary-dim"
            style={{ width: `${pct}%` }}
          />
          {/* Elapsed marker */}
          <div
            className="absolute top-[-2px] h-[calc(100%+4px)] w-[2px] bg-text-muted"
            style={{ left: `calc(${elapsedPct}% - 1px)` }}
            title={`${elapsedPct}% of semester elapsed`}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-muted">
          <span
            className={cn(
              "flex items-center gap-1",
              onPace ? "text-[#6BCB77]" : "text-[#E8B572]"
            )}
          >
            {onPace ? (
              <TrendingDown className="h-3 w-3" strokeWidth={2} />
            ) : (
              <TrendingUp className="h-3 w-3" strokeWidth={2} />
            )}
            {onPace
              ? `On pace — ${pct}% spent, ${elapsedPct}% elapsed`
              : `Slightly ahead of pace`}
          </span>
          <span>
            {USER.daysLeft} days left · {formatCurrency(Math.round(Math.max(0, remaining) / USER.daysLeft))}/day
          </span>
        </div>
      </div>
    </div>
  );
}
