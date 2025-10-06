import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, { className: string; label: string }> = {
    pending: { className: "bg-warning/10 text-warning hover:bg-warning/20", label: "Pending" },
    approved: { className: "bg-success/10 text-success hover:bg-success/20", label: "Approved" },
    rejected: { className: "bg-destructive/10 text-destructive hover:bg-destructive/20", label: "Rejected" },
    cancelled: { className: "bg-muted text-muted-foreground", label: "Cancelled" },
    completed: { className: "bg-primary/10 text-primary hover:bg-primary/20", label: "Completed" },
  };

  const variant = variants[status] || variants.pending;

  return (
    <Badge className={variant.className}>
      {variant.label}
    </Badge>
  );
}