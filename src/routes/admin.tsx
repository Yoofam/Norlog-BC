import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, LogOut, Trash2, Plus, X } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useStore, type Product } from "@/lib/store";
import { ADMIN_PIN, formatNaira } from "@/lib/constants";
import { SiteSettingsPanel } from "@/components/admin/SiteSettingsPanel";
import { ImageUploadField } from "@/components/admin/ImageUploadField";


export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Norlog" },
      { name: "description", content: "Internal admin area." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [tab, setTab] = useState<"quotes" | "bookings" | "products" | "site">("quotes");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("norlog.admin") === "1") setUnlocked(true);
  }, []);

  const tryUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setUnlocked(true);
      window.sessionStorage.setItem("norlog.admin", "1");
      toast.success("Welcome back.");
    } else {
      toast.error("Incorrect PIN");
      setPin("");
    }
  };

  const lock = () => {
    setUnlocked(false);
    setPin("");
    window.sessionStorage.removeItem("norlog.admin");
  };

  if (!unlocked) {
    return (
      <SiteLayout>
        <section className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 py-16">
          <form onSubmit={tryUnlock} className="w-full border-2 border-foreground bg-card p-6">
            <div className="mb-4 grid h-14 w-14 place-items-center border-2 border-foreground bg-accent">
              <Lock className="h-7 w-7 text-accent-foreground" />
            </div>
            <h1 className="font-display text-2xl font-black uppercase tracking-wider">Admin Access</h1>
            <p className="mt-1 text-xs text-muted-foreground">Enter the 4-digit PIN.</p>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              autoFocus
              className="mt-4 w-full border-2 border-foreground bg-background px-3 py-4 text-center font-display text-2xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="••••"
            />
            <button type="submit" className="mt-4 w-full border-2 border-foreground bg-foreground px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-background hover:bg-accent hover:text-accent-foreground">
              Unlock
            </button>
          </form>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="border-b-2 border-foreground bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8">
          <div>
            <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">Admin</div>
            <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Control Room</h1>
          </div>
          <button onClick={lock} className="inline-flex items-center gap-2 border-2 border-background bg-transparent px-4 py-2 font-display text-xs font-bold uppercase tracking-wider hover:bg-background hover:text-foreground">
            <LogOut className="h-4 w-4" /> Lock
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {(["quotes", "bookings", "products", "site"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-2 border-foreground px-4 py-2 font-display text-xs font-bold uppercase tracking-wider ${
                tab === t ? "bg-accent text-accent-foreground" : "bg-background hover:bg-foreground hover:text-background"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "quotes" && <QuotesPanel />}
          {tab === "bookings" && <BookingsPanel />}
          {tab === "products" && <ProductsPanel />}
          {tab === "site" && <SiteSettingsPanel />}
        </div>
      </section>
    </SiteLayout>
  );
}

function QuotesPanel() {
  const { quotes, updateQuoteStatus, removeQuote } = useStore();
  if (quotes.length === 0)
    return <EmptyState label="No quote requests yet." />;
  return (
    <ul className="grid gap-4">
      {quotes.map((q) => {
        const total = q.items.reduce((a, c) => a + c.price * c.quantity, 0);
        return (
          <li key={q.id} className="border-2 border-foreground bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display text-lg font-bold uppercase tracking-wider">{q.customer.name}</div>
                <div className="text-xs text-muted-foreground">{q.customer.phone} · {q.customer.email}</div>
                <div className="mt-1 text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={q.status}
                  onChange={(e) => updateQuoteStatus(q.id, e.target.value as typeof q.status)}
                  className="border-2 border-foreground bg-background px-2 py-1 font-display text-xs font-bold uppercase tracking-wider"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
                <button onClick={() => removeQuote(q.id)} className="grid h-8 w-8 place-items-center border-2 border-foreground text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {q.customer.notes && (
              <p className="mt-3 border-l-4 border-accent bg-muted p-3 text-sm">{q.customer.notes}</p>
            )}
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {q.items.map((it) => (
                <li key={it.productId} className="flex items-center justify-between py-2 text-sm">
                  <div>{it.name} <span className="text-muted-foreground">× {it.quantity} ({it.unit})</span></div>
                  <div className="font-display font-bold">{formatNaira(it.price * it.quantity)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-end font-display text-lg font-black">
              Total: {formatNaira(total)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function BookingsPanel() {
  const { bookings, updateBookingStatus, removeBooking } = useStore();
  if (bookings.length === 0) return <EmptyState label="No service bookings yet." />;
  return (
    <ul className="grid gap-4">
      {bookings.map((b) => (
        <li key={b.id} className="border-2 border-foreground bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-display text-lg font-bold uppercase tracking-wider">{b.name}</div>
              <div className="text-xs text-muted-foreground">{b.phone} · {b.email}</div>
              <div className="mt-1 text-xs text-muted-foreground">Booked {new Date(b.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={b.status}
                onChange={(e) => updateBookingStatus(b.id, e.target.value as typeof b.status)}
                className="border-2 border-foreground bg-background px-2 py-1 font-display text-xs font-bold uppercase tracking-wider"
              >
                <option value="new">New</option>
                <option value="scheduled">Scheduled</option>
                <option value="done">Done</option>
              </select>
              <button onClick={() => removeBooking(b.id)} className="grid h-8 w-8 place-items-center border-2 border-foreground text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-3 grid gap-1 text-sm">
            <div><span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">Service:</span> {b.serviceType}</div>
            <div><span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">Date:</span> {b.preferredDate}</div>
            <div><span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">Location:</span> {b.location}</div>
            {b.details && <p className="mt-1 border-l-4 border-accent bg-muted p-3 text-sm">{b.details}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ProductsPanel() {
  const { products, addProduct, updateProduct, removeProduct } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 border-2 border-foreground bg-accent px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-accent-foreground"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>
      <div className="overflow-x-auto border-2 border-foreground">
        <table className="w-full text-sm">
          <thead className="bg-foreground text-background">
            <tr className="text-left font-display text-xs uppercase tracking-wider">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Unit</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-10 w-14 border border-foreground object-cover" />
                  ) : (
                    <div className="grid h-10 w-14 place-items-center border border-dashed border-foreground text-[10px] text-muted-foreground">none</div>
                  )}
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{formatNaira(p.price)}</td>
                <td className="p-3 text-muted-foreground">{p.unit}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(p)} className="border-2 border-foreground px-2 py-1 font-display text-[10px] font-bold uppercase tracking-wider hover:bg-foreground hover:text-background">
                      Edit
                    </button>
                    <button onClick={() => removeProduct(p.id)} className="grid h-7 w-7 place-items-center border-2 border-foreground text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <ProductEditor
          initial={editing ?? undefined}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(p) => {
            if (editing) updateProduct({ ...editing, ...p });
            else addProduct(p);
            setEditing(null);
            setCreating(false);
            toast.success("Saved");
          }}
        />
      )}
    </div>
  );
}

function ProductEditor({
  initial,
  onSave,
  onClose,
}: {
  initial?: Product;
  onSave: (p: Omit<Product, "id">) => void;
  onClose: () => void;
}) {
  const [v, setV] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? "",
    price: initial?.price ?? 0,
    unit: initial?.unit ?? "",
    description: initial?.description ?? "",
    image: initial?.image ?? "",
  });
  const inputCls = "w-full border-2 border-foreground bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";
  const labelCls = "font-display text-xs font-bold uppercase tracking-wider";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/70 p-4">
      <div className="w-full max-w-lg border-2 border-foreground bg-background p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-black uppercase tracking-wider">
            {initial ? "Edit product" : "New product"}
          </h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center border-2 border-foreground hover:bg-foreground hover:text-background">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-1"><span className={labelCls}>Name</span>
            <input className={inputCls} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></label>
          <label className="grid gap-1"><span className={labelCls}>Category</span>
            <input className={inputCls} value={v.category} onChange={(e) => setV({ ...v, category: e.target.value })} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1"><span className={labelCls}>Price (₦)</span>
              <input type="number" className={inputCls} value={v.price} onChange={(e) => setV({ ...v, price: Number(e.target.value) })} /></label>
            <label className="grid gap-1"><span className={labelCls}>Unit</span>
              <input className={inputCls} value={v.unit} onChange={(e) => setV({ ...v, unit: e.target.value })} placeholder="per bag / per day" /></label>
          </div>
          <ImageUploadField
            label="Product image"
            value={v.image}
            onChange={(image) => setV({ ...v, image })}
          />

          <label className="grid gap-1"><span className={labelCls}>Description</span>
            <textarea rows={3} className={inputCls} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} /></label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="border-2 border-foreground px-4 py-2 font-display text-xs font-bold uppercase tracking-wider">Cancel</button>
          <button
            onClick={() => {
              if (!v.name || !v.category || !v.unit || v.price < 0) {
                toast.error("Fill in name, category, unit and a non-negative price.");
                return;
              }
              onSave(v);
            }}
            className="border-2 border-foreground bg-accent px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-accent-foreground"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="border-2 border-dashed border-foreground p-12 text-center text-muted-foreground">
      {label}
    </div>
  );
}
