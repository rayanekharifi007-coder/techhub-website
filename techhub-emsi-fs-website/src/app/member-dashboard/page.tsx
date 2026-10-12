import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  challengeSubmissions,
  challenges,
  eventRegistrations,
  events,
  membershipApplications,
  projectSubmissions,
  quizAttempts,
  quizzes,
  tutorialProgress,
  tutorials,
  users,
} from "@/db/schema";
import { PageHero } from "@/components/page-hero";
import { formatDate } from "@/lib/utils";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Member Dashboard",
};

export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  const user = await requireUser();

  async function updateProfile(formData: FormData) {
    "use server";
    const member = await requireUser();
    const bio = String(formData.get("bio") ?? "").trim();
    const githubUrl = String(formData.get("githubUrl") ?? "").trim();

    await db.update(users).set({ bio, githubUrl }).where(eq(users.id, member.id));
    revalidatePath("/member-dashboard");
    revalidatePath("/community");
  }

  async function submitProject(formData: FormData) {
    "use server";
    const member = await requireUser();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const repoUrl = String(formData.get("repoUrl") ?? "").trim();
    const demoUrl = String(formData.get("demoUrl") ?? "").trim();
    if (!title || !description) return;

    await db.insert(projectSubmissions).values({
      userId: member.id,
      title,
      description,
      repoUrl: repoUrl || null,
      demoUrl: demoUrl || null,
    });

    revalidatePath("/member-dashboard");
    revalidatePath("/admin-dashboard");
  }

  const [registrations, progressRows, projectRows, applicationRows, quizRows, challengeRows] = await Promise.all([
    db
      .select({ title: events.title, startsAt: events.startsAt, location: events.location })
      .from(eventRegistrations)
      .innerJoin(events, eq(eventRegistrations.eventId, events.id))
      .where(eq(eventRegistrations.userId, user.id))
      .orderBy(events.startsAt),
    db
      .select({ tutorialTitle: tutorials.title, completedAt: tutorialProgress.completedAt })
      .from(tutorialProgress)
      .innerJoin(tutorials, eq(tutorialProgress.tutorialId, tutorials.id))
      .where(eq(tutorialProgress.userId, user.id))
      .orderBy(desc(tutorialProgress.completedAt)),
    db.select().from(projectSubmissions).where(eq(projectSubmissions.userId, user.id)).orderBy(desc(projectSubmissions.createdAt)),
    db
      .select({ status: membershipApplications.status, createdAt: membershipApplications.createdAt })
      .from(membershipApplications)
      .where(eq(membershipApplications.email, user.email))
      .orderBy(desc(membershipApplications.createdAt))
      .limit(5),
    db
      .select({ title: quizzes.title, isCorrect: quizAttempts.isCorrect, createdAt: quizAttempts.createdAt })
      .from(quizAttempts)
      .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .where(eq(quizAttempts.userId, user.id))
      .orderBy(desc(quizAttempts.createdAt))
      .limit(5),
    db
      .select({ title: challenges.title, createdAt: challengeSubmissions.createdAt })
      .from(challengeSubmissions)
      .innerJoin(challenges, eq(challengeSubmissions.challengeId, challenges.id))
      .where(eq(challengeSubmissions.userId, user.id))
      .orderBy(desc(challengeSubmissions.createdAt))
      .limit(5),
  ]);

  return (
    <main>
      <PageHero
        eyebrow="Member Dashboard"
        title={`Welcome, ${user.name}.`}
        description="Track your profile, submissions, registrations, and technical learning progress from one place."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 lg:grid-cols-3 lg:px-8">
        <div className="space-y-6 lg:col-span-2">
          <form action={updateProfile} className="tech-card p-5">
            <h2 className="text-xl font-semibold">Profile</h2>
            <label className="mt-3 block text-sm">
              Bio
              <textarea name="bio" defaultValue={user.bio ?? ""} className="tech-input mt-1 h-24" />
            </label>
            <label className="mt-3 block text-sm">
              GitHub URL
              <input name="githubUrl" defaultValue={user.githubUrl ?? ""} className="tech-input mt-1" />
            </label>
            <button className="tech-button mt-3 text-sm">Save Profile</button>
          </form>

          <form action={submitProject} className="tech-card p-5">
            <h2 className="text-xl font-semibold">Submit a Project</h2>
            <label className="mt-3 block text-sm">
              Title
              <input required name="title" className="tech-input mt-1" />
            </label>
            <label className="mt-3 block text-sm">
              Description
              <textarea required name="description" className="tech-input mt-1 h-24" />
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                Repository URL
                <input name="repoUrl" className="tech-input mt-1" />
              </label>
              <label className="text-sm">
                Demo URL
                <input name="demoUrl" className="tech-input mt-1" />
              </label>
            </div>
            <button className="tech-button mt-3 text-sm">Submit for Review</button>
          </form>

          <div className="tech-card p-5">
            <h2 className="text-xl font-semibold">My Project Submissions</h2>
            <div className="mt-3 space-y-2 text-sm">
              {projectRows.length ? (
                projectRows.map((project) => (
                  <p key={project.id}>
                    {project.title} — <span className="font-medium">{project.status}</span>
                  </p>
                ))
              ) : (
                <p style={{ color: "var(--text-muted)" }}>No project submissions yet.</p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="tech-card p-5">
            <h3 className="text-lg font-semibold">Event Registrations</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {registrations.length ? (
                registrations.map((event, idx) => (
                  <li key={`${event.title}-${idx}`}>
                    <p className="font-medium">{event.title}</p>
                    <p style={{ color: "var(--text-muted)" }}>{event.location}</p>
                    <p style={{ color: "var(--text-muted)" }}>{formatDate(event.startsAt)}</p>
                  </li>
                ))
              ) : (
                <li style={{ color: "var(--text-muted)" }}>No event registrations yet.</li>
              )}
            </ul>
          </div>

          <div className="tech-card p-5">
            <h3 className="text-lg font-semibold">Tutorial Progress</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {progressRows.length ? (
                progressRows.map((item, idx) => (
                  <li key={`${item.tutorialTitle}-${idx}`}>{item.tutorialTitle}</li>
                ))
              ) : (
                <li style={{ color: "var(--text-muted)" }}>No completed tutorials yet.</li>
              )}
            </ul>
          </div>

          <div className="tech-card p-5">
            <h3 className="text-lg font-semibold">Membership Application Status</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {applicationRows.length ? (
                applicationRows.map((app, idx) => (
                  <li key={idx}>
                    {formatDate(app.createdAt)} — <span className="font-medium">{app.status}</span>
                  </li>
                ))
              ) : (
                <li style={{ color: "var(--text-muted)" }}>No applications found.</li>
              )}
            </ul>
          </div>

          <div className="tech-card p-5">
            <h3 className="text-lg font-semibold">Latest Quiz Attempts</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {quizRows.length ? (
                quizRows.map((attempt, idx) => (
                  <li key={idx}>
                    {attempt.title} — {attempt.isCorrect ? "Correct" : "Incorrect"}
                  </li>
                ))
              ) : (
                <li style={{ color: "var(--text-muted)" }}>No quiz attempts yet.</li>
              )}
            </ul>
          </div>

          <div className="tech-card p-5">
            <h3 className="text-lg font-semibold">Latest Challenge Attempts</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {challengeRows.length ? (
                challengeRows.map((attempt, idx) => <li key={idx}>{attempt.title}</li>)
              ) : (
                <li style={{ color: "var(--text-muted)" }}>No challenge submissions yet.</li>
              )}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
