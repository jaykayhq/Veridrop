/* eslint-disable */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo, LogoIcon } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("VENDOR");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (role === "VENDOR") {
        router.push("/vendor");
      } else if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans flex flex-col relative">
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
      <nav className="relative z-10 border-b border-default">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Logo href="/" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs text-text-muted transition-colors hover:text-text-primary"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Card */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-xl border border-default bg-surface/80 backdrop-blur-sm p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-default bg-app">
                <LogoIcon size={36} />
              </div>
              <h1 className="text-lg font-semibold">Welcome back</h1>
              <p className="mt-1 text-xs text-text-muted">Sign in to your Veridrop account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex rounded-lg border border-default p-1 bg-input/50 mb-4">
                <button
                  type="button"
                  onClick={() => setRole("VENDOR")}
                  className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors ${
                    role === "VENDOR"
                      ? "bg-surface shadow-sm text-text-primary"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  Vendor
                </button>
                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors ${
                    role === "ADMIN"
                      ? "bg-surface shadow-sm text-text-primary"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  Admin
                </button>
              </div>

              {error && (
                <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-500 text-center">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-text-muted uppercase tracking-[0.1em]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-medium text-text-muted uppercase tracking-[0.1em]">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[10px] text-text-muted transition-colors hover:text-text-primary">
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary w-full justify-center"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 border-t border-default pt-6">
              <p className="text-center text-[10px] font-medium text-text-muted">
                Don't have an account? <Link href="/register" className="text-text-primary transition-colors hover:text-brand-teal-light">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

