"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Contributor = { name: string; contribution: string };
type Project = {
  id: number;
  title: string;
  summary: string;
  category: string;
  githubUrl: string | null;
  liveDemoUrl: string | null;
  createdAt: Date;
};

export function ProjectsExplorer({
  projects,
  categories,
  contributors,
}: {
  projects: Project[];
  categories: string[];
  contributors: Record<number, Contributor[]>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"newest" | "alphabetical">("newest");

  const filtered = useMemo(() => {
    let items = projects.filter((project) => {
      const matchesQuery =
        !query ||
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.summary.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || project.category === category;
      return matchesQuery && matchesCategory;
    });

    items = [...items].sort((a, b) => {
      if (sort === "alphabetical") return a.title.localeCompare(b.title);
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });

    return items;
  }, [projects, query, category, sort]);

  return (
    <div>
      <div className="tech-card mb-6 grid gap-3 p-4 md:grid-cols-[1fr_220px_220px]">
        <label className="text-sm">
          Search projects
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or summary"
            className="tech-input mt-1"
          />
        </label>

        <label className="text-sm">
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="tech-input mt-1">
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value as "newest" | "alphabetical")} className="tech-input mt-1">
            <option value="newest">Newest</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </label>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { value: "all", label: "All" },
          ...categories.map((item) => ({ value: item, label: item })),
        ].map((chip) => (
          <button
            key={chip.value}
            onClick={() => setCategory(chip.value)}
            className="rounded-full border px-3 py-1 text-xs"
            style={{
              borderColor: chip.value === category ? "var(--accent)" : "var(--line)",
              background: chip.value === category ? "var(--accent-soft)" : "var(--surface)",
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length ? (
          filtered.map((project) => (
            <article key={project.id} className="tech-card p-5">
              <div className="mb-3 flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <span className="rounded-full px-2 py-1 text-xs" style={{ background: "var(--accent-soft)" }}>
                  {project.category}
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {project.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {project.githubUrl && (
                  <Link href={project.githubUrl} className="tech-button secondary" target="_blank">
                    GitHub
                  </Link>
                )}
                {project.liveDemoUrl && (
                  <Link href={project.liveDemoUrl} className="tech-button secondary" target="_blank">
                    Live Demo
                  </Link>
                )}
              </div>
              <div className="mt-4 border-t pt-3" style={{ borderColor: "var(--line)" }}>
                <p className="text-xs uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
                  Team Contributions
                </p>
                {contributors[project.id]?.length ? (
                  <ul className="mt-2 space-y-1 text-sm">
                    {contributors[project.id].map((item, idx) => (
                      <li key={`${project.id}-${idx}`}>
                        <span className="font-medium">{item.name}</span>: {item.contribution}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    Contributor details are not published yet.
                  </p>
                )}
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No projects match the current filters.
          </p>
        )}
      </div>
    </div>
  );
}
