"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo, LogoIcon } from "@/components/Logo";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Reset failed");
      }

      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-md bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-500 text-center">
        Invalid reset link. No token provided.
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-brand-teal/10 border border-brand-teal/20 p-4 text-xs text-brand-teal-light text-center">
          Password reset successful! You can now sign in with your new password.
        </div>
        <Link href="/login" className="btn-primary w-full justify-center block text-center">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-500 text-center">
          {error}
        </div>
      )}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-text-muted uppercase tracking-[0.1em]">
          New Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-text-muted uppercase tracking-[0.1em]">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
              <h1 className="text-lg font-semibold">Set new password</h1>
              <p className="mt-1 text-xs text-text-muted">Choose a new password for your account</p>
            </div>

            <Suspense fallback={<div className="text-xs text-text-muted text-center">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>

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
