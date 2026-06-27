import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Cpu, Activity, Database } from "lucide-react";
import { cn } from "@/lib/cn";

interface SystemHealthCardProps {
  uptime: string;
  cpuLoad: number;
  cameraLatency: number;
  dbStatus: "online" | "syncing" | "degraded";
  className?: string;
}

export function SystemHealthCard({
  uptime = "99.98%",
  cpuLoad = 14,
  cameraLatency = 45,
  dbStatus = "online",
  className,
}: SystemHealthCardProps) {
  const dbStatusColors = {
    online: "text-emerald-500 bg-emerald-500/10",
    syncing: "text-amber-500 bg-amber-500/10",
    degraded: "text-rose-500 bg-rose-500/10",
  };

  return (
    <Card className={cn("overflow-hidden border hover:shadow-md transition-shadow duration-200 border-muted-foreground/10", className)}>
      <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px] space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground tracking-tight">System Core Health</p>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="space-y-0.5">
            <h3 className="text-2xl font-bold tracking-tight">{uptime}</h3>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Network Uptime</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-3.5 border-t border-muted-foreground/5 text-[10px] font-bold uppercase text-muted-foreground">
          <div className="space-y-1">
            <span className="flex items-center gap-1"><Cpu className="h-3 w-3 text-primary" /> CPU Load</span>
            <p className="text-xs font-bold text-foreground">{cpuLoad}%</p>
          </div>
          <div className="space-y-1">
            <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-primary" /> Latency</span>
            <p className="text-xs font-bold text-foreground">{cameraLatency}ms</p>
          </div>
          <div className="space-y-1">
            <span className="flex items-center gap-1"><Database className="h-3 w-3 text-primary" /> Database</span>
            <span className={cn("inline-block px-1.5 py-0.2 rounded-xs font-extrabold text-[9px] mt-0.5", dbStatusColors[dbStatus])}>
              {dbStatus}
            </span>
          </div>
        </div>
        <div className="w-full mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
          <span className="truncate pr-1">API: GET /api/system/health</span>
          <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">User</span>
        </div>
      </CardContent>
    </Card>
  );
}
