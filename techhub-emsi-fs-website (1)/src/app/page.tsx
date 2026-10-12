import Image from "next/image";
import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { announcements, events, projects, tutorials, users } from "@/db/schema";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latestProjects, upcomingEvents, latestAnnouncements, metrics] = await Promise.all([
    db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(desc(projects.createdAt)).limit(3),
    db.select().from(events).orderBy(events.startsAt).limit(3),
    db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(3),
    Promise.all([
      db.select({ total: count(projects.id) }).from(projects),
      db.select({ total: count(events.id) }).from(events),
      db.select({ total: count(tutorials.id) }).from(tutorials),
      db.select({ total: count(users.id) }).from(users),
    ]),
  ]);

  const [projectCount, eventCount, tutorialCount, userCount] = metrics.map((entry) => entry[0]?.total ?? 0);

  return (
    <>
      <section className="border-b" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
              TechHub EMSI Fès
            </p>
            <h1 className="mt-4 text-[clamp(2.1rem,4vw,4.2rem)] font-semibold leading-[1.04] tracking-tight">
              Where Tech Meets Ideas.
            </h1>
            <p className="mt-5 max-w-2xl text-base lg:text-lg" style={{ color: "var(--muted)" }}>
              We build practical technology through collaborative student engineering: products, prototypes, workshops, and real-world experimentation.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/projects" className="tech-button">
                Explore Projects
              </Link>
              <Link href="/events" className="tech-button secondary">
                See Events
              </Link>
              <Link href="/join-us" className="tech-button secondary">
                Join TechHub
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Projects", projectCount],
                ["Events", eventCount],
                ["Tutorials", tutorialCount],
                ["Members", userCount],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-xl border p-3" style={{ borderColor: "var(--line)", background: "var(--surface-2)" }}>
                  <p className="text-xl font-semibold leading-none">{value}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 sm:grid-rows-2">
            <div className="tech-card relative overflow-hidden sm:row-span-2">
              <Image
                src="/images/home-lab.jpg"
                alt="TechHub engineering lab"
                width={900}
                height={1200}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="tech-card relative overflow-hidden">
              <Image
                src="/images/home-collaboration.jpg"
                alt="Students collaborating on technology project"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="tech-card relative overflow-hidden">
              <Image
                src="/images/home-hackathon.jpg"
                alt="Hackathon coding environment"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
              Live Updates
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">What’s active now</h2>
          </div>
          <Link href="/community" className="text-sm underline" style={{ color: "var(--muted)" }}>
            View community
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="tech-card p-5">
            <h3 className="text-lg font-semibold">Recent Projects</h3>
            <div className="mt-4 space-y-3">
              {latestProjects.length ? (
                latestProjects.map((project) => (
                  <div key={project.id} className="rounded-xl border p-3" style={{ borderColor: "var(--line)" }}>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {project.category}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  No projects published yet.
                </p>
              )}
            </div>
          </article>

          <article className="tech-card p-5">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <div className="mt-4 space-y-3">
              {upcomingEvents.length ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-xl border p-3" style={{ borderColor: "var(--line)" }}>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {formatDate(event.startsAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  No events listed yet.
                </p>
              )}
            </div>
          </article>

          <article className="tech-card p-5">
            <h3 className="text-lg font-semibold">Announcements</h3>
            <div className="mt-4 space-y-3">
              {latestAnnouncements.length ? (
                latestAnnouncements.map((note) => (
                  <div key={note.id} className="rounded-xl border p-3" style={{ borderColor: "var(--line)" }}>
                    <p className="font-medium">{note.title}</p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  No announcements yet.
                </p>
              )}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
