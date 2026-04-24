"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet, Calendar, Users, Plane } from "lucide-react";
import type { Trip } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export type ChipValues = {
  budgetPerPerson?: number;
  currency?: string;
  dates?: { start?: string; end?: string; flexDays?: number };
  groupSize?: number;
  homeAirport?: string;
  stayMaxPerNight?: number;
  stayMaxDistanceKm?: number;
  vibe?: string[];
  transportMode?: Array<"fly" | "train" | "bus">;
};

export function deriveDefaultChipValues(trip: Trip): ChipValues {
  return {
    budgetPerPerson:
      trip.people.length > 0
        ? Math.round(trip.estimatedCost / trip.people.length)
        : 0,
    currency: "EUR",
    dates: { start: trip.startDate, end: trip.endDate, flexDays: 0 },
    groupSize: trip.people.length,
    transportMode: ["fly"],
  };
}

export function ChipBar({
  value,
  onChange,
}: {
  value: ChipValues;
  onChange: (next: ChipValues) => void;
}) {
  const set = <K extends keyof ChipValues>(k: K, v: ChipValues[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-2">
      <Chip
        icon={<Wallet className="h-3 w-3" />}
        label="Budget/pp"
        summary={
          value.budgetPerPerson
            ? `${value.currency ?? "EUR"} ${value.budgetPerPerson}`
            : "—"
        }
      >
        {(close) => (
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <span className="w-20 text-[11px] text-text-muted">per pp</span>
              <input
                type="number"
                min={0}
                value={value.budgetPerPerson ?? ""}
                onChange={(e) =>
                  set(
                    "budgetPerPerson",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className="w-24 rounded border border-border bg-background px-2 py-1 text-[12px] text-text-primary"
              />
              <select
                value={value.currency ?? "EUR"}
                onChange={(e) => set("currency", e.target.value)}
                className="rounded border border-border bg-background px-1 py-1 text-[12px] text-text-primary"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </label>
            <SaveRow onClose={close} />
          </div>
        )}
      </Chip>

      <Chip
        icon={<Calendar className="h-3 w-3" />}
        label="Dates"
        summary={formatDateSummary(value.dates)}
      >
        {(close) => (
          <div className="space-y-2">
            <DateInput
              label="Start"
              value={value.dates?.start}
              onChange={(v) =>
                set("dates", { ...value.dates, start: v })
              }
            />
            <DateInput
              label="End"
              value={value.dates?.end}
              onChange={(v) => set("dates", { ...value.dates, end: v })}
            />
            <label className="block">
              <span className="text-[10px] uppercase tracking-wide text-text-muted">
                Flex days (±)
              </span>
              <input
                type="number"
                min={0}
                max={14}
                value={value.dates?.flexDays ?? 0}
                onChange={(e) =>
                  set("dates", {
                    ...value.dates,
                    flexDays: Number(e.target.value) || 0,
                  })
                }
                className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-[12px] text-text-primary"
              />
            </label>
            <SaveRow onClose={close} />
          </div>
        )}
      </Chip>

      <Chip
        icon={<Users className="h-3 w-3" />}
        label="Group"
        summary={value.groupSize ? `${value.groupSize} ppl` : "—"}
      >
        {(close) => (
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <span className="w-20 text-[11px] text-text-muted">size</span>
              <input
                type="number"
                min={1}
                max={20}
                value={value.groupSize ?? ""}
                onChange={(e) =>
                  set(
                    "groupSize",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className="w-20 rounded border border-border bg-background px-2 py-1 text-[12px] text-text-primary"
              />
            </label>
            <SaveRow onClose={close} />
          </div>
        )}
      </Chip>

      <Chip
        icon={<Plane className="h-3 w-3" />}
        label="Transport"
        summary={
          value.transportMode?.length ? value.transportMode.join(", ") : "any"
        }
      >
        {(close) => (
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-wide text-text-muted">
              Allowed modes
            </div>
            {(["fly", "train", "bus"] as const).map((m) => (
              <label
                key={m}
                className="flex items-center gap-2 text-[12px] text-text-primary"
              >
                <input
                  type="checkbox"
                  checked={value.transportMode?.includes(m) ?? false}
                  onChange={(e) => {
                    const cur = new Set(value.transportMode ?? []);
                    if (e.target.checked) cur.add(m);
                    else cur.delete(m);
                    set(
                      "transportMode",
                      Array.from(cur) as Array<"fly" | "train" | "bus">,
                    );
                  }}
                />
                {m}
              </label>
            ))}
            <SaveRow onClose={close} />
          </div>
        )}
      </Chip>
    </div>
  );
}

type ChipProps = {
  icon: React.ReactNode;
  label: string;
  summary: string;
  children: (close: () => void) => React.ReactNode;
};

function Chip({ icon, label, summary, children }: ChipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition",
          open
            ? "border-primary/60 bg-primary/10 text-primary"
            : "border-border bg-background text-text-primary hover:border-primary/40",
        )}
      >
        <span className="text-text-muted">{icon}</span>
        <span className="text-[10px] uppercase tracking-wide text-text-muted">
          {label}
        </span>
        <span className="font-medium">{summary}</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-64 rounded-lg border border-border bg-surface p-3 shadow-lg">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <input
        type="date"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-[12px] text-text-primary"
      />
    </label>
  );
}

function SaveRow({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClose}
        className="rounded bg-primary px-2.5 py-1 text-[11px] font-medium text-white transition hover:opacity-90"
      >
        Done
      </button>
    </div>
  );
}

function formatDateSummary(dates?: ChipValues["dates"]): string {
  if (!dates?.start || !dates?.end) return "—";
  const start = dates.start.slice(5).replace("-", "/");
  const end = dates.end.slice(5).replace("-", "/");
  const flex =
    dates.flexDays && dates.flexDays > 0 ? ` ±${dates.flexDays}d` : "";
  return `${start}→${end}${flex}`;
}
