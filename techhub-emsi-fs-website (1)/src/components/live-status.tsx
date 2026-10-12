"use client";

import { useEffect, useState } from "react";

export function LiveStatus() {
  const [time, setTime] = useState("");
  const [health, setHealth] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    const updateTime = () => {
      const value = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Casablanca",
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(new Date());
      setTime(value);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const response = await fetch("/api/health", { cache: "no-store" });
        if (!mounted) return;
        setHealth(response.ok ? "online" : "offline");
      } catch {
        if (!mounted) return;
        setHealth("offline");
      }
    };

    check();
    const interval = setInterval(check, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-30 hidden items-center gap-2 rounded-xl border px-3 py-2 text-xs md:flex"
      style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
      <span
        className="inline-block size-2 rounded-full"
        style={{ background: health === "online" ? "#16a34a" : health === "offline" ? "#dc2626" : "#f59e0b" }}
      />
      <span style={{ color: "var(--text-muted)" }}>System {health}</span>
      <span>•</span>
      <span>{time || "Syncing..."}</span>
    </div>
  );
}
