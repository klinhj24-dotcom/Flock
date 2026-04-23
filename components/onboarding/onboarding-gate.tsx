"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const KEY = "flock_onboarding_complete";

export function OnboardingGate() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(KEY)) {
      router.replace("/onboarding");
    }
  }, [router]);

  return null;
}
