/** Client-side image processing helpers (canvas based, no backend needed). */

/** Fixed product image spec — one size that looks right on every device. */
export const PRODUCT_IMAGE_SPEC = { width: 1200, height: 900, quality: 0.82 };
/** Fixed logo spec — square, transparent PNG. */
export const LOGO_IMAGE_SPEC = { size: 512 };

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("That file is not a valid image."));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/** Crop-to-fill into the fixed product spec and return a JPEG data URL. */
export async function processProductImage(file: File): Promise<string> {
  const img = await loadImage(file);
  const { width, height, quality } = PRODUCT_IMAGE_SPEC;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const scale = Math.max(width / img.width, height / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

/**
 * Fit into a square, strip near-white/flat backgrounds to transparency and
 * return a PNG data URL — so uploaded logos sit cleanly on any header colour.
 */
export async function processLogoImage(file: File): Promise<string> {
  const img = await loadImage(file);
  const size = LOGO_IMAGE_SPEC.size;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const scale = Math.min(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

  try {
    const data = ctx.getImageData(0, 0, size, size);
    const d = data.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      // near-white and low saturation => treat as background
      if (min > 232 && max - min < 18) {
        d[i + 3] = 0;
      } else if (min > 208 && max - min < 22) {
        d[i + 3] = Math.round(d[i + 3] * ((232 - min) / 24));
      }
    }
    ctx.putImageData(data, 0, 0);
  } catch {
    // cross-origin / tainted canvas — keep the untouched render
  }
  return canvas.toDataURL("image/png");
}
