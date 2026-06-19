import { LogoIcon } from "@/components/Logo";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createAdminClient, DATABASE_ID } from "@/lib/appwrite.server";
import { Query } from "node-appwrite";

export default async function StorefrontPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;
  const { databases } = createAdminClient();

  // Fetch store configuration based on the slug URL
  const storesReq = await databases.listDocuments(DATABASE_ID, "storefronts", [
    Query.equal("slug", storeId)
  ]);
  
  if (storesReq.total === 0) {
    return <div className="p-10 text-center">Store not found</div>;
  }
  
  const store = storesReq.documents[0];

  // Fetch products belonging to this vendor
  const productsReq = await databases.listDocuments(DATABASE_ID, "products", [
    Query.equal("vendorId", store.vendorId)
  ]);
  const products = productsReq.documents;

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-default bg-app/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href={`/s/${storeId}`} className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              {store.name}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-text-muted bg-surface border border-default px-3 py-1 rounded-full">
              Verified by Veridrop ✓
            </span>
            <ThemeToggle />
            <Link
              href={`/s/${storeId}/cart`}
              className="rounded-md border border-hover px-4 py-1.5 text-xs text-text-secondary transition-colors hover:border-brand-blue hover:text-brand-teal-light"
            >
              Cart (0)
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-default">
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-default bg-surface px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase">
                Veridrop Verified Store
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              {store.tagline}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-text-muted max-w-xl">
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
            <select className="text-xs bg-input border border-default rounded-md px-3 py-1.5 text-text-secondary focus:outline-none focus:border-brand-teal-light">
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
            <div key={p.$id} className="group rounded-lg border border-default bg-surface p-5 transition-all">
              <span className="text-[10px] font-medium tracking-[0.15em] text-brand-blue uppercase">
                {p.category}
              </span>
              <h3 className="mt-1 text-sm font-semibold">{p.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-base font-bold text-brand-teal-light">₦{p.price}</span>
                <button className="rounded-md bg-gradient-to-r from-brand-blue to-brand-teal-light px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90">
                  Buy with Veridrop
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badge */}
      <section className="border-t border-default py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-3 rounded-lg border border-default bg-surface px-5 py-3">
            <LogoIcon size={32} className="shrink-0" />
            <div className="text-left">
              <div className="text-xs font-medium text-text-primary">Protected by Veridrop</div>
              <div className="text-[10px] text-text-muted">Escrow · Inspection · Managed Logistics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-default py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-[10px] text-text-muted">
          &copy; {new Date().getFullYear()} {store.name}. Powered by Veridrop Trust Commerce Infrastructure.
        </div>
      </footer>
    </div>
  );
}
