"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
  Users,
  Plus,
  Check,
  Crown,
  Clock,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/header";
import { ChatDrawer } from "@/components/chat/chat-drawer";
import {
  TRIPS,
  FRIENDS,
  type Trip,
  type TripExpense,
} from "@/lib/mock-data";
import { cn, formatCurrency, formatDateRange, initials } from "@/lib/utils";

type TabId = "overview" | "expenses" | "bookings";

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const trip = TRIPS.find((t) => t.id === params.id);

  const [tab, setTab] = useState<TabId>("overview");
  const [showMessagePopover, setShowMessagePopover] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#expenses") {
      setTab("expenses");
    }
  }, []);

  if (!trip) {
    return (
      <>
        <Header greeting="Trip not found" subtitle="Let's find you something to plan." />
        <div className="px-10 py-8">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-[13px] text-text-muted transition hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to trips
          </Link>
        </div>
      </>
    );
  }

  const messageGroup = () => {
    const phones = trip.people
      .map((name) => FRIENDS.find((f) => f.name === name)?.phone)
      .filter(Boolean) as string[];
    if (!phones.length) return;
    const body = encodeURIComponent(
      `Hey everyone, about our trip to ${trip.city}...`
    );
    const smsUrl = `sms:&addresses=${phones.join(",")}&body=${body}`;
    window.open(smsUrl, "_blank");
  };

  const handleMessageClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      messageGroup();
    } else {
      setShowMessagePopover((v) => !v);
    }
  };

  return (
    <>
      <Header
        greeting={`${trip.flag} ${trip.city}`}
        subtitle={`${formatDateRange(trip.startDate, trip.endDate)} · ${trip.people.length} travelers`}
      />

      <div className="px-4 py-6 sm:px-10 sm:py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-[13px] text-text-muted transition hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to trips
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-[12px] font-medium text-primary transition hover:bg-primary/15"
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
              Plan with Flock
            </button>
            <div className="relative">
              <button
                onClick={handleMessageClick}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-hover px-3 py-2 text-[12px] font-medium text-text-primary transition hover:border-primary/40"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                Message Group
              </button>
              {showMessagePopover && (
                <div className="absolute right-0 top-full z-30 mt-2 w-60 rounded-lg border border-border bg-surface px-3 py-2.5 text-[12px] text-text-muted shadow-lg">
                  Open on mobile to message your group directly
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero */}
        <div
          className={cn(
            "gradient-noise relative mb-5 h-[160px] overflow-hidden rounded-2xl bg-gradient-to-br p-6",
            trip.accent
          )}
        >
          <div className="absolute bottom-5 left-6 right-6">
            <div className="mb-1 flex items-center gap-2 text-[12px] text-white/80">
              <span>{trip.flag}</span>
              <span>{trip.country}</span>
            </div>
            <h1 className="font-display text-[36px] leading-none tracking-tight text-white">
              {trip.city}
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-1 rounded-lg border border-border bg-surface p-1">
          {(
            [
              { id: "overview", label: "Overview" },
              { id: "expenses", label: "Expenses" },
              { id: "bookings", label: "Bookings" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 rounded-md px-4 py-1.5 text-[13px] font-medium transition",
                tab === t.id
                  ? "bg-surface-hover text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab trip={trip} />}
        {tab === "expenses" && <ExpensesTab trip={trip} />}
        {tab === "bookings" && <BookingsTab trip={trip} />}
      </div>

      <ChatDrawer
        trip={trip}
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}

function OverviewTab({ trip }: { trip: Trip }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="card p-5 sm:p-7 lg:col-span-2">
        <div className="mb-4 text-[12px] uppercase tracking-[0.12em] text-text-muted">
          The crew
        </div>
        <div className="flex flex-wrap gap-2">
          {trip.people.map((p) => {
            const isCaptain = p === (trip.tripCaptain ?? trip.captain);
            return (
              <div
                key={p}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px]",
                  isCaptain
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-surface-hover text-text-primary"
                )}
              >
                {isCaptain && <Crown className="h-3 w-3" />}
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-[9px] font-medium">
                  {initials(p)}
                </span>
                {p}
              </div>
            );
          })}
          {trip.waitlist?.map((p) => (
            <div
              key={p}
              className="flex items-center gap-2 rounded-full border border-dashed border-border bg-background/60 px-3 py-1.5 text-[12px] text-text-muted"
            >
              <Clock className="h-3 w-3" />
              {p}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 sm:p-7">
        <div className="mb-3 text-[12px] uppercase tracking-[0.12em] text-text-muted">
          Budget
        </div>
        <div className="font-display text-[32px] leading-none text-text-primary">
          {formatCurrency(trip.actualCost ?? trip.estimatedCost)}
        </div>
        <div className="mt-1 text-[12px] text-text-muted">
          {trip.actualCost ? "actual" : "estimated"} · {trip.status}
        </div>
        <div className="mt-5 flex items-center gap-2 text-[12px] text-text-muted">
          <Users className="h-3.5 w-3.5" />
          {trip.people.length} travelers
        </div>
      </div>
    </div>
  );
}

function BookingsTab({ trip }: { trip: Trip }) {
  return (
    <div className="card p-5 sm:p-7">
      <div className="mb-4 text-[12px] uppercase tracking-[0.12em] text-text-muted">
        Booking status
      </div>
      <div className="space-y-3">
        {trip.bookingStatus.map((b) => (
          <div
            key={b.item}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-4 py-3"
          >
            <div>
              <div className="text-[13px] font-medium text-text-primary">
                {b.item}
              </div>
              {b.note && (
                <div className="text-[11px] text-text-muted">{b.note}</div>
              )}
            </div>
            <span className="rounded-full border border-border bg-surface-hover px-2.5 py-1 text-[11px] font-medium text-text-primary">
              {b.status.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpensesTab({ trip }: { trip: Trip }) {
  const [expenses, setExpenses] = useState<TripExpense[]>(trip.expenses ?? []);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(trip.people[0]);
  const [splitBetween, setSplitBetween] = useState<string[]>([...trip.people]);

  const addExpense = () => {
    const a = Number(amount);
    if (!desc.trim() || !Number.isFinite(a) || a <= 0 || !splitBetween.length) return;
    setExpenses([
      ...expenses,
      {
        id: `e-${Date.now()}`,
        description: desc.trim(),
        amount: a,
        paidBy,
        splitBetween: [...splitBetween],
      },
    ]);
    setDesc("");
    setAmount("");
    setSplitBetween([...trip.people]);
  };

  const toggleSplit = (name: string) => {
    setSplitBetween((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const settleUp = (person: string) => {
    setExpenses((prev) =>
      prev.map((e) => ({
        ...e,
        settled: { ...(e.settled ?? {}), [person]: true },
      }))
    );
  };

  const balances = useMemo(() => {
    const b: Record<string, number> = Object.fromEntries(
      trip.people.map((p) => [p, 0])
    );
    for (const e of expenses) {
      const share = e.amount / (e.splitBetween.length || 1);
      b[e.paidBy] = (b[e.paidBy] ?? 0) + e.amount;
      for (const person of e.splitBetween) {
        if (e.settled?.[person]) continue;
        b[person] = (b[person] ?? 0) - share;
      }
    }
    return b;
  }, [expenses, trip.people]);

  const isSettled = (person: string) => {
    const unsettledExpenses = expenses.filter(
      (e) => e.splitBetween.includes(person) && !e.settled?.[person]
    );
    return balances[person] >= -0.5 && unsettledExpenses.length === 0 && person !== trip.people[0];
  };

  return (
    <div id="expenses" className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
      {/* Log expense form */}
      <div className="card p-5 sm:p-7">
        <div className="mb-1 text-[12px] uppercase tracking-[0.12em] text-text-muted">
          Log a group expense
        </div>
        <p className="mb-4 text-[12px] text-text-muted">
          Only for when one person pays for the whole group. Your personal spending syncs automatically from your linked bank.
        </p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
              Description
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Dinner, airport taxi..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-muted">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="60"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 pl-6 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Who paid?
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-text-primary focus:border-primary/40 focus:outline-none"
              >
                {trip.people.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
              Split between
            </label>
            <div className="flex flex-wrap gap-1.5">
              {trip.people.map((p) => {
                const active = splitBetween.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => toggleSplit(p)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] transition",
                      active
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border bg-surface text-text-muted hover:border-primary/30"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-3.5 w-3.5 items-center justify-center rounded border",
                        active
                          ? "border-primary bg-primary/40"
                          : "border-border"
                      )}
                    >
                      {active && <Check className="h-2 w-2 text-primary-dim" />}
                    </span>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={addExpense}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-background transition hover:bg-primary-dim"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
            Add Expense
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Balances */}
        <div className="card p-5 sm:p-7">
          <div className="mb-4 text-[12px] uppercase tracking-[0.12em] text-text-muted">
            Balances
          </div>
          <div className="space-y-2">
            {trip.people.map((p) => {
              const bal = balances[p] ?? 0;
              const rounded = Math.round(bal * 100) / 100;
              const settled = isSettled(p);
              return (
                <div
                  key={p}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-4 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-hover text-[10px] font-medium text-text-primary">
                      {initials(p)}
                    </div>
                    <span className="text-[13px] font-medium text-text-primary">
                      {p}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-display text-[18px]",
                        rounded > 0.5
                          ? "text-[#6BCB77]"
                          : rounded < -0.5
                          ? "text-[#E85C5C]"
                          : "text-text-muted"
                      )}
                    >
                      {rounded > 0 ? "+" : rounded < 0 ? "-" : ""}$
                      {Math.abs(rounded).toFixed(0)}
                    </span>
                    {rounded < -0.5 && !settled && (
                      <button
                        onClick={() => settleUp(p)}
                        className="rounded-full border border-border bg-surface-hover px-2.5 py-1 text-[11px] font-medium text-text-primary transition hover:border-primary/40"
                      >
                        Settle Up
                      </button>
                    )}
                    {settled && (
                      <span className="flex items-center gap-1 rounded-full bg-[#6BCB77]/15 px-2.5 py-1 text-[11px] font-medium text-[#6BCB77]">
                        <Check className="h-3 w-3" />
                        Settled
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense list */}
        <div className="card p-5 sm:p-7">
          <div className="mb-4 text-[12px] uppercase tracking-[0.12em] text-text-muted">
            Expenses ({expenses.length})
          </div>
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-[12px] text-text-muted">
                No expenses yet. Log one on the left.
              </div>
            ) : (
              expenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background/40 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-text-primary">
                      {e.description}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {e.paidBy} paid · split {e.splitBetween.length}
                    </div>
                  </div>
                  <div className="font-display text-[18px] text-text-primary">
                    {formatCurrency(e.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
