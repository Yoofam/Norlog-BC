import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
  image?: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
};

export type QuoteRequest = {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; email: string; notes?: string };
  items: CartItem[];
  status: "new" | "contacted" | "closed";
};

export type ServiceBooking = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  preferredDate: string;
  location: string;
  details: string;
  status: "new" | "scheduled" | "done";
};

export type SiteSettings = {
  companyName: string;
  shortName: string;
  subName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  /** Where contact / quote / booking submissions are emailed. */
  notificationEmail: string;
  /** Uploaded logo (transparent PNG data URL). */
  logoUrl: string;
  /** Site name shown next to the logo in the header. */
  siteName: string;
  /** Header-only colour palette. */
  headerBg: string;
  headerFg: string;
  headerAccent: string;
  /** Palette for the rest of the site. */
  siteBg: string;
  siteFg: string;
  siteAccent: string;
  heroBadge: string;
  heroIntro: string;
  aboutHeadline: string;
  aboutBody: string;
  footerBlurb: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "NORLOG BUILDING CONCEPT",
  shortName: "NORLOG",
  subName: "Building Concept",
  tagline: "Building Stronger Foundations.",
  phone: "+234 803 000 0000",
  whatsapp: "+234 803 000 0000",
  email: "info@norlogbuilding.com",
  address: "Plot 14, Industrial Layout, Abuja, Nigeria",
  notificationEmail: "owner@norlogbuilding.com",
  logoUrl: "",
  siteName: "NORLOG",
  headerBg: "#15171b",
  headerFg: "#f6f6f4",
  headerAccent: "#f5851f",
  siteBg: "#fafaf7",
  siteFg: "#1a1c20",
  siteAccent: "#f5851f",
  heroBadge: "Est. Nigeria · Trusted by Contractors",
  heroIntro:
    "Building materials, heavy equipment sales and rentals, and full-service construction — delivered on time, priced right, and built to last.",
  aboutHeadline: "Built On Trust. Backed By Concrete.",
  aboutBody:
    "Norlog Building Concept is a Nigerian construction company serving contractors, developers and homeowners with reliable building materials, heavy equipment, and skilled construction crews. We keep projects moving — from the first ground break to the final finish.",
  footerBlurb:
    "Delivering trusted building materials, heavy equipment, and construction services across Nigeria.",
};


const DEFAULT_PRODUCTS: Product[] = [
  { id: "p1", name: "Dangote Cement", category: "Cement", price: 9500, unit: "per bag (50kg)", description: "Grade 42.5, factory sealed." },
  { id: "p2", name: "BUA Cement", category: "Cement", price: 9200, unit: "per bag (50kg)" },
  { id: "p3", name: "6-inch Solid Block", category: "Blocks", price: 550, unit: "per block" },
  { id: "p4", name: "9-inch Hollow Block", category: "Blocks", price: 650, unit: "per block" },
  { id: "p5", name: "Iron Rod 12mm", category: "Reinforcement", price: 8500, unit: "per length" },
  { id: "p6", name: "Iron Rod 16mm", category: "Reinforcement", price: 14200, unit: "per length" },
  { id: "p7", name: "Binding Wire", category: "Reinforcement", price: 1800, unit: "per kg" },
  { id: "p8", name: "Sharp Sand", category: "Aggregates", price: 85000, unit: "per trip (20 ton)" },
  { id: "p9", name: "Granite 3/4", category: "Aggregates", price: 240000, unit: "per trip (30 ton)" },
  { id: "p10", name: "Ceramic Floor Tile 60x60", category: "Tiles", price: 6800, unit: "per carton" },
  { id: "p11", name: "Excavator (CAT 320)", category: "Equipment Rental", price: 180000, unit: "per day" },
  { id: "p12", name: "Concrete Mixer", category: "Equipment Rental", price: 25000, unit: "per day" },
  { id: "p13", name: "Tipper Truck", category: "Equipment Rental", price: 90000, unit: "per day" },
  { id: "p14", name: "Roofing Sheet (Long Span)", category: "Roofing", price: 5400, unit: "per meter" },
];

const P_KEY = "norlog.products";
const Q_KEY = "norlog.quotes";
const B_KEY = "norlog.bookings";
const S_KEY = "norlog.settings";

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

type Ctx = {
  hydrated: boolean;
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  resetSettings: () => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (p: Product) => void;
  removeProduct: (id: string) => void;

  cart: CartItem[];
  addToCart: (p: Product, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  quotes: QuoteRequest[];
  submitQuote: (customer: QuoteRequest["customer"]) => QuoteRequest;
  updateQuoteStatus: (id: string, status: QuoteRequest["status"]) => void;
  removeQuote: (id: string) => void;

  bookings: ServiceBooking[];
  submitBooking: (b: Omit<ServiceBooking, "id" | "createdAt" | "status">) => ServiceBooking;
  updateBookingStatus: (id: string, status: ServiceBooking["status"]) => void;
  removeBooking: (id: string) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [products, setProductsState] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);

  useEffect(() => {
    setSettings({ ...DEFAULT_SETTINGS, ...readLS(S_KEY, {} as Partial<SiteSettings>) });
    setProductsState(readLS(P_KEY, DEFAULT_PRODUCTS));
    setCart(readLS("norlog.cart", [] as CartItem[]));
    setQuotes(readLS(Q_KEY, [] as QuoteRequest[]));
    setBookings(readLS(B_KEY, [] as ServiceBooking[]));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) writeLS(S_KEY, settings); }, [settings, hydrated]);
  useEffect(() => { if (hydrated) writeLS(P_KEY, products); }, [products, hydrated]);
  useEffect(() => { if (hydrated) writeLS("norlog.cart", cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) writeLS(Q_KEY, quotes); }, [quotes, hydrated]);
  useEffect(() => { if (hydrated) writeLS(B_KEY, bookings); }, [bookings, hydrated]);

  const value: Ctx = {
    hydrated,
    settings,
    updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
    resetSettings: () => setSettings(DEFAULT_SETTINGS),
    products,
    setProducts: setProductsState,
    addProduct: (p) =>
      setProductsState((prev) => [...prev, { ...p, id: "p" + Date.now() }]),
    updateProduct: (p) =>
      setProductsState((prev) => prev.map((x) => (x.id === p.id ? p : x))),
    removeProduct: (id) =>
      setProductsState((prev) => prev.filter((x) => x.id !== id)),

    cart,
    addToCart: (p, quantity = 1) =>
      setCart((prev) => {
        const found = prev.find((c) => c.productId === p.id);
        if (found) {
          return prev.map((c) =>
            c.productId === p.id ? { ...c, quantity: c.quantity + quantity } : c,
          );
        }
        return [
          ...prev,
          { productId: p.id, name: p.name, price: p.price, unit: p.unit, quantity },
        ];
      }),
    updateCartQty: (productId, quantity) =>
      setCart((prev) =>
        prev
          .map((c) => (c.productId === productId ? { ...c, quantity } : c))
          .filter((c) => c.quantity > 0),
      ),
    removeFromCart: (productId) =>
      setCart((prev) => prev.filter((c) => c.productId !== productId)),
    clearCart: () => setCart([]),

    quotes,
    submitQuote: (customer) => {
      const q: QuoteRequest = {
        id: "q" + Date.now(),
        createdAt: new Date().toISOString(),
        customer,
        items: cart,
        status: "new",
      };
      setQuotes((prev) => [q, ...prev]);
      setCart([]);
      return q;
    },
    updateQuoteStatus: (id, status) =>
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q))),
    removeQuote: (id) => setQuotes((prev) => prev.filter((q) => q.id !== id)),

    bookings,
    submitBooking: (b) => {
      const nb: ServiceBooking = {
        ...b,
        id: "b" + Date.now(),
        createdAt: new Date().toISOString(),
        status: "new",
      };
      setBookings((prev) => [nb, ...prev]);
      return nb;
    },
    updateBookingStatus: (id, status) =>
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b))),
    removeBooking: (id) => setBookings((prev) => prev.filter((b) => b.id !== id)),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
