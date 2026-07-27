/**
 * Sends form submissions straight to the email address configured by the site
 * admin (Admin → Site Settings → Notification email).
 *
 * Uses FormSubmit (https://formsubmit.co) — a free, host-agnostic relay that
 * needs no server, no API key and no account. The FIRST message sent to a new
 * address triggers a one-time confirmation email to that address; once the
 * owner clicks "Activate", every later submission is delivered silently.
 */
export type NotifyResult = { ok: boolean; error?: string };

export async function sendToAdmin(
  toEmail: string,
  subject: string,
  fields: Record<string, string>,
): Promise<NotifyResult> {
  const email = toEmail.trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "No valid notification email configured." };
  }
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: subject, _template: "table", ...fields }),
    });
    if (!res.ok) return { ok: false, error: `Mail relay responded ${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

/** Fallback: opens the visitor's mail client pre-filled with the submission. */
export function mailtoFallback(toEmail: string, subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
