import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo, LogoIcon } from "@/components/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] font-sans flex flex-col relative">
      {/* Mesh bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 50% 100%, #00bda60d 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 20% 50%, #0a54a60a 0%, transparent 50%)
          `,
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-[#1a1a1a]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Logo href="/" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs text-[#666] transition-colors hover:text-[#e8e8e8]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Card */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-xl border border-[#1a1a1a] bg-[#111]/80 backdrop-blur-sm p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#1f1f1f] bg-[#0a0a0a]">
                <LogoIcon size={36} />
              </div>
              <h1 className="text-lg font-semibold">Welcome back</h1>
              <p className="mt-1 text-xs text-[#666]">Sign in to your Veridrop account</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-[#555] uppercase tracking-[0.1em]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-[#555] uppercase tracking-[0.1em]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input"
                />
              </div>
              <button className="btn-primary w-full justify-center">
                Sign In
              </button>
            </div>

            <div className="mt-6 border-t border-[#1a1a1a] pt-6">
              <p className="text-center text-[10px] font-medium text-[#555] uppercase tracking-[0.1em]">
                Demo access
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/vendor"
                  className="rounded-lg border border-[#1f1f1f] bg-[#0d0d0d] px-3 py-2 text-center text-xs text-[#888] transition-colors hover:border-[#333] hover:text-[#e8e8e8]"
                >
                  Vendor Demo
                </Link>
                <Link
                  href="/admin"
                  className="rounded-lg border border-[#1f1f1f] bg-[#0d0d0d] px-3 py-2 text-center text-xs text-[#888] transition-colors hover:border-[#333] hover:text-[#e8e8e8]"
                >
                  Admin Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
