import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
            Access Portal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Join the TechHub member network.</h1>
          <p className="max-w-xl text-base" style={{ color: "var(--text-muted)" }}>
            Create an account to register for events, submit projects, track learning progress, and collaborate with fellow engineering students.
          </p>
        </div>
        <AuthForm />
      </section>
    </main>
  );
}
