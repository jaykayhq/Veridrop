"use client";
import { LogoIcon } from "@/components/Logo";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";

interface TimelineEvent {
  status: string;
  timestamp: string;
  label: string;
}

interface OrderData {
  _id: string;
  productName: string;
  amount: number;
  status: string;
  buyerName: string;
  vendorName: string;
  createdAt: string;
  escrow?: {
    _id: string;
    amount: number;
    status: string;
    releasedAt?: string;
  };
}

const STEPS = ["pending", "locked", "inspection", "passed", "in_transit", "delivered"];

export default function TransactionTrackingPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const token = localStorage.getItem("veridrop_token");
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`/api/orders/${transactionId}`, { headers });
        const data = await res.json();

        if (!res.ok || !data.success) {
          if (res.status === 404) setNotFound(true);
          else throw new Error(data.error || "Failed to load order");
          return;
        }

        setOrder(data.data);

        const trackingRes = await fetch(`/api/orders/${transactionId}/tracking`, { headers });
        const trackingData = await trackingRes.json();
        if (trackingData.success) {
          setTimeline(trackingData.data.timeline || []);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [transactionId]);

  async function handleApproveRelease() {
    try {
      const token = localStorage.getItem("veridrop_token");
      const res = await fetch(`/api/orders/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "delivered" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
        setTimeline((prev) => [
          ...prev,
          { status: "delivered", timestamp: new Date().toISOString(), label: "Delivered successfully" },
        ]);
      }
    } catch {
      setError("Failed to confirm delivery");
    }
  }

  async function handleFileDispute() {
    try {
      const token = localStorage.getItem("veridrop_token");
      const res = await fetch(`/api/orders/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "disputed" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch {
      setError("Failed to file dispute");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-app text-text-primary font-sans flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-teal-light/30 border-t-brand-teal-light" />
          <span className="text-sm text-text-muted">Loading tracking...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-app text-text-primary font-sans flex items-center justify-center">
        <div className="text-center max-w-sm mx-6">
          <div className="text-5xl mb-4 opacity-20">404</div>
          <h1 className="text-lg font-semibold mb-2">Order Not Found</h1>
          <p className="text-sm text-text-muted mb-6">This transaction does not exist or has been removed.</p>
          <Link href="/" className="text-sm text-brand-teal-light hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-app text-text-primary font-sans flex items-center justify-center">
        <div className="text-center max-w-sm mx-6">
          <div className="rounded-lg bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-brand-teal-light hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="border-b border-default bg-app px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">Veridrop Tracking</span>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <div className="bg-surface rounded-xl border border-default p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Order</p>
              <h1 className="text-lg font-semibold font-mono">{order?._id}</h1>
              <p className="text-sm text-text-muted mt-1">{order?.productName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted mb-1">Status</p>
              {order && <StatusBadge status={order.status} />}
              <p className="text-sm text-text-muted mt-1">
                {order?.createdAt && formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">Buyer</p>
              <p className="text-text-primary">{order?.buyerName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">Vendor</p>
              <p className="text-text-primary">{order?.vendorName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">Amount</p>
              <p className="text-brand-teal-light font-semibold">
                {order && formatCurrency(order.amount)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">Escrow</p>
              <p className="text-text-primary capitalize">{order?.escrow?.status || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-default p-6">
          <h2 className="text-sm font-semibold mb-6">Timeline</h2>
          <div className="relative">
            <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-default" />
            <div className="space-y-6">
              {STEPS.map((step, i) => {
                const event = timeline.find((t) => t.status === step);
                const isActive = order && STEPS.indexOf(order.status) >= i;
                const isCurrent = order?.status === step;

                return (
                  <div key={step} className="relative flex items-start gap-4">
                    <div
                      className={`relative z-10 mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-colors ${
                        isCurrent
                          ? "border-brand-teal-light bg-brand-teal-light text-white"
                          : isActive
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                          : "border-default bg-input text-text-muted"
                      }`}
                    >
                      {isActive ? "✓" : i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium capitalize ${
                          isActive ? "text-text-primary" : "text-text-muted"
                        }`}
                      >
                        {step.replace(/_/g, " ")}
                      </p>
                      {event && (
                        <p className="text-xs text-text-muted mt-0.5">
                          {formatDate(event.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {(order?.status === "delivered" || order?.status === "in_transit") && (
          <div className="bg-surface rounded-xl border border-default p-5">
            <h2 className="text-sm font-semibold mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleApproveRelease}
                className="rounded-lg bg-gradient-to-r from-brand-blue to-brand-teal-light px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Approve Release
              </button>
              <button
                onClick={handleFileDispute}
                className="rounded-lg border border-hover px-5 py-2.5 text-sm text-text-secondary transition-colors hover:border-danger/50 hover:text-danger"
              >
                File Dispute
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
