"use client";

import { useState } from "react";
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
  ExternalLink,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Trip } from "@/lib/mock-data";

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

const TRIPS_BUDGET_REMAINING = 2160; // mock — pulled from budget

type StepId = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_META: { id: StepId; label: string; optional: boolean }[] = [
  { id: 1, label: "Destination", optional: false },
  { id: 2, label: "Flights", optional: true },
  { id: 3, label: "Budget", optional: true },
  { id: 4, label: "Vibe", optional: true },
  { id: 5, label: "Who", optional: false },
  { id: 6, label: "Summary", optional: false },
];

function StepPill({
  n,
  label,
  active,
  done,
  optional,
  onClick,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
  optional: boolean;
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
      <span className="hidden sm:inline">
        {label}
        {optional && <span className="ml-1 text-text-muted">·opt</span>}
      </span>
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

  // Step 1 — destination + dates
  const [destination, setDestination] = useState("");
  const [datesMode, setDatesMode] = useState<"manual" | "flexible">("manual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flexibleNote, setFlexibleNote] = useState("");

  // Step 2 — flights (booked externally, confirmed here)
  const [flightOpened, setFlightOpened] = useState(false);
  const [flightAirline, setFlightAirline] = useState("");
  const [flightPrice, setFlightPrice] = useState("");
  const [flightConfirmation, setFlightConfirmation] = useState("");
  const [flightSkipped, setFlightSkipped] = useState(false);

  // Step 3 — budget
  const [budget, setBudget] = useState("");
  const [noBudget, setNoBudget] = useState(false);
  const [budgetSkipped, setBudgetSkipped] = useState(false);

  // Step 4 — preferences
  const [preferences, setPreferences] = useState<string[]>([]);
  const [accommodation, setAccommodation] = useState<
    (typeof ACCOMMODATION_OPTIONS)[number]
  >("Hostel");
  const [notes, setNotes] = useState("");
  const [preferencesSkipped, setPreferencesSkipped] = useState(false);

  // Step 5 — group
  const [people, setPeople] = useState<string[]>(["Henry"]);
  const [personInput, setPersonInput] = useState("");
  const [captain, setCaptain] = useState("Henry");
  const [tripSizeLimit, setTripSizeLimit] = useState<number>(4);
  const [allowWaitlist, setAllowWaitlist] = useState(false);
  const [waitlist, setWaitlist] = useState<string[]>([]);
  const [waitlistInput, setWaitlistInput] = useState("");

  const budgetNum = Number(budget) || 0;
  const overBudget = !noBudget && budgetNum > TRIPS_BUDGET_REMAINING;
  const overBy = Math.max(0, budgetNum - TRIPS_BUDGET_REMAINING);

  const currentStep = STEP_META.find((s) => s.id === step)!;

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

  const flightSearchUrl = (() => {
    const dest = encodeURIComponent(destination.trim() || "");
    if (datesMode === "manual" && startDate && endDate) {
      return `https://www.google.com/travel/flights?q=flights+to+${dest}+on+${startDate}+returning+${endDate}`;
    }
    return `https://www.google.com/travel/flights?q=flights+to+${dest}`;
  })();

  const resetAll = () => {
    setStep(1);
    setDestination("");
    setDatesMode("manual");
    setStartDate("");
    setEndDate("");
    setFlexibleNote("");
    setFlightOpened(false);
    setFlightAirline("");
    setFlightPrice("");
    setFlightConfirmation("");
    setFlightSkipped(false);
    setBudget("");
    setNoBudget(false);
    setBudgetSkipped(false);
    setPreferences([]);
    setAccommodation("Hostel");
    setNotes("");
    setPreferencesSkipped(false);
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

  const canContinue = () => {
    if (step === 1) {
      if (!destination.trim()) return false;
      if (datesMode === "manual") return Boolean(startDate && endDate);
      return flexibleNote.trim().length > 0;
    }
    if (step === 2) return true; // skippable
    if (step === 3) return true; // skippable
    if (step === 4) return true; // skippable
    if (step === 5) return people.length >= 1;
    return true;
  };

  const next = () => {
    if (step < 6 && canContinue()) {
      if (step === 2) setFlightSkipped(false);
      if (step === 3) setBudgetSkipped(false);
      if (step === 4) setPreferencesSkipped(false);
      setStep((step + 1) as StepId);
    }
  };
  const back = () => {
    if (step > 1) setStep((step - 1) as StepId);
  };
  const skipCurrent = () => {
    if (step === 2) {
      setFlightSkipped(true);
    }
    if (step === 3) {
      setBudgetSkipped(true);
      setBudget("");
      setNoBudget(false);
    }
    if (step === 4) setPreferencesSkipped(true);
    if (step < 6) setStep((step + 1) as StepId);
  };

  const handleCreate = () => {
    const start =
      datesMode === "manual" && startDate
        ? startDate
        : new Date().toISOString().slice(0, 10);
    const endIso =
      datesMode === "manual" && endDate
        ? endDate
        : (() => {
            const d = new Date(start);
            d.setDate(d.getDate() + 2);
            return d.toISOString().slice(0, 10);
          })();

    const flightBooked = !flightSkipped && Boolean(flightAirline || flightConfirmation);

    const newTrip: Trip = {
      id: `t-${Date.now()}`,
      city: destination || "Somewhere",
      country: "TBD",
      flag: "🌍",
      startDate: start,
      endDate: endIso,
      people,
      estimatedCost: noBudget || budgetSkipped ? 0 : budgetNum,
      status: "Planning",
      accent: "from-[#2E3A5F] via-[#5B6EA8] to-[#A9B5D9]",
      captain,
      tripCaptain: captain,
      flightBooked,
      waitlist: waitlist.length ? waitlist : undefined,
      bookingStatus: [
        { item: "Flights", status: flightBooked ? "booked" : "book_soon" },
        { item: "Accommodation", status: "book_soon" },
      ],
      expenses: [],
    };
    onCreate?.(newTrip);
    resetAll();
    onClose();
  };

  if (!open) return null;

  const headings: Record<StepId, string> = {
    1: "Where to?",
    2: "Flights?",
    3: "What's the damage?",
    4: "What's the vibe?",
    5: "Who's coming?",
    6: "Ready to roll?",
  };

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
              New trip · Step {step} of 6
              {currentStep.optional && (
                <span className="ml-2 text-text-muted/80">· optional</span>
              )}
            </div>
            <h2 className="mt-1 font-display text-[22px] leading-none text-text-primary sm:text-[24px]">
              {headings[step]}
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
            {STEP_META.map((meta) => (
              <StepPill
                key={meta.id}
                n={meta.id}
                label={meta.label}
                optional={meta.optional}
                active={step === meta.id}
                done={step > meta.id}
                onClick={() => setStep(meta.id)}
              />
            ))}
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
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Search a city..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pl-10 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex gap-1 rounded-lg border border-border bg-background/60 p-1">
                  <button
                    onClick={() => setDatesMode("manual")}
                    className={cn(
                      "flex-1 rounded-md px-3 py-1.5 text-[12px] font-medium transition",
                      datesMode === "manual"
                        ? "bg-surface-hover text-text-primary"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    I know my dates
                  </button>
                  <button
                    onClick={() => setDatesMode("flexible")}
                    className={cn(
                      "flex-1 rounded-md px-3 py-1.5 text-[12px] font-medium transition",
                      datesMode === "flexible"
                        ? "bg-surface-hover text-text-primary"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    Help me pick dates
                  </button>
                </div>

                {datesMode === "manual" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                        Start
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-text-primary focus:border-primary/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                        End
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-text-primary focus:border-primary/40 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                      When are you open?
                    </label>
                    <textarea
                      value={flexibleNote}
                      onChange={(e) => setFlexibleNote(e.target.value)}
                      placeholder="e.g. any weekend in November, avoiding midterms the 7th–10th"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                    />
                    <div className="mt-2 flex items-start gap-2 rounded-lg border border-border bg-background/40 p-3 text-[11px] text-text-muted">
                      <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                      We'll compare your group's calendars and suggest dates after you finish setup.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-start gap-2 rounded-lg border border-border bg-background/40 p-3 text-[12px] text-text-muted">
                <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                <span>
                  We don't hold real flight inventory. Book on a real site, then drop your confirmation here so the group sees it.
                </span>
              </div>

              <div className="rounded-xl border border-border bg-background/40 p-5">
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-text-primary">
                  <Plane className="h-3.5 w-3.5" />
                  Search flights
                </div>
                <p className="mt-1 text-[11px] text-text-muted">
                  {datesMode === "manual" && startDate && endDate
                    ? `${destination || "Destination"} · ${startDate} → ${endDate}`
                    : `${destination || "Destination"} · dates flexible`}
                </p>
                <a
                  href={flightSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setFlightOpened(true)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-2 text-[12px] font-medium text-primary transition hover:bg-primary/20"
                >
                  Open Google Flights
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  Confirm what you booked
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={flightAirline}
                    onChange={(e) => setFlightAirline(e.target.value)}
                    placeholder="Airline"
                    className="rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                  />
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <input
                      type="number"
                      value={flightPrice}
                      onChange={(e) => setFlightPrice(e.target.value)}
                      placeholder="Price"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pl-10 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  value={flightConfirmation}
                  onChange={(e) => setFlightConfirmation(e.target.value)}
                  placeholder="Confirmation code (optional)"
                  className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                />
                {!flightOpened && (
                  <p className="mt-2 text-[11px] text-text-muted">
                    Haven't booked yet? Skip this step and come back later.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
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
                    onChange={(e) => {
                      setBudget(e.target.value);
                      if (e.target.value) setNoBudget(false);
                    }}
                    disabled={noBudget}
                    placeholder="320"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pl-10 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none disabled:opacity-40"
                  />
                </div>
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-[12px] text-text-muted">
                  <input
                    type="checkbox"
                    checked={noBudget}
                    onChange={(e) => {
                      setNoBudget(e.target.checked);
                      if (e.target.checked) setBudget("");
                    }}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  No budget — don't track this one
                </label>
              </div>
              {!noBudget && (
                <div className="rounded-lg border border-border bg-background/40 px-4 py-3 text-[12px] text-text-muted">
                  You have{" "}
                  <span className="font-medium text-text-primary">
                    ${TRIPS_BUDGET_REMAINING.toLocaleString()}
                  </span>{" "}
                  remaining in your Trips budget this semester
                </div>
              )}
              {overBudget && (
                <div className="rounded-lg border border-[#E8B572]/40 bg-[#E8B572]/10 px-4 py-3 text-[12px] text-[#E8B572]">
                  ⚠️ This puts you ${overBy.toLocaleString()} over your trips budget
                </div>
              )}
            </div>
          )}

          {step === 4 && (
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

          {step === 5 && (
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

          {step === 6 && (
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
                  {datesMode === "manual" && startDate && endDate
                    ? `${startDate} → ${endDate}`
                    : flexibleNote || "Dates flexible"}
                </div>
              </div>

              <SummaryRow
                label="Flight"
                value={
                  flightSkipped || (!flightAirline && !flightConfirmation)
                    ? "Not booked yet"
                    : `${flightAirline || "—"}${
                        flightPrice ? ` · $${Number(flightPrice).toLocaleString()}` : ""
                      }${
                        flightConfirmation ? ` · ${flightConfirmation}` : ""
                      }`
                }
              />
              <SummaryRow
                label="Budget"
                value={
                  budgetSkipped || noBudget
                    ? "Not tracked"
                    : budget
                    ? `$${Number(budget).toLocaleString()}`
                    : "—"
                }
              />
              <SummaryRow
                label="Accommodation"
                value={preferencesSkipped ? "Not set" : accommodation}
              />
              <SummaryRow
                label="Preferences"
                value={
                  preferencesSkipped
                    ? "Skipped"
                    : preferences.length
                    ? preferences.join(" · ")
                    : "None"
                }
              />
              <SummaryRow
                label="Travelers"
                value={`${people.join(", ")}${
                  waitlist.length ? ` · waitlist: ${waitlist.join(", ")}` : ""
                }`}
              />
              <SummaryRow label="Trip Captain" value={`👑 ${captain}`} />
              {!preferencesSkipped && notes && (
                <SummaryRow label="Notes" value={notes} />
              )}
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
          <div className="flex items-center gap-2">
            {currentStep.optional && step < 6 && (
              <button
                onClick={skipCurrent}
                className="rounded-lg border border-border px-3 py-2 text-[13px] font-medium text-text-muted transition hover:text-text-primary"
              >
                Skip for now
              </button>
            )}
            {step < 6 ? (
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
