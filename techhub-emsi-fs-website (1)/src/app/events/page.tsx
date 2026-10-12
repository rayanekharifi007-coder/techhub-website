import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { and, count, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { eventRegistrations, events } from "@/db/schema";
import { PageHero } from "@/components/page-hero";
import { formatDate } from "@/lib/utils";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { EventsLiveBoard } from "@/components/events-live-board";

export const metadata: Metadata = {
  title: "Events",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const user = await getCurrentUser();
  const eventRows = await db.select().from(events).orderBy(events.startsAt);
  const eventIds = eventRows.map((event) => event.id);

  const counts =
    eventIds.length === 0
      ? []
      : await db
          .select({ eventId: eventRegistrations.eventId, total: count(eventRegistrations.userId) })
          .from(eventRegistrations)
          .where(inArray(eventRegistrations.eventId, eventIds))
          .groupBy(eventRegistrations.eventId);

  const countMap = new Map<number, number>(counts.map((item) => [item.eventId, item.total]));

  async function registerForEvent(formData: FormData) {
    "use server";
    const member = await requireUser();
    const eventId = Number(formData.get("eventId"));

    const event = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!event[0]) return;

    const currentCount = await db
      .select({ total: count(eventRegistrations.userId) })
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId));

    if ((currentCount[0]?.total ?? 0) >= event[0].capacity) return;

    await db
      .insert(eventRegistrations)
      .values({ eventId, userId: member.id })
      .onConflictDoNothing();

    revalidatePath("/events");
    revalidatePath("/member-dashboard");
  }

  const memberRegistrations = user
    ? await db
        .select({ eventId: eventRegistrations.eventId })
        .from(eventRegistrations)
        .where(eq(eventRegistrations.userId, user.id))
    : [];

  const registeredSet = new Set(memberRegistrations.map((item) => item.eventId));

  return (
    <main>
      <PageHero
        eyebrow="Events & Hackathons"
        title="Workshops, coding sessions, and hands-on competitions."
        description="Browse upcoming activities, check available seats, and register directly as a member."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-4">
          <EventsLiveBoard
            events={eventRows.map((event) => ({
              id: event.id,
              title: event.title,
              startsAt: event.startsAt.toISOString(),
              location: event.location,
            }))}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {eventRows.length ? (
            eventRows.map((event) => {
              const total = countMap.get(event.id) ?? 0;
              const full = total >= event.capacity;
              const alreadyRegistered = registeredSet.has(event.id);

              return (
                <article key={event.id} className="tech-card p-5">
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    {event.description}
                  </p>

                  <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <dt style={{ color: "var(--text-muted)" }}>Starts</dt>
                      <dd>{formatDate(event.startsAt)}</dd>
                    </div>
                    <div>
                      <dt style={{ color: "var(--text-muted)" }}>Ends</dt>
                      <dd>{formatDate(event.endsAt)}</dd>
                    </div>
                    <div>
                      <dt style={{ color: "var(--text-muted)" }}>Location</dt>
                      <dd>{event.location}</dd>
                    </div>
                    <div>
                      <dt style={{ color: "var(--text-muted)" }}>Capacity</dt>
                      <dd>
                        {total}/{event.capacity}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 rounded-lg p-3 text-sm" style={{ background: "var(--surface-muted)" }}>
                    <p className="font-medium">Schedule</p>
                    <p style={{ color: "var(--text-muted)" }}>{event.schedule}</p>
                  </div>

                  <form action={registerForEvent} className="mt-4">
                    <input type="hidden" name="eventId" value={event.id} />
                    <button className="tech-button text-sm disabled:opacity-50" disabled={full || alreadyRegistered}>
                      {!user
                        ? "Sign in to register"
                        : alreadyRegistered
                          ? "Registered"
                          : full
                            ? "Capacity reached"
                            : "Register"}
                    </button>
                  </form>
                </article>
              );
            })
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No events have been published yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
