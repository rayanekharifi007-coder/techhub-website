"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const install = async () => {
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <div className="fixed bottom-20 right-4 z-30 max-w-xs rounded-2xl border p-3" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
      <p className="text-sm font-semibold">Install TechHub App</p>
      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
        Add TechHub to your Android home screen for an app-like experience.
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={install} className="tech-button text-xs">
          Install
        </button>
        <button onClick={() => setDismissed(true)} className="tech-button secondary text-xs">
          Later
        </button>
      </div>
    </div>
  );
}
