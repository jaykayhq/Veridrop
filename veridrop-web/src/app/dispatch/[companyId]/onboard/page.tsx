"use client";
import { LogoIcon } from "@/components/Logo";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Rider {
  _id: string;
  name: string;
  phone: string;
  status: string;
  activeDeliveries: number;
  totalDeliveries: number;
  createdAt: string;
}

export default function DispatchOnboardPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const companyName = companyId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  useEffect(() => {
    fetchRiders();
  }, [companyId]);

  async function fetchRiders() {
    try {
      const token = localStorage.getItem("veridrop_token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/dispatch/companies/${companyId}/riders`, { headers });
      const data = await res.json();
      if (data.success) setRiders(data.data || []);
    } catch {
      setError("Failed to load riders");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddRider(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("veridrop_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/dispatch/companies/${companyId}/riders`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to add rider");

      setRiders((prev) => [data.data, ...prev]);
      setName("");
      setPhone("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const statusColors: Record<string, string> = {
    available: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    on_delivery: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    offline: "text-gray-400 border-gray-500/30 bg-gray-500/10",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] font-sans">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a] px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">{companyName}</span>
            <span className="text-[10px] text-[#555] ml-2">Rider Onboarding</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-6">
          <h2 className="text-sm font-semibold mb-4">Register New Rider</h2>
          <form onSubmit={handleAddRider} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-[#666] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] px-3 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#00bda6] focus:border-transparent"
                  placeholder="Rider name"
                />
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] px-3 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#00bda6] focus:border-transparent"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-gradient-to-r from-[#0a54a6] to-[#00bda6] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Adding...
                </span>
              ) : (
                "Add Rider"
              )}
            </button>
          </form>
        </div>

        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold">Registered Riders ({riders.length})</h2>
          </div>

          {loading ? (
            <div className="px-5 py-8 text-center text-sm text-[#666]">Loading riders...</div>
          ) : riders.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-[#666]">No riders registered yet</div>
          ) : (
            <div className="divide-y divide-[#1a1a1a]">
              {riders.map((r) => (
                <div key={r._id} className="flex items-center justify-between px-5 py-4 hover:bg-[#0d0d0d] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] flex items-center justify-center text-sm font-semibold text-[#aaa]">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-[#666]">{r.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#555]">{r.totalDeliveries} deliveries</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
                        statusColors[r.status] || "text-gray-400 border-gray-500/30 bg-gray-500/10"
                      }`}
                    >
                      {r.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
