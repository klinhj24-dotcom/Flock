"use client";

import { MapPin, CalendarDays } from "lucide-react";
import { USER } from "@/lib/mock-data";

type HeaderProps = {
  greeting?: string;
  subtitle?: string;
};

export function Header({ greeting, subtitle }: HeaderProps) {
  const now = new Date();
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <header className="flex items-center justify-between border-b border-border bg-background/80 px-10 py-6 backdrop-blur">
      <div>
        <h1 className="font-display text-[32px] leading-tight tracking-tight text-text-primary">
          {greeting ?? `Good morning, ${USER.firstName}`}
        </h1>
        <p className="mt-1 text-[13px] text-text-muted">
          {subtitle ?? dateLabel}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-[13px] text-text-primary">
          <MapPin className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
          <span>{USER.homeFlag}</span>
          <span className="font-medium">
            {USER.homeCity}, {USER.homeCountry}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-[13px]">
          <CalendarDays
            className="h-3.5 w-3.5 text-secondary"
            strokeWidth={2}
          />
          <span className="font-medium text-text-primary">
            {USER.daysLeft} days left
          </span>
        </div>
      </div>
    </header>
  );
}
