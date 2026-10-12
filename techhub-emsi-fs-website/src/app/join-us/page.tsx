import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { membershipApplications } from "@/db/schema";
import { PageHero } from "@/components/page-hero";
import { getCurrentUser } from "@/lib/auth";
import { sendJoinApplicationEmail } from "@/lib/mailer";

export const metadata: Metadata = {
  title: "Join Us",
};

export default async function JoinUsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const submitted = String(params.submitted ?? "") === "1";
  const mailError = String(params.error ?? "") === "mail";

  async function submitApplication(formData: FormData) {
    "use server";
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const motivation = String(formData.get("motivation") ?? "").trim();
    const background = String(formData.get("background") ?? "").trim();
    const userIdRaw = formData.get("userId");

    if (!fullName || !email || !motivation || !background) return;

    await db.insert(membershipApplications).values({
      fullName,
      email,
      motivation,
      background,
      userId: userIdRaw ? Number(userIdRaw) : null,
    });

    try {
      await sendJoinApplicationEmail({ fullName, email, background, motivation });
    } catch {
      redirect("/join-us?error=mail");
    }

    revalidatePath("/admin-dashboard");
    redirect("/join-us?submitted=1");
  }

  return (
    <main>
      <PageHero
        eyebrow="Join Us"
        title="Apply to become a TechHub member."
        description="Tell us about your background, interests, and the kind of technical work you want to contribute."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <aside className="tech-card p-5">
          <h2 className="text-xl font-semibold">Application Notes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
            <li>Applications are reviewed by the TechHub leadership team.</li>
            <li>Please provide accurate contact information.</li>
            <li>Use concrete examples of your interests and goals.</li>
          </ul>
        </aside>

        <form action={submitApplication} className="tech-card space-y-4 p-5">
          {submitted && (
            <p className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--line)", background: "var(--accent-soft)" }}>
              Application submitted successfully and sent to emsi.techhub@gmail.com.
            </p>
          )}
          {mailError && (
            <p className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "#ef4444", background: "color-mix(in oklab, #ef4444 10%, transparent)" }}>
              Application saved, but Gmail delivery failed. Please configure GMAIL_USER and GMAIL_APP_PASSWORD.
            </p>
          )}
          {user && <input type="hidden" name="userId" value={user.id} />}
          <label className="block text-sm">
            Full name
            <input required name="fullName" defaultValue={user?.name ?? ""} className="tech-input mt-1" />
          </label>
          <label className="block text-sm">
            Email
            <input required type="email" name="email" defaultValue={user?.email ?? ""} className="tech-input mt-1" />
          </label>
          <label className="block text-sm">
            Your technical background
            <textarea required name="background" className="tech-input mt-1 h-28" />
          </label>
          <label className="block text-sm">
            Why do you want to join TechHub?
            <textarea required name="motivation" className="tech-input mt-1 h-28" />
          </label>

          <button className="tech-button">Submit Application</button>
        </form>
      </section>
    </main>
  );
}
