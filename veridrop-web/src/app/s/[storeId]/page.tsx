import { LogoIcon } from "@/components/Logo";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const STORES: Record<string, { name: string; tagline: string; description: string }> = {
  "gadgethub-ng": {
    name: "GadgetHub NG",
    tagline: "Premium Electronics, Trusted Delivery",
    description: "Shop the latest smartphones, laptops, and accessories. Every order is inspection-protected by Veridrop.",
  },
};

const products = [
  { id: 1, name: "iPhone 15 Pro", price: "₦245,000", category: "Phones", image: "📱" },
  { id: 2, name: "MacBook Air M3", price: "₦520,000", category: "Laptops", image: "💻" },
  { id: 3, name: "Samsung Galaxy S25", price: "₦156,000", category: "Phones", image: "📱" },
  { id: 4, name: "Dell XPS 15", price: "₦312,000", category: "Laptops", image: "💻" },
  { id: 5, name: "iPad Pro 12.9", price: "₦189,000", category: "Tablets", image: "📋" },
  { id: 6, name: "AirPods Pro 2", price: "₦45,000", category: "Accessories", image: "🎧" },
];

export default function StorefrontPage({ params }: { params: { storeId: string } }) {
  const store = STORES[params.storeId] || {
    name: params.storeId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    tagline: "Verified Products, Secure Checkout",
    description: "Browse our catalog with confidence. Every purchase is backed by Veridrop's escrow and inspection guarantee.",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href={`/s/${params.storeId}`} className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight text-[#e8e8e8]">
              {store.name}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-[#555] bg-[#111] border border-[#1f1f1f] px-3 py-1 rounded-full">
              Verified by Veridrop ✓
            </span>
            <ThemeToggle />
            <Link
              href={`/s/${params.storeId}/cart`}
              className="rounded-md border border-[#333] px-4 py-1.5 text-xs text-[#aaa] transition-colors hover:border-[#0a54a6] hover:text-[#00bda6]"
            >
              Cart (0)
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#1a1a1a]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1f1f1f] bg-[#111] px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium tracking-[0.2em] text-[#555] uppercase">
                Veridrop Verified Store
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              {store.tagline}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#666] max-w-xl">
              {store.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="flex gap-2">
            <select className="text-xs bg-[#0d0d0d] border border-[#1f1f1f] rounded-md px-3 py-1.5 text-[#aaa] focus:outline-none focus:border-[#00bda6]">
              <option>All Categories</option>
              <option>Phones</option>
              <option>Laptops</option>
              <option>Tablets</option>
              <option>Accessories</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="group rounded-lg border border-[#1f1f1f] bg-[#111] p-5 transition-all hover:border-[#00bda6]/30 hover:shadow-[0_0_30px_-10px_rgba(13,143,143,0.15)]"
            >
              <div className="mb-4 flex h-32 items-center justify-center rounded-md bg-[#0d0d0d] text-5xl">
                {p.image}
              </div>
              <span className="text-[10px] font-medium tracking-[0.15em] text-[#0a54a6] uppercase">
                {p.category}
              </span>
              <h3 className="mt-1 text-sm font-semibold">{p.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-base font-bold text-[#00bda6]">{p.price}</span>
                <button className="rounded-md bg-gradient-to-r from-[#0a54a6] to-[#00bda6] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90">
                  Buy with Veridrop
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badge */}
      <section className="border-t border-[#1a1a1a] py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-3 rounded-lg border border-[#1f1f1f] bg-[#111] px-5 py-3">
            <LogoIcon size={32} className="shrink-0" />
            <div className="text-left">
              <div className="text-xs font-medium text-[#e8e8e8]">Protected by Veridrop</div>
              <div className="text-[10px] text-[#555]">Escrow · Inspection · Managed Logistics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-[10px] text-[#333]">
          &copy; {new Date().getFullYear()} {store.name}. Powered by Veridrop Trust Commerce Infrastructure.
        </div>
      </footer>
    </div>
  );
}
