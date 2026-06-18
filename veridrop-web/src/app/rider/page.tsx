import { LogoIcon } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RiderPage() {
  const assignments = [
    { id: "RID-001", order: "ORD-003", product: "MacBook Air", pickup: "GadgetHub NG, Ikeja", dropoff: "12, Adeola Odeku, VI", status: "picked_up", amount: "₦2,500" },
    { id: "RID-002", order: "ORD-006", product: "LV Bag", pickup: "FashionAxis, Surulere", dropoff: "45, Awolowo Rd, Ikoyi", status: "pending", amount: "₦2,000" },
    { id: "RID-003", order: "ORD-010", product: "PS5", pickup: "TechPlus NG, Yaba", dropoff: "8, Bode Thomas, Surulere", status: "delivered", amount: "₦3,000" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] font-sans">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a] px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">Rider App</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#666]">
            <span className="text-emerald-400">● Available</span>
            <ThemeToggle />
            <div className="h-5 w-5 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[10px]">
              E
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Your Assignments</h1>
            <p className="text-xs text-[#666] mt-1">3 active orders for today</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            Scan QR
          </button>
        </div>

        <div className="space-y-3">
          {assignments.map((a) => (
            <div key={a.id} className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4 hover:border-[#2a2a2a] transition-colors">
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
                  <p className="text-xs text-[#666] mt-0.5">Order {a.order}</p>
                </div>
                <span className="text-sm font-semibold text-[#00bda6]">{a.amount}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#666]">
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[#555] mb-0.5">Pickup</div>
                  <div className="text-[#aaa]">{a.pickup}</div>
                </div>
                <div className="text-[#555]">→</div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[#555] mb-0.5">Dropoff</div>
                  <div className="text-[#aaa]">{a.dropoff}</div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-[#00bda6]/10 text-[#00bda6] text-xs font-medium rounded-lg border border-[#00bda6]/20 hover:bg-[#00bda6]/20 transition-colors">
                  Scan QR at Pickup
                </button>
                <button className="px-3 py-2 border border-[#1f1f1f] text-[#aaa] text-xs font-medium rounded-lg hover:border-[#333] transition-colors">
                  Navigate
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* QR Scanner Quick Action */}
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] flex items-center justify-center text-xl">
              📷
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">QR Custody Scan</h3>
              <p className="text-xs text-[#666] mt-0.5">Scan the Veridrop tamper-evident seal at every handoff point</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
              Open Scanner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
