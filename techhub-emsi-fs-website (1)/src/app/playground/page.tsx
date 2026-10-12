import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PlaygroundTools } from "@/components/playground-tools";

export const metadata: Metadata = {
  title: "TechHub Playground",
};

export default function PlaygroundPage() {
  return (
    <main>
      <PageHero
        eyebrow="TechHub Playground"
        title="Experiment directly in the browser."
        description="Use interactive mini-labs for converters, logic circuits, sorting behavior, password and color tooling, regex testing, and quick front-end prototyping."
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
        <PlaygroundTools />
      </section>
    </main>
  );
}
