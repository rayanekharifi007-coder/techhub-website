import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { CommandPalette } from "@/components/command-palette";
import { LiveStatus } from "@/components/live-status";
import { IntroLoader } from "@/components/intro-loader";
import { AmbientLayer } from "@/components/ambient-layer";
import { QuickActions } from "@/components/quick-actions";
import { InstallAppPrompt } from "@/components/install-app-prompt";

export const metadata: Metadata = {
  title: {
    default: "TechHub EMSI Fès",
    template: "%s · TechHub EMSI Fès",
  },
  description:
    "TechHub EMSI Fès is an engineering student technology club where projects, events, and learning programs come together.",
  keywords: ["TechHub", "EMSI Fès", "engineering", "coding club", "hackathon"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    title: "TechHub",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    apple: "/apple-icon",
    icon: [
      { url: "/icon", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a1226" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('techhub-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';localStorage.setItem('techhub-theme',t)}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})();",
          }}
        />
        <div className="min-h-screen">
          <AmbientLayer />
          <IntroLoader />
          <SiteHeader />
          <main id="main-content">{children}</main>
          <footer className="mx-auto mt-16 w-full max-w-7xl border-t px-4 py-8 text-sm lg:px-8" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} TechHub EMSI Fès</p>
              <div className="flex gap-4">
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
                <Link href="/join-us" className="hover:underline">
                  Join Us
                </Link>
              </div>
            </div>
          </footer>
          <CommandPalette />
          <LiveStatus />
          <QuickActions />
          <InstallAppPrompt />
        </div>
      </body>
    </html>
  );
}
