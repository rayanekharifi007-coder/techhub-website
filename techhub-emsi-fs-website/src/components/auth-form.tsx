"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next");
  const redirectPath = next ? `/${next}` : "/member-dashboard";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    if (mode === "register" && payload.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push(redirectPath);
    router.refresh();
  };

  return (
    <div className="tech-card mx-auto w-full max-w-md p-6">
      <div className="mb-5 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`tech-button ${mode === "login" ? "" : "secondary"} text-sm`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`tech-button ${mode === "register" ? "" : "secondary"} text-sm`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <label className="block text-sm">
            Full name
            <input required name="name" className="tech-input mt-1" />
          </label>
        )}

        <label className="block text-sm">
          Email
          <input required type="email" name="email" className="tech-input mt-1" />
        </label>

        <label className="block text-sm">
          Password
          <input required type="password" name="password" className="tech-input mt-1" minLength={8} />
        </label>

        {error && (
          <p className="rounded-md px-3 py-2 text-sm" style={{ background: "var(--accent-soft)", color: "var(--text)" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="tech-button w-full text-sm disabled:opacity-60">
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
