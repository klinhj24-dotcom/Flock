"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  MapPin,
  Users,
  Sparkles,
  Check,
  ArrowRight,
  Mail,
} from "lucide-react";
import { WorldMap, type Pin } from "@/components/onboarding/world-map";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

const KEY_COMPLETE = "flock_onboarding_complete";
const KEY_PINS = "flock_onboarding_pins";
const KEY_FRIEND = "flock_onboarding_friend";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [pins, setPins] = useState<Pin[]>([]);
  const [friendName, setFriendName] = useState("");
  const [friendContact, setFriendContact] = useState("");

  const canContinueStep1 = pins.length === 3;
  const canContinueStep2 = friendName.trim().length > 0;

  const finish = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEY_COMPLETE, "true");
      window.localStorage.setItem(KEY_PINS, JSON.stringify(pins));
      window.localStorage.setItem(
        KEY_FRIEND,
        JSON.stringify({ name: friendName, contact: friendContact })
      );
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1100px] flex-col px-4 py-6 sm:px-8 sm:py-10">
        {/* Brand */}
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
            <Compass className="h-4.5 w-4.5 text-primary" strokeWidth={1.75} />
          </div>
          <span className="font-display text-2xl tracking-tight text-text-primary">
            Flock
          </span>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {([1, 2, 3] as const).map((n) => {
            const active = step === n;
            const done = step > n;
            return (
              <div
                key={n}
                className={cn(
                  "flex flex-1 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium transition",
                  active
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : done
                    ? "border-border bg-surface-hover text-text-primary"
                    : "border-border bg-background text-text-muted"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px]",
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
                  {n === 1 && "Where to?"}
                  {n === 2 && "Who with?"}
                  {n === 3 && "You're in"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1">
          {step === 1 && (
            <div>
              <div className="mb-5">
                <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                  Step 1 of 3
                </div>
                <h1 className="mt-1 font-display text-[32px] leading-tight text-text-primary sm:text-[42px]">
                  Drop three pins to start your journey
                </h1>
                <p className="mt-2 max-w-xl text-[13px] text-text-muted sm:text-[14px]">
                  Click anywhere on a country you'd love to visit. Tap a pin to
                  remove it.
                </p>
              </div>

              <WorldMap pins={pins} setPins={setPins} max={3} />

              <div className="mt-6 flex items-center justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!canContinueStep1}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mx-auto max-w-xl">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-primary">
                  <Users className="h-3.5 w-3.5" />
                  Step 2 of 3
                </div>
                <h1 className="mt-1 font-display text-[32px] leading-tight text-text-primary sm:text-[42px]">
                  Invite one friend to join
                </h1>
                <p className="mt-2 text-[13px] text-text-muted sm:text-[14px]">
                  Flock is better with someone else. You can invite more
                  later.
                </p>
              </div>

              <div className="card p-5 sm:p-7">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                      Friend's name
                    </label>
                    <input
                      type="text"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      placeholder="Jake"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                      Email or phone (optional)
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={friendContact}
                        onChange={(e) => setFriendContact(e.target.value)}
                        placeholder="jake@domain.com"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pl-10 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-lg border border-border bg-background/40 px-4 py-3 text-[12px] text-text-muted">
                  We'll send them a link to see your 3 pinned spots and start
                  planning together.
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-[13px] text-text-muted transition hover:text-text-primary"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canContinueStep2}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send invite
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mx-auto max-w-xl text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary/30">
                <Sparkles className="h-7 w-7 text-primary" strokeWidth={1.75} />
              </div>
              <h1 className="font-display text-[32px] leading-tight text-text-primary sm:text-[42px]">
                You're in.
              </h1>
              <p className="mt-3 text-[14px] text-text-muted">
                {pins.length} pins dropped
                {friendName && `, ${friendName} invited`}. Let's plan your
                first trip.
              </p>

              <div className="mx-auto mt-6 flex max-w-sm flex-wrap justify-center gap-2">
                {pins.map((p, i) => (
                  <span
                    key={p.id}
                    className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[12px] text-primary"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background">
                      {i + 1}
                    </span>
                    {p.country}
                  </span>
                ))}
              </div>

              <button
                onClick={finish}
                className="mt-8 inline-flex items-center gap-1.5 rounded-lg bg-primary px-6 py-3 text-[14px] font-medium text-background transition hover:bg-primary-dim"
              >
                Enter Flock
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        {/* Skip link (for demo / already-onboarded users) */}
        {step !== 3 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.localStorage.setItem(KEY_COMPLETE, "true");
                }
                router.push("/");
              }}
              className="text-[12px] text-text-muted transition hover:text-text-primary"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
