import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  announcements,
  challenges,
  contactMessages,
  events,
  membershipApplications,
  projectSubmissions,
  projects,
  quizzes,
  tutorials,
  users,
} from "@/db/schema";
import { PageHero } from "@/components/page-hero";
import { requireAdmin } from "@/lib/auth";
import { formatDate, slugify } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  async function createProject(formData: FormData) {
    "use server";
    const user = await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const githubUrl = String(formData.get("githubUrl") ?? "").trim();
    const liveDemoUrl = String(formData.get("liveDemoUrl") ?? "").trim();
    if (!title || !summary || !category) return;

    await db.insert(projects).values({
      title,
      summary,
      category,
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      githubUrl: githubUrl || null,
      liveDemoUrl: liveDemoUrl || null,
      createdBy: user.id,
      isPublished: true,
    });

    revalidatePath("/projects");
    revalidatePath("/admin-dashboard");
  }

  async function createEvent(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const startsAt = String(formData.get("startsAt") ?? "");
    const endsAt = String(formData.get("endsAt") ?? "");
    const schedule = String(formData.get("schedule") ?? "").trim();
    const capacity = Number(formData.get("capacity"));
    if (!title || !description || !location || !startsAt || !endsAt || !schedule || capacity < 1) return;

    await db.insert(events).values({
      title,
      description,
      location,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      schedule,
      capacity,
    });

    revalidatePath("/events");
    revalidatePath("/admin-dashboard");
  }

  async function createAnnouncement(formData: FormData) {
    "use server";
    const user = await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    if (!title || !body) return;

    await db.insert(announcements).values({ title, body, createdBy: user.id });
    revalidatePath("/community");
    revalidatePath("/");
    revalidatePath("/admin-dashboard");
  }

  async function createTutorial(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const level = String(formData.get("level") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const contentUrl = String(formData.get("contentUrl") ?? "").trim();
    if (!title || !level || !description) return;

    await db.insert(tutorials).values({ title, level, description, contentUrl: contentUrl || null });
    revalidatePath("/learning-hub");
    revalidatePath("/admin-dashboard");
  }

  async function createChallenge(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const difficulty = String(formData.get("difficulty") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!title || !difficulty || !description) return;

    await db.insert(challenges).values({ title, difficulty, description });
    revalidatePath("/learning-hub");
    revalidatePath("/admin-dashboard");
  }

  async function createQuiz(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const question = String(formData.get("question") ?? "").trim();
    const correctAnswer = String(formData.get("correctAnswer") ?? "").trim();
    if (!title || !question || !correctAnswer) return;

    await db.insert(quizzes).values({ title, question, correctAnswer });
    revalidatePath("/learning-hub");
    revalidatePath("/admin-dashboard");
  }

  async function updateApplicationStatus(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = Number(formData.get("id"));
    const status = String(formData.get("status") ?? "pending");
    if (!["pending", "approved", "rejected"].includes(status)) return;
    await db.update(membershipApplications).set({ status: status as "pending" | "approved" | "rejected" }).where(eq(membershipApplications.id, id));
    revalidatePath("/admin-dashboard");
    revalidatePath("/member-dashboard");
  }

  async function updateSubmissionStatus(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = Number(formData.get("id"));
    const status = String(formData.get("status") ?? "pending");
    if (!["pending", "approved", "rejected"].includes(status)) return;
    await db.update(projectSubmissions).set({ status: status as "pending" | "approved" | "rejected" }).where(eq(projectSubmissions.id, id));
    revalidatePath("/admin-dashboard");
    revalidatePath("/member-dashboard");
  }

  async function updateUserRole(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = Number(formData.get("id"));
    const role = String(formData.get("role") ?? "member");
    if (!["member", "admin"].includes(role)) return;
    await db.update(users).set({ role: role as "member" | "admin" }).where(eq(users.id, id));
    revalidatePath("/admin-dashboard");
  }

  const [
    memberRows,
    applicationRows,
    submissionRows,
    projectRows,
    eventRows,
    messageRows,
    announcementRows,
    tutorialRows,
  ] = await Promise.all([
    db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users).orderBy(users.createdAt),
    db.select().from(membershipApplications).orderBy(desc(membershipApplications.createdAt)).limit(20),
    db.select().from(projectSubmissions).orderBy(desc(projectSubmissions.createdAt)).limit(20),
    db.select().from(projects).orderBy(desc(projects.createdAt)).limit(10),
    db.select().from(events).orderBy(desc(events.startsAt)).limit(10),
    db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(10),
    db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(10),
    db.select().from(tutorials).orderBy(desc(tutorials.createdAt)).limit(10),
  ]);

  return (
    <main>
      <PageHero
        eyebrow="Admin Dashboard"
        title={`Operations console for ${admin.name}.`}
        description="Manage the TechHub platform resources, moderation tasks, learning content, and member-facing workflows."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <form action={createProject} className="tech-card space-y-3 p-5">
          <h2 className="text-lg font-semibold">Create Project</h2>
          <input required name="title" placeholder="Title" className="tech-input" />
          <input required name="category" placeholder="Category" className="tech-input" />
          <textarea required name="summary" placeholder="Summary" className="tech-input h-24" />
          <input name="githubUrl" placeholder="GitHub URL" className="tech-input" />
          <input name="liveDemoUrl" placeholder="Live demo URL" className="tech-input" />
          <button className="tech-button text-sm">Publish Project</button>
        </form>

        <form action={createEvent} className="tech-card space-y-3 p-5">
          <h2 className="text-lg font-semibold">Create Event</h2>
          <input required name="title" placeholder="Title" className="tech-input" />
          <textarea required name="description" placeholder="Description" className="tech-input h-20" />
          <input required name="location" placeholder="Location" className="tech-input" />
          <div className="grid gap-2 sm:grid-cols-2">
            <input required type="datetime-local" name="startsAt" className="tech-input" />
            <input required type="datetime-local" name="endsAt" className="tech-input" />
          </div>
          <input required type="number" min={1} name="capacity" placeholder="Capacity" className="tech-input" />
          <textarea required name="schedule" placeholder="Schedule details" className="tech-input h-20" />
          <button className="tech-button text-sm">Publish Event</button>
        </form>

        <form action={createAnnouncement} className="tech-card space-y-3 p-5">
          <h2 className="text-lg font-semibold">Post Announcement</h2>
          <input required name="title" placeholder="Title" className="tech-input" />
          <textarea required name="body" placeholder="Body" className="tech-input h-24" />
          <button className="tech-button text-sm">Publish</button>
        </form>

        <form action={createTutorial} className="tech-card space-y-3 p-5">
          <h2 className="text-lg font-semibold">Create Tutorial</h2>
          <input required name="title" placeholder="Title" className="tech-input" />
          <input required name="level" placeholder="Level" className="tech-input" />
          <textarea required name="description" placeholder="Description" className="tech-input h-24" />
          <input name="contentUrl" placeholder="Resource URL (optional)" className="tech-input" />
          <button className="tech-button text-sm">Add Tutorial</button>
        </form>

        <form action={createChallenge} className="tech-card space-y-3 p-5">
          <h2 className="text-lg font-semibold">Create Challenge</h2>
          <input required name="title" placeholder="Title" className="tech-input" />
          <input required name="difficulty" placeholder="Difficulty" className="tech-input" />
          <textarea required name="description" placeholder="Description" className="tech-input h-24" />
          <button className="tech-button text-sm">Add Challenge</button>
        </form>

        <form action={createQuiz} className="tech-card space-y-3 p-5">
          <h2 className="text-lg font-semibold">Create Quiz</h2>
          <input required name="title" placeholder="Title" className="tech-input" />
          <textarea required name="question" placeholder="Question" className="tech-input h-24" />
          <input required name="correctAnswer" placeholder="Correct answer" className="tech-input" />
          <button className="tech-button text-sm">Add Quiz</button>
        </form>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-12 lg:grid-cols-2 lg:px-8">
        <div className="tech-card p-5">
          <h3 className="text-lg font-semibold">Membership Applications</h3>
          <div className="mt-3 space-y-3 text-sm">
            {applicationRows.map((app) => (
              <form key={app.id} action={updateApplicationStatus} className="rounded-xl border p-3" style={{ borderColor: "var(--line)" }}>
                <input type="hidden" name="id" value={app.id} />
                <p className="font-medium">{app.fullName}</p>
                <p style={{ color: "var(--text-muted)" }}>{app.email}</p>
                <p className="mt-1">{app.motivation}</p>
                <div className="mt-2 flex items-center gap-2">
                  <select name="status" defaultValue={app.status} className="tech-input max-w-40">
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                  <button className="tech-button secondary text-xs">Update</button>
                </div>
              </form>
            ))}
          </div>
        </div>

        <div className="tech-card p-5">
          <h3 className="text-lg font-semibold">Project Submissions</h3>
          <div className="mt-3 space-y-3 text-sm">
            {submissionRows.map((submission) => (
              <form key={submission.id} action={updateSubmissionStatus} className="rounded-xl border p-3" style={{ borderColor: "var(--line)" }}>
                <input type="hidden" name="id" value={submission.id} />
                <p className="font-medium">{submission.title}</p>
                <p style={{ color: "var(--text-muted)" }}>{submission.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <select name="status" defaultValue={submission.status} className="tech-input max-w-40">
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                  <button className="tech-button secondary text-xs">Update</button>
                </div>
              </form>
            ))}
          </div>
        </div>

        <div className="tech-card p-5">
          <h3 className="text-lg font-semibold">Members & Roles</h3>
          <div className="mt-3 space-y-2 text-sm">
            {memberRows.map((member) => (
              <form key={member.id} action={updateUserRole} className="flex items-center justify-between gap-2 rounded-xl border p-3" style={{ borderColor: "var(--line)" }}>
                <input type="hidden" name="id" value={member.id} />
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p style={{ color: "var(--text-muted)" }}>{member.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select name="role" defaultValue={member.role} className="tech-input w-28">
                    <option value="member">member</option>
                    <option value="admin">admin</option>
                  </select>
                  <button className="tech-button secondary text-xs">Save</button>
                </div>
              </form>
            ))}
          </div>
        </div>

        <div className="tech-card p-5">
          <h3 className="text-lg font-semibold">Recent Contact Messages</h3>
          <div className="mt-3 space-y-2 text-sm">
            {messageRows.map((msg) => (
              <article key={msg.id} className="rounded-xl border p-3" style={{ borderColor: "var(--line)" }}>
                <p className="font-medium">{msg.subject}</p>
                <p style={{ color: "var(--text-muted)" }}>
                  {msg.name} · {msg.email}
                </p>
                <p className="mt-1">{msg.message}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="tech-card p-5">
          <h3 className="text-lg font-semibold">Published Overview</h3>
          <p className="mt-2 text-sm">Projects: {projectRows.length}</p>
          <p className="text-sm">Events: {eventRows.length}</p>
          <p className="text-sm">Announcements: {announcementRows.length}</p>
          <p className="text-sm">Tutorials: {tutorialRows.length}</p>

          <div className="mt-4 border-t pt-3 text-sm" style={{ borderColor: "var(--line)" }}>
            {eventRows.slice(0, 3).map((event) => (
              <p key={event.id}>
                {event.title} — {formatDate(event.startsAt)}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
