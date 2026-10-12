"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const navItems = [
  { href: "/", label: "Home", group: "Core" },
  { href: "/about", label: "About", group: "Core" },
  { href: "/projects", label: "Projects", group: "Build" },
  { href: "/events", label: "Events", group: "Build" },
  { href: "/techhub-playground", label: "TechHub Playground", group: "Build" },
  { href: "/learning-hub", label: "Learning Hub", group: "Learning" },
  { href: "/community", label: "Community", group: "People" },
  { href: "/join-us", label: "Join Us", group: "People" },
  { href: "/contact", label: "Contact", group: "People" },
  { href: "/member-dashboard", label: "Member Dashboard", group: "Account" },
  { href: "/admin-dashboard", label: "Admin Dashboard", group: "Account" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navItems;
    return navItems.filter((item) => item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q));
  }, [query]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="tech-button secondary fixed bottom-4 right-4 z-30 hidden text-xs md:inline-flex"
      >
        Open Command Menu ⌘K
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/35 p-4 pt-[12vh]" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-2xl rounded-2xl border p-3"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="tech-input"
          placeholder="Search pages, dashboards, tools..."
        />

        <ul className="mt-3 max-h-[52vh] space-y-1 overflow-y-auto">
          {results.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:translate-x-[2px]"
                style={{ borderColor: "var(--line)", background: "var(--surface-muted)" }}
              >
                <span>{item.label}</span>
                <span style={{ color: "var(--text-muted)" }}>{item.group}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 && (
            <li className="rounded-xl border px-3 py-4 text-sm" style={{ borderColor: "var(--line)", color: "var(--text-muted)" }}>
              No matching routes found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
