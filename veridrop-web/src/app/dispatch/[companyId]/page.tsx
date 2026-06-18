import { LogoIcon } from "@/components/Logo";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function DispatchPortalPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const companyName = companyId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="sticky top-0 z-50 border-b border-default bg-app/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              {companyName}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-text-muted bg-surface border border-default px-3 py-1 rounded-full">
              Veridrop Dispatch Partner
            </span>
            <ThemeToggle />
            <Link
              href={`/dispatch/${companyId}/dashboard`}
              className="rounded-md bg-gradient-to-r from-brand-blue to-brand-teal-light px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-default">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-default bg-surface px-4 py-1.5">
              <div className="h-5 w-5 rounded bg-gradient-to-br from-[#0a6b8a] to-brand-teal-light" />
              <span className="text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase">
                Dispatch Integration
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Deliver with{" "}
              <span className="bg-gradient-to-r from-brand-teal-light via-brand-blue to-brand-teal-light bg-clip-text text-transparent">
                Trust
              </span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-text-muted max-w-xl">
              {companyName} is integrated with Veridrop&apos;s trusted delivery network. Scan QR codes at every handoff,
              track packages in real-time, and get automated settlement.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href={`/dispatch/${companyId}/dashboard`}
                className="rounded-md bg-gradient-to-r from-brand-blue to-brand-teal-light px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Rider Dashboard
              </Link>
              <Link
                href={`/dispatch/${companyId}/onboard`}
                className="rounded-md border border-hover px-5 py-2 text-sm text-text-secondary transition-colors hover:border-[#555] hover:text-text-primary"
              >
                Onboard Riders
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: "📱", title: "QR Custody Chain", description: "Scan tamper-evident seals at pickup, transit handoffs, and delivery. Immutable chain of custody." },
            { icon: "📍", title: "GPS Tracking", description: "Real-time location tracking webhooks. Vendors and buyers see exactly where their package is." },
            { icon: "💰", title: "Automated Settlement", description: "No more COD reconciliation. Delivery fees are settled automatically on scan-confirmed delivery." },
          ].map((f) => (
            <div key={f.title} className="rounded-lg border border-default bg-surface p-6 transition-colors hover:border-hover">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-default py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-[10px] text-text-muted">
          &copy; {new Date().getFullYear()} {companyName} · Powered by Veridrop Trust Commerce Infrastructure
        </div>
      </footer>
    </div>
  );
}
