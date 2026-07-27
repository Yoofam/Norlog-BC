import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Save, Send } from "lucide-react";
import { useStore, DEFAULT_SETTINGS, type SiteSettings } from "@/lib/store";
import { sendToAdmin } from "@/lib/notify";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const inputCls =
  "w-full border-2 border-foreground bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";
const labelCls = "font-display text-xs font-bold uppercase tracking-wider";

function Field({
  label,
  value,
  onChange,
  hint,
  textarea,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className={labelCls}>{label}</span>
      {textarea ? (
        <textarea rows={3} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={type} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className={labelCls}>{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer border-2 border-foreground bg-background p-1"
        />
        <input
          className={inputCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
        />
      </div>
    </label>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-2 border-foreground bg-card p-5">
      <h3 className="font-display text-lg font-black uppercase tracking-wider">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function SiteSettingsPanel() {
  const { settings, updateSettings, resetSettings, hydrated } = useStore();
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (hydrated) setDraft(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const set = (k: keyof SiteSettings) => (v: string) => setDraft((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(draft.notificationEmail.trim())) {
      toast.error("Enter a valid notification email.");
      return;
    }
    try {
      updateSettings(draft);
      toast.success("Site settings saved.");
    } catch {
      toast.error("Could not save — the uploaded images may be too large.");
    }
  };

  const sendTest = async () => {
    setTesting(true);
    const res = await sendToAdmin(draft.notificationEmail, "Norlog test notification", {
      Message: "This is a test from the Norlog admin portal. Form submissions will arrive here.",
    });
    setTesting(false);
    if (res.ok) toast.success("Test sent. Check the inbox (confirm the first email if asked).");
    else toast.error(res.error ?? "Could not send test email.");
  };

  return (
    <div className="grid gap-5">
      <div className="border-2 border-foreground bg-secondary p-4 text-sm">
        <div className="font-display text-xs font-bold uppercase tracking-wider">How emails work</div>
        <p className="mt-1 text-muted-foreground">
          Quote requests and service bookings are emailed to the notification address below.
          The very first message to a new address sends a one-time confirmation link to that
          inbox — click “Activate” once and all future submissions arrive automatically.
        </p>
      </div>

      <Group title="Notifications">
        <Field
          label="Notification email"
          type="email"
          value={draft.notificationEmail}
          onChange={set("notificationEmail")}
          hint="All contact / quote / booking submissions are sent here."
        />
        <div className="flex items-end">
          <button
            onClick={sendTest}
            disabled={testing}
            className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-4 py-2 font-display text-xs font-bold uppercase tracking-wider hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> {testing ? "Sending…" : "Send test email"}
          </button>
        </div>
      </Group>

      <Group title="Contact Information">
        <Field label="Phone" value={draft.phone} onChange={set("phone")} />
        <Field label="WhatsApp" value={draft.whatsapp} onChange={set("whatsapp")} />
        <Field label="Public email" type="email" value={draft.email} onChange={set("email")} />
        <Field label="Yard address" value={draft.address} onChange={set("address")} />
      </Group>

      <Group title="Header Branding">
        <div className="sm:col-span-2">
          <ImageUploadField
            label="Site logo"
            value={draft.logoUrl}
            onChange={(v) => setDraft((p) => ({ ...p, logoUrl: v }))}
            variant="logo"
          />
        </div>
        <Field
          label="Site name (header)"
          value={draft.siteName}
          onChange={set("siteName")}
          hint="Shown as text right beside the logo."
        />
        <Field label="Sub name" value={draft.subName} onChange={set("subName")} />
      </Group>

      <Group title="Header Colour Palette">
        <ColorField label="Header background" value={draft.headerBg} onChange={set("headerBg")} />
        <ColorField label="Header text" value={draft.headerFg} onChange={set("headerFg")} />
        <ColorField label="Header accent" value={draft.headerAccent} onChange={set("headerAccent")} />
        <div className="flex items-end">
          <div
            className="flex w-full items-center gap-3 border-2 border-foreground px-3 py-3"
            style={{ background: draft.headerBg, color: draft.headerFg }}
          >
            <span className="font-display text-sm font-black uppercase tracking-wider">
              {draft.siteName || "Preview"}
            </span>
            <span
              className="ml-auto px-2 py-1 font-display text-[10px] font-bold uppercase"
              style={{ background: draft.headerAccent, color: draft.headerBg }}
            >
              Quote
            </span>
          </div>
        </div>
      </Group>

      <Group title="Site Colour Palette">
        <ColorField label="Page background" value={draft.siteBg} onChange={set("siteBg")} />
        <ColorField label="Body text" value={draft.siteFg} onChange={set("siteFg")} />
        <ColorField label="Site accent" value={draft.siteAccent} onChange={set("siteAccent")} />
        <div className="flex items-end">
          <div
            className="flex w-full items-center gap-3 border-2 border-foreground px-3 py-3"
            style={{ background: draft.siteBg, color: draft.siteFg }}
          >
            <span className="text-sm">Body text preview</span>
            <span
              className="ml-auto px-2 py-1 font-display text-[10px] font-bold uppercase"
              style={{ background: draft.siteAccent, color: draft.siteBg }}
            >
              Accent
            </span>
          </div>
        </div>
      </Group>

      <Group title="Company Names">
        <Field label="Full company name" value={draft.companyName} onChange={set("companyName")} />
        <Field label="Short name (footer)" value={draft.shortName} onChange={set("shortName")} />
        <div className="sm:col-span-2">
          <Field label="Tagline" value={draft.tagline} onChange={set("tagline")} />
        </div>
      </Group>

      <Group title="Homepage Text">
        <Field label="Hero badge" value={draft.heroBadge} onChange={set("heroBadge")} />
        <Field label="Footer blurb" value={draft.footerBlurb} onChange={set("footerBlurb")} textarea />
        <div className="sm:col-span-2">
          <Field label="Hero intro paragraph" value={draft.heroIntro} onChange={set("heroIntro")} textarea />
        </div>
      </Group>

      <Group title="About Page Text">
        <div className="sm:col-span-2">
          <Field label="About headline" value={draft.aboutHeadline} onChange={set("aboutHeadline")} />
        </div>
        <div className="sm:col-span-2">
          <Field label="About paragraph" value={draft.aboutBody} onChange={set("aboutBody")} textarea />
        </div>
      </Group>

      <div className="flex flex-wrap justify-end gap-2">
        <button
          onClick={() => {
            resetSettings();
            setDraft(DEFAULT_SETTINGS);
            toast.success("Reset to defaults.");
          }}
          className="inline-flex items-center gap-2 border-2 border-foreground px-4 py-2 font-display text-xs font-bold uppercase tracking-wider"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
        <button
          onClick={save}
          className="inline-flex items-center gap-2 border-2 border-foreground bg-accent px-6 py-2 font-display text-xs font-bold uppercase tracking-wider text-accent-foreground"
        >
          <Save className="h-4 w-4" /> Save changes
        </button>
      </div>
    </div>
  );
}
