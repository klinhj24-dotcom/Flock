"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Home as HomeIcon,
  Plane,
  Wallet,
  Telescope,
  Settings,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { USER } from "@/lib/mock-data";

const NAV = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/trips", label: "Trips", icon: Plane },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/discover", label: "Discover", icon: Telescope },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[240px] flex-col border-r border-border bg-background px-5 py-6">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
          <Compass className="h-4.5 w-4.5 text-primary" strokeWidth={1.75} />
        </div>
        <span className="font-display text-2xl tracking-tight text-text-primary">
          Flock
        </span>
      </div>

      {/* User context */}
      <div className="mb-8 rounded-xl border border-border bg-surface px-3.5 py-3">
        <div className="mb-1 text-[13px] font-medium text-text-primary">
          {USER.name}
        </div>
        <div className="mb-0.5 flex items-center gap-1.5 text-[12px] text-text-muted">
          <span>{USER.homeFlag}</span>
          <span>
            {USER.homeCity}, {USER.homeCountry}
          </span>
        </div>
        <div className="text-[11px] text-text-muted/80">{USER.program}</div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition",
                active
                  ? "bg-surface text-text-primary"
                  : "text-text-muted hover:bg-surface/60 hover:text-text-primary"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition",
                  active ? "text-primary" : "text-text-muted group-hover:text-text-primary"
                )}
                strokeWidth={1.75}
              />
              <span className="font-medium">{label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="mt-4 space-y-2">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-text-muted transition hover:bg-surface/60 hover:text-text-primary">
          <Settings className="h-4 w-4" strokeWidth={1.75} />
          <span>Settings</span>
        </button>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-[13px] font-medium text-text-primary transition hover:border-primary/40 hover:bg-surface-hover">
          <UserPlus className="h-4 w-4" strokeWidth={1.75} />
          Invite Friends
        </button>
      </div>
    </aside>
  );
}
