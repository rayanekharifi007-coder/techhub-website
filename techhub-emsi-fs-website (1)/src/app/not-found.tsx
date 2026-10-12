import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-24 lg:px-8">
      <div className="tech-card p-8 text-center">
        <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
          404
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
          The route you requested does not exist in the TechHub workspace.
        </p>
        <Link href="/" className="tech-button mt-5">
          Return Home
        </Link>
      </div>
    </section>
  );
}
