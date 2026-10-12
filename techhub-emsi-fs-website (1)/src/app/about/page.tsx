import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About"
        title="Built by engineering students, for real technical impact."
        description="TechHub EMSI Fès is a student-led technology club dedicated to practical engineering culture: building working systems, sharing technical knowledge, and growing as collaborative problem-solvers."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 lg:grid-cols-3 lg:px-8">
        <article className="tech-card p-6">
          <h2 className="text-xl font-semibold">Mission</h2>
          <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
            Foster a disciplined environment where students prototype, test, and deploy meaningful technology projects.
          </p>
        </article>
        <article className="tech-card p-6">
          <h2 className="text-xl font-semibold">Operating Principles</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
            <li>Build before presenting.</li>
            <li>Document every process clearly.</li>
            <li>Peer review and shared ownership.</li>
          </ul>
        </article>
        <article className="tech-card p-6">
          <h2 className="text-xl font-semibold">Leadership & Contacts</h2>
          <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
            Official club officers and contact channels can be published by admins in the dashboard announcements section.
          </p>
        </article>
      </section>
    </main>
  );
}
