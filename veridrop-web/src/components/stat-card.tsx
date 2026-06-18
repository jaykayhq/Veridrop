import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
}: StatCardProps) {
  const changeColors = {
    up: "text-[#00bda6]",
    down: "text-[#dc2626]",
    neutral: "text-[#666]",
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-[#555] uppercase tracking-[0.1em]">
            {label}
          </p>
          <p className="text-2xl font-semibold text-[#e8e8e8] tracking-tight">{value}</p>
          {change && (
            <p className={cn("text-xs font-medium", changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] text-[#888] shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
