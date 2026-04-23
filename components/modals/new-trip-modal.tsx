"use client";

import { useState, useMemo } from "react";
import {
  X,
  Plus,
  MapPin,
  Plane,
  Clock,
  Crown,
  DollarSign,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Trip } from "@/lib/mock-data";

type FlightOption = {
  airline: string;
  price: number;
  duration: string;
  departure: string;
};

const PREFERENCE_OPTIONS = [
  "Beach",
  "Food",
  "Nightlife",
  "Culture",
  "Nature",
  "Shopping",
  "Relaxation",
] as const;

const ACCOMMODATION_OPTIONS = ["Hostel", "Airbnb", "Hotel"] as const;

const MOCK_FLIGHTS: FlightOption[] = [
  {
    airline: "Peach Aviation",
    price: 128,
    duration: "2h 30m",
    departure: "Fri 7:20 AM",
  },
  {
    airline: "ANA",
    price: 186,
    duration: "2h 15m",
    departure: "Fri 6:45 PM",
  },
  {
    airline: "Jetstar",
    price: 94,
    duration: "2h 45m",
    departure: "Sat 11:10 AM",
  },
];

const TRIPS_BUDGET_REMAINING = 2160; // mock — pulled from budget

type StepId = 1 | 2 | 3 | 4 | 5;

function HeatmapDay({
  label,
  date,
  price,
  selected,
  onClick,
}: {
  label: string;
  date: number;
  price: number;
  selected: boolean;
  onClick: () => void;
}) {
  let bg = "rgba(232, 92, 92, 0.2)"; // red >180
  let fg = "#E85C5C";
  if (price < 120) {
    bg = "rgba(34, 197, 94, 0.2)";
    fg = "#6BCB77";
  } else if (price <= 180) {
    bg = "rgba(232, 181, 114, 0.2)";
    fg = "#E8B572";
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-0.5 rounded-lg p-2 text-left transition",
        selected
          ? "ring-2 ring-primary"
          : "ring-1 ring-transparent hover:ring-border"
      )}
      style={{ background: bg }}
    >
      <div className="text-[10px] uppercase tracking-wide text-text-muted">
        {label} {date}
      </div>
      <div className="text-[13px] font-medium" style={{ color: fg }}>
        ${price}
      </div>
    </button>
  );
}

function StepPill({
  n,
  label,
  active,
  done,
  onClick,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition sm:px-3",
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : done
          ? "border-border bg-surface-hover text-text-primary"
          : "border-border bg-background text-text-muted"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[9px]",
          active
            ? "bg-primary text-background"
            : done
            ? "bg-primary/30 text-primary"
            : "bg-border text-text-muted"
        )}
      >
        {done ? <Check className="h-2.5 w-2.5" /> : n}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function NewTripModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate?: (trip: Trip) => void;
}) {
  const [step, setStep] = useState<StepId>(1);

  // Step 1
  const [destination, setDestination] = useState("");
  const [flights, setFlights] = useState<FlightOption[] | null>(null);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  // Step 2
  const [budget, setBudget] = useState("");

  // Step 3
  const [preferences, setPreferences] = useState<string[]>([]);
  const [accommodation, setAccommodation] = useState<
    (typeof ACCOMMODATION_OPTIONS)[number]
  >("Hostel");
  const [notes, setNotes] = useState("");

  // Step 4
  const [people, setPeople] = useState<string[]>(["Henry"]);
  const [personInput, setPersonInput] = useState("");
  const [captain, setCaptain] = useState("Henry");
  const [tripSizeLimit, setTripSizeLimit] = useState<number>(4);
  const [allowWaitlist, setAllowWaitlist] = useState(false);
  const [waitlist, setWaitlist] = useState<string[]>([]);
  const [waitlistInput, setWaitlistInput] = useState("");

  const heatmapDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        d.getDay()
      ];
      // Stable pseudo-random price per index
      const price = 60 + ((i * 47 + 13) % 221);
      return { label: dayLabel, date: d.getDate(), price, iso: d.toISOString().slice(0, 10) };
    });
  }, []);

  const budgetNum = Number(budget) || 0;
  const overBudget = budgetNum > TRIPS_BUDGET_REMAINING;
  const overBy = Math.max(0, budgetNum - TRIPS_BUDGET_REMAINING);

  const addPerson = () => {
    const name = personInput.trim();
    if (name && !people.includes(name)) {
      const next = [...people, name];
      setPeople(next);
      setPersonInput("");
      if (next.length > tripSizeLimit) setTripSizeLimit(next.length);
    }
  };
  const removePerson = (name: string) => {
    if (name === "Henry") return;
    setPeople(people.filter((p) => p !== name));
    if (captain === name) setCaptain("Henry");
  };
  const addWaitlist = () => {
    const name = waitlistInput.trim();
    if (name && !waitlist.includes(name) && !people.includes(name)) {
      setWaitlist([...waitlist, name]);
      setWaitlistInput("");
    }
  };
  const removeWaitlist = (name: string) => {
    setWaitlist(waitlist.filter((p) => p !== name));
  };

  const searchFlights = () => {
    if (!destination.trim()) return;
    setFlights(null);
    setSelectedFlight(null);
    setFlightsLoading(true);
    setTimeout(() => {
      setFlights(MOCK_FLIGHTS);
      setFlightsLoading(false);
    }, 500);
  };

  const resetAll = () => {
    setStep(1);
    setDestination("");
    setFlights(null);
    setSelectedFlight(null);
    setSelectedDayIdx(null);
    setBudget("");
    setPreferences([]);
    setAccommodation("Hostel");
    setNotes("");
    setPeople(["Henry"]);
    setPersonInput("");
    setCaptain("Henry");
    setTripSizeLimit(4);
    setAllowWaitlist(false);
    setWaitlist([]);
    setWaitlistInput("");
  };

  const handleClose = () => {
    onClose();
  };

  const next = () => {
    if (step < 5) setStep(((step + 1) as StepId));
  };
  const back = () => {
    if (step > 1) setStep(((step - 1) as StepId));
  };

  const canContinue = () => {
    if (step === 1) return destination.trim().length > 0;
    if (step === 2) return budgetNum > 0;
    if (step === 3) return true;
    if (step === 4) return people.length >= 1;
    return true;
  };

  const handleCreate = () => {
    const depart = selectedDayIdx !== null ? heatmapDays[selectedDayIdx].iso : heatmapDays[0].iso;
    const end = new Date(depart);
    end.setDate(end.getDate() + 2);
    const endIso = end.toISOString().slice(0, 10);

    const newTrip: Trip = {
      id: `t-${Date.now()}`,
      city: destination || "Somewhere",
      country: "TBD",
      flag: "🌍",
      startDate: depart,
      endDate: endIso,
      people,
      estimatedCost: budgetNum || 0,
      status: "Planning",
      accent: "from-[#2E3A5F] via-[#5B6EA8] to-[#A9B5D9]",
      captain,
      tripCaptain: captain,
      flightBooked: Boolean(selectedFlight),
      waitlist: waitlist.length ? waitlist : undefined,
      bookingStatus: [
        { item: "Flights", status: selectedFlight ? "booked" : "book_soon" },
        { item: "Accommodation", status: "book_soon" },
      ],
      expenses: [],
    };
    onCreate?.(newTrip);
    resetAll();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
      onClick={handleClose}
    >
      <div
        className="relative flex h-full w-full max-w-full flex-col overflow-hidden border-border bg-surface shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-[640px] sm:rounded-2xl sm:border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-text-muted">
              New trip · Step {step} of 5
            </div>
            <h2 className="mt-1 font-display text-[22px] leading-none text-text-primary sm:text-[24px]">
              {step === 1 && "Where to?"}
              {step === 2 && "What's the damage?"}
              {step === 3 && "What's the vibe?"}
              {step === 4 && "Who's coming?"}
              {step === 5 && "Ready to roll?"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition hover:border-primary/40 hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="border-b border-border bg-background/30 px-4 py-3 sm:px-7">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {(["Destination", "Budget", "Preferences", "Who", "Summary"] as const).map(
              (label, idx) => {
                const n = idx + 1;
                return (
                  <StepPill
                    key={label}
                    n={n}
                    label={label}
                    active={step === n}
                    done={step > n}
                    onClick={() => setStep(n as StepId)}
                  />
                );
              }
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  Destination
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") searchFlights();
                      }}
                      placeholder="Search a city..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pl-10 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={searchFlights}
                    disabled={!destination.trim()}
                    className="rounded-lg bg-primary px-4 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim disabled:opacity-40"
                  >
                    Search
                  </button>
                </div>
              </div>

              {flightsLoading && (
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">
                    Searching flights...
                  </div>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-lg border border-border bg-background/40"
                    />
                  ))}
                </div>
              )}

              {flights && !flightsLoading && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.1em] text-text-muted">
                    Flights to {destination}
                  </div>
                  <div className="space-y-2">
                    {flights.map((f) => {
                      const active = selectedFlight?.airline === f.airline;
                      return (
                        <button
                          key={f.airline}
                          onClick={() => setSelectedFlight(f)}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-lg border bg-background/40 px-4 py-3 text-left transition",
                            active
                              ? "border-primary/60 bg-primary/5"
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-hover">
                              <Plane className="h-4 w-4 text-primary" strokeWidth={1.75} />
                            </div>
                            <div>
                              <div className="text-[13px] font-medium text-text-primary">
                                {f.airline}
                              </div>
                              <div className="text-[11px] text-text-muted">
                                {f.departure} · {f.duration}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-display text-[20px] text-text-primary">
                              ${f.price}
                            </div>
                            <div className="text-[10px] text-text-muted">one-way</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {flights && !flightsLoading && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.1em] text-text-muted">
                    Cheapest Day to Fly
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {heatmapDays.map((d, i) => (
                      <HeatmapDay
                        key={i}
                        label={d.label}
                        date={d.date}
                        price={d.price}
                        selected={selectedDayIdx === i}
                        onClick={() => setSelectedDayIdx(i)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  Budget for this trip ($)
                </label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="320"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pl-10 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                  />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background/40 px-4 py-3 text-[12px] text-text-muted">
                You have{" "}
                <span className="font-medium text-text-primary">
                  ${TRIPS_BUDGET_REMAINING.toLocaleString()}
                </span>{" "}
                remaining in your Trips budget this semester
              </div>
              {overBudget && (
                <div className="rounded-lg border border-[#E8B572]/40 bg-[#E8B572]/10 px-4 py-3 text-[12px] text-[#E8B572]">
                  ⚠️ This puts you ${overBy.toLocaleString()} over your trips budget
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  Travel preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCE_OPTIONS.map((p) => {
                    const active = preferences.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() =>
                          setPreferences(
                            active
                              ? preferences.filter((x) => x !== p)
                              : [...preferences, p]
                          )
                        }
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition",
                          active
                            ? "border-primary/50 bg-primary/15 text-primary"
                            : "border-border bg-surface text-text-muted hover:border-primary/30 hover:text-text-primary"
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  Accommodation type
                </label>
                <select
                  value={accommodation}
                  onChange={(e) =>
                    setAccommodation(
                      e.target.value as (typeof ACCOMMODATION_OPTIONS)[number]
                    )
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-text-primary focus:border-primary/40 focus:outline-none"
                >
                  {ACCOMMODATION_OPTIONS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  Anything else Flock should know? (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Looking for cheap street food spots, museums open late..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  Who's coming?
                </label>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {people.map((p) => (
                    <span
                      key={p}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[12px]",
                        p === "Henry"
                          ? "bg-primary/10 text-primary"
                          : "bg-surface-hover text-text-primary"
                      )}
                    >
                      {p === captain && <Crown className="h-3 w-3" />}
                      {p}
                      {p !== "Henry" && (
                        <button
                          onClick={() => removePerson(p)}
                          className="text-text-muted transition hover:text-text-primary"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={personInput}
                    onChange={(e) => setPersonInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPerson();
                      }
                    }}
                    placeholder="Add a friend..."
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                  />
                  <button
                    onClick={addPerson}
                    className="flex items-center gap-1 rounded-lg border border-border bg-surface-hover px-3 py-2 text-[13px] font-medium text-text-primary transition hover:border-primary/40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  Trip size limit
                </label>
                <input
                  type="number"
                  min={people.length}
                  value={tripSizeLimit}
                  onChange={(e) =>
                    setTripSizeLimit(
                      Math.max(people.length, Number(e.target.value))
                    )
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-text-primary focus:border-primary/40 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-4 py-3">
                <div>
                  <div className="text-[13px] font-medium text-text-primary">
                    Allow waitlist
                  </div>
                  <div className="text-[11px] text-text-muted">
                    First come, first serve
                  </div>
                </div>
                <button
                  onClick={() => setAllowWaitlist((v) => !v)}
                  className={cn(
                    "relative h-6 w-11 flex-shrink-0 rounded-full border transition",
                    allowWaitlist
                      ? "border-primary/50 bg-primary/30"
                      : "border-border bg-background"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full transition",
                      allowWaitlist
                        ? "left-[22px] bg-primary"
                        : "left-0.5 bg-text-muted"
                    )}
                  />
                </button>
              </div>

              {allowWaitlist && (
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                    Add waitlisted people
                  </label>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {waitlist.map((p) => (
                      <span
                        key={p}
                        className="flex items-center gap-1.5 rounded-full border border-dashed border-border bg-background/60 px-2.5 py-1 text-[12px] text-text-muted"
                      >
                        <Clock className="h-3 w-3" />
                        {p}
                        <button
                          onClick={() => removeWaitlist(p)}
                          className="transition hover:text-text-primary"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={waitlistInput}
                      onChange={(e) => setWaitlistInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addWaitlist();
                        }
                      }}
                      placeholder="Add waitlisted friend..."
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                    />
                    <button
                      onClick={addWaitlist}
                      className="flex items-center gap-1 rounded-lg border border-border bg-surface-hover px-3 py-2 text-[13px] font-medium text-text-primary transition hover:border-primary/40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  <Crown className="h-3 w-3" />
                  Trip Captain
                </label>
                <select
                  value={captain}
                  onChange={(e) => setCaptain(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-text-primary focus:border-primary/40 focus:outline-none"
                >
                  {people.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  All set
                </div>
                <h3 className="mt-1 font-display text-[28px] leading-none text-text-primary">
                  {destination || "Your trip"}
                </h3>
                <div className="mt-1 text-[12px] text-text-muted">
                  Departing{" "}
                  {selectedDayIdx !== null
                    ? `${heatmapDays[selectedDayIdx].label} ${heatmapDays[selectedDayIdx].date}`
                    : "(no date selected)"}
                </div>
              </div>

              <SummaryRow
                label="Flight"
                value={
                  selectedFlight
                    ? `${selectedFlight.airline} — $${selectedFlight.price} · ${selectedFlight.duration}`
                    : "Not selected"
                }
              />
              <SummaryRow
                label="Budget"
                value={budget ? `$${Number(budget).toLocaleString()}` : "—"}
              />
              <SummaryRow
                label="Accommodation"
                value={accommodation}
              />
              <SummaryRow
                label="Preferences"
                value={preferences.length ? preferences.join(" · ") : "None"}
              />
              <SummaryRow
                label="Travelers"
                value={`${people.join(", ")}${
                  waitlist.length ? ` · waitlist: ${waitlist.join(", ")}` : ""
                }`}
              />
              <SummaryRow label="Trip Captain" value={`👑 ${captain}`} />
              {notes && <SummaryRow label="Notes" value={notes} />}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-border bg-background/40 px-5 py-4 sm:px-7">
          <button
            onClick={step === 1 ? handleClose : back}
            className="rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted transition hover:text-text-primary"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 5 ? (
            <button
              onClick={next}
              disabled={!canContinue()}
              className="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-background transition hover:bg-primary-dim disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-background transition hover:bg-primary-dim"
            >
              Create Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background/40 px-4 py-3">
      <span className="text-[11px] uppercase tracking-[0.1em] text-text-muted">
        {label}
      </span>
      <span className="flex-1 text-right text-[13px] text-text-primary">
        {value}
      </span>
    </div>
  );
}
