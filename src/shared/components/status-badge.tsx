import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger";
};

const toneClassName: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  neutral:
    "border-border bg-card text-foreground",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700",
  danger:
    "border-rose-200 bg-rose-50 text-rose-700",
};

export function StatusBadge({
  label,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em]",
        toneClassName[tone]
      )}
    >
      {label}
    </Badge>
  );
}
