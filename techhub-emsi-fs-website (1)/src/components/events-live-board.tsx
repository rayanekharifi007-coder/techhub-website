"use client";

import { useEffect, useMemo, useState } from "react";

type EventItem = {
  id: number;
  title: string;
  startsAt: string;
  location: string;
};

export function EventsLiveBoard({ events }: { events: EventItem[] }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nextEvent = useMemo(() => {
    return events
      .filter((event) => +new Date(event.startsAt) > now)
      .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))[0];
  }, [events, now]);

  const countdown = useMemo(() => {
    if (!nextEvent) return null;
    const diff = +new Date(nextEvent.startsAt) - now;
    if (diff <= 0) return "Starting now";
    const seconds = Math.floor(diff / 1000);
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  }, [nextEvent, now]);

  return (
    <aside className="tech-card p-5">
      <p className="text-xs uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
        Live Event Board
      </p>
      {nextEvent ? (
        <div className="mt-3 space-y-2">
          <h3 className="text-lg font-semibold">Next: {nextEvent.title}</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {nextEvent.location}
          </p>
          <p className="rounded-lg px-3 py-2 text-sm" style={{ background: "var(--accent-soft)" }}>
            Starts in {countdown}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
          No upcoming events in the schedule yet.
        </p>
      )}
    </aside>
  );
}
