"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("techhub-theme");
    const initialDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", initialDark);
    setDark(initialDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("techhub-theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="tech-button secondary text-xs"
      title="Toggle dark mode"
    >
      <span aria-hidden>{dark ? "☀️" : "🌙"}</span>
      <span className="ml-1 hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
