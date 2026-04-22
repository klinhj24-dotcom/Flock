"use client";

import { useState } from "react";
import { X, Plus, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewTripModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState<string[]>(["Henry"]);
  const [personInput, setPersonInput] = useState("");
  const [captain, setCaptain] = useState("Henry");

  if (!open) return null;

  const addPerson = () => {
    const name = personInput.trim();
    if (name && !people.includes(name)) {
      setPeople([...people, name]);
      setPersonInput("");
    }
  };

  const removePerson = (name: string) => {
    if (name === "Henry") return;
    setPeople(people.filter((p) => p !== name));
    if (captain === name) setCaptain("Henry");
  };

  const handleCreate = () => {
    // mock — would persist to state/store
    onClose();
    setDestination("");
    setStartDate("");
    setEndDate("");
    setBudget("");
    setPeople(["Henry"]);
    setCaptain("Henry");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-7 py-5">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-text-muted">
              New trip
            </div>
            <h2 className="mt-1 font-display text-[24px] leading-none text-text-primary">
              Where to?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition hover:border-primary/40 hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 px-7 py-6">
          {/* Destination */}
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

          {/* Dates */}
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

          {/* People */}
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

          {/* Budget */}
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
              Budget estimate
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-text-muted">
                $
              </span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="320"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pl-7 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Trip Captain */}
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
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

        <div className="flex items-center justify-end gap-2 border-t border-border bg-background/40 px-7 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-[13px] font-medium text-text-muted transition hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-background transition hover:bg-primary-dim"
          >
            Create Trip
          </button>
        </div>
      </div>
    </div>
  );
}
