"use client";

import Link from "next/link";
import { useState } from "react";

const actions = [
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/techhub-playground", label: "Playground" },
  { href: "/join-us", label: "Join" },
];

export function QuickActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2">
      <div className="rounded-2xl border p-1" style={{ borderColor: "var(--line)", background: "color-mix(in oklab, var(--surface) 88%, transparent)" }}>
        {open ? (
          <div className="flex items-center gap-1">
            {actions.map((action) => (
              <Link key={action.href} href={action.href} className="rounded-xl px-3 py-2 text-xs" style={{ color: "var(--muted)" }}>
                {action.label}
              </Link>
            ))}
            <button className="tech-button secondary text-xs" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        ) : (
          <button className="tech-button secondary text-xs" onClick={() => setOpen(true)}>
            Quick Actions
          </button>
        )}
      </div>
    </div>
  );
}
