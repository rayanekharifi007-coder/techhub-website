"use client";

import { useEffect, useState } from "react";

type LoaderState = "checking" | "visible" | "hidden";

export function IntroLoader() {
  const [state, setState] = useState<LoaderState>("checking");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("techhub_intro_seen") === "1";

    if (alreadySeen) {
      setState("hidden");
      return;
    }

    setState("visible");
    const startedAt = Date.now();

    const ticker = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const value = Math.min(100, (elapsed / 5000) * 100);
      setProgress(value);
    }, 50);

    const timer = setTimeout(() => {
      sessionStorage.setItem("techhub_intro_seen", "1");
      setState("hidden");
    }, 5000);

    return () => {
      clearInterval(ticker);
      clearTimeout(timer);
    };
  }, []);

  if (state !== "visible") return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center"
      style={{ background: "var(--bg)" }}
      aria-live="polite"
      aria-label="Loading TechHub"
    >
      <div className="flex flex-col items-center gap-4 px-6">
        <p className="text-xs uppercase tracking-[0.28em]" style={{ color: "var(--muted)" }}>
          Initializing Platform
        </p>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">TechHub</h1>
        <div className="h-1.5 w-56 overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, background: "var(--accent)", transition: "width 80ms linear" }}
          />
        </div>
      </div>

      <p className="absolute bottom-4 right-4 text-3xl font-semibold tracking-wide" style={{ color: "var(--muted)" }}>
        @r4yane.e
      </p>
    </div>
  );
}
