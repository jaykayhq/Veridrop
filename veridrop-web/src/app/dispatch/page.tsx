import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function DispatchLandingPage() {
  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-default bg-app/60 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-6 py-4 md:px-10 lg:px-16">
          <Logo href="/" />
          <Link
            href="/login"
            className="rounded-md border border-default px-4 py-1.5 text-xs text-text-secondary transition-colors hover:border-brand-teal hover:text-brand-teal-light"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">
          Dispatch Partner Portal
        </h1>
        <p className="mt-4 text-sm text-text-muted max-w-xl mx-auto">
          Connect your delivery fleet to Veridrop&apos;s trust commerce network. 
          Manage riders, track deliveries, and grow your business.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="btn-primary"
          >
            Get Started
          </Link>
          <a
            href="#how-it-works"
            className="btn-secondary text-sm"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-default py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold">How It Works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Register Your Company", description: "Create your dispatch company profile. Provide your business details and coverage areas." },
              { step: "02", title: "Add Your Riders", description: "Register your delivery riders with names and phone numbers. Each rider gets tracked through the system." },
              { step: "03", title: "Start Receiving Orders", description: "Once connected, orders are automatically dispatched to available riders with QR-based handoff tracking." },
            ].map((s) => (
              <div key={s.step} className="card p-6 text-center">
                <span className="text-brand-teal-light text-2xl font-bold">{s.step}</span>
                <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-xs text-text-muted">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-default py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold">Why Partner With Veridrop?</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Real-Time Tracking", desc: "GPS-enabled rider tracking for every delivery" },
              { title: "QR Handoff", desc: "Tamper-evident QR seals scanned at every handoff" },
              { title: "Automated Settlement", desc: "Fast, transparent payment settlement" },
              { title: "Growth Platform", desc: "Access to Veridrop&apos;s growing merchant network" },
            ].map((f) => (
              <div key={f.title} className="card p-5 text-center">
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-2 text-xs text-text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-default py-8 text-center text-xs text-text-muted">
        &copy; {new Date().getFullYear()} Veridrop. Trust Commerce Infrastructure.
      </footer>
    </div>
  );
}
