"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Order {
  _id: string;
  productName: string;
  amount: number;
  status: string;
  buyerName: string;
  createdAt: string;
}

export default function VendorAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders", { credentials: "include" });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-app text-text-primary font-sans flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-teal-light/30 border-t-brand-teal-light" />
          <span className="text-sm text-text-muted">Loading analytics...</span>
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

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const thisMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const lastMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const passedOrders = orders.filter((o) => o.status === "passed" || o.status === "delivered" || o.status === "in_transit");
  const passRate = totalOrders > 0 ? (passedOrders.length / totalOrders) * 100 : 0;

  const thisMonthRevenue = thisMonthOrders.reduce((s, o) => s + o.amount, 0);
  const lastMonthRevenue = lastMonthOrders.reduce((s, o) => s + o.amount, 0);
  const revenueChange = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

  const thisMonthCount = thisMonthOrders.length;
  const lastMonthCount = lastMonthOrders.length;
  const countChange = lastMonthCount > 0 ? ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100 : 0;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = months.map((month, i) => {
    const mOrders = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === i && d.getFullYear() === thisYear;
    });
    const revenue = mOrders.reduce((s, o) => s + o.amount, 0);
    return { month, orders: mOrders.length, revenue };
  });

  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);

  const recentOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Analytics</h1>
          <p className="text-sm text-text-muted mt-1">Performance overview for your store</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl border border-default p-5">
            <p className="text-xs text-text-muted uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-semibold mt-1">{totalOrders}</p>
            <p className="text-xs text-text-muted mt-1">
              {thisMonthCount} this month
              {countChange !== 0 && (
                <span className={countChange > 0 ? " text-emerald-400 ml-1" : " text-danger ml-1"}>
                  ({countChange > 0 ? "+" : ""}{countChange.toFixed(0)}%)
                </span>
              )}
            </p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-5">
            <p className="text-xs text-text-muted uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-semibold mt-1">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-text-muted mt-1">
              {formatCurrency(thisMonthRevenue)} this month
              {revenueChange !== 0 && (
                <span className={revenueChange > 0 ? " text-emerald-400 ml-1" : " text-danger ml-1"}>
                  ({revenueChange > 0 ? "+" : ""}{revenueChange.toFixed(0)}%)
                </span>
              )}
            </p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-5">
            <p className="text-xs text-text-muted uppercase tracking-wider">Avg Order Value</p>
            <p className="text-2xl font-semibold mt-1">{formatCurrency(avgOrderValue)}</p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-5">
            <p className="text-xs text-text-muted uppercase tracking-wider">Pass Rate</p>
            <p className="text-2xl font-semibold mt-1">{passRate.toFixed(0)}%</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-default p-5">
          <h2 className="text-sm font-semibold mb-4">Monthly Revenue</h2>
          <div className="flex items-end gap-2 h-40">
            {monthlyData.map((m) => {
              const height = (m.revenue / maxRevenue) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] text-text-muted">{formatCurrency(m.revenue)}</span>
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-brand-blue to-brand-teal-light transition-all hover:opacity-80"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  <span className="text-[10px] text-text-muted">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-default overflow-hidden">
          <div className="px-5 py-4 border-b border-default">
            <h2 className="text-sm font-semibold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-default">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Buyer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default">
                {recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">{o._id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-text-primary">{o.buyerName}</td>
                    <td className="px-4 py-3 text-text-primary">{o.productName}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(o.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-text-muted text-xs">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
