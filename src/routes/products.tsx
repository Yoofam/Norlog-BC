import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useStore, type Product } from "@/lib/store";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Materials & Equipment — Norlog Building Concept" },
      { name: "description", content: "Browse building materials and heavy equipment: cement, blocks, iron rods, sand, granite, excavators, mixers and more. Prices in Naira." },
      { property: "og:title", content: "Materials & Equipment — Norlog" },
      { property: "og:description", content: "Cement, blocks, rods, aggregates and heavy equipment rentals." },
    ],
  }),
  component: Products,
});

function Products() {
  const { products, addToCart } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inCat = category === "All" || p.category === category;
      const inQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return inCat && inQ;
    });
  }, [products, query, category]);

  const handleAdd = (p: Product) => {
    addToCart(p, 1);
    toast.success(`${p.name} added to quote`);
  };

  return (
    <SiteLayout>
      <section className="border-b-2 border-foreground bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Catalog
          </div>
          <h1 className="mt-2 font-display text-4xl font-black md:text-6xl">
            Materials & Equipment
          </h1>
          <p className="mt-3 max-w-xl text-background/70">
            All prices in Naira. Add items to your quote list and we'll come back with
            confirmed availability and delivery cost.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cement, rods, excavator..."
              className="w-full border-2 border-foreground bg-background py-3 pl-10 pr-3 font-display text-sm uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`border-2 border-foreground px-3 py-2 font-display text-xs font-bold uppercase tracking-wider transition-colors ${
                  category === c
                    ? "bg-accent text-accent-foreground"
                    : "bg-background hover:bg-foreground hover:text-background"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="border-2 border-dashed border-foreground p-12 text-center text-muted-foreground">
            No products match your search.
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
