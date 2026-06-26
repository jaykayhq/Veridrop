"use client";

import { useState } from "react";
import DispatchRiderMap from "@/components/dispatch-rider-map";

interface DispatchCompany {
  _id: string;
  name: string;
  status: string;
  activeRiders: number;
  deliveriesToday: number;
}

interface DispatchClientProps {
  companies: DispatchCompany[];
  stats: { connected: number; activeRiders: number; deliveriesToday: number };
  origin: string;
}

export default function DispatchClient({ companies, stats, origin }: DispatchClientProps) {
  const [copyId, setCopyId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);

  const copyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopyId(id);
    setTimeout(() => setCopyId(null), 2000);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Connected Partners</p>
          <p className="text-lg font-semibold text-emerald-400 mt-1">{stats.connected}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Active Riders</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{stats.activeRiders}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Today&apos;s Deliveries</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{stats.deliveriesToday}</p>
        </div>
      </div>

      {/* Live Rider Map */}
      {showMap && (
        <DispatchRiderMap
          companyName="Your Delivery Network"
          height={380}
        />
      )}

      {/* Integration Link */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Dispatch Integration Link</h3>
            <p className="text-xs text-text-muted mt-1">Share this unique link with delivery companies to onboard them</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-input border border-default rounded-lg p-3">
          <div className="flex-1 font-mono text-sm text-brand-teal-light truncate">
            {`${origin}/dispatch/connect`}
          </div>
          <button
            onClick={() => copyLink("integration", `${origin}/dispatch/connect`)}
            className="shrink-0 px-4 py-1.5 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            {copyId === "integration" ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Dispatch Partners */}
      <div className="bg-surface rounded-xl border border-default overflow-hidden">
        <div className="px-5 py-4 border-b border-default">
          <h3 className="text-sm font-semibold text-text-primary">Delivery Partners</h3>
        </div>
        <div className="divide-y divide-default">
          {companies.map((dc: DispatchCompany) => (
            <div
              key={dc._id}
              className="flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-input border border-default flex items-center justify-center text-base">
                  🚚
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{dc.name}</div>
                  <div className="text-xs text-text-muted">{dc.activeRiders} riders · {dc.deliveriesToday} today</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    dc.status === "connected"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : dc.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {dc.status}
                </span>
                {dc.status === "connected" && (
                  <a
                    href={`/dispatch/${dc._id}`}
                    className="px-3 py-1 border border-default text-text-secondary text-xs font-medium rounded-md hover:border-hover transition-colors"
                  >
                    Dashboard
                  </a>
                )}
              </div>
            </div>
          ))}
          {companies.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-text-muted">
              No dispatch companies connected yet.
            </div>
          )}
        </div>
      </div>

      {/* Integration Instructions */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">How It Works</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "01", title: "Share Link", description: "Send your unique dispatch link to any delivery company" },
            { step: "02", title: "They Connect", description: "Delivery company registers riders and sets coverage zones" },
            { step: "03", title: "Automated Dispatch", description: "Orders are automatically routed to available riders with QR handoff" },
          ].map((s) => (
            <div key={s.step} className="border border-default rounded-lg p-4">
              <span className="text-brand-teal-light text-sm font-bold">{s.step}</span>
              <h4 className="text-sm font-medium text-text-primary mt-1">{s.title}</h4>
              <p className="text-xs text-text-muted mt-1">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
