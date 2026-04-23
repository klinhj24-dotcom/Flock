"use client";

import { useEffect, useState } from "react";
import { HERO_PHOTOS, coverPhoto } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PhotoRotator({
  intervalMs = 5000,
  className,
  children,
}: {
  intervalMs?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((v) => (v + 1) % HERO_PHOTOS.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[#0a0a12]",
        className
      )}
    >
      {HERO_PHOTOS.map((p, i) => (
        <div
          key={p.seed}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
            i === idx ? "opacity-100" : "opacity-0"
          )}
          style={{
            backgroundImage: `url(${coverPhoto(p.seed, 1800, 900)})`,
          }}
        />
      ))}
      {/* dark gradient for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* Caption */}
      <div className="pointer-events-none absolute left-5 top-5 flex gap-1">
        {HERO_PHOTOS.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 w-6 rounded-full transition",
              i === idx ? "bg-white" : "bg-white/30"
            )}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-5 right-6 text-[11px] font-medium uppercase tracking-[0.15em] text-white/70">
        {HERO_PHOTOS[idx].caption}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
