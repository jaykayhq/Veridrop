"use client";
import { LogoIcon } from "@/components/Logo";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Order {
  _id: string;
  productName: string;
  amount: number;
  status: string;
  vendorName: string;
  createdAt: string;
}

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("veridrop_token");
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch("/api/orders", { headers });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to load orders");
        setOrders(data.data || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const activeOrders = orders.filter((o) => !["delivered", "refunded", "disputed"].includes(o.status));
  const disputedOrders = orders.filter((o) => o.status === "disputed");

  if (loading) {
    return (
      <div className="min-h-screen bg-app text-text-primary font-sans flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-teal-light/30 border-t-brand-teal-light" />
          <span className="text-sm text-text-muted">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-app text-text-primary font-sans flex items-center justify-center">
        <div className="rounded-lg bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="border-b border-default bg-app px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">My Orders</span>
          </div>
          <Link href="/s/gadgethub-ng" className="text-xs text-brand-teal-light hover:underline">
            Browse Stores
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">Total Orders</p>
            <p className="text-lg font-semibold mt-1">{orders.length}</p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">Active</p>
            <p className="text-lg font-semibold text-emerald-400 mt-1">{activeOrders.length}</p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">Disputed</p>
            <p className="text-lg font-semibold text-orange-400 mt-1">{disputedOrders.length}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-surface rounded-xl border border-default p-12 text-center">
            <div className="text-4xl mb-4 opacity-30">📦</div>
            <p className="text-base text-text-muted mb-4">No orders yet</p>
            <Link
              href="/s/gadgethub-ng"
              className="inline-block rounded-md bg-gradient-to-r from-brand-blue to-brand-teal-light px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-default overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-default">
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Order</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Vendor</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-default">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-surface-hover transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-text-secondary">{o._id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-text-secondary">{o.productName}</td>
                      <td className="px-4 py-3 text-text-secondary">{o.vendorName}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(o.amount)}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3 text-text-muted text-xs">{formatDate(o.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/t/${o._id}`}
                          className="text-xs text-brand-teal-light hover:underline"
                        >
                          Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
