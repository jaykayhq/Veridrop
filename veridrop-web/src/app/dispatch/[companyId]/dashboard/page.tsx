import { LogoIcon } from "@/components/Logo";
export default function DispatchDashboardPage({ params }: { params: { companyId: string } }) {
  const companyName = params.companyId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const activeDeliveries = [
    { id: "DSP-001", order: "ORD-003", product: "MacBook Air", status: "picked_up", rider: "Emeka N.", eta: "14:30" },
    { id: "DSP-002", order: "ORD-006", product: "LV Bag", status: "in_transit", rider: "Fatima Y.", eta: "15:15" },
    { id: "DSP-003", order: "ORD-010", product: "PS5", status: "out_for_delivery", rider: "Tunde B.", eta: "14:45" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] font-sans">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a] px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">{companyName}</span>
            <span className="text-[10px] text-[#555] ml-2">Dispatch Dashboard</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#666]">
            <span>24 riders online</span>
            <div className="h-6 w-px bg-[#1f1f1f]" />
            <span className="text-emerald-400">● Live</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
            <p className="text-xs text-[#666] uppercase tracking-wider">Active Deliveries</p>
            <p className="text-lg font-semibold mt-1">12</p>
          </div>
          <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
            <p className="text-xs text-[#666] uppercase tracking-wider">Pending Pickup</p>
            <p className="text-lg font-semibold text-yellow-400 mt-1">4</p>
          </div>
          <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
            <p className="text-xs text-[#666] uppercase tracking-wider">Delivered Today</p>
            <p className="text-lg font-semibold text-emerald-400 mt-1">31</p>
          </div>
          <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
            <p className="text-xs text-[#666] uppercase tracking-wider">QR Scans Today</p>
            <p className="text-lg font-semibold text-[#00bda6] mt-1">47</p>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h3 className="text-sm font-semibold">Active Deliveries</h3>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {activeDeliveries.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-[#0d0d0d] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <div>
                    <div className="text-sm font-medium text-[#e8e8e8]">{d.product}</div>
                    <div className="text-xs text-[#666]">{d.order} · Rider: {d.rider}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#555]">ETA {d.eta}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/30 capitalize">
                    {d.status.replace(/_/g, " ")}
                  </span>
                  <button className="text-xs text-[#00bda6] hover:underline">Track</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Scan Terminal */}
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-6">
          <h3 className="text-sm font-semibold mb-4">QR Custody Scanner</h3>
          <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg p-4 text-center">
            <div className="mx-auto h-24 w-24 rounded-lg border-2 border-dashed border-[#333] flex items-center justify-center mb-3">
              <span className="text-3xl opacity-30">📷</span>
            </div>
            <p className="text-sm text-[#666]">Point camera at Veridrop QR seal to scan</p>
            <p className="text-xs text-[#555] mt-1">Opens camera on mobile devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
