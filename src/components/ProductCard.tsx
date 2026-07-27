import { Package, Plus } from "lucide-react";
import type { Product } from "@/lib/store";
import { formatNaira } from "@/lib/constants";

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  return (
    <div className="group flex flex-col border-2 border-foreground bg-card transition-shadow hover:shadow-[6px_6px_0_0_var(--color-accent)]">
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-foreground steel-plate">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-background/40">
            <Package className="h-16 w-16" />
          </div>
        )}
        <div className="absolute left-0 top-0 bg-accent px-2 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
          {product.category}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg font-bold leading-tight">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-muted-foreground">{product.description}</p>
        )}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline justify-between">
            <div className="font-display text-2xl font-black text-foreground">
              {formatNaira(product.price)}
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {product.unit}
            </div>
          </div>
          <button
            onClick={() => onAdd(product)}
            className="mt-3 flex w-full items-center justify-center gap-2 border-2 border-foreground bg-foreground px-3 py-2 font-display text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="h-4 w-4" /> Add to Quote
          </button>
        </div>
      </div>
    </div>
  );
}
