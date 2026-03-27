import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: 'solid' | 'outline' | 'dot';
  className?: string;
}

export function StatusBadge({ status, variant = 'outline', className }: StatusBadgeProps) {
  let colorClass = "";
  
  const s = status.toLowerCase();
  if (s.includes('critical') || s.includes('offline') || s.includes('escalado')) {
    colorClass = variant === 'solid' ? "bg-destructive text-destructive-foreground" : "text-destructive border-destructive/50 bg-destructive/10";
  } else if (s.includes('high') || s.includes('análise') || s.includes('warning')) {
    colorClass = variant === 'solid' ? "bg-warning text-warning-foreground" : "text-warning border-warning/50 bg-warning/10";
  } else if (s.includes('medium') || s.includes('novo') || s.includes('info')) {
    colorClass = variant === 'solid' ? "bg-info text-info-foreground" : "text-info border-info/50 bg-info/10";
  } else if (s.includes('low') || s.includes('online') || s.includes('resolvido') || s.includes('falso positivo')) {
    colorClass = variant === 'solid' ? "bg-success text-success-foreground" : "text-success border-success/50 bg-success/10";
  } else {
    colorClass = variant === 'solid' ? "bg-muted text-muted-foreground" : "text-muted-foreground border-border bg-muted/30";
  }

  if (variant === 'dot') {
    return (
      <span className={cn("flex items-center gap-2 text-sm font-medium", className)}>
        <span className={cn("h-2 w-2 rounded-full", colorClass.replace('text-', 'bg-').split(' ')[0])} />
        {status}
      </span>
    );
  }

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border", colorClass, className)}>
      {status}
    </span>
  );
}
