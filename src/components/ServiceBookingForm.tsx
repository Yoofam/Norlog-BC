import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { sendToAdmin } from "@/lib/notify";

const SERVICES = [
  "Site Clearing & Excavation",
  "Foundation Work",
  "Concrete & Slab Casting",
  "Block Work / Masonry",
  "Equipment Rental with Operator",
  "Site Supervision & Consultation",
  "Other",
];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  email: z.string().trim().email("Enter a valid email").max(255),
  serviceType: z.string().min(1),
  preferredDate: z.string().min(1, "Pick a preferred date"),
  location: z.string().trim().min(2, "Site location required").max(200),
  details: z.string().trim().max(1000).optional().default(""),
});

export function ServiceBookingForm() {
  const { submitBooking, settings } = useStore();
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: SERVICES[0],
    preferredDate: "",
    location: "",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof typeof values, v: string) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const b = submitBooking(parsed.data);
    toast.success("Booking submitted — we'll be in touch shortly.");
    const res = await sendToAdmin(settings.notificationEmail, `New service booking ${b.id}`, {
      Reference: b.id,
      Name: parsed.data.name,
      Phone: parsed.data.phone,
      Email: parsed.data.email,
      Service: parsed.data.serviceType,
      "Preferred date": parsed.data.preferredDate,
      Location: parsed.data.location,
      Details: parsed.data.details || "-",
    });
    if (!res.ok) console.warn("[booking] email relay failed:", res.error);
    setValues({
      name: "",
      phone: "",
      email: "",
      serviceType: SERVICES[0],
      preferredDate: "",
      location: "",
      details: "",
    });
    setSubmitting(false);
  };

  const inputCls =
    "w-full border-2 border-foreground bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent";
  const labelCls =
    "font-display text-xs font-bold uppercase tracking-wider text-foreground";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 border-2 border-foreground bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className={labelCls}>Full Name</span>
          <input className={inputCls} value={values.name} onChange={(e) => update("name", e.target.value)} maxLength={100} required />
        </label>
        <label className="grid gap-1.5">
          <span className={labelCls}>Phone / WhatsApp</span>
          <input className={inputCls} value={values.phone} onChange={(e) => update("phone", e.target.value)} maxLength={20} required />
        </label>
        <label className="grid gap-1.5 sm:col-span-2">
          <span className={labelCls}>Email</span>
          <input type="email" className={inputCls} value={values.email} onChange={(e) => update("email", e.target.value)} maxLength={255} required />
        </label>
        <label className="grid gap-1.5">
          <span className={labelCls}>Service Type</span>
          <select className={inputCls} value={values.serviceType} onChange={(e) => update("serviceType", e.target.value)}>
            {SERVICES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className={labelCls}>Preferred Date</span>
          <input type="date" className={inputCls} value={values.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} required />
        </label>
        <label className="grid gap-1.5 sm:col-span-2">
          <span className={labelCls}>Site Location</span>
          <input className={inputCls} value={values.location} onChange={(e) => update("location", e.target.value)} maxLength={200} placeholder="Street, area, LGA, state" required />
        </label>
        <label className="grid gap-1.5 sm:col-span-2">
          <span className={labelCls}>Project Details</span>
          <textarea rows={4} className={inputCls} value={values.details} onChange={(e) => update("details", e.target.value)} maxLength={1000} placeholder="Scope, size, timeline, budget range..." />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="border-2 border-foreground bg-accent px-6 py-4 font-display text-sm font-bold uppercase tracking-wider text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Request Booking"}
      </button>
    </form>
  );
}
