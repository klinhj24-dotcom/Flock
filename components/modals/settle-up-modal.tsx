"use client";

import { useState } from "react";
import { X, Send, Mail, MessageCircle, Check, ExternalLink } from "lucide-react";
import { FRIENDS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function SettleUpModal({
  open,
  onClose,
  person,
  amountOwed,
  owedTo,
  tripCity,
  onMarkSettled,
}: {
  open: boolean;
  onClose: () => void;
  person: string; // the one who owes
  amountOwed: number; // positive number
  owedTo: string; // the person being repaid
  tripCity: string;
  onMarkSettled: () => void;
}) {
  const [sentVia, setSentVia] = useState<"venmo" | "sms" | "email" | null>(null);

  if (!open) return null;

  const debtor = FRIENDS.find((f) => f.name === person);
  const creditor = FRIENDS.find((f) => f.name === owedTo);

  const amount = Math.max(0, Math.round(amountOwed * 100) / 100);
  const note = `Flock: ${tripCity} trip split`;

  const venmoHandle = creditor?.venmo ?? "flock-demo";
  // Venmo deep link (charge = request money); app → web fallback
  const venmoAppUrl = `venmo://paycharge?txn=charge&recipients=${venmoHandle}&amount=${amount}&note=${encodeURIComponent(note)}`;
  const venmoWebUrl = `https://venmo.com/?txn=charge&audience=friends&recipients=${venmoHandle}&amount=${amount}&note=${encodeURIComponent(note)}`;

  const smsBody = `Hey ${person}, settling up from our ${tripCity} trip — you owe me $${amount}. Venmo me here: ${venmoWebUrl}`;
  const smsUrl = `sms:${debtor?.phone ?? ""}?&body=${encodeURIComponent(smsBody)}`;

  const emailSubject = `Quick settle up — ${tripCity}`;
  const emailBody = `Hey ${person},\n\nSettling up from our ${tripCity} trip — you owe me $${amount}.\n\nEasiest way: tap this Venmo link\n${venmoWebUrl}\n\nThanks!\n${owedTo}`;
  const emailUrl = `mailto:${debtor?.email ?? ""}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const sendVenmo = () => {
    // Try the app deep link first; browsers fall back to the web link if app not installed
    window.location.href = venmoAppUrl;
    setTimeout(() => {
      window.open(venmoWebUrl, "_blank");
    }, 400);
    setSentVia("venmo");
  };

  const sendSms = () => {
    window.open(smsUrl, "_self");
    setSentVia("sms");
  };

  const sendEmail = () => {
    window.open(emailUrl, "_self");
    setSentVia("email");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[460px] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-text-muted">
              Settle up
            </div>
            <h3 className="mt-1 font-display text-[22px] leading-none text-text-primary">
              {person} owes you ${amount.toFixed(0)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition hover:border-primary/40 hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="mb-4 text-[12px] text-text-muted">
            Ping them with the lowest-friction option first — Venmo opens a
            pre-filled request.
          </p>

          {/* Primary: Venmo */}
          <button
            onClick={sendVenmo}
            className="group flex w-full items-center justify-between gap-3 rounded-xl border border-[#3D95CE]/40 bg-gradient-to-br from-[#3D95CE]/20 to-[#3D95CE]/5 px-4 py-3.5 text-left transition hover:border-[#3D95CE] hover:from-[#3D95CE]/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3D95CE] text-[15px] font-bold text-white">
                V
              </div>
              <div>
                <div className="text-[14px] font-medium text-text-primary">
                  Send Venmo request
                </div>
                <div className="text-[11px] text-text-muted">
                  @{venmoHandle} · ${amount.toFixed(0)} · "{note}"
                </div>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 flex-shrink-0 text-text-muted transition group-hover:text-text-primary" />
          </button>

          <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-text-muted">
            <div className="h-px flex-1 bg-border" />
            or ping with a link
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={sendSms}
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-hover px-3 py-2.5 text-[13px] font-medium text-text-primary transition hover:border-primary/40"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              Text
            </button>
            <button
              onClick={sendEmail}
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-hover px-3 py-2.5 text-[13px] font-medium text-text-primary transition hover:border-primary/40"
            >
              <Mail className="h-4 w-4" strokeWidth={1.75} />
              Email
            </button>
          </div>

          {sentVia && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#6BCB77]/30 bg-[#6BCB77]/10 px-3 py-2 text-[12px] text-[#6BCB77]">
              <Send className="h-3.5 w-3.5" />
              {sentVia === "venmo" && "Opened Venmo — complete the request there"}
              {sentVia === "sms" && "Opened Messages with the link ready"}
              {sentVia === "email" && "Opened your email client with a pre-filled draft"}
            </div>
          )}

          <button
            onClick={() => {
              onMarkSettled();
              onClose();
            }}
            className={cn(
              "mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-[12px] font-medium transition hover:border-primary/40",
              sentVia ? "text-[#6BCB77]" : "text-text-muted"
            )}
          >
            <Check className="h-3.5 w-3.5" />
            {sentVia ? "Mark as settled" : "Already settled — just mark it"}
          </button>
        </div>
      </div>
    </div>
  );
}
