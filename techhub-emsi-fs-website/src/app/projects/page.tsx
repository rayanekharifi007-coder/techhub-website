import type { Metadata } from "next";
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { projectContributors, projects, users } from "@/db/schema";
import { PageHero } from "@/components/page-hero";
import { ProjectsExplorer } from "@/components/projects-explorer";

export const metadata: Metadata = {
  title: "Projects",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projectRows = await db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(asc(projects.title));

  const categories = Array.from(new Set(projectRows.map((row) => row.category)));
  const ids = projectRows.map((project) => project.id);

  const contributorRows =
    ids.length === 0
      ? []
      : await db
          .select({
            projectId: projectContributors.projectId,
            name: users.name,
            contribution: projectContributors.contribution,
          })
          .from(projectContributors)
          .innerJoin(users, eq(projectContributors.userId, users.id))
          .where(inArray(projectContributors.projectId, ids));

  const contributors = contributorRows.reduce<Record<number, { name: string; contribution: string }[]>>((acc, row) => {
    if (!acc[row.projectId]) acc[row.projectId] = [];
    acc[row.projectId].push({ name: row.name, contribution: row.contribution });
    return acc;
  }, {});

  return (
    <main>
      <PageHero
        eyebrow="Project Portfolio"
        title="Engineering projects shipped by TechHub members."
        description="Search instantly, filter by category, inspect contribution roles, and open source/demo links in one dynamic explorer."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
        <ProjectsExplorer projects={projectRows} categories={categories} contributors={contributors} />
      </section>
    </main>
  );
}
