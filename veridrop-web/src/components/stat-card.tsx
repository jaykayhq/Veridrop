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
    up: "text-teal-light",
    down: "text-danger",
    neutral: "text-text-muted",
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-[0.1em]">
            {label}
          </p>
          <p className="text-2xl font-semibold text-text-primary tracking-tight">{value}</p>
          {change && (
            <p className={cn("text-xs font-medium", changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-default bg-app text-text-secondary shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
