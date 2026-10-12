export default function GlobalLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-24 lg:px-8">
      <div className="tech-card animate-pulse p-8">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Loading TechHub workspace...
        </p>
      </div>
    </main>
  );
}
