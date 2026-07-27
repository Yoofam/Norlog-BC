import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Trash2 } from "lucide-react";
import { processLogoImage, processProductImage } from "@/lib/image";

export function ImageUploadField({
  label,
  value,
  onChange,
  variant = "product",
  hint,
}: {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  variant?: "product" | "logo";
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    setBusy(true);
    try {
      const out =
        variant === "logo"
          ? await processLogoImage(file)
          : await processProductImage(file);
      onChange(out);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-1.5">
      <span className="font-display text-xs font-bold uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-start gap-3">
        <div
          className={`grid shrink-0 place-items-center overflow-hidden border-2 border-foreground ${
            variant === "logo" ? "h-16 w-16" : "h-16 w-24"
          } ${variant === "logo" ? "checker" : "bg-muted"}`}
        >
          {value ? (
            <img
              src={value}
              alt={`${label} preview`}
              className={`h-full w-full ${variant === "logo" ? "object-contain" : "object-cover"}`}
            />
          ) : (
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-3 py-2 font-display text-xs font-bold uppercase tracking-wider hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            <ImagePlus className="h-4 w-4" /> {busy ? "Processing…" : value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-2 border-2 border-foreground px-3 py-2 font-display text-xs font-bold uppercase tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      <span className="text-[11px] text-muted-foreground">
        {hint ??
          (variant === "logo"
            ? "Square 512×512 PNG. The background is removed automatically."
            : "Auto-resized to a fixed 1200×900 (4:3) crop that fits every device.")}
      </span>
    </div>
  );
}
