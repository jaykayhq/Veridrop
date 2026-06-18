import { LogoIcon } from "@/components/Logo";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function DispatchPortalPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const companyName = companyId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] font-sans">
      <nav className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight text-[#e8e8e8]">
              {companyName}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-[#555] bg-[#111] border border-[#1f1f1f] px-3 py-1 rounded-full">
              Veridrop Dispatch Partner
            </span>
            <ThemeToggle />
            <Link
              href={`/dispatch/${companyId}/dashboard`}
              className="rounded-md bg-gradient-to-r from-[#0a54a6] to-[#00bda6] px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-[#1a1a1a]">
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1f1f1f] bg-[#111] px-4 py-1.5">
              <div className="h-5 w-5 rounded bg-gradient-to-br from-[#0a6b8a] to-[#00bda6]" />
              <span className="text-[10px] font-medium tracking-[0.2em] text-[#555] uppercase">
                Dispatch Integration
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Deliver with{" "}
              <span className="bg-gradient-to-r from-[#00bda6] via-[#0a54a6] to-[#00bda6] bg-clip-text text-transparent">
                Trust
              </span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#666] max-w-xl">
              {companyName} is integrated with Veridrop&apos;s trusted delivery network. Scan QR codes at every handoff,
              track packages in real-time, and get automated settlement.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href={`/dispatch/${companyId}/dashboard`}
                className="rounded-md bg-gradient-to-r from-[#0a54a6] to-[#00bda6] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Rider Dashboard
              </Link>
              <Link
                href={`/dispatch/${companyId}/onboard`}
                className="rounded-md border border-[#333] px-5 py-2 text-sm text-[#aaa] transition-colors hover:border-[#555] hover:text-[#e8e8e8]"
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
            <div key={f.title} className="rounded-lg border border-[#1f1f1f] bg-[#111] p-6 transition-colors hover:border-[#2a2a2a]">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-[#e8e8e8]">{f.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#666]">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#1a1a1a] py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-[10px] text-[#333]">
          &copy; {new Date().getFullYear()} {companyName} · Powered by Veridrop Trust Commerce Infrastructure
        </div>
      </footer>
    </div>
  );
}
