/* eslint-disable */
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo, LogoIcon, VeridropLogoFull } from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="landing-dark min-h-screen bg-app text-text-primary font-sans">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 border-b border-default bg-app/60 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-6 py-4 md:px-10 lg:px-16">
          <Logo href="/" />
          <div className="flex items-center gap-4">
            <a
              href="#features"
              className="text-xs text-text-muted transition-colors hover:text-text-primary"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-xs text-text-muted transition-colors hover:text-text-primary"
            >
              How It Works
            </a>
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-md border border-hover px-4 py-1.5 text-xs text-text-secondary transition-colors hover:border-brand-teal hover:text-brand-teal-light"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-primary group !px-4 !py-1.5 !text-xs !h-auto"
            >
              Get Started
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-default">
        {/* Hero mesh gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% -20%, #00bda61a 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 80% 100%, #0a54a61a 0%, transparent 60%),
              radial-gradient(ellipse 40% 30% at 20% 80%, #c8a8620d 0%, transparent 50%)
            `,
          }}
        />
        {/* Grid pattern overlay */}
        <div className="grid-pattern pointer-events-none absolute inset-0 opacity-[0.03]" />
        {/* Dot mesh */}
        <div className="mesh-pattern pointer-events-none absolute inset-0 opacity-[0.15]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Trust Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-default bg-surface px-4 py-1.5 animate-fade-in">
              <LogoIcon size={16} />
              <span className="text-[10px] font-medium tracking-[0.2em] text-text-muted">
                TRUST COMMERCE INFRASTRUCTURE
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl animate-fade-in-up">
              Trust Commerce
              <br />
              <span className="text-gradient-brand">
                Infrastructure
              </span>
            </h1>

            <p className="mt-5 text-sm leading-relaxed text-text-muted md:text-base text-pretty max-w-2xl mx-auto animate-fade-in-up">
              Escrow-protected payments, physical inspection at source, and
              managed logistics — the trust layer for verified commerce across
              Africa.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex items-center justify-center gap-3 animate-fade-in-up">
              <Link
                href="/login"
                className="btn-primary group"
              >
                Get Started
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#features"
                className="btn-secondary text-sm"
              >
                Learn More
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="mt-16 grid grid-cols-3 gap-3 md:mx-auto md:max-w-lg animate-fade-in-up">
              {[
                { value: "$2.5M+", label: "Escrow Volume" },
                { value: "5K+", label: "Transactions" },
                { value: "1K+", label: "Vendors" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="group rounded-lg border border-default bg-surface/80 px-4 py-4 text-center transition-all hover:border-brand-teal-light/20 hover:bg-surface-hover"
                  style={{ animationDelay: `${i * 100 + 400}ms` }}
                >
                  <div className="stat-value text-gradient-brand">{stat.value}</div>
                  <div className="mt-1 text-[10px] font-medium tracking-[0.05em] text-text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="border-b border-default py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="trust-badge">Platform Capabilities</span>
            <h2 className="mt-4 text-2xl font-bold md:text-3xl text-balance">
              Everything you need for{" "}
              <span className="text-gradient-brand">trusted commerce</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted text-pretty">
              From capital commitment to final settlement — every step is
              verified, insured, and traceable.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 stagger">
            {/* Escrow */}
            <FeatureCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
              title="Escrow Protection"
              subtitle="Capital Commit & Dispatch"
              description="Buyers commit funds to Veridrop's escrow at order placement. Funds are held securely until inspection passes and delivery is confirmed — eliminating counterparty risk for both parties."
              metrics={["Funds held in trust", "Conditional release", "Dispute arbitration"]}
              accent="#00bda6"
            />

            {/* Inspection */}
            <FeatureCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
              title="Physical Inspection"
              subtitle="Source Inspection & Verification"
              description="Every product is physically inspected at source by Veridrop's verified inspector network before shipment. Quality, quantity, and condition are documented with photo evidence."
              metrics={["1K+ trained inspectors", "Photo documentation", "Digital inspection reports"]}
              accent="#0a54a6"
            />

            {/* Unique Links */}
            <FeatureCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              }
              title="Unique Transaction Links"
              subtitle="Per-Transaction Portals"
              description="Each transaction generates a unique, encrypted link — a private portal where buyers track inspection progress, view evidence, and authorize release. Share once, trust every time."
              metrics={["End-to-end encrypted", "Real-time status", "Secure document sharing"]}
              accent="#c8a862"
            />

            {/* Logistics */}
            <FeatureCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              }
              title="Managed Logistics"
              subtitle="Settlement & Delivery"
              description="Coordinated pickup, trackable shipping, and automated settlement. Funds release only after buyer confirms receipt — bridging the last mile of trust."
              metrics={["Multi-carrier network", "Real-time tracking", "Automated settlement"]}
              accent="#0a54a6"
            />
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="border-b border-default py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="trust-badge">Workflow</span>
            <h2 className="mt-4 text-2xl font-bold md:text-3xl">
              How Veridrop works
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted text-pretty">
              Three steps from commitment to delivery. Every milestone verified, every handoff tracked.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3 stagger">
            {[
              {
                step: "01",
                title: "Capital Commit",
                description:
                  "Buyer commits funds to Veridrop escrow. Seller gets a verified commitment notification and proceeds with fulfillment, knowing payment is secured.",
                accent: "#0a54a6",
              },
              {
                step: "02",
                title: "Inspect & Verify",
                description:
                  "Veridrop dispatches a trained inspector to the source location. Product is inspected, photographed, and a digital report is shared via the unique transaction link.",
                accent: "#00bda6",
              },
              {
                step: "03",
                title: "Settle & Deliver",
                description:
                  "Buyer reviews inspection evidence through their secure link, authorizes release. Funds settle to seller. Logistics coordinates pickup and final delivery.",
                accent: "#0a54a6",
              },
            ].map((step) => (
              <div
                key={step.step}
                className="card group p-6"
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${step.accent}22, ${step.accent}11)`,
                    color: step.accent,
                    border: `1px solid ${step.accent}33`,
                  }}
                >
                  {step.step}
                </div>
                <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
                <p className="text-xs leading-relaxed text-text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Unique Links Deep Dive ─── */}
      <section className="border-b border-default py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="trust-badge">Feature Deep Dive</span>
              <h2 className="mt-4 text-2xl font-bold md:text-3xl text-balance">
                Every transaction gets its{" "}
                <span className="text-gradient-brand">own secure world</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                No more digging through email threads. Each Veridrop transaction
                generates a unique, encrypted link — a private portal where
                buyers and vendors see exactly what matters for that deal.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Real-time inspection photo feeds",
                  "Digital evidence vault per transaction",
                  "One-click approve or dispute",
                  "End-to-end encrypted communication",
                  "Auto-expires after settlement",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00bda6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Terminal-style mockup */}
            <div className="card p-5 font-mono text-[11px]">
              <div className="mb-3 flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#555]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#555]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#555]" />
                <span className="ml-2 text-[10px] text-[#444] font-sans">
                  transaction-9f8a3b.veridrop.app
                </span>
              </div>
              <div className="space-y-1.5 leading-relaxed">
                <div className="animate-fade-in">
                  <span className="text-brand-teal-light">$ </span>
                  <span className="text-text-secondary">inspect</span>
                  <span className="text-[#555]"> --transaction tx_9f8a3b</span>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <span className="text-text-muted">{">"} Scanning inspection report...</span>
                </div>
                <div className="text-brand-teal-light animate-fade-in" style={{ animationDelay: "400ms" }}>
                  {"\u2713"} Status:{" "}
                  <span className="text-brand-gold">INSPECTION_PASSED</span>
                </div>
                <div className="text-text-muted animate-fade-in" style={{ animationDelay: "600ms" }}>
                  {"\u2713"} Items verified:{" "}
                  <span className="text-text-primary">12/12</span>
                </div>
                <div className="text-text-muted animate-fade-in" style={{ animationDelay: "800ms" }}>
                  {"\u2713"} Photos uploaded:{" "}
                  <span className="text-text-primary">8</span>
                </div>
                <div className="mt-2 border-t border-default pt-2 animate-fade-in" style={{ animationDelay: "1000ms" }}>
                  <span className="text-brand-teal-light">$ </span>
                  <span className="text-text-secondary">approve</span>
                  <span className="text-[#555]">
                    {" "}
                    --reason "quality confirmed"
                  </span>
                </div>
                <div className="text-brand-gold animate-fade-in" style={{ animationDelay: "1200ms" }}>
                  {"\u2192"} Funds released to seller
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Signals Section ─── */}
      <section className="border-b border-default py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="trust-badge">Trust Infrastructure</span>
            <h2 className="mt-4 text-2xl font-bold md:text-3xl text-balance">
              Built for{" "}
              <span className="text-gradient-gold">verification</span>,
              designed for trust
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Every layer of Veridrop is engineered to eliminate the trust gap in digital commerce.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00bda6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                label: "Escrow Protected",
                desc: "Funds held in trust until conditions met",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00bda6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
                label: "Physically Inspected",
                desc: "On-site verification by trained inspectors",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00bda6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  </svg>
                ),
                label: "Managed Logistics",
                desc: "End-to-end delivery chain of custody",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8a862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M12 2a10 10 0 1 0 10 10h-10V2z" />
                  </svg>
                ),
                label: "Chain Verified",
                desc: "QR-sealed custody at every handoff",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="card p-5 text-center group"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-default bg-app transition-colors group-hover:border-brand-teal-light/30">
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-text-primary">{item.label}</div>
                <div className="mt-1 text-[10px] leading-relaxed text-text-muted">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Compliance badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {["PCI DSS Compliant", "SOC 2 Type II", "GDPR Ready", "ISO 27001 Aligned"].map(
              (badge) => (
                <div
                  key={badge}
                  className="text-[10px] font-medium tracking-[0.1em] text-[#444] flex items-center gap-1.5"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="#444">
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  {badge}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-b border-default py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-default bg-surface"
            >
              <LogoIcon size={40} />
            </div>
            <h2 className="text-2xl font-bold md:text-3xl text-balance">
              Ready to build{" "}
              <span className="text-gradient-brand">trusted commerce</span>?
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              Get started with Veridrop today and secure your commerce workflow.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="btn-primary"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="btn-secondary text-sm"
              >
                View Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 border-b border-default pb-8 md:flex-row">
            <Logo href="/" />
            <div className="flex items-center gap-6 text-xs text-text-muted">
              <Link href="/login" className="transition-colors hover:text-text-primary">
                Sign In
              </Link>
              <span className="text-[#333]">|</span>
              <a href="#features" className="transition-colors hover:text-text-primary">
                Features
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-[10px] text-[#333]">
            &copy; {new Date().getFullYear()} Veridrop. Trust Commerce
            Infrastructure.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Feature Card Component ─── */
function FeatureCard({
  icon,
  title,
  subtitle,
  description,
  metrics,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  metrics: string[];
  accent: string;
}) {
  return (
    <div className="card group p-6">
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-md transition-colors"
          style={{
            color: accent,
            border: `1px solid ${accent}33`,
            background: `${accent}11`,
          }}
        >
          {icon}
        </div>
        <span
          className="text-[10px] font-medium tracking-[0.15em]"
          style={{ color: accent }}
        >
          {subtitle}
        </span>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-text-muted">{description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {metrics.map((m) => (
          <span
            key={m}
            className="rounded-md border border-default bg-app px-2.5 py-1 text-[10px] text-text-muted"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

