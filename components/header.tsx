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
    <header className="flex flex-col gap-3 border-b border-border bg-background/80 px-4 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-6">
      <div>
        <h1 className="font-display text-[24px] leading-tight tracking-tight text-text-primary sm:text-[32px]">
          {greeting ?? `Good morning, ${USER.firstName}`}
        </h1>
        <p className="mt-1 text-[12px] text-text-muted sm:text-[13px]">
          {subtitle ?? dateLabel}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] text-text-primary sm:px-3.5 sm:py-2 sm:text-[13px]">
          <MapPin className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
          <span>{USER.homeFlag}</span>
          <span className="font-medium">
            {USER.homeCity}, {USER.homeCountry}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] sm:px-3.5 sm:py-2 sm:text-[13px]">
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
