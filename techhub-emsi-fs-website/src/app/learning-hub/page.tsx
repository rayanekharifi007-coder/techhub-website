import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  challengeSubmissions,
  challenges,
  quizAttempts,
  quizzes,
  tutorialProgress,
  tutorials,
} from "@/db/schema";
import { PageHero } from "@/components/page-hero";
import { getCurrentUser, requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Learning Hub",
};

export const dynamic = "force-dynamic";

export default async function LearningHubPage() {
  const user = await getCurrentUser();
  const [tutorialRows, challengeRows, quizRows] = await Promise.all([
    db.select().from(tutorials).orderBy(desc(tutorials.createdAt)),
    db.select().from(challenges).orderBy(desc(challenges.createdAt)),
    db.select().from(quizzes).orderBy(desc(quizzes.createdAt)),
  ]);

  const completed = user
    ? await db
        .select({ tutorialId: tutorialProgress.tutorialId })
        .from(tutorialProgress)
        .where(eq(tutorialProgress.userId, user.id))
    : [];

  const completedSet = new Set(completed.map((row) => row.tutorialId));

  async function markComplete(formData: FormData) {
    "use server";
    const member = await requireUser();
    const tutorialId = Number(formData.get("tutorialId"));

    await db
      .insert(tutorialProgress)
      .values({ userId: member.id, tutorialId })
      .onConflictDoNothing();

    revalidatePath("/learning-hub");
    revalidatePath("/member-dashboard");
  }

  async function submitChallenge(formData: FormData) {
    "use server";
    const member = await requireUser();
    const challengeId = Number(formData.get("challengeId"));
    const submissionText = String(formData.get("submissionText") ?? "").trim();
    if (!submissionText) return;

    await db.insert(challengeSubmissions).values({ userId: member.id, challengeId, submissionText });
    revalidatePath("/learning-hub");
    revalidatePath("/member-dashboard");
  }

  async function submitQuiz(formData: FormData) {
    "use server";
    const member = await requireUser();
    const quizId = Number(formData.get("quizId"));
    const answer = String(formData.get("answer") ?? "").trim();
    if (!answer) return;

    const found = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
    if (!found[0]) return;

    const isCorrect = found[0].correctAnswer.toLowerCase() === answer.toLowerCase();
    await db.insert(quizAttempts).values({ userId: member.id, quizId, answer, isCorrect });

    revalidatePath("/learning-hub");
    revalidatePath("/member-dashboard");
  }

  const latestAttempts = user
    ? await db
        .select({
          quizTitle: quizzes.title,
          answer: quizAttempts.answer,
          isCorrect: quizAttempts.isCorrect,
        })
        .from(quizAttempts)
        .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
        .where(eq(quizAttempts.userId, user.id))
        .orderBy(desc(quizAttempts.createdAt))
        .limit(5)
    : [];

  return (
    <main>
      <PageHero
        eyebrow="Learning Hub"
        title="Tutorials, coding challenges, and quizzes."
        description="Progress through practical resources and track your completion state in your member dashboard."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <div className="tech-card p-5">
          <h2 className="text-xl font-semibold">Tutorials</h2>
          <div className="mt-4 space-y-3">
            {tutorialRows.length ? (
              tutorialRows.map((tutorial) => (
                <article key={tutorial.id} className="rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
                  <p className="text-xs uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                    {tutorial.level}
                  </p>
                  <h3 className="mt-1 font-semibold">{tutorial.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    {tutorial.description}
                  </p>
                  <form action={markComplete} className="mt-3 flex items-center gap-2">
                    <input type="hidden" name="tutorialId" value={tutorial.id} />
                    <button disabled={completedSet.has(tutorial.id)} className="tech-button secondary text-sm disabled:opacity-60">
                      {completedSet.has(tutorial.id) ? "Completed" : "Mark Complete"}
                    </button>
                    {tutorial.contentUrl && (
                      <a href={tutorial.contentUrl} target="_blank" className="text-sm underline">
                        Open resource
                      </a>
                    )}
                  </form>
                </article>
              ))
            ) : (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No tutorials published yet.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="tech-card p-5">
            <h2 className="text-xl font-semibold">Coding Challenges</h2>
            <div className="mt-4 space-y-4">
              {challengeRows.length ? (
                challengeRows.map((challenge) => (
                  <form key={challenge.id} action={submitChallenge} className="rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
                    <input type="hidden" name="challengeId" value={challenge.id} />
                    <p className="text-xs uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                      {challenge.difficulty}
                    </p>
                    <h3 className="font-semibold">{challenge.title}</h3>
                    <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                      {challenge.description}
                    </p>
                    <textarea
                      required
                      name="submissionText"
                      className="tech-input mt-2 h-24"
                      placeholder="Describe your approach or include a repository/demo link"
                    />
                    <button className="tech-button mt-2 text-sm">Submit Challenge Attempt</button>
                  </form>
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No challenges available yet.
                </p>
              )}
            </div>
          </div>

          <div className="tech-card p-5">
            <h2 className="text-xl font-semibold">Quizzes</h2>
            <div className="mt-4 space-y-4">
              {quizRows.length ? (
                quizRows.map((quiz) => (
                  <form key={quiz.id} action={submitQuiz} className="rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
                    <input type="hidden" name="quizId" value={quiz.id} />
                    <h3 className="font-semibold">{quiz.title}</h3>
                    <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                      {quiz.question}
                    </p>
                    <input required name="answer" className="tech-input mt-2" placeholder="Your answer" />
                    <button className="tech-button mt-2 text-sm">Submit Answer</button>
                  </form>
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No quizzes published yet.
                </p>
              )}
            </div>

            {user && latestAttempts.length > 0 && (
              <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--line)" }}>
                <p className="text-sm font-medium">Recent attempts</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {latestAttempts.map((attempt, idx) => (
                    <li key={`${attempt.quizTitle}-${idx}`}>
                      {attempt.quizTitle}: <span className="font-medium">{attempt.answer}</span> — {attempt.isCorrect ? "Correct" : "Try again"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
