import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="border-b" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 lg:px-8 lg:py-14">
        <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight lg:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base lg:text-lg" style={{ color: "var(--muted)" }}>
          {description}
        </p>
        {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
