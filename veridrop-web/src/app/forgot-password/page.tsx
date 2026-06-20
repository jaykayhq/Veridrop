"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo, LogoIcon } from "@/components/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResetUrl(data.data.resetUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans flex flex-col relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 50% 100%, #00bda60d 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 20% 50%, #0a54a60a 0%, transparent 50%)
          `,
        }}
      />

      <nav className="relative z-10 border-b border-default">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Logo href="/" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="text-xs text-text-muted transition-colors hover:text-text-primary">
              ← Back to Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-xl border border-default bg-surface/80 backdrop-blur-sm p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-default bg-app">
                <LogoIcon size={36} />
              </div>
              <h1 className="text-lg font-semibold">Reset your password</h1>
              <p className="mt-1 text-xs text-text-muted">Enter your email and we'll generate a reset link</p>
            </div>

            {resetUrl ? (
              <div className="space-y-4">
                <div className="rounded-md bg-brand-teal/10 border border-brand-teal/20 p-4 text-xs text-brand-teal-light text-center break-all">
                  <p className="mb-2 font-medium">Reset link generated:</p>
                  <a href={resetUrl} className="underline hover:no-underline">{resetUrl}</a>
                </div>
                <Link href={resetUrl} className="btn-primary w-full justify-center block text-center">
                  Click to Reset Password
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <div className="mt-6 border-t border-default pt-6">
              <p className="text-center text-[10px] font-medium text-text-muted">
                Remember your password? <Link href="/login" className="text-text-primary transition-colors hover:text-brand-teal-light">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
