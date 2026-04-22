import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  compact: boolean = false
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(amount);
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth();
  const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });
  if (sameMonth) {
    return `${monthFmt.format(s)} ${s.getDate()}–${e.getDate()}`;
  }
  return `${monthFmt.format(s)} ${s.getDate()} – ${monthFmt.format(
    e
  )} ${e.getDate()}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
