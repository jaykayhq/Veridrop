import { LogoIcon } from "@/components/Logo";
export default function DispatchDashboardPage({ params }: { params: { companyId: string } }) {
  const companyName = params.companyId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const activeDeliveries = [
    { id: "DSP-001", order: "ORD-003", product: "MacBook Air", status: "picked_up", rider: "Emeka N.", eta: "14:30" },
    { id: "DSP-002", order: "ORD-006", product: "LV Bag", status: "in_transit", rider: "Fatima Y.", eta: "15:15" },
    { id: "DSP-003", order: "ORD-010", product: "PS5", status: "out_for_delivery", rider: "Tunde B.", eta: "14:45" },
  ];

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="border-b border-default bg-app px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">{companyName}</span>
            <span className="text-[10px] text-text-muted ml-2">Dispatch Dashboard</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>24 riders online</span>
            <div className="h-6 w-px bg-default" />
            <span className="text-emerald-400">● Live</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">Active Deliveries</p>
            <p className="text-lg font-semibold mt-1">12</p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">Pending Pickup</p>
            <p className="text-lg font-semibold text-yellow-400 mt-1">4</p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">Delivered Today</p>
            <p className="text-lg font-semibold text-emerald-400 mt-1">31</p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">QR Scans Today</p>
            <p className="text-lg font-semibold text-brand-teal-light mt-1">47</p>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-surface rounded-xl border border-default overflow-hidden">
          <div className="px-5 py-4 border-b border-default">
            <h3 className="text-sm font-semibold">Active Deliveries</h3>
          </div>
          <div className="divide-y divide-default">
            {activeDeliveries.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <div>
                    <div className="text-sm font-medium text-text-primary">{d.product}</div>
                    <div className="text-xs text-text-muted">{d.order} · Rider: {d.rider}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-muted">ETA {d.eta}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/30 capitalize">
                    {d.status.replace(/_/g, " ")}
                  </span>
                  <button className="text-xs text-brand-teal-light hover:underline">Track</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Scan Terminal */}
        <div className="bg-surface rounded-xl border border-default p-6">
          <h3 className="text-sm font-semibold mb-4">QR Custody Scanner</h3>
          <div className="bg-input border border-default rounded-lg p-4 text-center">
            <div className="mx-auto h-24 w-24 rounded-lg border-2 border-dashed border-hover flex items-center justify-center mb-3">
              <span className="text-3xl opacity-30">📷</span>
            </div>
            <p className="text-sm text-text-muted">Point camera at Veridrop QR seal to scan</p>
            <p className="text-xs text-text-muted mt-1">Opens camera on mobile devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
