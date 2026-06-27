import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import { IncidentItem } from "@/services/mockApi";

interface ActiveIncidentCardProps {
  incident: IncidentItem;
  onRespond?: (id: string) => void;
  onResolve?: (id: string) => void;
  className?: string;
}

export function ActiveIncidentCard({
  incident,
  onRespond,
  onResolve,
  className,
}: ActiveIncidentCardProps) {
  const severityConfig = {
    info: "border-blue-500/25 bg-blue-500/5 text-blue-600 dark:text-blue-400",
    warning: "border-amber-500/25 bg-amber-500/5 text-amber-600 dark:text-amber-400",
    critical: "border-rose-500/25 bg-rose-500/5 text-rose-600 dark:text-rose-400 animate-pulse",
  };

  return (
    <Card className={cn("overflow-hidden border hover:shadow-md transition-shadow duration-200 border-muted-foreground/10", className)}>
      <CardContent className="p-5 space-y-3.5">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] font-bold text-muted-foreground">{incident.id}</span>
            <h4 className="text-xs font-bold text-foreground pr-1 truncate">{incident.title}</h4>
          </div>
          <Badge className={cn("text-[8px] uppercase tracking-wider rounded-xs px-2 py-0.5 border-0 text-white font-extrabold", 
            incident.severity === "critical" ? "bg-rose-600" : incident.severity === "warning" ? "bg-orange-500" : "bg-blue-500"
          )}>
            {incident.severity}
          </Badge>
        </div>

        <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
          {incident.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-muted-foreground font-semibold">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {incident.location}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {incident.timestamp}</span>
        </div>

        {incident.status !== "resolved" && (onRespond || onResolve) && (
          <div className="flex gap-2 pt-2 border-t border-muted-foreground/5 justify-end">
            {incident.status === "active" && onRespond && (
              <Button
                onClick={() => onRespond(incident.id)}
                size="sm"
                variant="outline"
                className="h-7 text-[10px] cursor-pointer"
              >
                Investigate
              </Button>
            )}
            {onResolve && (
              <Button
                onClick={() => onResolve(incident.id)}
                size="sm"
                className="h-7 text-[10px] cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95"
              >
                Resolve
              </Button>
            )}
          </div>
        )}
        <div className="w-full mt-3.5 pt-2.5 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
          <span className="truncate pr-1">API: GET /api/incidents/active</span>
          <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">Incident</span>
        </div>
      </CardContent>
    </Card>
  );
}
