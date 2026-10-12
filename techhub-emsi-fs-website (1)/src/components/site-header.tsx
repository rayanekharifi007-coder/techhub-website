import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/projects", "Projects"],
  ["/events", "Events"],
  ["/techhub-playground", "Playground"],
  ["/learning-hub", "Learning"],
  ["/community", "Community"],
  ["/join-us", "Join"],
  ["/contact", "Contact"],
] as const;

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 border-b backdrop-blur-md" style={{ borderColor: "var(--line)", background: "color-mix(in oklab, var(--bg) 92%, transparent)" }}>
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
        <Link href="/" className="shrink-0 rounded-xl border px-3 py-1.5 text-sm font-semibold" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
          TechHub EMSI Fès
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-1.5 text-sm"
              style={{ color: "var(--muted)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/member-dashboard" className="tech-button secondary text-xs">
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link href="/admin-dashboard" className="tech-button secondary text-xs">
                  Admin
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <Link href="/auth" className="tech-button text-xs">
              Sign in
            </Link>
          )}
        </div>
      </div>

      <nav className="grid grid-cols-3 gap-1 px-4 pb-3 text-xs md:hidden">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="truncate rounded-lg border px-2 py-1.5" style={{ borderColor: "var(--line)", background: "var(--surface)", color: "var(--muted)" }}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
