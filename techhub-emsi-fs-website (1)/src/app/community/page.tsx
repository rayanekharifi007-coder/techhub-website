import type { Metadata } from "next";
import { desc, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { announcements, users } from "@/db/schema";
import { PageHero } from "@/components/page-hero";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community",
};

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const [memberRows, announcementRows] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        role: users.role,
        bio: users.bio,
        githubUrl: users.githubUrl,
      })
      .from(users)
      .where(or(sql`${users.bio} is not null`, sql`${users.githubUrl} is not null`))
      .orderBy(users.name),
    db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(8),
  ]);

  return (
    <main>
      <PageHero
        eyebrow="Community"
        title="People, updates, and collaborative momentum."
        description="Meet active members and follow official club announcements published by the leadership team."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <div className="tech-card p-5">
          <h2 className="text-xl font-semibold">Member Profiles</h2>
          <div className="mt-4 space-y-3">
            {memberRows.length ? (
              memberRows.map((member) => (
                <article key={member.id} className="rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{member.name}</h3>
                    <span className="rounded-full px-2 py-1 text-xs" style={{ background: "var(--accent-soft)" }}>
                      {member.role}
                    </span>
                  </div>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    {member.bio ?? "Profile details will be added by this member soon."}
                  </p>
                  {member.githubUrl && (
                    <a className="mt-2 inline-block text-sm underline" href={member.githubUrl} target="_blank">
                      GitHub Profile
                    </a>
                  )}
                </article>
              ))
            ) : (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Public member profiles are not available yet.
              </p>
            )}
          </div>
        </div>

        <div className="tech-card p-5">
          <h2 className="text-xl font-semibold">Announcements</h2>
          <div className="mt-4 space-y-3">
            {announcementRows.length ? (
              announcementRows.map((item) => (
                <article key={item.id} className="rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    {item.body}
                  </p>
                  <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    {formatDate(item.createdAt)}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No announcements posted yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
