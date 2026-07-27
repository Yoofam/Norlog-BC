import { Link } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, Lock } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Materials & Equipment" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About / Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { cart, hydrated, settings } = useStore();
  const count = hydrated ? cart.reduce((a, c) => a + c.quantity, 0) : 0;

  const siteVars = {
    "--background": settings.siteBg,
    "--foreground": settings.siteFg,
    "--accent": settings.siteAccent,
    "--ring": settings.siteAccent,
  } as CSSProperties;

  const headerVars = {
    "--background": settings.headerBg,
    "--foreground": settings.headerFg,
    "--accent": settings.headerAccent,
    "--accent-foreground": settings.headerBg,
    "--border": settings.headerFg,
    color: settings.headerFg,
  } as CSSProperties;

  return (
    <div style={siteVars} className="flex min-h-screen flex-col bg-background text-foreground">
      <header
        style={headerVars}
        className="sticky top-0 z-40 border-b-2 border-foreground bg-background/95 backdrop-blur"
      >
        <div className="h-1 diagonal-stripes" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={`${settings.siteName} logo`}
                className="h-10 w-10 shrink-0 object-contain"
              />
            ) : (
              <div className="grid h-10 w-10 shrink-0 place-items-center border-2 border-foreground bg-accent font-display text-xl font-black text-accent-foreground">
                {(settings.siteName || "N").charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="truncate font-display text-base font-bold leading-none tracking-wider sm:text-lg">
                {settings.siteName}
              </div>
              <div className="truncate text-[10px] uppercase tracking-[0.2em] opacity-60">
                {settings.subName}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-accent" }}
                className="font-display text-sm font-semibold uppercase tracking-wider transition-colors hover:text-accent"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/admin"
              title="Admin portal"
              aria-label="Admin portal"
              className="hidden items-center gap-2 border-2 border-foreground px-3 py-2 font-display text-xs font-bold uppercase tracking-wider transition-colors hover:bg-accent hover:text-accent-foreground sm:flex"
            >
              <Lock className="h-4 w-4" />
              <span className="hidden md:inline">Admin</span>
            </Link>
            <Link
              to="/quote"
              className="relative flex items-center gap-2 border-2 border-foreground bg-accent px-3 py-2 font-display text-xs font-bold uppercase tracking-wider text-accent-foreground transition-opacity hover:opacity-90"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Quote</span>
              {count > 0 && (
                <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-[10px] font-black text-background">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-foreground/20 bg-background lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-accent" }}
                  className="border-b border-foreground/15 py-3 font-display text-sm font-semibold uppercase tracking-wider"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 py-3 font-display text-sm font-semibold uppercase tracking-wider"
              >
                <Lock className="h-4 w-4" /> Admin Portal
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t-2 border-foreground bg-foreground text-background">
        <div className="h-1 diagonal-stripes" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <div className="font-display text-2xl font-black tracking-wider">
              {settings.shortName}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.3em] text-background/60">
              {settings.subName}
            </div>
            <p className="mt-4 max-w-xs text-sm text-background/70">
              {settings.tagline} {settings.footerBlurb}
            </p>
          </div>
          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wider text-accent">
              Contact
            </div>
            <ul className="mt-3 space-y-2 text-sm text-background/80">
              <li>{settings.phone}</li>
              <li>{settings.email}</li>
              <li>{settings.address}</li>
            </ul>
          </div>
          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wider text-accent">
              Quick Links
            </div>
            <ul className="mt-3 space-y-2 text-sm text-background/80">
              <li><Link to="/products" className="hover:text-accent">Materials</Link></li>
              <li><Link to="/services" className="hover:text-accent">Services</Link></li>
              <li><Link to="/quote" className="hover:text-accent">Request a Quote</Link></li>
              <li><Link to="/about" className="hover:text-accent">About / Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-background/50 sm:flex-row">
            <div>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</div>
            <Link to="/admin" className="hover:text-accent">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
