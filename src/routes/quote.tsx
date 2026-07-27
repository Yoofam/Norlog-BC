import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/constants";
import { sendToAdmin } from "@/lib/notify";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Request a Quote — Norlog Building Concept" },
      { name: "description", content: "Review your selected materials and equipment, then submit a single quote request. We'll respond within 24 hours." },
      { property: "og:title", content: "Request a Quote — Norlog" },
      { property: "og:description", content: "Submit a consolidated quote request for materials and equipment." },
    ],
  }),
  component: QuotePage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  email: z.string().trim().email("Enter a valid email").max(255),
  notes: z.string().trim().max(1000).optional().default(""),
});

function QuotePage() {
  const { cart, updateCartQty, removeFromCart, submitQuote, settings } = useStore();
  const [values, setValues] = useState({ name: "", phone: "", email: "", notes: "" });
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const subtotal = cart.reduce((a, c) => a + c.price * c.quantity, 0);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Add at least one item to your quote list.");
      return;
    }
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    const itemLines = cart
      .map((c) => `${c.name} x ${c.quantity} (${c.unit}) - ${formatNaira(c.price * c.quantity)}`)
      .join("\n");
    const q = submitQuote(parsed.data);
    setSubmittedId(q.id);
    toast.success("Quote request submitted.");
    const res = await sendToAdmin(settings.notificationEmail, `New quote request ${q.id}`, {
      Reference: q.id,
      Name: parsed.data.name,
      Phone: parsed.data.phone,
      Email: parsed.data.email,
      Notes: parsed.data.notes || "-",
      Items: itemLines,
      Subtotal: formatNaira(subtotal),
    });
    if (!res.ok) console.warn("[quote] email relay failed:", res.error);
  };

  if (submittedId) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-24 text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center border-2 border-foreground bg-accent">
            <CheckCircle2 className="h-10 w-10 text-accent-foreground" />
          </div>
          <h1 className="font-display text-4xl font-black md:text-5xl">Quote Received</h1>
          <p className="mt-4 text-muted-foreground">
            Thank you. Your request <span className="font-mono text-foreground">{submittedId}</span> has
            been logged. A project coordinator will get back to you within 24 hours
            with confirmed pricing and delivery.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/products" className="border-2 border-foreground bg-foreground px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-background">
              Browse more materials
            </Link>
            <Link to="/" className="border-2 border-foreground bg-background px-5 py-3 font-display text-xs font-bold uppercase tracking-wider">
              Back home
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const inputCls =
    "w-full border-2 border-foreground bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent";
  const labelCls =
    "font-display text-xs font-bold uppercase tracking-wider";

  return (
    <SiteLayout>
      <section className="border-b-2 border-foreground bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">Quote List</div>
          <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">Request a Quote</h1>
          <p className="mt-3 max-w-xl text-background/70">
            Review your list, add your contact details, and submit. We'll respond
            with confirmed pricing and delivery cost within 24 hours.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.5fr_1fr]">
        {/* Cart items */}
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wider">Selected Items</h2>
          {cart.length === 0 ? (
            <div className="mt-4 border-2 border-dashed border-foreground p-10 text-center">
              <p className="text-muted-foreground">Your quote list is empty.</p>
              <Link to="/products" className="mt-4 inline-flex border-2 border-foreground bg-accent px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-accent-foreground">
                Browse materials
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y-2 divide-foreground border-2 border-foreground bg-card">
              {cart.map((item) => (
                <li key={item.productId} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 sm:flex sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-display text-base font-bold uppercase tracking-wider">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{formatNaira(item.price)} · {item.unit}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border-2 border-foreground">
                      <button
                        onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                        className="grid h-9 w-9 place-items-center hover:bg-foreground hover:text-background"
                        aria-label="Decrease"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="grid w-10 place-items-center font-display text-sm font-bold">{item.quantity}</div>
                      <button
                        onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                        className="grid h-9 w-9 place-items-center hover:bg-foreground hover:text-background"
                        aria-label="Increase"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="hidden text-right font-display text-sm font-bold sm:block">
                      {formatNaira(item.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="grid h-9 w-9 place-items-center border-2 border-foreground text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {cart.length > 0 && (
            <div className="mt-4 flex items-center justify-between border-2 border-foreground bg-secondary p-4">
              <div className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                Estimated subtotal (excludes delivery)
              </div>
              <div className="font-display text-2xl font-black">{formatNaira(subtotal)}</div>
            </div>
          )}
        </div>

        {/* Contact form */}
        <form onSubmit={onSubmit} className="h-fit border-2 border-foreground bg-card p-6">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wider">Your Details</h2>
          <p className="mt-1 text-xs text-muted-foreground">We'll only use this to send your quote.</p>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-1.5">
              <span className={labelCls}>Full Name</span>
              <input className={inputCls} value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} maxLength={100} required />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Phone / WhatsApp</span>
              <input className={inputCls} value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} maxLength={20} required />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Email</span>
              <input type="email" className={inputCls} value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} maxLength={255} required />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Notes (optional)</span>
              <textarea rows={4} className={inputCls} value={values.notes} onChange={(e) => setValues({ ...values, notes: e.target.value })} maxLength={1000} placeholder="Delivery address, project timeline, etc." />
            </label>
            <button
              type="submit"
              className="border-2 border-foreground bg-accent px-6 py-4 font-display text-sm font-bold uppercase tracking-wider text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Submit Quote Request
            </button>
          </div>
        </form>
      </section>
    </SiteLayout>
  );
}
