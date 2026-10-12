"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-24 lg:px-8">
      <section className="tech-card p-8">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
          {error.message || "An unexpected error occurred."}
        </p>
        <button onClick={reset} className="tech-button mt-4">
          Try again
        </button>
      </section>
    </main>
  );
}
