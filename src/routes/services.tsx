import { createFileRoute } from "@tanstack/react-router";
import { HardHat, Layers, Hammer, Truck, ClipboardCheck, Ruler } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ServiceBookingForm } from "@/components/ServiceBookingForm";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Construction Services — Norlog Building Concept" },
      { name: "description", content: "Site clearing, foundation work, concrete casting, equipment rental with operators, and expert construction consultation across Nigeria." },
      { property: "og:title", content: "Construction Services — Norlog" },
      { property: "og:description", content: "Book site clearing, foundation, concrete, equipment rental and consultation." },
    ],
  }),
  component: Services,
});

const SERVICES = [
  { icon: HardHat, title: "Site Clearing & Excavation", body: "Vegetation removal, cut-and-fill, and grading for greenfield and brownfield sites." },
  { icon: Layers, title: "Foundation Work", body: "Strip, raft and pile foundations executed to engineering spec." },
  { icon: Hammer, title: "Concrete & Slab Casting", body: "Ready-mix supply, formwork, reinforcement and controlled pours." },
  { icon: Truck, title: "Equipment Rental + Operators", body: "Excavators, tippers, mixers and compactors — with certified operators." },
  { icon: ClipboardCheck, title: "Site Supervision", body: "Daily supervision by qualified engineers for critical project phases." },
  { icon: Ruler, title: "Consultation & BOQ", body: "Bill of quantities, cost planning and value engineering for your project." },
];

function Services() {
  return (
    <SiteLayout>
      <section className="border-b-2 border-foreground bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">Services</div>
          <h1 className="mt-2 font-display text-4xl font-black md:text-6xl">Boots On The Ground.</h1>
          <p className="mt-3 max-w-xl text-background/70">
            From breaking ground to final pour — supervised by engineers, executed by
            crews who've done it a hundred times.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border-2 border-foreground bg-card p-6 transition-shadow hover:shadow-[6px_6px_0_0_var(--color-accent)]">
              <div className="mb-4 grid h-12 w-12 place-items-center border-2 border-foreground bg-foreground">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t-2 border-foreground bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">Book a Service</div>
            <h2 className="mt-2 font-display text-3xl font-black md:text-4xl">Tell us about your site.</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Share your project brief and preferred date. A project coordinator will
              reach out within 24 hours to confirm scope and pricing.
            </p>
          </div>
          <ServiceBookingForm />
        </div>
      </section>
    </SiteLayout>
  );
}
