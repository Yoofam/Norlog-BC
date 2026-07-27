import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Contact — Norlog Building Concept" },
      { name: "description", content: "Meet Norlog Building Concept — a Nigerian construction firm building stronger foundations. Reach us by phone, WhatsApp, email, or visit our yard." },
      { property: "og:title", content: "About & Contact — Norlog" },
      { property: "og:description", content: "Contact Norlog Building Concept for materials, equipment and construction services." },
    ],
  }),
  component: About,
});

function About() {
  const { settings } = useStore();
  const COMPANY = settings;
  const waLink = `https://wa.me/${COMPANY.whatsapp.replace(/[^\d]/g, "")}`;
  return (
    <SiteLayout>
      <section className="border-b-2 border-foreground bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">About</div>
          <h1 className="mt-2 font-display text-4xl font-black md:text-6xl">{settings.aboutHeadline}</h1>
          <p className="mt-4 max-w-2xl text-background/70">{settings.aboutBody}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-black uppercase tracking-wider">Our Story</h2>
          <p className="mt-4 text-muted-foreground">
            Founded on a simple idea — that Nigerian builders deserve honest pricing,
            dependable delivery, and a partner who understands the site. Over the years
            we've grown from a single yard of cement and blocks into a full construction
            partner with a fleet of heavy equipment and a crew of experienced engineers
            and operators.
          </p>
          <p className="mt-4 text-muted-foreground">
            Whether you're pouring a single foundation or breaking ground on a multi-unit
            estate, our team is set up to move fast, price fairly, and hold the line on
            quality.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="border-2 border-foreground bg-card p-6">
            <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">Mission</div>
            <p className="mt-2 font-display text-xl font-bold">
              Supply the Nigerian construction industry with materials, machines and
              expertise it can rely on — every single day.
            </p>
          </div>
          <div className="border-2 border-foreground bg-card p-6">
            <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">Values</div>
            <ul className="mt-3 grid gap-2 font-display text-sm font-bold uppercase tracking-wider">
              <li>· Honesty in pricing</li>
              <li>· Precision in delivery</li>
              <li>· Safety on every site</li>
              <li>· Quality that outlasts the project</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-foreground bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="font-display text-3xl font-black uppercase tracking-wider">Contact</h2>
          <p className="mt-2 text-muted-foreground">Reach us by whichever channel is easiest — we usually respond within a few hours.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="group border-2 border-foreground bg-background p-6 transition-shadow hover:shadow-[6px_6px_0_0_var(--color-accent)]">
              <Phone className="h-6 w-6 text-accent" />
              <div className="mt-3 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</div>
              <div className="mt-1 font-display text-base font-bold group-hover:text-accent">{COMPANY.phone}</div>
            </a>
            <a href={waLink} target="_blank" rel="noreferrer" className="group border-2 border-foreground bg-background p-6 transition-shadow hover:shadow-[6px_6px_0_0_var(--color-accent)]">
              <MessageCircle className="h-6 w-6 text-accent" />
              <div className="mt-3 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">WhatsApp</div>
              <div className="mt-1 font-display text-base font-bold group-hover:text-accent">{COMPANY.whatsapp}</div>
            </a>
            <a href={`mailto:${COMPANY.email}`} className="group border-2 border-foreground bg-background p-6 transition-shadow hover:shadow-[6px_6px_0_0_var(--color-accent)]">
              <Mail className="h-6 w-6 text-accent" />
              <div className="mt-3 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</div>
              <div className="mt-1 break-all font-display text-base font-bold group-hover:text-accent">{COMPANY.email}</div>
            </a>
            <div className="border-2 border-foreground bg-background p-6">
              <MapPin className="h-6 w-6 text-accent" />
              <div className="mt-3 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">Yard</div>
              <div className="mt-1 font-display text-base font-bold">{COMPANY.address}</div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
