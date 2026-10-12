import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { PageHero } from "@/components/page-hero";
import { sendContactEmail } from "@/lib/mailer";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sent = String(params.sent ?? "") === "1";
  const mailError = String(params.error ?? "") === "mail";

  async function submitMessage(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) return;

    await db.insert(contactMessages).values({ name, email, subject, message });

    try {
      await sendContactEmail({ name, email, subject, message });
    } catch {
      redirect("/contact?error=mail");
    }

    revalidatePath("/admin-dashboard");
    redirect("/contact?sent=1");
  }

  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Get in touch with TechHub EMSI Fès."
        description="Use this form for partnerships, collaborations, workshop proposals, or general inquiries."
      />

      <section className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-8">
        <form action={submitMessage} className="tech-card space-y-4 p-6">
          {sent && (
            <p className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--line)", background: "var(--accent-soft)" }}>
              Message sent successfully to emsi.techhub@gmail.com.
            </p>
          )}
          {mailError && (
            <p className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "#ef4444", background: "color-mix(in oklab, #ef4444 10%, transparent)" }}>
              Message saved, but Gmail delivery failed. Please configure GMAIL_USER and GMAIL_APP_PASSWORD.
            </p>
          )}
          <label className="block text-sm">
            Name
            <input required name="name" className="tech-input mt-1" />
          </label>
          <label className="block text-sm">
            Email
            <input required type="email" name="email" className="tech-input mt-1" />
          </label>
          <label className="block text-sm">
            Subject
            <input required name="subject" className="tech-input mt-1" />
          </label>
          <label className="block text-sm">
            Message
            <textarea required name="message" className="tech-input mt-1 h-40" />
          </label>
          <button className="tech-button">Send Message</button>
        </form>
      </section>
    </main>
  );
}
