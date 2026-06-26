import { statusColor, cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: "text-brand-teal-light border-brand-teal-light/20 bg-brand-teal-light/10",
  pending: "text-brand-gold border-brand-gold/20 bg-brand-gold/10",
  passed: "text-brand-teal-light border-brand-teal-light/20 bg-brand-teal-light/10",
  failed: "text-danger border-danger/20 bg-danger/10",
  completed: "text-brand-teal-light border-brand-teal-light/20 bg-brand-teal-light/10",
  cancelled: "text-text-muted border-hover bg-surface",
  disputed: "text-brand-warning border-warning/20 bg-warning/10",
  released: "text-brand-blue border-brand-blue/20 bg-brand-blue/10",
  locked: "text-brand-blue border-brand-blue/20 bg-brand-blue/10",
  refunded: "text-text-muted border-hover bg-surface",
  resolved: "text-brand-teal-light border-brand-teal-light/20 bg-brand-teal-light/10",
  review: "text-brand-gold border-brand-gold/20 bg-brand-gold/10",
  rejected: "text-danger border-danger/20 bg-danger/10",
  on_order: "text-brand-blue border-brand-blue/20 bg-brand-blue/10",
  picked_up: "text-brand-blue border-brand-blue/20 bg-brand-blue/10",
  in_transit: "text-brand-teal-light border-brand-teal-light/20 bg-brand-teal-light/10",
  delivered: "text-brand-teal-light border-brand-teal-light/20 bg-brand-teal-light/10",
  available: "text-brand-teal-light border-brand-teal-light/20 bg-brand-teal-light/10",
  on_delivery: "text-brand-blue border-brand-blue/20 bg-brand-blue/10",
  offline: "text-text-muted border-hover bg-surface",
  default: "text-text-secondary border-hover bg-surface",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status.toLowerCase()] || statusStyles.default;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border capitalize tracking-[0.05em]",
        style,
        className
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: style.includes("teal-light") ? "var(--color-brand-teal-light)"
            : style.includes("gold") ? "var(--color-brand-gold)"
            : style.includes("warning") ? "var(--color-warning)"
            : style.includes("danger") ? "var(--color-danger)"
            : style.includes("brand-blue") ? "var(--color-brand-blue)"
            : style.includes("muted") ? "var(--color-text-muted)"
            : "var(--color-text-secondary)",
        }}
      />
      {status.replace(/_/g, " ")}
    </span>
  );
}
