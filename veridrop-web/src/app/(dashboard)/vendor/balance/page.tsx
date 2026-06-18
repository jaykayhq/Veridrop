import { formatCurrency } from "@/lib/utils";

export default function VendorBalance() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#e8e8e8]">Balance</h1>
        <p className="text-sm text-[#666] mt-1">Your wallets and escrow holdings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-6">
          <p className="text-xs text-[#666] uppercase tracking-wider mb-1">Available Balance</p>
          <p className="text-3xl font-semibold text-[#e8e8e8]">{formatCurrency(284000)}</p>
          <p className="text-xs text-emerald-400 mt-2">Settled and withdrawable</p>
          <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            Withdraw Funds
          </button>
        </div>

        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-6">
          <p className="text-xs text-[#666] uppercase tracking-wider mb-1">Escrow Locked</p>
          <p className="text-3xl font-semibold text-[#e8e8e8]">{formatCurrency(892000)}</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#666]">Awaiting inspection</span>
              <span className="font-medium text-[#e8e8e8]">{formatCurrency(245000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">In transit</span>
              <span className="font-medium text-[#e8e8e8]">{formatCurrency(445000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Pending release</span>
              <span className="font-medium text-[#e8e8e8]">{formatCurrency(202000)}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-6">
          <p className="text-xs text-[#666] uppercase tracking-wider mb-1">Security Reserve</p>
          <p className="text-3xl font-semibold text-[#e8e8e8]">{formatCurrency(125000)}</p>
          <p className="text-xs text-[#555] mt-2">10% holdback on first 10 transactions</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#666]">Progress</span>
              <span className="font-medium text-[#e8e8e8]">7 / 10 transactions</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-2">
              <div className="bg-[#00bda6] h-2 rounded-full" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-6">
        <h3 className="text-sm font-semibold text-[#e8e8e8] mb-4">Penalty Ledger</h3>
        <div className="text-sm text-[#666]">
          No active penalties. Your inspection pass rate is 94%.
        </div>
      </div>
    </div>
  );
}
