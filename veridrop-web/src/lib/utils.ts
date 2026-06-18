export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function statusColor(status: string) {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    locked: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    passed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    failed: "bg-red-500/10 text-red-400 border-red-500/30",
    in_transit: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    delivered: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    disputed: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    refunded: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/10 text-red-400 border-red-500/30",
    review: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  };
  return map[status] || "bg-gray-500/10 text-gray-400 border-gray-500/30";
}

export function generateStoreUrl(slug: string) {
  return `/s/${slug}`;
}
