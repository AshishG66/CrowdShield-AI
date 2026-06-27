import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "safe" | "warning" | "critical";
  className?: string;
  apiEndpoint?: string;
  collection?: string;
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
  className,
  apiEndpoint,
  collection,
}: KpiCardProps) {
  const variantStyles = {
    default: "border-muted-foreground/10",
    safe: "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5",
    warning: "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/5",
    critical: "border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/5",
  };

  const iconColors = {
    default: "text-muted-foreground",
    safe: "text-emerald-500",
    warning: "text-amber-500",
    critical: "text-rose-500",
  };

  return (
    <Card className={cn("overflow-hidden border hover:shadow-md transition-shadow duration-200", variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground tracking-tight">{title}</p>
          {Icon && (
            <div className={cn("p-2 rounded-lg bg-muted/40", iconColors[variant])}>
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          {(description || trend) && (
            <div className="flex items-center gap-1.5 mt-1">
              {trend && (
                <span
                  className={cn(
                    "text-xs font-semibold px-1 rounded-sm",
                    trend.isPositive
                      ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
                      : "text-rose-600 bg-rose-500/10 dark:text-rose-400"
                  )}
                >
                  {trend.value}
                </span>
              )}
              {description && <span className="text-xs text-muted-foreground">{description}</span>}
            </div>
          )}
        </div>
        {apiEndpoint && (
          <div className="mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
            <span className="truncate pr-1" title={apiEndpoint}>API: {apiEndpoint}</span>
            {collection && <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">{collection}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
