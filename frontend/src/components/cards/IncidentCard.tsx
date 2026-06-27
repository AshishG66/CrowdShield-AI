import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ShieldAlert, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

export type IncidentSeverity = "info" | "warning" | "critical";
export type IncidentStatus = "active" | "investigating" | "resolved";

interface IncidentCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  onRespond?: (id: string) => void;
  onResolve?: (id: string) => void;
  className?: string;
}

export function IncidentCard({
  id,
  title,
  description,
  location,
  timestamp,
  severity,
  status,
  onRespond,
  onResolve,
  className,
}: IncidentCardProps) {
  const severityConfig = {
    info: { label: "Info", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400", icon: AlertTriangle },
    warning: { label: "Warning", color: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400", icon: AlertTriangle },
    critical: { label: "Critical", color: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400 animate-pulse", icon: ShieldAlert },
  };

  const statusConfig = {
    active: { label: "Active", variant: "destructive" as const },
    investigating: { label: "Investigating", variant: "secondary" as const },
    resolved: { label: "Resolved", variant: "outline" as const },
  };

  return (
    <Card className={cn("overflow-hidden border hover:shadow-md transition-shadow duration-200 border-muted-foreground/10", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", severityConfig[severity].color)}>
            {severityConfig[severity].label}
          </Badge>
          <CardTitle className="text-base font-bold tracking-tight text-foreground pt-1">{title}</CardTitle>
        </div>
        <Badge variant={statusConfig[status].variant} className="text-[10px] uppercase font-bold tracking-wider">
          {statusConfig[status].label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
        <div className="flex flex-col gap-1.5 pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/75" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/75" />
            <span>{timestamp}</span>
          </div>
        </div>
      </CardContent>
      {status !== "resolved" && (onRespond || onResolve) && (
        <CardFooter className="flex gap-2 pt-3 pb-4 px-6 justify-end border-t border-muted-foreground/5 mt-3">
          {status === "active" && onRespond && (
            <Button size="sm" variant="secondary" className="h-8 text-xs font-semibold" onClick={() => onRespond(id)}>
              Investigate
            </Button>
          )}
          {onResolve && (
            <Button size="sm" className="h-8 text-xs font-semibold" onClick={() => onResolve(id)}>
              Mark Resolved
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
