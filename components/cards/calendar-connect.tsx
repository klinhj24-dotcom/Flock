"use client";

import { useState } from "react";
import { Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ClassBlock = {
  day: string; // "M" | "T" | "W" | "Th" | "F"
  startHour: number; // 8-18
  endHour: number;
  label: string;
  accent: string; // tailwind color class
};

const CLASSES: ClassBlock[] = [
  { day: "M", startHour: 9, endHour: 10, label: "Economics", accent: "bg-[#4A9EBF]/70" },
  { day: "W", startHour: 9, endHour: 10, label: "Economics", accent: "bg-[#4A9EBF]/70" },
  { day: "F", startHour: 9, endHour: 10, label: "Economics", accent: "bg-[#4A9EBF]/70" },
  { day: "T", startHour: 14, endHour: 15.5, label: "Art History", accent: "bg-[#B85C3C]/70" },
  { day: "Th", startHour: 14, endHour: 15.5, label: "Art History", accent: "bg-[#B85C3C]/70" },
  { day: "T", startHour: 11, endHour: 12.5, label: "Intro Japanese", accent: "bg-[#C8B7DE]/70" },
  { day: "Th", startHour: 11, endHour: 12.5, label: "Intro Japanese", accent: "bg-[#C8B7DE]/70" },
  { day: "W", startHour: 15, endHour: 17, label: "Seminar", accent: "bg-[#E8D5A3]/70" },
];

const DAYS = ["M", "T", "W", "Th", "F"] as const;
const START_HOUR = 8;
const END_HOUR = 18;
const HOUR_HEIGHT = 28;

export function CalendarConnect() {
  const [status, setStatus] = useState<"idle" | "loading" | "connected">("idle");

  const connect = () => {
    setStatus("loading");
    setTimeout(() => setStatus("connected"), 1000);
  };

  if (status === "connected") {
    return (
      <div className="card card-hover relative p-5 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-text-muted">
              <Calendar className="h-3.5 w-3.5" />
              Your Schedule
            </div>
            <h2 className="mt-1 font-display text-[22px] leading-none text-text-primary sm:text-[24px]">
              This week
            </h2>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[#6BCB77]/15 px-2.5 py-1 text-[11px] font-medium text-[#6BCB77]">
            <Check className="h-3 w-3" /> Synced
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="flex border-b border-border text-[11px] uppercase tracking-[0.1em] text-text-muted">
              <div className="w-10 flex-shrink-0 py-2" />
              {DAYS.map((d) => (
                <div key={d} className="flex-1 py-2 text-center">
                  {d}
                </div>
              ))}
            </div>
            <div
              className="relative flex"
              style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}
            >
              {/* Hour gutter */}
              <div className="w-10 flex-shrink-0 border-r border-border">
                {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-end pr-1.5 pt-0.5 text-[9px] text-text-muted"
                    style={{ height: HOUR_HEIGHT }}
                  >
                    {START_HOUR + i}
                  </div>
                ))}
              </div>
              {/* Day columns */}
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="relative flex-1 border-r border-border last:border-r-0"
                >
                  {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                    <div
                      key={i}
                      className="border-b border-border/60"
                      style={{ height: HOUR_HEIGHT }}
                    />
                  ))}
                  {CLASSES.filter((c) => c.day === d).map((c, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute left-1 right-1 flex items-start rounded-md px-1.5 py-1 text-[10px] font-medium text-white shadow-sm",
                        c.accent
                      )}
                      style={{
                        top: (c.startHour - START_HOUR) * HOUR_HEIGHT,
                        height: (c.endHour - c.startHour) * HOUR_HEIGHT - 2,
                      }}
                    >
                      {c.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-hover flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10 ring-1 ring-secondary/30">
          <Calendar className="h-5 w-5 text-secondary" strokeWidth={1.75} />
        </div>
        <div>
          <div className="text-[12px] uppercase tracking-[0.12em] text-text-muted">
            Your Schedule
          </div>
          <h3 className="mt-1 font-display text-[20px] leading-tight text-text-primary">
            Connect Google Calendar so Flock can plan around your classes
          </h3>
        </div>
      </div>
      <button
        onClick={connect}
        disabled={status === "loading"}
        className="w-full rounded-lg border border-border bg-surface-hover px-4 py-2.5 text-[13px] font-medium text-text-primary transition hover:border-primary/40 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Connecting…" : "Connect Google Calendar"}
      </button>
    </div>
  );
}
