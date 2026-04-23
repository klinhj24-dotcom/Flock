"use client";

import { useState } from "react";
import { Building2, X, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Transaction = {
  date: string;
  merchant: string;
  amount: number;
  category: string;
};

const CATEGORY_COLOR: Record<string, string> = {
  Trips: "#4A9EBF",
  "Daily Food": "#B85C3C",
  Transportation: "#9FD4C5",
  Housing: "#E8D5A3",
  Activities: "#C8B7DE",
  Miscellaneous: "#E8A4A4",
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { date: "Apr 21", merchant: "Ryanair", amount: 87, category: "Trips" },
  { date: "Apr 20", merchant: "Lidl", amount: 14, category: "Daily Food" },
  { date: "Apr 19", merchant: "Airbnb", amount: 143, category: "Trips" },
  { date: "Apr 18", merchant: "Metro Card", amount: 22, category: "Transportation" },
  { date: "Apr 17", merchant: "Starbucks", amount: 6, category: "Daily Food" },
  { date: "Apr 16", merchant: "Uber", amount: 18, category: "Transportation" },
  { date: "Apr 15", merchant: "Zara", amount: 54, category: "Miscellaneous" },
  { date: "Apr 14", merchant: "Supermarket", amount: 32, category: "Daily Food" },
];

export function BankConnect() {
  const [connected, setConnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const useDemo = () => {
    setConnected(true);
    setModalOpen(false);
  };

  if (connected) {
    return (
      <div className="card card-hover p-5 sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-text-muted">
              <Building2 className="h-3.5 w-3.5" />
              Connected bank
            </div>
            <h2 className="mt-1 font-display text-[22px] leading-none text-text-primary sm:text-[24px]">
              Recent transactions
            </h2>
          </div>
          <span className="rounded-full bg-[#6BCB77]/15 px-2.5 py-1 text-[11px] font-medium text-[#6BCB77]">
            ✓ Synced
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          {MOCK_TRANSACTIONS.map((t, i) => (
            <div
              key={`${t.date}-${t.merchant}`}
              className={cn(
                "flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[13px]",
                i !== MOCK_TRANSACTIONS.length - 1 && "border-b border-border"
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="w-14 flex-shrink-0 text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  {t.date}
                </span>
                <span className="truncate font-medium text-text-primary">
                  {t.merchant}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    background: `${CATEGORY_COLOR[t.category] ?? "#6B6880"}22`,
                    color: CATEGORY_COLOR[t.category] ?? "#6B6880",
                  }}
                >
                  {t.category}
                </span>
                <span className="font-medium text-text-primary">
                  -${t.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card card-hover flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
            <Building2 className="h-5 w-5 text-primary" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-display text-[20px] leading-tight text-text-primary">
              Connect your bank
            </h3>
            <p className="mt-1 text-[13px] text-text-muted">
              Automatically track spending by category
            </p>
          </div>
        </div>
        <button
          onClick={openModal}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-[13px] font-medium text-background transition hover:bg-primary-dim sm:w-auto"
        >
          Connect via Stripe
        </button>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-[440px] overflow-hidden rounded-2xl border border-[#2a2a40] bg-[#0f0f18] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1e1e2e] px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#635BFF]">
                  <span className="text-[11px] font-bold text-white">S</span>
                </div>
                <span className="text-[14px] font-medium text-white">
                  Stripe Connect
                </span>
              </div>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1e1e2e] text-text-muted transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="mb-5">
                <h3 className="font-display text-[22px] leading-tight text-white">
                  Link your bank account
                </h3>
                <p className="mt-1 text-[12px] text-text-muted">
                  Your credentials are encrypted end-to-end.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                    Routing number
                  </label>
                  <input
                    type="text"
                    value={routing}
                    onChange={(e) => setRouting(e.target.value)}
                    placeholder="021000021"
                    className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-3 py-2.5 text-[14px] text-white placeholder:text-text-muted focus:border-[#635BFF]/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-text-muted">
                    Account number
                  </label>
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="0123456789"
                    className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-3 py-2.5 text-[14px] text-white placeholder:text-text-muted focus:border-[#635BFF]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-text-muted">
                <Lock className="h-3 w-3" />
                256-bit SSL · Stripe never stores your full account details
              </div>

              <button
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-lg bg-[#635BFF]/50 px-4 py-2.5 text-[13px] font-medium text-white"
              >
                Link Account
              </button>

              <div className="relative my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#1e1e2e]" />
                <span className="text-[10px] uppercase tracking-[0.12em] text-text-muted">
                  or
                </span>
                <div className="h-px flex-1 bg-[#1e1e2e]" />
              </div>

              <button
                onClick={useDemo}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#2a2a40] bg-[#13131a] px-4 py-2.5 text-[13px] font-medium text-white transition hover:border-primary/40"
              >
                <Check className="h-3.5 w-3.5" />
                Use Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
