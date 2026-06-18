"use client";

import { useState, useEffect } from "react";

const dispatchCompanies = [
  { id: "DC-001", name: "SwiftLogix", status: "connected", activeRiders: 12, deliveriesToday: 45, onboarding: false },
  { id: "DC-002", name: "RedStar Express", status: "pending", activeRiders: 0, deliveriesToday: 0, onboarding: true },
  { id: "DC-003", name: "GoLorry NG", status: "available", activeRiders: 0, deliveriesToday: 0, onboarding: false },
];

export default function VendorDispatch() {
  const [origin, setOrigin] = useState("");
  const [copyId, setCopyId] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const copyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopyId(id);
    setTimeout(() => setCopyId(null), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#e8e8e8]">Dispatch</h1>
        <p className="text-sm text-[#666] mt-1">Connect delivery companies and manage logistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Connected Partners</p>
          <p className="text-lg font-semibold text-emerald-400 mt-1">1</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Active Riders</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">12</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Today&apos;s Deliveries</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">45</p>
        </div>
      </div>

      {/* Integration Link */}
      <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Dispatch Integration Link</h3>
            <p className="text-xs text-[#666] mt-1">Share this unique link with delivery companies to onboard them</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg p-3">
          <div className="flex-1 font-mono text-sm text-[#00bda6] truncate">
            {`${origin}/dispatch/gadgethub-ng`}
          </div>
          <button
            onClick={() => copyLink("integration", `${origin}/dispatch/gadgethub-ng`)}
            className="shrink-0 px-4 py-1.5 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            {copyId === "integration" ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Dispatch Partners */}
      <div className="bg-[#111] rounded-xl border border-[#1a1a1a] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Delivery Partners</h3>
        </div>
        <div className="divide-y divide-[#1a1a1a]">
          {dispatchCompanies.map((dc) => (
            <div
              key={dc.id}
              className="flex items-center justify-between px-5 py-4 hover:bg-[#111] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] flex items-center justify-center text-base">
                  🚚
                </div>
                <div>
                  <div className="text-sm font-medium text-[#e8e8e8]">{dc.name}</div>
                  <div className="text-xs text-[#666]">{dc.activeRiders} riders · {dc.deliveriesToday} today</div>
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
                {dc.onboarding ? (
                  <span className="text-[10px] text-[#555]">Onboarding...</span>
                ) : dc.status === "available" ? (
                  <button className="px-3 py-1 bg-[#00bda6]/10 text-[#00bda6] text-xs font-medium rounded-md border border-[#00bda6]/20 hover:bg-[#00bda6]/20 transition-colors">
                    Connect
                  </button>
                ) : null}
                {dc.status === "connected" && (
                  <a
                    href={`/dispatch/${dc.id}`}
                    className="px-3 py-1 border border-[#1f1f1f] text-[#aaa] text-xs font-medium rounded-md hover:border-[#333] transition-colors"
                  >
                    Dashboard
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Instructions */}
      <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-6">
        <h3 className="text-sm font-semibold text-[#e8e8e8] mb-4">How It Works</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "01", title: "Share Link", description: "Send your unique dispatch link to any delivery company" },
            { step: "02", title: "They Connect", description: "Delivery company registers riders and sets coverage zones" },
            { step: "03", title: "Automated Dispatch", description: "Orders are automatically routed to available riders with QR handoff" },
          ].map((s) => (
            <div key={s.step} className="border border-[#1f1f1f] rounded-lg p-4">
              <span className="text-[#00bda6] text-sm font-bold">{s.step}</span>
              <h4 className="text-sm font-medium text-[#e8e8e8] mt-1">{s.title}</h4>
              <p className="text-xs text-[#666] mt-1">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
