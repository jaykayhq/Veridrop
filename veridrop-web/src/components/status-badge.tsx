import { statusColor, cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: "text-[#00bda6] border-[#00bda633] bg-[#00bda611]",
  pending: "text-[#c8a862] border-[#c8a86233] bg-[#c8a86211]",
  passed: "text-[#00bda6] border-[#00bda633] bg-[#00bda611]",
  failed: "text-[#dc2626] border-[#dc262633] bg-[#dc262611]",
  completed: "text-[#00bda6] border-[#00bda633] bg-[#00bda611]",
  cancelled: "text-[#666] border-[#333] bg-[#111]",
  disputed: "text-[#d97706] border-[#d9770633] bg-[#d9770611]",
  released: "text-[#0a54a6] border-[#0a54a633] bg-[#0a54a611]",
  locked: "text-[#0a54a6] border-[#0a54a633] bg-[#0a54a611]",
  refunded: "text-[#666] border-[#333] bg-[#111]",
  default: "text-[#a0a0a0] border-[#333] bg-[#111]",
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
          backgroundColor: style.includes("teal-light") || style.includes("0d8f8f") ? "#00bda6"
            : style.includes("c8a862") ? "#c8a862"
            : style.includes("dc2626") ? "#dc2626"
            : style.includes("d97706") ? "#d97706"
            : style.includes("1a6b9e") ? "#0a54a6"
            : style.includes("666") ? "#666"
            : "#888",
        }}
      />
      {status.replace(/_/g, " ")}
    </span>
  );
}
