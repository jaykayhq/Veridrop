import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";

const stores = [
  { id: "STR-001", name: "GadgetHub NG", slug: "gadgethub-ng", owner: "Amara Okafor", products: 7, status: "active", visits: 1240 },
  { id: "STR-002", name: "FashionAxis", slug: "fashionaxis", owner: "Chioma Eze", products: 24, status: "active", visits: 892 },
  { id: "STR-003", name: "TechPlus NG", slug: "techplus-ng", owner: "Daniel Musa", products: 0, status: "pending", visits: 0 },
  { id: "STR-004", name: "LuxWear", slug: "luxwear", owner: "James D.", products: 15, status: "active", visits: 567 },
  { id: "STR-005", name: "StyleLab", slug: "stylelab", owner: "Amina B.", products: 9, status: "active", visits: 345 },
];

export default function AdminStores() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#e8e8e8]">Stores</h1>
        <p className="text-sm text-[#666] mt-1">All vendor storefronts on the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Total Stores</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">5</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Active</p>
          <p className="text-lg font-semibold text-emerald-400 mt-1">4</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Pending</p>
          <p className="text-lg font-semibold text-yellow-400 mt-1">1</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Total Products</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">55</p>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-[#1a1a1a]">
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "name", header: "Store Name" },
            {
              key: "slug",
              header: "Link",
              render: (row) => (
                <span className="font-mono text-[#00bda6] text-xs">/s/{row.slug as string}</span>
              ),
            },
            { key: "owner", header: "Owner" },
            { key: "products", header: "Products" },
            { key: "visits", header: "Visits" },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status as string} />,
            },
          ]}
          data={stores}
        />
      </div>
    </div>
  );
}
