import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HardHat, Truck, Wrench, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Norlog Building Concept — Building Stronger Foundations" },
      { name: "description", content: "Nigerian construction firm supplying cement, blocks, iron rods, aggregates and heavy equipment rentals. Request a quote today." },
      { property: "og:title", content: "Norlog Building Concept — Building Stronger Foundations" },
      { property: "og:description", content: "Nigerian construction firm supplying cement, blocks, iron rods, aggregates and heavy equipment rentals. Request a quote today." },
    ],
  }),
  component: Index,
});

function Index() {
  const { settings } = useStore();
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-foreground bg-foreground text-background">
        <div className="absolute inset-0 blueprint-grid opacity-40" />
        <div className="absolute inset-y-0 right-0 hidden w-1/3 diagonal-stripes opacity-20 md:block" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="mb-6 inline-flex items-center gap-2 border-2 border-accent bg-accent/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.25em] text-accent">
            <span className="h-2 w-2 bg-accent" />
            {settings.heroBadge}
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {settings.shortName}
            <br />
            <span className="text-accent">{settings.subName.split(" ")[0]}</span>{" "}
            {settings.subName.split(" ").slice(1).join(" ")}
          </h1>
          <p className="mt-6 max-w-2xl font-display text-2xl font-semibold uppercase tracking-wider text-background/90 md:text-3xl">
            {settings.tagline}
          </p>
          <p className="mt-4 max-w-xl text-base text-background/70">
            {settings.heroIntro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/quote"
              className="group inline-flex items-center gap-2 border-2 border-accent bg-accent px-6 py-4 font-display text-sm font-bold uppercase tracking-wider text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border-2 border-background bg-transparent px-6 py-4 font-display text-sm font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground"
            >
              Browse Materials
            </Link>
          </div>
        </div>

        {/* Bottom stat bar */}
        <div className="relative border-t-2 border-accent bg-foreground">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x-2 divide-background/10 md:grid-cols-4">
            {[
              ["15+", "Years On-Site"],
              ["500+", "Projects Delivered"],
              ["50+", "Heavy Machines"],
              ["24/7", "Site Support"],
            ].map(([n, l]) => (
              <div key={l} className="px-4 py-5 sm:px-6 sm:py-6">
                <div className="font-display text-3xl font-black text-accent md:text-4xl">{n}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-background/60">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">
              What We Do
            </div>
            <h2 className="mt-2 font-display text-4xl font-black md:text-5xl">
              Three Divisions.<br />One Site Partner.
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: HardHat,
              title: "Building Materials",
              body: "Cement, blocks, iron rods, sand, granite, tiles and roofing — sourced direct from mills and quarries.",
              cta: "Shop materials",
              to: "/products" as const,
            },
            {
              icon: Truck,
              title: "Heavy Equipment",
              body: "Excavators, tippers, mixers and compactors available for sale or by the day, week or project.",
              cta: "Rent equipment",
              to: "/products" as const,
            },
            {
              icon: Wrench,
              title: "Construction Services",
              body: "Site clearing, foundation, concrete work, and consultation — supervised by certified engineers.",
              cta: "Book a service",
              to: "/services" as const,
            },
          ].map(({ icon: Icon, title, body, cta, to }) => (
            <div key={title} className="group relative border-2 border-foreground bg-card p-6 transition-shadow hover:shadow-[8px_8px_0_0_var(--color-foreground)]">
              <div className="mb-4 grid h-14 w-14 place-items-center border-2 border-foreground bg-accent">
                <Icon className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              <Link to={to} className="mt-5 inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors group-hover:text-accent">
                {cta} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="border-y-2 border-foreground bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">Why Norlog</div>
            <h2 className="mt-2 font-display text-4xl font-black md:text-5xl">Priced Right.<br/>Delivered On Time.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              We supply contractors and homeowners across the country with the honest
              pricing and reliable logistics that big projects demand.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              ["Direct-from-source pricing", "No middlemen inflating your BOQ."],
              ["Certified equipment operators", "All rentals include trained operators on request."],
              ["Nationwide delivery", "Tipper and flatbed fleet across 36 states."],
              ["Site supervision", "Engineers on call for critical pours."],
            ].map(([t, d]) => (
              <li key={t} className="border-2 border-foreground bg-background p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <div className="font-display text-sm font-bold uppercase tracking-wider">{t}</div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="relative overflow-hidden border-2 border-foreground bg-foreground p-8 text-background md:p-14">
          <div className="absolute inset-0 blueprint-grid opacity-30" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl font-black md:text-5xl">
                Ready to build?
              </h2>
              <p className="mt-2 max-w-lg text-background/70">
                Send us your list. We'll come back with a costed quote — usually within 24 hours.
              </p>
            </div>
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 border-2 border-accent bg-accent px-6 py-4 font-display text-sm font-bold uppercase tracking-wider text-accent-foreground"
            >
              Start a Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
