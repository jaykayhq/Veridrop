import { LogoIcon } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RiderPage() {
  const assignments = [
    { id: "RID-001", order: "ORD-003", product: "MacBook Air", pickup: "GadgetHub NG, Ikeja", dropoff: "12, Adeola Odeku, VI", status: "picked_up", amount: "₦2,500" },
    { id: "RID-002", order: "ORD-006", product: "LV Bag", pickup: "FashionAxis, Surulere", dropoff: "45, Awolowo Rd, Ikoyi", status: "pending", amount: "₦2,000" },
    { id: "RID-003", order: "ORD-010", product: "PS5", pickup: "TechPlus NG, Yaba", dropoff: "8, Bode Thomas, Surulere", status: "delivered", amount: "₦3,000" },
  ];

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="border-b border-default bg-app px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">Rider App</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="text-emerald-400">● Available</span>
            <ThemeToggle />
            <div className="h-5 w-5 rounded-full bg-border flex items-center justify-center text-[10px]">
              E
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Your Assignments</h1>
            <p className="text-xs text-text-muted mt-1">3 active orders for today</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-teal-light text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            Scan QR
          </button>
        </div>

        <div className="space-y-3">
          {assignments.map((a) => (
            <div key={a.id} className="bg-surface rounded-xl border border-default p-4 hover:border-hover transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{a.product}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${
                        a.status === "delivered"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : a.status === "picked_up"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {a.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">Order {a.order}</p>
                </div>
                <span className="text-sm font-semibold text-brand-teal-light">{a.amount}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-text-muted">
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">Pickup</div>
                  <div className="text-text-secondary">{a.pickup}</div>
                </div>
                <div className="text-text-muted">→</div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">Dropoff</div>
                  <div className="text-text-secondary">{a.dropoff}</div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-brand-teal-light/10 text-brand-teal-light text-xs font-medium rounded-lg border border-brand-teal-light/20 hover:bg-brand-teal-light/20 transition-colors">
                  Scan QR at Pickup
                </button>
                <button className="px-3 py-2 border border-default text-text-secondary text-xs font-medium rounded-lg hover:border-hover transition-colors">
                  Navigate
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* QR Scanner Quick Action */}
        <div className="bg-surface rounded-xl border border-default p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-input border border-default flex items-center justify-center text-xl">
              📷
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">QR Custody Scan</h3>
              <p className="text-xs text-text-muted mt-0.5">Scan the Veridrop tamper-evident seal at every handoff point</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-teal-light text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
              Open Scanner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
